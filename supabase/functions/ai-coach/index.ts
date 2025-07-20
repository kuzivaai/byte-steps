import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      assessmentData, 
      userContext, 
      requestType = 'guidance',
      currentProgress 
    } = await req.json();

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
    
    switch (requestType) {
      case 'guidance':
        userPrompt = `Based on the user's assessment results, provide personalized guidance for improving their digital skills. Focus on their weakest areas while building on their strengths. Suggest 3-5 specific, actionable next steps.`;
        break;
      case 'encouragement':
        userPrompt = `The user seems to be struggling or losing confidence. Provide encouraging words and remind them of their progress. Suggest easier steps they can take to build confidence.`;
        break;
      case 'explanation':
        userPrompt = `The user needs help understanding: "${userContext}". Explain this concept in simple terms suitable for someone new to technology.`;
        break;
      case 'next-steps':
        userPrompt = `Based on their current progress, suggest what the user should learn or practice next. Make recommendations that build logically on what they already know.`;
        break;
      default:
        userPrompt = `Provide helpful guidance for this digital skills learner: ${userContext}`;
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
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const guidance = data.choices[0].message.content;

    console.log('AI guidance generated successfully');

    return new Response(JSON.stringify({ 
      guidance,
      requestType,
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