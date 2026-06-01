import React, { useState } from 'react';
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
  BrainCircuit,
  Radio,
  Lightbulb,
  Headphones,
  Layers,
  ChevronDown,
  ChevronUp,
  Cpu,
  Wifi,
  Zap,
  MessageSquare,
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
  BrainCircuit: <BrainCircuit className="w-10 h-10" />,
  Radio: <Radio className="w-10 h-10" />,
  Lightbulb: <Lightbulb className="w-10 h-10" />,
  Headphones: <Headphones className="w-10 h-10" />,
  Layers: <Layers className="w-10 h-10" />,
  // Fallbacks
  Cpu: <Cpu className="w-10 h-10" />,
  Wifi: <Wifi className="w-10 h-10" />,
  Zap: <Zap className="w-10 h-10" />,
  MessageSquare: <MessageSquare className="w-10 h-10" />,
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
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = [
    'Todos',
    'Desenvolvimento',
    'Infraestrutura',
    'Segurança',
    'Cloud',
    'Consultoria',
    'IA & Automação',
    'Suporte',
  ];

  const filtered =
    activeCategory === 'Todos' ? SERVICES : SERVICES.filter(s => s.category === activeCategory);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <>
      <SEOHead
        page={SEO_PAGES.services}
        jsonLd={[
          organizationSchema(),
          ...SERVICES.map(s => serviceSchema(s.title, s.description, s.title)),
        ]}
      />
      <div className="pt-16 md:pt-28 pb-0 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <SectionHeader
            title="Serviços Prestados"
            subtitle="INFRAESTRUTURAS · TELECOMUNICAÇÕES · CYBERSECURITY · DESENVOLVIMENTO"
          />
          <p className="text-center text-slate-400 max-w-3xl mx-auto mb-16 text-lg">
            Soluções tecnológicas completas para empresas, instituições públicas, privadas e
            empreendedores em Angola.
          </p>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-sm text-sm font-mono tracking-wide border transition-all duration-300 ${
                  activeCategory === cat
                    ? 'border-nxr-primary text-nxr-primary bg-nxr-primary/10'
                    : 'border-nxr-border text-slate-400 hover:border-nxr-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((service, index) => (
              <AnimateIn key={service.id} delay={Math.min(index * 80, 400)}>
                <div className="group relative bg-nxr-panel border border-nxr-border p-8 hover:border-nxr-primary transition-colors duration-300 overflow-hidden flex flex-col h-full">
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="text-nxr-primary w-6 h-6" />
                  </div>

                  <div className="text-nxr-text group-hover:text-nxr-primary transition-colors mb-6">
                    {iconMap[service.icon] || iconMap['Layers']}
                  </div>

                  <span className="text-xs font-mono text-nxr-primary uppercase tracking-widest mb-2 block">
                    {service.category}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-4">{service.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
                    {service.description}
                  </p>

                  {service.subServices && service.subServices.length > 0 && (
                    <div className="mt-auto border-t border-slate-800 pt-4">
                      <button
                        onClick={() => toggleExpand(service.id)}
                        className="text-xs font-mono text-nxr-primary uppercase tracking-widest flex items-center gap-1 hover:text-white transition-colors w-full text-left"
                      >
                        {expandedId === service.id ? 'Ocultar detalhes' : 'Ver detalhes'}
                        {expandedId === service.id ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>

                      {expandedId === service.id && (
                        <ul className="mt-4 space-y-2">
                          {service.subServices.map((sub, i) => (
                            <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                              <span className="text-cyan-500 mt-1">&bull;</span>
                              {sub}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  {/* Hover Glow Effect */}
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-nxr-primary/10 rounded-full blur-2xl group-hover:bg-nxr-primary/20 transition-all duration-500 pointer-events-none" />
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>

        {/* Process Section */}
        <section className="bg-nxr-dark border-t border-nxr-border py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h3 className="text-nxr-primary font-mono text-sm uppercase tracking-widest mb-2">
                  Como Trabalhamos
                </h3>
                <h2 className="text-3xl font-bold text-white mb-6">
                  Processo simples, resultados sólidos
                </h2>
                <p className="text-slate-400 mb-8 leading-relaxed">
                  A nossa metodologia foca-se na transparência, na precisão técnica e no alinhamento
                  contínuo com os objetivos da sua organização.
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center text-white hover:text-nxr-primary font-bold transition-colors"
                >
                  Solicitar Avaliação <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
              <div className="bg-nxr-panel/50 p-8 rounded-sm border border-nxr-border">
                <div className="space-y-2">
                  <AnimateIn delay={0}>
                    <ProcessStep
                      number="01"
                      title="DIAGNÓSTICO"
                      description="Analisamos as necessidades da sua organização e o estado actual da infraestrutura tecnológica."
                    />
                  </AnimateIn>
                  <AnimateIn delay={80}>
                    <ProcessStep
                      number="02"
                      title="PROPOSTA"
                      description="Apresentamos uma solução adaptada, com âmbito, prazo e investimento definidos."
                    />
                  </AnimateIn>
                  <AnimateIn delay={160}>
                    <ProcessStep
                      number="03"
                      title="IMPLEMENTAÇÃO"
                      description="Executamos com rigor técnico, mantendo comunicação contínua com o cliente."
                    />
                  </AnimateIn>
                  <AnimateIn delay={240}>
                    <ProcessStep
                      number="04"
                      title="SUPORTE"
                      description="Garantimos acompanhamento pós-implementação e suporte contínuo."
                    />
                  </AnimateIn>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Store Section */}
        <section className="bg-nxr-panel border-t border-nxr-border py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Também Comercializamos Material Tecnológico
            </h3>
            <p className="text-slate-400 mb-10 max-w-2xl mx-auto">
              Hardware, redes, segurança, telecomunicações, consumíveis e software licenciado.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-10">
              {['Informática', 'Redes', 'Segurança', 'Telecom', 'Consumíveis', 'Software'].map(
                (item, idx) => (
                  <div
                    key={idx}
                    className="bg-nxr-dark border border-nxr-border px-6 py-3 rounded-sm text-slate-300 font-mono text-sm"
                  >
                    {item}
                  </div>
                )
              )}
            </div>

            <Link
              to="/store"
              className="inline-flex items-center px-6 py-3 border border-nxr-primary text-nxr-primary font-bold rounded-sm hover:bg-nxr-primary hover:text-nxr-dark transition-all duration-300"
            >
              Ver Loja <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Future Areas */}
        <section className="bg-nxr-dark py-12 border-t border-nxr-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h4 className="text-sm font-mono text-slate-500 uppercase tracking-widest mb-6">
              Em Desenvolvimento
            </h4>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                'Fintech (AngoPay360)',
                'ERP Próprio',
                'SaaS Próprio',
                'Datacenter',
                'ISP',
                'Cloud NXRS',
                'Academia NXRS',
                'Smart City',
                'IoT',
                'Blockchain',
                'GovTech',
              ].map((area, idx) => (
                <span
                  key={idx}
                  className="bg-slate-900 border border-slate-800 text-slate-500 text-xs px-3 py-1.5 rounded-sm"
                >
                  {area} <span className="opacity-50 ml-1">(Em breve)</span>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-nxr-primary/5 py-16 md:py-24 border-t border-nxr-border text-center">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Precisa de uma solução específica?
            </h2>
            <p className="text-lg text-slate-400 mb-10">
              Criamos soluções tecnológicas que geram valor e impulsionam negócios.
            </p>

            <Link
              to="/contact"
              className="inline-block px-8 py-4 bg-nxr-primary text-nxr-dark font-bold rounded-sm hover:bg-white hover:scale-105 transition-all duration-300 mb-8"
            >
              Solicitar Proposta
            </Link>

            <p className="text-sm text-slate-500 font-mono">
              Resposta em 24-48 horas úteis &middot; +244 923 479 049 &middot;
              geral@nxrscripts.co.ao
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default Services;
