import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export async function checkAnonymousRateLimit(
  supabase: any,
  request: Request
): Promise<boolean> {
  try {
    // Extract IP address from request headers
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const clientIp = forwarded?.split(',')[0] || realIp || '127.0.0.1'
    
    console.log('Checking rate limit for IP:', clientIp)
    
    // Call the database function to check rate limit
    const { data, error } = await supabase.rpc('check_anonymous_rate_limit')
    
    if (error) {
      console.error('Rate limit check failed:', error)
      return false // Fail closed for security
    }
    
    console.log('Rate limit check result:', data)
    return data === true
  } catch (error) {
    console.error('Rate limit check error:', error)
    return false // Fail closed for security
  }
}

export function getRateLimitResponse(): Response {
  return new Response(
    JSON.stringify({ 
      error: 'Too many requests. Please try again later.',
      message: 'For your security, we limit anonymous usage. Please wait an hour before trying again.',
      retryAfter: 3600 // 1 hour
    }), 
    { 
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': '3600'
      }
    }
  )
}

export async function logAnonymousUser(
  supabase: any,
  request: Request,
  sessionId?: string
): Promise<void> {
  try {
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const clientIp = forwarded?.split(',')[0] || realIp || '127.0.0.1'
    
    // Create anonymous user record for tracking
    const { error } = await supabase
      .from('users')
      .upsert({
        is_anonymous: true,
        last_active_ip: clientIp,
        anonymous_session_id: sessionId || crypto.randomUUID(),
        last_active: new Date().toISOString()
      }, {
        onConflict: 'anonymous_session_id'
      })
    
    if (error) {
      console.error('Failed to log anonymous user:', error)
    }
  } catch (error) {
    console.error('Error logging anonymous user:', error)
  }
}