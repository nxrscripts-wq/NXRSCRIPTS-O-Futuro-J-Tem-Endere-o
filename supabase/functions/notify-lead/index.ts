import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  try {
    const payload = await req.json();
    // O webhook do Supabase envia: { type, table, record, old_record, schema }
    if (payload.type !== 'INSERT') return new Response('ok', { status: 200 });

    const lead = payload.record;
    const apiKey = Deno.env.get('RESEND_API_KEY');
    const notifyEmail = Deno.env.get('NOTIFY_EMAIL'); // email da equipa

    if (!apiKey || !notifyEmail) {
        throw new Error('RESEND_API_KEY or NOTIFY_EMAIL is not set in environment variables.');
    }

    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
        <h2 style="color: #0f172a; border-bottom: 2px solid #00E5FF; padding-bottom: 10px;">
          🔔 Novo Lead — NXRSCRIPTS
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr><td style="padding: 8px 0; color: #64748b; width: 120px;">Nome</td><td style="font-weight: bold; color: #0f172a;">${lead.name}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;">Email</td><td style="font-weight: bold; color: #0f172a;"><a href="mailto:${lead.email}" style="color: #00E5FF; text-decoration: none;">${lead.email}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;">Empresa</td><td style="font-weight: bold; color: #0f172a;">${lead.company || '—'}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;">Categoria IA</td><td style="font-weight: bold; color: #0f172a;">${lead.category}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;">Data</td><td style="font-weight: bold; color: #0f172a;">${new Date(lead.created_at).toLocaleString('pt-PT')}</td></tr>
        </table>
        
        <div style="margin-top: 30px; background-color: white; padding: 15px; border-radius: 6px; border-left: 4px solid #00E5FF;">
          <div style="color: #64748b; font-size: 12px; margin-bottom: 8px; font-weight: bold;">MENSAGEM</div>
          <div style="color: #334155; line-height: 1.5; white-space: pre-wrap;">${lead.message}</div>
        </div>
        
        <div style="margin-top: 30px; text-align: center;">
          <a href="https://www.nxrscripts.com/admin" style="display: inline-block; background-color: #0f172a; color: #00E5FF; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; border: 1px solid #1e293b;">
            Ver no Admin Panel
          </a>
        </div>
      </div>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'NXRSCRIPTS <onboarding@resend.dev>', // Resend standard test domain unless verified
        to: [notifyEmail],
        subject: `[NXRSCRIPTS] Novo lead: ${lead.name} — ${lead.category}`,
        html: emailHtml,
      }),
    });

    if (!res.ok) throw new Error(`Resend error: ${await res.text()}`);
    return new Response(JSON.stringify({ sent: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (err: any) {
    console.error('[notify-lead]', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
});
