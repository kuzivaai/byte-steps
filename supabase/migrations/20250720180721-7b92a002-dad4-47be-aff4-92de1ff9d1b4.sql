-- Create rate_limits table for persistent rate limiting
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  ip_address INET NOT NULL,
  endpoint VARCHAR(100) NOT NULL,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Create policies for rate_limits
CREATE POLICY "Allow inserting rate limit records" 
ON public.rate_limits 
FOR INSERT 
WITH CHECK (true);

-- Add ip_address to users table for tracking
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS ip_address INET;

-- Function to cleanup old rate limit records
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void AS $$
BEGIN
  DELETE FROM public.rate_limits 
  WHERE created_at < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-cleanup (runs on each insert)
CREATE OR REPLACE FUNCTION public.trigger_cleanup_rate_limits()
RETURNS TRIGGER AS $$
BEGIN
  -- Cleanup old records 10% of the time to avoid performance impact
  IF random() < 0.1 THEN
    PERFORM public.cleanup_old_rate_limits();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS cleanup_rate_limits_trigger ON public.rate_limits;
CREATE TRIGGER cleanup_rate_limits_trigger
  AFTER INSERT ON public.rate_limits
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_cleanup_rate_limits();