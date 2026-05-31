import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  try {
    const { type, payload } = await req.json();

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'GEMINI_API_KEY not configured' }),
        { status: 500, headers: CORS_HEADERS }
      );
    }

    let prompt = '';

    if (type === 'insight') {
      prompt = `És um analista sénior de cibersegurança da NXRSCRIPTS, empresa angolana de tecnologia.
Fornece um resumo profissional e técnico (máximo 2 frases) sobre o seguinte tópico de segurança: "${payload}".
Foca em mitigação de riscos e tendências actuais.
Responde em português de Portugal. Não uses markdown, asteriscos nem formatação especial.`;

    } else if (type === 'categorize') {
      prompt = `Analisa a seguinte mensagem de contacto e determina a categoria (Sales, Support, Partnership ou General).
Retorna APENAS o nome da categoria em inglês. Mensagem: "${payload}"`;

    } else if (type === 'chat') {
      const { message, history = [] } = typeof payload === 'string' ? JSON.parse(payload) : payload;
      const historyText = history.slice(-6).map((m: { role: string; text: string }) =>
        `${m.role === 'user' ? 'Utilizador' : 'NXR Assistant'}: ${m.text}`
      ).join('\n');

      prompt = `És o NXR Assistant, assistente digital da NXRSCRIPTS — empresa angolana de TI em Luanda.
Respondes SEMPRE em português de Portugal (nunca brasileiro).
Especialização: cibersegurança, desenvolvimento de software, redes, telecomunicações, consultoria IT, transformação digital.
Respostas concisas (máximo 3 parágrafos). Quando o utilizador mostrar interesse em serviços: sugere visitar /contact ou /quote.
Não responder a perguntas fora do âmbito tecnológico/empresarial.
Se não souberes algo específico: "Para informação detalhada, contacta-nos em nxrscripts@gmail.com ou +244 923 479 049".

${historyText ? `Histórico da conversa:\n${historyText}\n\n` : ''}Utilizador: ${message}
NXR Assistant:`;
    }

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Invalid type. Use: insight, categorize, or chat' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: type === 'chat' ? 400 : (type === 'insight' ? 150 : 20),
            temperature: type === 'chat' ? 0.7 : 0.3,
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errBody = await geminiResponse.text();
      console.error('[ai-analyze] Gemini error:', errBody);
      throw new Error(`Gemini API error: ${geminiResponse.status}`);
    }

    const geminiData = await geminiResponse.json();
    const result = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

    if (!result) throw new Error('Empty response from Gemini');

    return new Response(
      JSON.stringify({ result }),
      { status: 200, headers: CORS_HEADERS }
    );

  } catch (err) {
    console.error('[ai-analyze]', err);
    return new Response(
      JSON.stringify({ result: null, error: String(err) }),
      { status: 200, headers: CORS_HEADERS }
    );
  }
});
