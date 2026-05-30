import React from 'react';
import { COMPANY_INFO } from '../constants';
import { SEOHead } from '../components/SEOHead';
import { SEO_PAGES } from '../lib/seo';
import { AnimateIn } from '../components/AnimateIn';

const Privacy: React.FC = () => {
  return (
    <>
      <SEOHead page={SEO_PAGES.privacy} />
      <div className="pt-20 sm:pt-28 pb-24 bg-slate-950 min-h-screen">
        <div className="max-w-4xl mx-auto px-6">
          <header className="mb-16">
            <h1 className="font-orbitron text-4xl sm:text-5xl font-bold text-white mb-4">
              Política de Privacidade
            </h1>
            <p className="font-rajdhani text-slate-400 text-lg">
              Última actualização: 28 de Maio de 2026
            </p>
          </header>

          <div className="space-y-12 font-rajdhani text-slate-300 leading-relaxed text-lg">
            <AnimateIn delay={0}>
              <section>
                <h2 className="font-mono text-cyan-400 uppercase tracking-widest text-sm mb-4 font-bold">
                  1. RESPONSÁVEL PELO TRATAMENTO
                </h2>
                <p>
                  NXRSCRIPTS &middot; {COMPANY_INFO.address.full} &middot;{' '}
                  <a
                    href={`mailto:${COMPANY_INFO.contact.email}`}
                    className="text-cyan-400 hover:text-white transition-colors"
                  >
                    {COMPANY_INFO.contact.email}
                  </a>
                </p>
              </section>
            </AnimateIn>

            <AnimateIn delay={0}>
              <section>
                <h2 className="font-mono text-cyan-400 uppercase tracking-widest text-sm mb-4 font-bold">
                  2. DADOS RECOLHIDOS
                </h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Via formulário de contacto:</strong> nome, email, empresa, mensagem.
                  </li>
                  <li>
                    <strong>Via formulário de orçamento:</strong> nome, empresa, email, tipo de
                    serviço, dimensão, orçamento estimado.
                  </li>
                  <li>
                    <strong>Técnicos:</strong> cookies de sessão, endereço IP (uso interno de
                    segurança).
                  </li>
                </ul>
              </section>
            </AnimateIn>

            <AnimateIn delay={0}>
              <section>
                <h2 className="font-mono text-cyan-400 uppercase tracking-widest text-sm mb-4 font-bold">
                  3. FINALIDADE DO TRATAMENTO
                </h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Resposta a pedidos de contacto e orçamento.</li>
                  <li>
                    Categorização interna de leads por inteligência artificial (Google Gemini) — sem
                    retenção de dados pela API externa.
                  </li>
                  <li>Comunicações comerciais apenas com consentimento explícito.</li>
                </ul>
              </section>
            </AnimateIn>

            <AnimateIn delay={0}>
              <section>
                <h2 className="font-mono text-cyan-400 uppercase tracking-widest text-sm mb-4 font-bold">
                  4. BASE LEGAL
                </h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Art. 6.º, n.º 1, al. b) RGPD — execução de diligências pré-contratuais.</li>
                  <li>
                    Art. 6.º, n.º 1, al. f) RGPD — interesse legítimo para gestão de contactos B2B.
                  </li>
                </ul>
              </section>
            </AnimateIn>

            <AnimateIn delay={0}>
              <section>
                <h2 className="font-mono text-cyan-400 uppercase tracking-widest text-sm mb-4 font-bold">
                  5. SUBCONTRATANTES E TRANSFERÊNCIAS
                </h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Supabase Inc.</strong> (base de dados — servidores EU/EEA) —
                    armazenamento de formulários.
                  </li>
                  <li>
                    <strong>Google LLC</strong> (API Gemini — EUA) — análise de texto; dados não
                    retidos após processamento.
                  </li>
                  <li>
                    <strong>Vercel Inc.</strong> (alojamento web — EUA/EU) — serviço de hospedagem.
                  </li>
                  <li>
                    <strong>Resend Inc.</strong> (emails transaccionais) — notificações internas.
                  </li>
                </ul>
                <p className="mt-4 font-semibold text-white">
                  Sem venda nem cedência de dados a terceiros para marketing.
                </p>
              </section>
            </AnimateIn>

            <AnimateIn delay={0}>
              <section>
                <h2 className="font-mono text-cyan-400 uppercase tracking-widest text-sm mb-4 font-bold">
                  6. RETENÇÃO
                </h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Dados de formulário:</strong> 24 meses após último contacto, salvo
                    obrigação legal.
                  </li>
                  <li>
                    <strong>Dados técnicos (logs):</strong> 90 dias.
                  </li>
                </ul>
              </section>
            </AnimateIn>

            <AnimateIn delay={0}>
              <section>
                <h2 className="font-mono text-cyan-400 uppercase tracking-widest text-sm mb-4 font-bold">
                  7. DIREITOS DO TITULAR
                </h2>
                <p className="mb-2">
                  Acesso, rectificação, apagamento, portabilidade, limitação, oposição.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Exercer via:</strong>{' '}
                    <a
                      href={`mailto:${COMPANY_INFO.contact.email}`}
                      className="text-cyan-400 hover:text-white transition-colors"
                    >
                      {COMPANY_INFO.contact.email}
                    </a>
                  </li>
                  <li>
                    <strong>Prazo de resposta:</strong> 30 dias úteis.
                  </li>
                  <li>Direito de reclamação junto da entidade reguladora competente.</li>
                </ul>
              </section>
            </AnimateIn>

            <AnimateIn delay={0}>
              <section>
                <h2 className="font-mono text-cyan-400 uppercase tracking-widest text-sm mb-4 font-bold">
                  8. COOKIES
                </h2>
                <p>
                  Apenas cookies técnicos de sessão (necessários para funcionamento).
                  <br />
                  Sem cookies de rastreio, publicidade ou análise de terceiros.
                </p>
              </section>
            </AnimateIn>

            <AnimateIn delay={0}>
              <section>
                <h2 className="font-mono text-cyan-400 uppercase tracking-widest text-sm mb-4 font-bold">
                  9. SEGURANÇA
                </h2>
                <p>
                  Dados transmitidos via HTTPS (TLS 1.3). Acesso restrito a pessoal autorizado.
                  <br />
                  Base de dados protegida por Row-Level Security (RLS) e autenticação multi-factor.
                </p>
              </section>
            </AnimateIn>

            <AnimateIn delay={0}>
              <section>
                <h2 className="font-mono text-cyan-400 uppercase tracking-widest text-sm mb-4 font-bold">
                  10. ACTUALIZAÇÕES
                </h2>
                <p>
                  Alterações materiais notificadas com 30 dias de antecedência via email (se
                  subscritor).
                  <br />
                  Data desta versão: 28 de Maio de 2026.
                </p>
              </section>
            </AnimateIn>
          </div>
        </div>
      </div>
    </>
  );
};

export default Privacy;
