import { GoogleGenAI } from "npm:@google/genai";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `És o assistente digital da NXRSCRIPTS, empresa de tecnologia em Luanda, Angola.
Nome: NXR Assistant. Responde em português de Portugal (não brasileiro).
Especialização: cibersegurança, software, consultoria IT, transformação digital para Angola.
Respostas concisas (máximo 3 parágrafos). Quando há interesse em contratar: sugere /contact ou /quote.
Não responder a tópicos fora de tecnologia/negócio.`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { message, history } = await req.json();

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing GEMINI_API_KEY" }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Format history for Gemini SDK
    // According to GoogleGenAI SDK, history needs to be in `contents` format.
    // user -> role: 'user', parts: [{ text: ... }]
    // model -> role: 'model', parts: [{ text: ... }]
    
    const formattedHistory = Array.isArray(history) ? history.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    })) : [];

    // The chat session setup
    const chat = ai.chats.create({
        model: 'gemini-2.0-flash',
        config: {
            systemInstruction: SYSTEM_PROMPT,
        }
    });

    // If there is history, we need to pass it. Wait, the `GoogleGenAI` chats.create has a `history` param?
    // Actually, `ai.chats.create` config might not take history directly in this version.
    // Let's use `generateContent` with a concatenated history or use the supported chat history approach.
    // The standard way in `@google/genai` is `ai.chats.create({ model, history: formattedHistory, config })`
    
    const chatSession = ai.chats.create({
      model: 'gemini-2.0-flash',
      config: {
        systemInstruction: SYSTEM_PROMPT,
      },
      history: formattedHistory
    });

    const response = await chatSession.sendMessage({ message });

    return new Response(JSON.stringify({ reply: response.text }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error("Error in chat edge function:", error);
    return new Response(JSON.stringify({ error: error.message || "Unknown error" }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
});
