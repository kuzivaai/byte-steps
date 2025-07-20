import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Rate limiting function
const checkRateLimit = async (clientIp: string, endpoint: string, maxRequests: number) => {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  
  const { data, error } = await supabase
    .from('rate_limits')
    .select('id')
    .eq('ip_address', clientIp)
    .eq('endpoint', endpoint)
    .gte('created_at', oneHourAgo);

  if (error) {
    console.error('Rate limit check error:', error);
    return true; // Allow on error to prevent blocking legitimate users
  }

  if (data && data.length >= maxRequests) {
    return false;
  }

  // Log this request
  await supabase
    .from('rate_limits')
    .insert({ ip_address: clientIp, endpoint });

  return true;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const clientIp = req.headers.get('x-forwarded-for') || 
                     req.headers.get('x-real-ip') || 
                     '127.0.0.1';

    // Check rate limit (10 requests per hour)
    const rateLimitOk = await checkRateLimit(clientIp, 'text-to-speech', 10);
    if (!rateLimitOk) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    const { text, voice = 'alloy', speed = 1.0 } = await req.json();

    if (!text) {
      throw new Error('Text is required');
    }

    console.log('Generating speech for text length:', text.length);

    // Generate speech using OpenAI's TTS API
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: voice, // alloy, echo, fable, onyx, nova, shimmer
        response_format: 'mp3',
        speed: speed,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI TTS error:', error);
      throw new Error(error.error?.message || 'Failed to generate speech');
    }

    // Convert audio to base64
    const arrayBuffer = await response.arrayBuffer();
    const base64Audio = btoa(
      String.fromCharCode(...new Uint8Array(arrayBuffer))
    );

    console.log('Speech generated successfully');

    return new Response(
      JSON.stringify({ 
        audioContent: base64Audio,
        voice,
        generatedAt: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );

  } catch (error) {
    console.error('Error in text-to-speech function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate speech',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});