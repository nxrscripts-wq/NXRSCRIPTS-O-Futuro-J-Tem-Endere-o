import { GoogleGenAI } from "npm:@google/genai";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { type, payload } = await req.json();

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing GEMINI_API_KEY" }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    let result = '';

    if (type === 'categorize') {
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: `Analyze the following contact message and determine the category (Sales, Support, Partnership, or General). 
            Return ONLY the category name in English (to match system types). Message: "${payload}"`
      });
      result = response.text?.trim() || "General";
    } else if (type === 'insight') {
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: `You are a senior cybersecurity analyst at NXRSCRIPTS. 
      Provide a brief, professional, and technical insight (max 2 sentences) about the following topic: "${payload}". 
      Focus on risk mitigation and future trends. Write your response in Portuguese (Portugal). Do not use markdown.`,
      });
      result = response.text || "Insight de segurança indisponível no momento.";
    } else {
      return new Response(JSON.stringify({ error: "Invalid type provided" }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error("Error in ai-analyze edge function:", error);
    return new Response(JSON.stringify({ error: error.message || "Unknown error" }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
});
