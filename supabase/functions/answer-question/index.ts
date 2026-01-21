import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const AI_TIMEOUT_MS = 55_000;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

  try {
    const { caseContext, caseQuestion, userQuestion } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an interviewer conducting a case interview. The candidate is asking you clarifying questions about the case.

Your role is to:
1. Answer questions that a real interviewer would answer (company background, goals, constraints, market info, etc.)
2. Provide realistic, helpful information that guides the candidate
3. If the question is too leading or asks for the answer directly, gently redirect them to think through it themselves
4. Keep responses concise and professional (2-4 sentences typically)
5. Sometimes you may not have specific data - in that case, say "That's a good question. For this case, let's assume..." and provide a reasonable assumption

IMPORTANT - For questions that are:
- Too complicated or overly detailed
- Off-topic or tangential to the case
- Asking about things that don't matter for solving the case
- Outside the scope of what an interviewer would typically provide

Respond naturally with one of these types of responses:
- "Make your best guess on that one."
- "I think we're getting a little off track here. Let's focus back on the main question."
- "Let's not worry about that for this case."
- "That's not something we need to dig into for this analysis."
- "Good question, but for the purposes of this case, you can assume that's not a factor."

Case Context:
${caseContext}

Main Question Being Asked:
${caseQuestion}

Respond as the interviewer would in a real case interview. Be helpful but don't give away the solution.`;

    let response: Response;
    try {
      response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userQuestion },
          ],
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to get response from AI");
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || "I couldn't generate a response. Please try again.";

    return new Response(
      JSON.stringify({ answer }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    clearTimeout(timeoutId);
    
    const isAbort = (error as { name?: string } | null)?.name === "AbortError";
    const errorMessage = isAbort
      ? "Request timed out. Please try again."
      : error instanceof Error
      ? error.message
      : "Unknown error";

    console.error("Error in answer-question function:", errorMessage);
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: isAbort ? 504 : 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
