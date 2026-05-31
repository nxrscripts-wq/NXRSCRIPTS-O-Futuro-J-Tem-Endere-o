import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  try {
    const payload = await req.json();
    
    // O webhook criado pela IA do Supabase envia o "NEW" record diretamente no corpo (body)
    // Caso seja o webhook padrão, viria dentro de payload.record. Suportamos ambos:
    const order = payload.record || payload;

    // Validação básica para ter a certeza que é uma encomenda válida
    if (!order || !order.customer_email || !order.product_name) {
      return new Response('Invalid payload', { status: 400 });
    }
    const apiKey = Deno.env.get('RESEND_API_KEY');
    const notifyEmail = Deno.env.get('NOTIFY_EMAIL') || 'nxrscripts@gmail.com';

    // Email para a NXRSCRIPTS (alerta interno)
    const adminEmailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #020617; color: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid #1e293b;">
        <div style="background: #06b6d4; padding: 20px; text-align: center;">
          <h2 style="color: #020617; margin: 0;">🛒 Nova Requisição de Compra — NXRSCRIPTS</h2>
        </div>
        <div style="padding: 30px;">
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr><td style="padding: 10px; border-bottom: 1px solid #1e293b; color: #94a3b8;">Produto</td><td style="padding: 10px; border-bottom: 1px solid #1e293b; font-weight: bold;">${order.product_name}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #1e293b; color: #94a3b8;">Preço</td><td style="padding: 10px; border-bottom: 1px solid #1e293b;">${order.product_price ? 'Kz ' + Number(order.product_price).toLocaleString('pt-AO') : 'Consultar'}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #1e293b; color: #94a3b8;">Quantidade</td><td style="padding: 10px; border-bottom: 1px solid #1e293b;">${order.quantity}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #1e293b; color: #94a3b8;">Cliente</td><td style="padding: 10px; border-bottom: 1px solid #1e293b;">${order.customer_name}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #1e293b; color: #94a3b8;">Email</td><td style="padding: 10px; border-bottom: 1px solid #1e293b;">${order.customer_email}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #1e293b; color: #94a3b8;">Telefone</td><td style="padding: 10px; border-bottom: 1px solid #1e293b;">${order.customer_phone || '—'}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #1e293b; color: #94a3b8;">Origem</td><td style="padding: 10px; border-bottom: 1px solid #1e293b;">${order.source === 'whatsapp' ? '💬 WhatsApp' : '📋 Formulário'}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #1e293b; color: #94a3b8;">Data</td><td style="padding: 10px; border-bottom: 1px solid #1e293b;">${new Date(order.created_at).toLocaleString('pt-PT')}</td></tr>
          </table>
          
          ${order.message ? `<div style="background: #0f172a; padding: 15px; border-left: 4px solid #06b6d4; border-radius: 4px; margin-bottom: 20px;"><strong style="color: #94a3b8; font-size: 12px; display: block; margin-bottom: 5px;">MENSAGEM DO CLIENTE</strong>${order.message}</div>` : ''}
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://nxrscripts.com/admin" style="background: #06b6d4; color: #020617; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 6px; display: inline-block;">Ver no Admin Panel</a>
          </div>
        </div>
        <div style="text-align: center; padding: 15px; font-size: 12px; color: #64748b; border-top: 1px solid #1e293b;">
          NXRSCRIPTS · nxrscripts@gmail.com · +244 923 479 049
        </div>
      </div>
    `;

    // Email de confirmação para o CLIENTE
    const clientEmailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; color: #334155; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
        <div style="background: #020617; padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; letter-spacing: 2px;">NXRSCRIPTS</h1>
          <p style="color: #06b6d4; font-size: 12px; margin: 5px 0 0 0; letter-spacing: 4px;">SOLUÇÕES DIGITAIS</p>
        </div>
        <div style="padding: 40px 30px;">
          <h2 style="color: #0f172a; margin-top: 0;">Requisição Recebida com Sucesso!</h2>
          <p style="line-height: 1.6;">Olá <strong>${order.customer_name}</strong>,</p>
          <p style="line-height: 1.6;">Recebemos a sua requisição para o produto <strong>${order.product_name}</strong> (quantidade: ${order.quantity}). A nossa equipa irá entrar em contacto consigo brevemente.</p>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 25px 0;">
            <p style="margin: 0 0 10px 0;"><strong>Produto:</strong> ${order.product_name}</p>
            <p style="margin: 0 0 10px 0;"><strong>Quantidade:</strong> ${order.quantity}</p>
            <p style="margin: 0;"><strong>Referência:</strong> ${order.id.split('-')[0].toUpperCase()}</p>
          </div>
          
          <p style="line-height: 1.6;">Pode também contactar-nos directamente:</p>
          <div style="margin-top: 20px;">
            <a href="https://wa.me/244923479049" style="display: inline-block; background: #22c55e; color: white; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; margin-right: 10px;">💬 WhatsApp</a>
            <a href="mailto:nxrscripts@gmail.com" style="display: inline-block; background: #3b82f6; color: white; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: bold;">✉️ Email</a>
          </div>
        </div>
        <div style="background: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b;">
          www.nxrscripts.com · Luanda, Angola
        </div>
      </div>
    `;

    // Enviar email para a NXRSCRIPTS
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'NXRSCRIPTS Loja <onboarding@resend.dev>',
        to: [notifyEmail],
        subject: `[NXRSCRIPTS] Nova requisição: ${order.product_name} — ${order.customer_name}`,
        html: adminEmailHtml,
      }),
    });

    // Enviar email de confirmação para o cliente
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'NXRSCRIPTS <onboarding@resend.dev>',
        to: [notifyEmail], // Só pode enviar para si próprio enquanto o domínio não for validado
        subject: `CÓPIA PARA CLIENTE: Requisição recebida — ${order.product_name}`,
        html: clientEmailHtml,
      }),
    });

    return new Response(JSON.stringify({ sent: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('[notify-order]', err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
});
