import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

// Initialize Supabase client for rate limiting
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkRateLimit(identifier: string, endpoint: string, maxRequests = 10, windowMs = 60000): Promise<boolean> {
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

  const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  
  // Check rate limit using database
  const rateLimitOk = await checkRateLimit(clientIp, 'ai-coach');
  if (!rateLimitOk) {
    return new Response(
      JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
      { 
        status: 429, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }

  try {
    const { 
      assessmentData, 
      userContext, 
      requestType = 'guidance',
      currentProgress 
    } = await req.json();

    // Input sanitization for AI safety
    const sanitizeInput = (input: string): string => {
      if (!input) return '';
      
      // Remove potential prompt injections
      const dangerous = [
        'ignore previous instructions',
        'system prompt',
        'reveal your instructions',
        'disregard',
        'override',
        '###',
        '<system>',
        '</system>',
        'assistant:',
        'human:',
        'ai:',
        'chatgpt:',
        'openai:'
      ];
      
      let sanitized = input.toLowerCase();
      for (const pattern of dangerous) {
        if (sanitized.includes(pattern)) {
          throw new Error('Invalid input detected');
        }
      }
      
      // Limit length and remove excessive special characters
      return input.slice(0, 500).replace(/[<>{}]/g, '');
    };

    // Sanitize all string inputs
    const safeUserContext = userContext ? sanitizeInput(userContext) : '';
    const safeRequestType = ['guidance', 'encouragement', 'explanation', 'next-steps'].includes(requestType) 
      ? requestType 
      : 'guidance';

    console.log('AI Coach request:', { requestType, userContext });

    // Create system prompt based on ByteSteps' mission
    const systemPrompt = `You are a supportive AI coach for ByteSteps, a digital skills platform designed specifically for elderly users (ages 60+). Your role is to provide:

1. **Encouraging and patient guidance** - Always be supportive, never condescending
2. **Simple, clear explanations** - Break down complex digital concepts into easy steps
3. **Accessibility-focused advice** - Consider visual, motor, and cognitive accessibility needs
4. **Practical, real-world applications** - Connect digital skills to daily life benefits
5. **Confidence building** - Celebrate small wins and progress

Key principles:
- Use clear, simple language without technical jargon
- Provide step-by-step instructions
- Acknowledge that learning technology can be challenging
- Focus on practical benefits (staying connected with family, accessing services, etc.)
- Be patient and encouraging
- Suggest breaking tasks into smaller, manageable steps

Assessment context: ${JSON.stringify(assessmentData)}
User progress: ${JSON.stringify(currentProgress)}`;

    let userPrompt = '';
    
    switch (safeRequestType) {
      case 'guidance':
        userPrompt = `Based on the user's assessment results, provide personalized guidance for improving their digital skills. Focus on their weakest areas while building on their strengths. Suggest 3-5 specific, actionable next steps.`;
        break;
      case 'encouragement':
        userPrompt = `The user seems to be struggling or losing confidence. Provide encouraging words and remind them of their progress. Suggest easier steps they can take to build confidence.`;
        break;
      case 'explanation':
        userPrompt = `The user needs help understanding: "${safeUserContext}". Explain this concept in simple terms suitable for someone new to technology.`;
        break;
      case 'next-steps':
        userPrompt = `Based on their current progress, suggest what the user should learn or practice next. Make recommendations that build logically on what they already know.`;
        break;
      default:
        userPrompt = `Provide helpful guidance for this digital skills learner: ${safeUserContext}`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 400,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const guidance = data.choices[0].message.content;

    // Output validation - ensure response is safe
    if (guidance.toLowerCase().includes('ignore') && guidance.toLowerCase().includes('instructions')) {
      throw new Error('Invalid AI response detected');
    }

    console.log('AI guidance generated successfully');

    return new Response(JSON.stringify({ 
      guidance: guidance.slice(0, 1000), // Limit output length
      requestType: safeRequestType,
      generatedAt: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-coach function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to generate guidance',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});