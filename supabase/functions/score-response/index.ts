import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const AI_TIMEOUT_MS = 55_000;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

  try {
    const { caseContext, question, userResponse } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are an expert business case interview coach with experience at top consulting firms (McKinsey, BCG, Bain). 
Your role is to evaluate candidate responses to case interview questions.

Evaluate the response based on these criteria:
1. Structure (0-25 points): Is the answer well-organized with a clear framework?
2. Analysis (0-25 points): Does the candidate identify key issues and consider multiple factors?
3. Quantitative Reasoning (0-25 points): Are numbers and calculations used appropriately?
4. Business Insight (0-25 points): Does the response show practical business understanding?

Provide your evaluation in this exact JSON format:
{
  "totalScore": <number 0-100>,
  "breakdown": {
    "structure": <number 0-25>,
    "analysis": <number 0-25>,
    "quantitative": <number 0-25>,
    "businessInsight": <number 0-25>
  },
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<improvement 1>", "<improvement 2>"],
  "feedback": "<2-3 sentence overall feedback>"
}`;

    const userPrompt = `Case Context:
${caseContext}

Question:
${question}

Candidate's Response:
${userResponse}

Please evaluate this response and provide your scoring.`;

    let response: Response;
    try {
      response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Payment required. Please add credits to continue.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error('AI gateway error');
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    // Parse the JSON from the AI response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }
    
    const evaluation = JSON.parse(jsonMatch[0]);
    
    return new Response(JSON.stringify(evaluation), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    clearTimeout(timeoutId);
    
    const isAbort = (error as { name?: string } | null)?.name === "AbortError";
    const errorMessage = isAbort
      ? "Evaluation timed out. Please try again."
      : error instanceof Error
      ? error.message
      : "Failed to score response";

    console.error('Error in score-response:', errorMessage);
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: isAbort ? 504 : 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
