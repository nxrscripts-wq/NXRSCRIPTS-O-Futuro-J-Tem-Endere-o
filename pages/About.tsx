import React from 'react';
import { SectionHeader } from '../components/SectionHeader';
import {
  Target,
  Telescope,
  CheckCircle,
  Monitor,
  Code2,
  Network,
  Radio,
  ShieldCheck,
  Lightbulb,
  UserPlus,
  Linkedin,
  Facebook,
} from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { SEO_PAGES } from '../lib/seo';
import { organizationSchema } from '../lib/jsonld';
import { AnimateIn } from '../components/AnimateIn';
import { Link } from 'react-router-dom';

const TeamMember: React.FC<{
  name: string;
  role: string;
  bio: string;
  image: string;
  badges?: string[];
}> = ({ name, role, bio, image, badges }) => (
  <div className="group relative">
    <div className="relative h-[400px] w-full overflow-hidden rounded-sm bg-slate-800 border border-nxr-border group-hover:border-nxr-primary transition-colors duration-300">
      <img
        src={image}
        alt={name}
        className="h-full w-full object-cover opacity-80 group-hover:scale-105 transition-all duration-500"
        loading="lazy"
        decoding="async"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-nxr-dark via-nxr-dark/60 to-transparent opacity-90" />

      <div className="absolute bottom-0 left-0 p-6 w-full">
        {badges && (
          <div className="flex flex-wrap gap-2 mb-3">
            {badges.map((badge, idx) => (
              <span
                key={idx}
                className="text-[10px] font-mono bg-nxr-primary/20 text-nxr-primary px-2 py-0.5 rounded-sm border border-nxr-primary/30 uppercase"
              >
                {badge}
              </span>
            ))}
          </div>
        )}
        <h4 className="text-2xl font-bold text-white mb-1">{name}</h4>
        <p className="text-nxr-primary text-xs font-mono uppercase tracking-widest mb-3">{role}</p>
        <p className="text-slate-300 text-sm line-clamp-3 mb-4">{bio}</p>
        <div className="flex space-x-3">
          <a
            href="https://www.linkedin.com/in/elviino-francisco-7b61393a7/"
            className="text-slate-400 hover:text-white transition-colors bg-slate-800/50 p-2 rounded-full border border-slate-700 hover:border-nxr-primary"
          >
            <Linkedin size={16} />
          </a>
          <a
            href="https://web.facebook.com/elviinojf/"
            className="text-slate-400 hover:text-white transition-colors bg-slate-800/50 p-2 rounded-full border border-slate-700 hover:border-nxr-primary"
          >
            <Facebook size={16} />
          </a>
        </div>
      </div>
    </div>
  </div>
);

const OpenPositionCard: React.FC = () => (
  <div className="h-[400px] w-full rounded-sm bg-slate-900 border border-dashed border-slate-700 hover:border-nxr-primary/50 transition-colors duration-300 flex flex-col items-center justify-center p-6 text-center group">
    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
      <UserPlus className="w-8 h-8 text-slate-500 group-hover:text-nxr-primary transition-colors" />
    </div>
    <h4 className="text-lg font-bold text-slate-300 mb-2">Posição em Aberto</h4>
    <p className="text-sm text-slate-500 mb-6">Integra a equipa NXRSCRIPTS</p>
    <Link
      to="/contact"
      className="text-xs font-mono text-nxr-primary border border-nxr-primary/30 px-4 py-2 hover:bg-nxr-primary hover:text-nxr-dark transition-colors uppercase tracking-widest"
    >
      Candidatar-se
    </Link>
  </div>
);

const AreaCard: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({
  icon,
  title,
  desc,
}) => (
  <div className="bg-nxr-panel border border-nxr-border p-8 hover:border-nxr-primary/50 transition-all duration-300 group">
    <div className="w-12 h-12 bg-slate-800 rounded-sm flex items-center justify-center text-nxr-primary mb-6 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
  </div>
);

const About: React.FC = () => {
  return (
    <>
      <SEOHead page={SEO_PAGES.about} jsonLd={organizationSchema()} />
      <div className="pt-24 sm:pt-32 pb-0">
        {/* Hero-like intro */}
        <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-nxr-primary/30 bg-nxr-primary/5 backdrop-blur-sm mt-4 md:mt-0">
                <span className="text-nxr-primary font-mono text-[10px] md:text-xs uppercase tracking-wider">
                  TECNOLOGIA · INOVAÇÃO · TRANSFORMAÇÃO DIGITAL
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-8">
                Quem Somos
              </h1>
              <div className="space-y-6">
                <p className="text-lg text-slate-400 leading-relaxed">
                  A NXRSCRIPTS é uma empresa angolana especializada em Tecnologias de Informação
                  (TI), focada no fornecimento de soluções tecnológicas para empresas, instituições
                  públicas, privadas e empreendedores.
                </p>
                <p className="text-lg text-slate-400 leading-relaxed">
                  Atuamos nas áreas de desenvolvimento tecnológico, infraestruturas de TI, redes,
                  telecomunicações, segurança digital e transformação digital, oferecendo soluções
                  modernas e adaptadas às necessidades do mercado.
                </p>
                <p className="text-lg text-slate-400 leading-relaxed">
                  O nosso objetivo é apoiar organizações através da tecnologia, inovação e melhoria
                  contínua dos processos.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 mt-10">
                <span className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-sm text-xs font-mono text-white tracking-widest">
                  FOCO NO CLIENTE
                </span>
                <span className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-sm text-xs font-mono text-white tracking-widest">
                  TECNOLOGIA
                </span>
                <span className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-sm text-xs font-mono text-white tracking-widest">
                  RESULTADOS
                </span>
              </div>
            </div>
            <div className="relative h-96 w-full bg-slate-900 rounded-lg overflow-hidden border border-nxr-border group flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-nxr-primary/10 to-transparent z-10" />
              {/* Abstract Dark Placeholder */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, #334155 1px, transparent 0)',
                  backgroundSize: '24px 24px',
                }}
              />
              <div className="z-20 text-center px-6">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-600 tracking-tight">
                  NXRSCRIPTS
                </h2>
                <p className="text-nxr-primary font-mono mt-2 tracking-widest text-sm">
                  SOLUÇÕES DIGITAIS
                </p>
              </div>
              <div className="absolute bottom-4 left-4 z-20">
                <div className="text-xs font-mono text-slate-500 bg-black/80 px-2 py-1">
                  EST. 2026
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Visão e Compromisso */}
        <section className="bg-nxr-panel py-20 border-y border-nxr-border mb-20">
          <div className="max-w-7xl mx-auto px-4">
            <SectionHeader title="Visão e Compromisso" subtitle="Os Princípios que Nos Guiam" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mt-12">
              <AnimateIn delay={0}>
                <div className="text-center p-6">
                  <div className="w-16 h-16 mx-auto bg-slate-800 rounded-full flex items-center justify-center text-nxr-primary mb-6">
                    <Target className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Missão</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Fornecer soluções tecnológicas inovadoras que contribuam para o crescimento,
                    modernização e transformação digital das organizações.
                  </p>
                </div>
              </AnimateIn>
              <AnimateIn delay={80}>
                <div className="text-center p-6">
                  <div className="w-16 h-16 mx-auto bg-slate-800 rounded-full flex items-center justify-center text-nxr-primary mb-6">
                    <Telescope className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Visão</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Ser uma referência nacional no sector tecnológico, reconhecida pela qualidade,
                    inovação e excelência.
                  </p>
                </div>
              </AnimateIn>
              <AnimateIn delay={160}>
                <div className="text-center p-6">
                  <div className="w-16 h-16 mx-auto bg-slate-800 rounded-full flex items-center justify-center text-nxr-primary mb-6">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Compromisso</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Desenvolver tecnologia com foco em eficiência, inovação e impacto.
                  </p>
                </div>
              </AnimateIn>
            </div>
          </div>
        </section>

        {/* Áreas de Atuação */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <SectionHeader
            title="Áreas de Atuação"
            subtitle="Soluções tecnológicas end-to-end para o mercado angolano"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <AnimateIn delay={0}>
              <AreaCard
                icon={<Monitor className="w-6 h-6" />}
                title="Tecnologias de Informação (TI)"
                desc="Soluções tecnológicas, suporte e transformação digital para organizações de qualquer dimensão."
              />
            </AnimateIn>
            <AnimateIn delay={80}>
              <AreaCard
                icon={<Code2 className="w-6 h-6" />}
                title="Desenvolvimento de Software"
                desc="Aplicações web, sistemas empresariais, plataformas digitais e soluções SaaS à medida."
              />
            </AnimateIn>
            <AnimateIn delay={160}>
              <AreaCard
                icon={<Network className="w-6 h-6" />}
                title="Redes e Infraestruturas"
                desc="Implementação, configuração e gestão de redes de computadores corporativas."
              />
            </AnimateIn>
            <AnimateIn delay={240}>
              <AreaCard
                icon={<Radio className="w-6 h-6" />}
                title="Telecomunicações"
                desc="Soluções de conectividade e comunicação corporativa, VoIP e interligação de filiais."
              />
            </AnimateIn>
            <AnimateIn delay={320}>
              <AreaCard
                icon={<ShieldCheck className="w-6 h-6" />}
                title="Cybersecurity"
                desc="Proteção de sistemas, dados e infraestruturas digitais contra ameaças internas e externas."
              />
            </AnimateIn>
            <AnimateIn delay={400}>
              <AreaCard
                icon={<Lightbulb className="w-6 h-6" />}
                title="Consultoria Tecnológica"
                desc="Planeamento, implementação e otimização de soluções tecnológicas para crescimento organizacional."
              />
            </AnimateIn>
          </div>
        </section>

        {/* Leadership Team */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <SectionHeader title="Liderança" subtitle="Fundador e Diretor Geral" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-12">
            <div className="md:col-start-1">
              <AnimateIn delay={0}>
                <TeamMember
                  name="ELVINO JACINTO FRANCISCO"
                  role="Fundador & CEO — Diretor Geral"
                  bio="Fundador da NXRSCRIPTS, com foco no desenvolvimento de soluções tecnológicas inovadoras para o mercado angolano. Lidera a estratégia, operações e visão técnica da empresa."
                  image="/team/ceo-elvino.jpg"
                  badges={['Sócio Único', 'Diretor Geral', 'NXRSCRIPTS']}
                />
              </AnimateIn>
            </div>
            <div className="md:col-start-2">
              <AnimateIn delay={80}>
                <OpenPositionCard />
              </AnimateIn>
            </div>
            <div className="md:col-start-3">
              <AnimateIn delay={160}>
                <OpenPositionCard />
              </AnimateIn>
            </div>
          </div>
        </section>

        {/* Legal Info */}
        <section className="bg-nxr-panel py-6 border-t border-nxr-border">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-xs text-slate-500 font-mono tracking-wide">
              NXRS DIGITAL - PRESTAÇÃO DE SERVIÇOS (SU), LDA &middot; NIF: 5002960974 &middot;
              Matrícula: 13693-26/260319 &middot; Viana, Luanda – Angola
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;
