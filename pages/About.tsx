import React from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { Target, Globe, Users, Linkedin, Twitter } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { SEO_PAGES } from '../lib/seo';
import { organizationSchema } from '../lib/jsonld';
import { AnimateIn } from '../components/AnimateIn';

const TeamMember: React.FC<{ name: string; role: string; bio: string; image: string }> = ({ name, role, bio, image }) => (
  <div className="group relative">
    <div className="relative h-80 w-full overflow-hidden rounded-sm bg-slate-800 border border-nxr-border group-hover:border-nxr-primary transition-colors duration-300">
      <img
        src={image}
        alt={name}
        width="400"
        height="320"
        className="h-full w-full object-cover opacity-70 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
        loading="lazy"
        decoding="async"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-nxr-dark via-transparent to-transparent opacity-90"></div>

      <div className="absolute bottom-0 left-0 p-6 w-full">
        <h4 className="text-xl font-bold text-white">{name}</h4>
        <p className="text-nxr-primary text-xs font-mono uppercase tracking-widest mb-2">{role}</p>
        <p className="text-slate-400 text-sm line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
          {bio}
        </p>
        <div className="flex space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
          <a href="#" className="text-slate-400 hover:text-white transition-colors"><Linkedin size={16} /></a>
          <a href="#" className="text-slate-400 hover:text-white transition-colors"><Twitter size={16} /></a>
        </div>
      </div>
    </div>
  </div>
);

const About: React.FC = () => {
  return (
    <>
    <SEOHead page={SEO_PAGES.about} jsonLd={organizationSchema()} />
    <div className="pt-20 sm:pt-16 pb-24">
      {/* Hero-like intro */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Arquitetos da <span className="text-nxr-primary">Confiança</span> Digital
            </h1>
            <p className="text-lg text-slate-400 mb-6 leading-relaxed">
              Na NXRSCRIPTS, acreditamos que a segurança não é apenas uma funcionalidade — é a base da inovação. Fundada por um coletivo de investigadores de segurança de elite e hackers éticos, crescemos para nos tornar uma autoridade global em infraestrutura de cibersegurança.
            </p>
            <p className="text-lg text-slate-400 leading-relaxed">
              A nossa missão é capacitar as organizações para operarem sem medo num cenário digital cada vez mais hostil. Estabelecemos a ponte entre a segurança técnica complexa e a continuidade do negócio.
            </p>
          </div>
          <div className="relative h-96 w-full bg-slate-900 rounded-lg overflow-hidden border border-nxr-border group">
            {/* Placeholder for futuristic office/team image */}
            <div className="absolute inset-0 bg-gradient-to-tr from-nxr-primary/20 to-purple-500/10 z-10"></div>
            <img
              src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
              alt="NXRSCRIPTS Operations Center"
              width="1600"
              height="900"
              className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
              loading="eager"
              decoding="sync"
              fetchPriority="high"
            />
            <div className="absolute bottom-4 left-4 z-20">
              <div className="text-xs font-mono text-nxr-primary bg-black/80 px-2 py-1">INSTALAÇÃO_SEGURA_V2.0</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-nxr-panel py-20 border-y border-nxr-border mb-20">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader title="O Nosso ADN" subtitle="Princípios Fundamentais" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <AnimateIn delay={0}>
              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto bg-slate-800 rounded-full flex items-center justify-center text-nxr-primary mb-6">
                  <Target className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Precisão</h3>
                <p className="text-slate-400 text-sm">Precisão cirúrgica na identificação e neutralização de ameaças sem interromper as operações comerciais.</p>
              </div>
            </AnimateIn>
            <AnimateIn delay={80}>
              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto bg-slate-800 rounded-full flex items-center justify-center text-nxr-primary mb-6">
                  <Globe className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Visão Global</h3>
                <p className="text-slate-400 text-sm">Proteção de ativos além-fronteiras com inteligência recolhida através de uma rede mundial de sensores.</p>
              </div>
            </AnimateIn>
            <AnimateIn delay={160}>
              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto bg-slate-800 rounded-full flex items-center justify-center text-nxr-primary mb-6">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Parceria</h3>
                <p className="text-slate-400 text-sm">Não apenas resolvemos problemas; construímos estratégias de resiliência a longo prazo juntamente com os nossos clientes.</p>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title="Liderança" subtitle="O Conselho Executivo" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimateIn delay={0}>
            <TeamMember
              name="Alexandre Vaz"
              role="Chief Executive Officer"
              bio="Ex-CISO de Fortune 500 com 20 anos de experiência em defesa cibernética estratégica."
              image="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            />
          </AnimateIn>
          <AnimateIn delay={80}>
            <TeamMember
              name="Sarah Chen"
              role="CTO & Head of Research"
              bio="Pioneira em criptografia quântica e arquiteta dos protocolos proprietários da NXR."
              image="https://images.unsplash.com/photo-1573496359-136d475583dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            />
          </AnimateIn>
          <AnimateIn delay={160}>
            <TeamMember
              name="Marcus Thorne"
              role="Dir. Operações de Segurança"
              bio="Lidera as equipas de Resposta a Incidentes e Red Teaming globais."
              image="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            />
          </AnimateIn>
          <AnimateIn delay={240}>
            <TeamMember
              name="Elena Roussos"
              role="VP de Engenharia"
              bio="Especialista em segurança cloud e orquestração de infraestruturas resilientes."
              image="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            />
          </AnimateIn>
        </div>
      </section>
    </div>
    </>
  );
};

export default About;