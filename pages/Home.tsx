import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Quote,
  Users,
  Settings,
  Layers,
  Heart,
  Megaphone,
  CreditCard,
  Phone,
  Mail,
} from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import { SEOHead } from '../components/SEOHead';
import { SEO_PAGES } from '../lib/seo';
import { organizationSchema, localBusinessSchema, webSiteSchema } from '../lib/jsonld';
import { AnimateIn } from '../components/AnimateIn';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-nxr-dark">
      {/* Abstract Background Grid */}
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Radiant Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-nxr-primary/10 rounded-full blur-[120px] z-0 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-24 pb-20 sm:pt-32 sm:pb-32 text-center">
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-nxr-primary/30 bg-nxr-primary/5 backdrop-blur-sm mt-4 md:mt-0">
          <span className="text-nxr-primary font-mono text-[10px] md:text-xs uppercase tracking-wider">
            TECNOLOGIA • INOVAÇÃO • TRANSFORMAÇÃO DIGITAL
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
          Soluções Tecnológicas <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-nxr-primary to-cyan-100 neon-text">
            Para o Futuro Digital.
          </span>
        </h1>

        <p className="text-base md:text-xl text-slate-400 mb-8 max-w-3xl mx-auto leading-relaxed">
          A NXRSCRIPTS é uma empresa angolana especializada em Tecnologias de Informação, focada no
          fornecimento de soluções modernas para empresas, instituições públicas, privadas e
          empreendedores.
        </p>

        <div className="inline-block mb-10">
          <p className="text-2xl md:text-3xl font-bold text-white mb-2">
            O futuro já tem endereço.
          </p>
          <p className="text-nxr-primary italic text-sm md:text-base">The future has an address.</p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            to="/contact"
            className="w-full sm:w-auto px-8 py-4 bg-nxr-primary text-nxr-dark font-bold rounded-sm hover:bg-white hover:scale-105 transition-all duration-300 flex items-center justify-center group text-sm md:text-base"
          >
            Solicitar Proposta
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
        <div className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-transparent via-nxr-primary/30 to-transparent animate-scan-beam blur-[4px]" />
        <div className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-scan-beam" />
      </div>
    </section>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({
  icon,
  title,
  desc,
}) => (
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
        <SectionHeader title="Pilares da Marca" subtitle="O Que Nos Move" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <AnimateIn delay={0}>
            <FeatureCard
              icon={<Users className="w-8 h-8" />}
              title="Equipa Especializada"
              desc="Equipa orientada para tecnologia e inovação, com capacidade de resposta rápida e foco total nos resultados do cliente."
            />
          </AnimateIn>
          <AnimateIn delay={80}>
            <FeatureCard
              icon={<Settings className="w-8 h-8" />}
              title="Soluções Adaptadas"
              desc="Soluções tecnológicas adaptadas às necessidades específicas de cada organização, desde startups a grandes empresas."
            />
          </AnimateIn>
          <AnimateIn delay={160}>
            <FeatureCard
              icon={<Layers className="w-8 h-8" />}
              title="Serviços Integrados"
              desc="Serviços integrados de TI end-to-end: desenvolvimento, infraestrutura, segurança e consultoria numa só parceria."
            />
          </AnimateIn>
        </div>
      </div>
    </section>
  );
};

const TrustSection: React.FC = () => {
  return (
    <section className="py-24 border-y border-nxr-border bg-nxr-panel/30">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <SectionHeader
          title="Parceiros e Colaborações"
          subtitle="Construindo o futuro em conjunto"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-12">
          <AnimateIn delay={0}>
            <div className="border border-nxr-border bg-nxr-panel p-8 hover:border-nxr-primary transition-all duration-300 flex flex-col h-full">
              <img
                src="/partners/vectron-logo.png"
                alt="Vectron"
                className="h-20 object-contain mx-auto mb-6"
              />
              <h4 className="text-xl font-bold text-white mb-2">VECTRON ENGENHARIA INTEGRADA</h4>
              <p className="text-nxr-primary font-mono text-xs uppercase mb-4">
                Engenharia que move o futuro.
              </p>
              <p className="text-slate-400 text-sm leading-relaxed mt-auto">
                Parceiro estratégico nas áreas de engenharia e soluções integradas, contribuindo
                para o desenvolvimento de projectos e inovação.
              </p>
            </div>
          </AnimateIn>
          <AnimateIn delay={80}>
            <div className="border border-nxr-border bg-nxr-panel p-8 hover:border-nxr-primary transition-all duration-300 flex flex-col h-full">
              <img
                src="/partners/arnezes-logo.png"
                alt="Arnezes"
                className="h-16 object-contain mx-auto mb-6"
              />
              <h4 className="text-xl font-bold text-white mb-2">ARNEZES, LDA</h4>
              <p className="text-nxr-primary font-mono text-xs uppercase mb-4">
                Visão real dos seus sonhos!
              </p>
              <p className="text-slate-400 text-sm leading-relaxed mt-auto">
                Actuação voltada para soluções e serviços empresariais, contribuindo para o
                fortalecimento de iniciativas e projectos conjuntos.
              </p>
            </div>
          </AnimateIn>
          <AnimateIn delay={160}>
            <div className="border border-nxr-border bg-nxr-panel p-8 hover:border-nxr-primary transition-all duration-300 flex flex-col h-full">
              <img
                src="/partners/fa-energy-logo.png"
                alt="FA Energy"
                className="h-16 object-contain mx-auto mb-6"
              />
              <h4 className="text-xl font-bold text-white mb-2">FA ENERGY & AUTOMATION</h4>
              <p className="text-nxr-primary font-mono text-xs uppercase mb-4">
                Fazer a diferença na vida das pessoas.
              </p>
              <p className="text-slate-400 text-sm leading-relaxed mt-auto">
                Parceiro estratégico nas áreas de energia, automação industrial e soluções
                tecnológicas, orientado para inovação e modernização.
              </p>
            </div>
          </AnimateIn>
        </div>
      </div>
    </section>
  );
};

const ExpansionSection: React.FC = () => {
  return (
    <section className="py-16 bg-nxr-dark border-t border-nxr-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-slate-900 border border-slate-800 rounded-2xl p-8 lg:p-12">
          <div className="md:w-1/2 flex justify-center">
            {/* Mini simplified map representation */}
            <div className="relative w-48 h-48 opacity-80">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full text-nxr-primary"
                fill="currentColor"
              >
                <path
                  d="M45,20 C50,15 60,18 65,25 C70,30 80,35 85,45 C90,55 85,65 75,70 C65,75 55,85 45,85 C35,85 25,75 20,65 C15,55 10,45 15,35 C20,25 35,25 45,20 Z"
                  opacity="0.1"
                />
                <circle cx="35" cy="45" r="4" className="animate-pulse" />
                <circle cx="55" cy="35" r="2" opacity="0.5" />
                <circle cx="65" cy="60" r="2" opacity="0.5" />
                <circle cx="45" cy="70" r="2" opacity="0.5" />
                <path
                  d="M35,45 L55,35 M35,45 L65,60 M35,45 L45,70"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  strokeDasharray="1 2"
                  opacity="0.3"
                />
              </svg>
            </div>
          </div>
          <div className="md:w-1/2 text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Onde Estamos</h3>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Baseados em Luanda · Servindo Angola · Expandindo para a região da SADC. A nossa
              infraestrutura cresce para garantir suporte de proximidade.
            </p>
            <Link
              to="/coverage"
              className="inline-flex items-center text-nxr-primary font-bold hover:text-white transition-colors"
            >
              Ver mapa de cobertura <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

const CaseStudyCard: React.FC<{
  title: string;
  sector: string;
  desc: string;
  icon: React.ReactNode;
  badge: string;
}> = ({ title, sector, desc, icon, badge }) => (
  <div className="bg-nxr-panel border border-nxr-border p-8 relative overflow-hidden group hover:border-nxr-primary transition-colors duration-500 flex flex-col h-full">
    <div className="absolute top-0 right-0 p-4">{icon}</div>

    <div className="mb-4">
      <div className="inline-block px-2 py-1 bg-nxr-dark border border-nxr-border text-xs font-mono text-nxr-primary rounded-sm mb-4">
        {badge}
      </div>
      <br />
      <span className="text-xs font-mono text-nxr-primary uppercase tracking-widest">{sector}</span>
      <h3 className="text-2xl font-bold text-white mt-1">{title}</h3>
    </div>

    <div className="flex-grow mt-4">
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>

    <div className="pt-6 mt-6 border-t border-slate-800">
      <p className="text-xs text-slate-500 font-mono leading-relaxed">
        Visão de Inovação: Transformação Digital · Escalabilidade · Desenvolvimento Nacional
      </p>
    </div>

    <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-nxr-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
  </div>
);

const CaseStudies: React.FC = () => {
  return (
    <section className="py-24 bg-nxr-dark relative border-t border-nxr-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Projectos Desenvolvidos e em Andamento"
          subtitle="Soluções tecnológicas voltadas para diferentes sectores"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimateIn delay={0}>
            <CaseStudyCard
              sector="HealthTech / Tecnologia em Saúde"
              title="MediConnect"
              desc="Plataforma digital voltada para o sector da saúde, criada para conectar pacientes, clínicas e serviços médicos através da tecnologia."
              badge="EM DESENVOLVIMENTO"
              icon={
                <Heart className="w-6 h-6 text-green-600 group-hover:text-green-500 transition-colors" />
              }
            />
          </AnimateIn>
          <AnimateIn delay={80}>
            <CaseStudyCard
              sector="Marketing Digital / Business Platform"
              title="AngoPlaceMarketing"
              desc="Plataforma orientada para marketing, divulgação e posicionamento digital de empresas, marcas e empreendedores angolanos."
              badge="EM DESENVOLVIMENTO"
              icon={
                <Megaphone className="w-6 h-6 text-cyan-500 group-hover:text-cyan-400 transition-colors" />
              }
            />
          </AnimateIn>
          <AnimateIn delay={160}>
            <CaseStudyCard
              sector="Fintech / Soluções Financeiras"
              title="AngoPay360"
              desc="Projecto Fintech focado em soluções financeiras digitais, pagamentos e ecossistemas tecnológicos modernos para o mercado angolano."
              badge="EM BREVE"
              icon={
                <CreditCard className="w-6 h-6 text-blue-500 group-hover:text-blue-400 transition-colors" />
              }
            />
          </AnimateIn>
        </div>
      </div>
    </section>
  );
};

const TestimonialCard: React.FC<{
  quote: string;
  author: string;
  role: string;
  company: string;
  image?: string;
}> = ({ quote, author, role, company, image }) => (
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
            {author.charAt(0)}
            {author.split(' ')[1]?.charAt(0)}
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
        <SectionHeader
          title="O Que Dizem Sobre Nós"
          subtitle="Parceiros e clientes que confiam na NXRSCRIPTS"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
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

const FinalCTA: React.FC = () => {
  return (
    <section className="py-20 bg-nxr-panel border-t border-nxr-border relative">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          Prontos para apoiar a sua organização
        </h2>
        <p className="text-lg text-slate-400 mb-10">
          Criamos soluções tecnológicas que geram valor e impulsionam negócios.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
          <Link
            to="/contact"
            className="w-full sm:w-auto px-8 py-4 bg-nxr-primary text-nxr-dark font-bold rounded-sm hover:bg-white hover:scale-105 transition-all duration-300 flex items-center justify-center text-sm md:text-base"
          >
            Falar Connosco
          </Link>
          <Link
            to="/services"
            className="w-full sm:w-auto px-8 py-4 border border-slate-700 text-white rounded-sm hover:border-nxr-primary hover:text-nxr-primary transition-all duration-300 text-sm md:text-base"
          >
            Ver Serviços
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-8 text-slate-300">
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-nxr-primary" />
            <span>+244 923 479 049</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-nxr-primary" />
            <span>geral@nxrscripts.co.ao</span>
          </div>
        </div>
      </div>
    </section>
  );
};

const Home: React.FC = () => {
  return (
    <>
      <SEOHead
        page={SEO_PAGES.home}
        jsonLd={[organizationSchema(), localBusinessSchema(), webSiteSchema()]}
      />
      <Hero />
      <Highlights />
      <TrustSection />
      <ExpansionSection />
      <CaseStudies />
      <Testimonials />
      <FinalCTA />
    </>
  );
};

export default Home;
