import { COMPANY_INFO } from '../constants';

export interface SEOConfig {
  title: string;
  description: string;
  path: string;
  ogType?: string;
  keywords?: string;
}

const BASE_URL = COMPANY_INFO.domain;
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;

export const SEO_PAGES: Record<string, SEOConfig> = {
  home: {
    title: 'NXRSCRIPTS — Soluções Tecnológicas para Angola',
    description: 'Empresa angolana de tecnologia especializada em cibersegurança, desenvolvimento de software e transformação digital. Baseada em Luanda, Angola.',
    path: '/',
    keywords: 'cibersegurança angola, desenvolvimento software luanda, tecnologia angola, nxrscripts',
  },
  about: {
    title: 'Sobre Nós — NXRSCRIPTS',
    description: 'Conheça a NXRSCRIPTS: equipa, missão e visão de uma empresa tecnológica angolana a construir o futuro digital de Angola.',
    path: '/about',
    keywords: 'sobre nxrscripts, empresa tecnologia angola, equipa desenvolvimento software luanda',
  },
  services: {
    title: 'Serviços — Cibersegurança e Desenvolvimento | NXRSCRIPTS',
    description: 'Cibersegurança, desenvolvimento de software personalizado, consultoria IT e transformação digital para empresas em Angola.',
    path: '/services',
    keywords: 'serviços cibersegurança angola, consultoria IT luanda, desenvolvimento aplicações angola',
  },
  technologies: {
    title: 'Tecnologias — Stack e Ferramentas | NXRSCRIPTS',
    description: 'As tecnologias que usamos: React, TypeScript, Supabase, cloud computing e as mais recentes ferramentas de segurança digital.',
    path: '/technologies',
    keywords: 'tecnologias nxrscripts, react angola, supabase angola, cloud computing angola',
  },
  store: {
    title: 'Loja — Produtos e Soluções Digitais | NXRSCRIPTS',
    description: 'Produtos digitais, licenças de software e soluções tecnológicas prontas para empresas angolanas.',
    path: '/store',
    keywords: 'loja nxrscripts, produtos digitais angola, software empresas angola',
  },
  contact: {
    title: 'Contacto — Fala Connosco | NXRSCRIPTS',
    description: 'Entre em contacto com a NXRSCRIPTS. Estamos em Luanda, Angola, prontos para apoiar as suas necessidades tecnológicas.',
    path: '/contact',
    keywords: 'contacto nxrscripts, contacto empresa tecnologia luanda angola',
  },
  privacy: {
    title: 'Política de Privacidade | NXRSCRIPTS',
    description: 'Conheça a nossa política de privacidade, saiba como protegemos os seus dados e conheça os seus direitos na NXRSCRIPTS.',
    path: '/privacy',
    keywords: 'política de privacidade nxrscripts, proteção de dados, rgpd angola',
  },
  quote: {
    title: 'Pedir Orçamento | NXRSCRIPTS',
    description: 'Configure as necessidades da sua infraestrutura e inicie o seu projeto de cibersegurança ou desenvolvimento connosco.',
    path: '/quote',
  },
  blog: {
    title: 'Blog de Cibersegurança & Tecnologia | NXRSCRIPTS',
    description: 'Insights, tendências e análises profundas sobre cibersegurança, desenvolvimento de software e a evolução tecnológica em Angola.',
    path: '/blog',
    keywords: 'blog cibersegurança, blog tecnologia angola, artigos segurança informática, nxrscripts blog',
  },
};

export function buildSEO(page: SEOConfig) {
  return {
    ...page,
    canonical: `${BASE_URL}${page.path}`,
    ogImage: DEFAULT_OG_IMAGE,
    ogType: page.ogType ?? 'website',
    siteName: COMPANY_INFO.name,
  };
}
