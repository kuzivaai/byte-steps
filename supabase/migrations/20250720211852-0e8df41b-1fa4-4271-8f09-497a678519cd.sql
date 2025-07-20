-- Fix Critical Supabase Security Issues for ByteSteps
-- Priority: Fix security warnings while maintaining elderly-friendly anonymous access

-- 1. Create rate limiting function for anonymous users
CREATE OR REPLACE FUNCTION check_anonymous_rate_limit()
RETURNS BOOLEAN AS $$
DECLARE
  request_count INT;
  client_ip INET;
BEGIN
  -- Get IP address from request headers  
  client_ip := COALESCE(
    (current_setting('request.headers', true)::json->>'x-forwarded-for')::inet,
    (current_setting('request.headers', true)::json->>'x-real-ip')::inet,
    '127.0.0.1'::inet
  );
  
  -- Count requests from this IP in last hour
  SELECT COUNT(*) INTO request_count
  FROM rate_limits
  WHERE ip_address = client_ip
  AND endpoint = 'anonymous_access'
  AND created_at > NOW() - INTERVAL '1 hour';
  
  -- Allow max 50 actions per hour per IP for anonymous users
  IF request_count >= 50 THEN
    RETURN FALSE;
  END IF;
  
  -- Log this request
  INSERT INTO rate_limits (ip_address, endpoint, window_start)
  VALUES (client_ip, 'anonymous_access', NOW())
  ON CONFLICT DO NOTHING;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Update RLS policies to include rate limiting for anonymous users

-- Update assessment_responses policy
DROP POLICY IF EXISTS "Users can insert own assessment responses" ON assessment_responses;
CREATE POLICY "Users can insert own assessment responses"
ON assessment_responses FOR INSERT
WITH CHECK (
  (auth.uid() = user_id OR (auth.uid() IS NULL AND check_anonymous_rate_limit()))
);

-- Update help_requests policy  
DROP POLICY IF EXISTS "Users can insert own help requests" ON help_requests;
CREATE POLICY "Users can insert own help requests"
ON help_requests FOR INSERT
WITH CHECK (
  (auth.uid() = user_id OR (auth.uid() IS NULL AND check_anonymous_rate_limit()))
  AND (SELECT COUNT(*) FROM help_requests 
       WHERE created_at > NOW() - INTERVAL '1 hour' 
       AND (user_id = auth.uid() OR (auth.uid() IS NULL AND user_id IS NULL))) < 5
);

-- Update learning_progress policy
DROP POLICY IF EXISTS "Users can insert own learning progress" ON learning_progress;
CREATE POLICY "Users can insert own learning progress"
ON learning_progress FOR INSERT
WITH CHECK (
  (auth.uid() = user_id OR (auth.uid() IS NULL AND check_anonymous_rate_limit()))
);

-- 3. Add tracking columns to users table for anonymous users
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS last_active_ip INET,
ADD COLUMN IF NOT EXISTS anonymous_session_id UUID DEFAULT gen_random_uuid();

-- 4. Create view to monitor anonymous activity
CREATE OR REPLACE VIEW anonymous_usage_stats AS
SELECT 
  DATE(created_at) as activity_date,
  COUNT(DISTINCT last_active_ip) as unique_ip_addresses,
  COUNT(DISTINCT anonymous_session_id) as unique_sessions,
  COUNT(*) as total_anonymous_users,
  COUNT(CASE WHEN created_at > NOW() - INTERVAL '1 hour' THEN 1 END) as users_last_hour
FROM users
WHERE is_anonymous = true
GROUP BY DATE(created_at)
ORDER BY activity_date DESC
LIMIT 30;

-- 5. Function to clean up old anonymous data (GDPR compliance)
CREATE OR REPLACE FUNCTION cleanup_old_anonymous_data()
RETURNS void AS $$
BEGIN
  -- Delete anonymous user data older than 30 days
  DELETE FROM users 
  WHERE is_anonymous = true 
  AND last_active < NOW() - INTERVAL '30 days';
  
  -- Clean up orphaned records
  DELETE FROM assessment_responses 
  WHERE user_id NOT IN (SELECT id FROM users WHERE id IS NOT NULL);
  
  DELETE FROM learning_progress 
  WHERE user_id NOT IN (SELECT id FROM users WHERE id IS NOT NULL);
  
  -- Clean up old rate limit records
  PERFORM cleanup_old_rate_limits();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create security documentation table
CREATE TABLE IF NOT EXISTS security_documentation (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  feature TEXT NOT NULL,
  decision TEXT NOT NULL,
  reasoning TEXT NOT NULL,
  mitigations TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT DEFAULT current_user
);

-- Document the anonymous access decision
INSERT INTO security_documentation (feature, decision, reasoning, mitigations) VALUES
(
  'Anonymous User Access',
  'Allow anonymous users to use core features without authentication',
  'ByteSteps targets elderly users (65+) who may struggle with authentication. Research shows authentication is a major barrier to digital adoption for this demographic. Anonymous access reduces friction and improves accessibility.',
  ARRAY[
    'IP-based rate limiting (50 requests/hour)',
    'Session-based tracking for analytics',
    'Automatic cleanup of data after 30 days',
    'No sensitive personal data collected',
    'Help requests limited to 5 per hour',
    'All data encrypted at rest'
  ]
);

-- 7. Create index for better rate limiting performance
CREATE INDEX IF NOT EXISTS idx_rate_limits_ip_endpoint_created 
ON rate_limits (ip_address, endpoint, created_at);

-- 8. Create trigger to automatically cleanup old data
CREATE OR REPLACE FUNCTION trigger_cleanup_anonymous_data()
RETURNS trigger AS $$
BEGIN
  -- Cleanup old data 5% of the time to avoid performance impact
  IF random() < 0.05 THEN
    PERFORM cleanup_old_anonymous_data();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to users table
DROP TRIGGER IF EXISTS cleanup_anonymous_data_trigger ON users;
CREATE TRIGGER cleanup_anonymous_data_trigger
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION trigger_cleanup_anonymous_data();