import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client for rate limiting
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkRateLimit(identifier: string, endpoint: string, maxRequests = 20, windowMs = 60000): Promise<boolean> {
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
    
    // Check rate limit for assessments (20 per minute)
    const rateLimitOk = await checkRateLimit(clientIp, 'assessment-submit', 20);
    if (!rateLimitOk) {
      return new Response(
        JSON.stringify({ error: 'Too many assessment submissions. Please wait before submitting again.' }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { responses, sessionId } = await req.json();

    // Input validation
    if (!responses || !Array.isArray(responses)) {
      return new Response(
        JSON.stringify({ error: 'Invalid assessment responses format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate each response
    for (const response of responses) {
      if (!response.question_id || !response.response) {
        return new Response(
          JSON.stringify({ error: 'Each response must have question_id and response' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Assessment submitted successfully',
        submittedAt: new Date().toISOString(),
        responseCount: responses.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in assessment-submit function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});