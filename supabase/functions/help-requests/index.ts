import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { checkAnonymousRateLimit, getRateLimitResponse, logAnonymousUser } from '../_shared/rateLimiting.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client for rate limiting
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkRateLimit(identifier: string, endpoint: string, maxRequests = 5, windowMs = 60000): Promise<boolean> {
  try {
    const windowStart = new Date(Date.now() - windowMs);
    
    // Check current rate limit
    const { data: limits, error } = await supabase
      .from('rate_limits')
      .select('*')
      .eq('ip_address', identifier)
      .eq('endpoint', endpoint)
      .gte('created_at', windowStart.toISOString());

    if (error) {
      console.error('Rate limit check error:', error);
      return true; // Allow on error
    }

    if (limits && limits.length >= maxRequests) {
      return false;
    }

    // Record this request
    await supabase
      .from('rate_limits')
      .insert({
        ip_address: identifier,
        endpoint: endpoint,
        user_id: null
      });

    return true;
  } catch (error) {
    console.error('Rate limiting error:', error);
    return true; // Allow on error
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    
    // Get authorization header for auth check
    const authHeader = req.headers.get('Authorization');
    
    // Initialize Supabase client for user auth check
    const userSupabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      authHeader ? {
        global: { headers: { Authorization: authHeader } }
      } : {}
    );
    
    // Check if user is authenticated
    const { data: { user }, error: userError } = await userSupabase.auth.getUser();
    
    if (!user) {
      // Anonymous user - check new rate limiting system
      console.log('Anonymous user detected, checking rate limit');
      const canProceed = await checkAnonymousRateLimit(supabase, req);
      if (!canProceed) {
        console.log('Rate limit exceeded for anonymous user');
        return getRateLimitResponse();
      }
      
      // Log anonymous user activity
      await logAnonymousUser(supabase, req);
      console.log('Anonymous user allowed to proceed');
    } else {
      // Authenticated user - use existing rate limiting
      const rateLimitOk = await checkRateLimit(clientIp, 'help-requests', 5);
      if (!rateLimitOk) {
        return new Response(
          JSON.stringify({ error: 'Too many help requests. Please wait before submitting another.' }),
          { 
            status: 429, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    }

    const { description, urgency, contactMethod, contactDetails } = await req.json();

    // Input validation
    if (!description || description.length < 10 || description.length > 1000) {
      return new Response(
        JSON.stringify({ error: 'Description must be between 10 and 1000 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize input
    const sanitizedDescription = description.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Help request submitted successfully',
        submittedAt: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in help-requests function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});