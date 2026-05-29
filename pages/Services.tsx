import React from 'react';
import { SERVICES } from '../constants';
import { SectionHeader } from '../components/SectionHeader';
import {
  ArrowUpRight,
  ShieldCheck,
  ScanEye,
  Code2,
  Server,
  Activity,
  Cloud,
  Globe,
  Smartphone,
  Network,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import { SEO_PAGES } from '../lib/seo';
import { organizationSchema, serviceSchema } from '../lib/jsonld';
import { AnimateIn } from '../components/AnimateIn';

const iconMap: Record<string, React.ReactNode> = {
  ShieldCheck: <ShieldCheck className="w-10 h-10" />,
  ScanEye: <ScanEye className="w-10 h-10" />,
  Code2: <Code2 className="w-10 h-10" />,
  Server: <Server className="w-10 h-10" />,
  Activity: <Activity className="w-10 h-10" />,
  Cloud: <Cloud className="w-10 h-10" />,
  Globe: <Globe className="w-10 h-10" />,
  Smartphone: <Smartphone className="w-10 h-10" />,
  Network: <Network className="w-10 h-10" />,
};

const ProcessStep: React.FC<{ number: string; title: string; description: string }> = ({
  number,
  title,
  description,
}) => (
  <div className="relative p-6 border-l-2 border-nxr-border hover:border-nxr-primary transition-colors duration-300">
    <div className="absolute -left-[11px] top-6 w-5 h-5 bg-nxr-dark border-2 border-nxr-primary rounded-full" />
    <span className="text-4xl font-bold text-slate-800 absolute top-4 right-4 select-none">
      {number}
    </span>
    <h4 className="text-xl font-bold text-white mb-2 relative z-10">{title}</h4>
    <p className="text-slate-400 text-sm relative z-10">{description}</p>
  </div>
);

const Services: React.FC = () => {
  return (
    <>
      <SEOHead
        page={SEO_PAGES.services}
        jsonLd={[
          organizationSchema(),
          ...SERVICES.map(s => serviceSchema(s.title, s.description, s.title)),
        ]}
      />
      <div className="pt-20 sm:pt-16 pb-24 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Capacidades" subtitle="Serviços de Defesa Cibernética de Elite" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            {SERVICES.map((service, index) => (
              <AnimateIn key={service.id} delay={Math.min(index * 80, 400)}>
                <div className="group relative bg-nxr-panel border border-nxr-border p-8 hover:border-nxr-primary transition-colors duration-300 overflow-hidden h-full">
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="text-nxr-primary w-6 h-6" />
                  </div>

                  <div className="text-nxr-text group-hover:text-nxr-primary transition-colors mb-6">
                    {iconMap[service.icon]}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-4">{service.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {service.description}
                  </p>

                  <Link
                    to="/contact"
                    className="inline-block text-xs font-mono text-nxr-primary uppercase tracking-widest border-b border-transparent group-hover:border-nxr-primary transition-all"
                  >
                    Saber Mais
                  </Link>

                  {/* Hover Glow Effect */}
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-nxr-primary/10 rounded-full blur-2xl group-hover:bg-nxr-primary/20 transition-all duration-500" />
                </div>
              </AnimateIn>
            ))}
          </div>

          {/* Process Section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <h3 className="text-nxr-primary font-mono text-sm uppercase tracking-widest mb-2">
                Como Trabalhamos
              </h3>
              <h2 className="text-3xl font-bold text-white mb-6">O Protocolo de Segurança NXR</h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Adotamos uma abordagem sistemática e militarizada para proteger os seus ativos.
                Desde a avaliação inicial até à monitorização contínua, o nosso processo garante que
                nenhuma vulnerabilidade passe despercebida.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center text-white hover:text-nxr-primary font-bold transition-colors"
              >
                Iniciar Auditoria Gratuita <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
            <div className="bg-nxr-panel/50 p-8 rounded-sm border border-nxr-border">
              <div className="space-y-2">
                <AnimateIn delay={0}>
                  <ProcessStep
                    number="01"
                    title="Avaliação & Descoberta"
                    description="Mapeamento completo da infraestrutura digital e identificação de vetores de ataque potenciais."
                  />
                </AnimateIn>
                <AnimateIn delay={80}>
                  <ProcessStep
                    number="02"
                    title="Estratégia & Arquitetura"
                    description="Desenho de uma arquitetura de segurança personalizada alinhada com os objetivos de negócio."
                  />
                </AnimateIn>
                <AnimateIn delay={160}>
                  <ProcessStep
                    number="03"
                    title="Implementação & Hardening"
                    description="Execução técnica de protocolos de defesa, encriptação e segregação de redes."
                  />
                </AnimateIn>
                <AnimateIn delay={240}>
                  <ProcessStep
                    number="04"
                    title="Monitorização & Vigilância"
                    description="Operação contínua 24/7 do SOC para deteção e neutralização de ameaças em tempo real."
                  />
                </AnimateIn>
              </div>
            </div>
          </section>

          <div className="p-8 bg-gradient-to-r from-nxr-panel to-slate-900 border border-nxr-border rounded-sm text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Soluções Empresariais Personalizadas
            </h3>
            <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
              Precisa de uma arquitetura de segurança à medida? Os nossos engenheiros desenham
              soluções personalizadas para os setores governamental, financeiro e da saúde.
            </p>
            <Link
              to="/contact"
              className="px-6 py-3 bg-white text-nxr-dark font-bold hover:bg-nxr-primary transition-colors"
            >
              Contactar Engenharia de Vendas
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Services;
