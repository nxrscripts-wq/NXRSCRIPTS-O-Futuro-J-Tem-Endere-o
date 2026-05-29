import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Globe, ArrowRight, Activity, Server, Code2, Database, CheckCircle, FileText, Quote } from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import { SEOHead } from '../components/SEOHead';
import { SEO_PAGES } from '../lib/seo';
import { organizationSchema, localBusinessSchema, webSiteSchema } from '../lib/jsonld';
import { AnimateIn } from '../components/AnimateIn';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-nxr-dark">
      {/* Abstract Background Grid */}
      <div className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}>
      </div>

      {/* Radiant Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-nxr-primary/10 rounded-full blur-[120px] z-0 pointer-events-none"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-32 md:py-0 text-center">
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-nxr-primary/30 bg-nxr-primary/5 backdrop-blur-sm mt-4 md:mt-0">
          <span className="text-nxr-primary font-mono text-[10px] md:text-xs uppercase tracking-wider">Estado do Sistema: Seguro</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
          Proteja o Futuro. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-nxr-primary to-cyan-100 neon-text">
            Defenda o Presente.
          </span>
        </h1>

        <p className="text-base md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          A NXRSCRIPTS entrega soluções de cibersegurança de nível empresarial, desenhadas para proteger infraestruturas globais contra ameaças digitais em evolução.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            to="/contact"
            className="w-full sm:w-auto px-8 py-4 bg-nxr-primary text-nxr-dark font-bold rounded-sm hover:bg-white hover:scale-105 transition-all duration-300 flex items-center justify-center group text-sm md:text-base"
          >
            Solicitar Consultoria
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/quote"
            className="w-full sm:w-auto px-8 py-4 bg-slate-800/80 text-white font-bold rounded-sm border border-slate-700 hover:border-nxr-primary hover:text-nxr-primary transition-all duration-300 flex items-center justify-center text-sm md:text-base"
          >
            Pedir Orçamento
          </Link>
          <Link
            to="/services"
            className="w-full sm:w-auto px-8 py-4 border border-slate-700 text-white rounded-sm hover:border-nxr-primary hover:text-nxr-primary transition-all duration-300 text-sm md:text-base"
          >
            Explorar Serviços
          </Link>
        </div>
      </div>

      {/* Active Cyber Scan Line - Subtle Animation */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-slate-800/50 overflow-hidden">
        {/* The blurry glow beam */}
        <div className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-transparent via-nxr-primary/30 to-transparent animate-scan-beam blur-[4px]"></div>
        {/* The sharp light beam */}
        <div className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-scan-beam"></div>
      </div>
    </section>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="p-8 bg-nxr-panel border border-nxr-border hover:border-nxr-primary/50 transition-all duration-300 group">
    <div className="mb-6 p-4 bg-nxr-dark inline-block rounded-sm group-hover:text-nxr-primary transition-colors text-white">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-slate-400 leading-relaxed text-sm">{desc}</p>
  </div>
);

const Highlights: React.FC = () => {
  return (
    <section className="py-24 bg-nxr-dark relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title="Especialização" subtitle="Estratégias de Defesa Abrangentes" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnimateIn delay={0}>
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="Proteção Avançada"
              desc="Caça proativa de ameaças e mecanismos de defesa em tempo real que antecipam ataques antes que aconteçam."
            />
          </AnimateIn>
          <AnimateIn delay={80}>
            <FeatureCard
              icon={<Activity className="w-8 h-8" />}
              title="Monitorização Contínua"
              desc="Vigilância 24/7 da sua infraestrutura crítica com protocolos automatizados de resposta a incidentes."
            />
          </AnimateIn>
          <AnimateIn delay={160}>
            <FeatureCard
              icon={<Code2 className="w-8 h-8" />}
              title="Desenvolvimento Seguro"
              desc="Integração de segurança em todas as fases do ciclo de vida de desenvolvimento de software (SDLC)."
            />
          </AnimateIn>
        </div>
      </div>
    </section>
  );
};

const CaseStudyCard: React.FC<{
  title: string;
  sector: string;
  problem: string;
  solution: string;
  result: string;
}> = ({ title, sector, problem, solution, result }) => (
  <div className="bg-nxr-panel border border-nxr-border p-8 relative overflow-hidden group hover:border-nxr-primary transition-colors duration-500">
    <div className="absolute top-0 right-0 p-4">
      <FileText className="w-6 h-6 text-slate-700 group-hover:text-nxr-primary transition-colors" />
    </div>

    <div className="mb-4">
      <span className="text-xs font-mono text-nxr-primary uppercase tracking-widest">{sector}</span>
      <h3 className="text-xl font-bold text-white mt-1">{title}</h3>
    </div>

    <div className="space-y-6 mt-8">
      <div>
        <div className="flex items-center text-red-400 mb-2">
          <Activity className="w-4 h-4 mr-2" />
          <span className="text-sm font-semibold uppercase">Desafio</span>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed">{problem}</p>
      </div>

      <div>
        <div className="flex items-center text-nxr-primary mb-2">
          <Shield className="w-4 h-4 mr-2" />
          <span className="text-sm font-semibold uppercase">Solução NXR</span>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed">{solution}</p>
      </div>

      <div className="pt-6 border-t border-slate-800">
        <div className="flex items-center text-green-400 mb-2">
          <CheckCircle className="w-4 h-4 mr-2" />
          <span className="text-sm font-semibold uppercase">Resultado</span>
        </div>
        <p className="text-white font-medium text-sm">{result}</p>
      </div>
    </div>

    {/* Decorative corner */}
    <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-nxr-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
  </div>
);

const CaseStudies: React.FC = () => {
  return (
    <section className="py-24 bg-nxr-dark relative border-t border-nxr-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title="Casos de Sucesso" subtitle="Resultados Comprovados em Ambientes Críticos" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimateIn delay={0}>
            <CaseStudyCard
              sector="Fintech"
              title="Fortaleza Bancária Global"
              problem="Um banco de Nível 1 enfrentou ataques DDoS coordenados e tentativas de credential stuffing ameaçando 5M+ contas."
              solution="Implementação da análise de tráfego baseada em IA da NXR e framework de identidade Zero Trust em todos os endpoints."
              result="100% de Mitigação de Ataques com zero tempo de inatividade durante o pico de transações."
            />
          </AnimateIn>
          <AnimateIn delay={80}>
            <CaseStudyCard
              sector="Saúde"
              title="Segurança de Dados de Pacientes"
              problem="Rede hospitalar regional exigiu remediação urgente após detetar movimento lateral na sua rede interna legada."
              solution="Equipa de resposta rápida a incidentes (IR) isolou nós comprometidos e reestruturou políticas de segmentação de rede."
              result="Prevenção de deployment de ransomware; economia estimada de $50M em danos potenciais."
            />
          </AnimateIn>
          <AnimateIn delay={160}>
            <CaseStudyCard
              sector="Governo"
              title="Escudo de Infraestrutura Crítica"
              problem="Fornecedor nacional de serviços públicos precisava proteger sistemas SCADA contra ameaças persistentes avançadas (APTs)."
              solution="Implementação de backups air-gapped e sistemas de deteção de intrusão personalizados para protocolos industriais."
              result="Bloqueio bem-sucedido de 3 grandes tentativas de intrusão num período de 12 meses."
            />
          </AnimateIn>
        </div>
      </div>
    </section>
  );
};

const TrustSection: React.FC = () => {
  return (
    <section className="py-20 border-y border-nxr-border bg-nxr-panel/30">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm font-mono text-nxr-primary mb-8 uppercase tracking-widest">A Confiança de Empresas Globais</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          {/* Placeholder Logos */}
          <AnimateIn delay={0}><div className="flex items-center justify-center h-12 text-2xl font-bold font-mono">CORP_ONE</div></AnimateIn>
          <AnimateIn delay={80}><div className="flex items-center justify-center h-12 text-2xl font-bold font-mono">NET_SYS</div></AnimateIn>
          <AnimateIn delay={160}><div className="flex items-center justify-center h-12 text-2xl font-bold font-mono">DATA_GRD</div></AnimateIn>
          <AnimateIn delay={240}><div className="flex items-center justify-center h-12 text-2xl font-bold font-mono">SEC_OPS</div></AnimateIn>
        </div>
      </div>
    </section>
  );
}

const TestimonialCard: React.FC<{ quote: string; author: string; role: string; company: string; image?: string }> = ({ quote, author, role, company, image }) => (
  <div className="bg-nxr-panel border border-nxr-border p-8 rounded-sm relative hover:border-nxr-primary/30 transition-colors duration-300">
    <div className="absolute top-6 right-8 text-nxr-primary/10">
      <Quote className="w-12 h-12" />
    </div>
    <div className="relative z-10">
      <p className="text-slate-300 italic mb-6 leading-relaxed text-sm">"{quote}"</p>
      <div className="flex items-center">
        {image ? (
          <picture>
            <source srcSet={image.replace('.png', '.webp')} type="image/webp" />
            <img
              src={image}
              alt={author}
              width="48"
              height="48"
              loading="lazy"
              decoding="async"
              className="w-12 h-12 rounded-full object-cover mr-3 border-2 border-nxr-primary/30"
            />
          </picture>
        ) : (
          <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-slate-500 font-bold text-xs mr-3 border border-nxr-border">
            {author.charAt(0)}{author.split(' ')[1]?.charAt(0)}
          </div>
        )}
        <div>
          <h4 className="text-white font-bold text-sm">{author}</h4>
          <div className="text-xs text-nxr-primary uppercase tracking-wide mt-0.5">{role}</div>
          <div className="text-xs text-slate-500 font-mono">{company}</div>
        </div>
      </div>
    </div>
  </div>
);

const Testimonials: React.FC = () => {
  return (
    <section className="py-24 bg-nxr-dark border-t border-nxr-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title="Testemunhos" subtitle="O Que Dizem os Nossos Parceiros" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <AnimateIn delay={0}>
            <TestimonialCard
              quote="A NXRSCRIPTS elevou a nossa segurança a um novo patamar. A auditoria detalhada e a implementação de defesas proativas blindaram a nossa infraestrutura contra ataques complexos."
              author="Carlos Silva"
              role="CTO"
              company="TechSolutions Angola"
              image="/testimonial_carlos.png"
            />
          </AnimateIn>
          <AnimateIn delay={80}>
            <TestimonialCard
              quote="Profissionalismo excecional. A equipa identificou vulnerabilidades críticas que outros ignoraram. A resposta a incidentes é rápida e eficaz, garantindo a continuidade do nosso negócio."
              author="Ana Costa"
              role="Diretora de TI"
              company="Banco Atlântico Sul"
              image="/testimonial_ana.png"
            />
          </AnimateIn>
          <AnimateIn delay={160}>
            <TestimonialCard
              quote="Parceiros indispensáveis para a nossa operação. A implementação de arquitetura Zero Trust foi conduzida com maestria técnica e zero impacto na produtividade."
              author="Miguel Santos"
              role="CEO"
              company="InfraRede Global"
              image="/testimonial_miguel.png"
            />
          </AnimateIn>
        </div>
      </div>
    </section>
  );
};

const Home: React.FC = () => {
  return (
    <>
      <SEOHead page={SEO_PAGES.home} jsonLd={[organizationSchema(), localBusinessSchema(), webSiteSchema()]} />
      <Hero />
      <TrustSection />
      <Highlights />
      <CaseStudies />
      <Testimonials />
    </>
  );
};

export default Home;