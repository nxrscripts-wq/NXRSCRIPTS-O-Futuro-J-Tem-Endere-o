import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

// ============================================================
// CORS — Restricted to NXRSCRIPTS domains
// ============================================================
const ALLOWED_ORIGINS = [
  'https://nxrscripts.co.ao',
  'https://www.nxrscripts.co.ao',
  'https://www.nxrscripts.com',
  'https://nxrscripts.com',
];

function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get('origin') || '';
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Content-Type': 'application/json',
  };
}

// ============================================================
// Rate Limiting — In-memory per IP (10 req/min)
// ============================================================
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 10;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) {
    return true;
  }

  return false;
}

// Cleanup stale entries every 5 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now > entry.resetAt) rateLimitMap.delete(ip);
  }
}, 5 * 60_000);

// ============================================================
// Input Validation
// ============================================================
const VALID_TYPES = ['insight', 'categorize', 'chat'] as const;
const MAX_PAYLOAD_LENGTH = 2000;

// ============================================================
// Main Handler
// ============================================================
serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Rate limit check
  const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('cf-connecting-ip')
    || 'unknown';

  if (isRateLimited(clientIp)) {
    return new Response(
      JSON.stringify({ error: 'Rate limit exceeded. Try again in 1 minute.' }),
      { status: 429, headers: { ...corsHeaders, 'Retry-After': '60' } }
    );
  }

  try {
    const body = await req.json();
    const { type, payload } = body;

    // Validate type
    if (!type || !VALID_TYPES.includes(type)) {
      return new Response(
        JSON.stringify({ error: `Invalid type. Must be one of: ${VALID_TYPES.join(', ')}` }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate payload
    if (!payload || typeof payload !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Payload is required and must be a string' }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (payload.length > MAX_PAYLOAD_LENGTH) {
      return new Response(
        JSON.stringify({ error: `Payload too large. Max ${MAX_PAYLOAD_LENGTH} characters.` }),
        { status: 400, headers: corsHeaders }
      );
    }

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'GEMINI_API_KEY not configured' }),
        { status: 500, headers: corsHeaders }
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
        { status: 400, headers: corsHeaders }
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
      { status: 200, headers: corsHeaders }
    );

  } catch (err) {
    console.error('[ai-analyze]', err);
    return new Response(
      JSON.stringify({ result: null, error: String(err) }),
      { status: 200, headers: corsHeaders }
    );
  }
});
