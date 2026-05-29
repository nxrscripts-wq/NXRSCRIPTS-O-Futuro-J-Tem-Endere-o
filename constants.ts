import { Service, TechItem, NavigationItem } from './types';

export const COMPANY_INFO = {
  name: 'NXRSCRIPTS',
  tagline: 'O Futuro Já Tem Endereço',
  founded: 2026,
  domain: 'https://nxrscripts.co.ao',
  address: {
    street: 'Rua 11 de Novembro',
    district: 'Capalanga',
    city: 'Luanda Sul',
    country: 'Angola',
    full: 'Rua 11 de Novembro, Capalanga — Luanda Sul, Angola',
  },
  contact: {
    phone: '+244 923 479 049',
    phoneLink: 'tel:+244923479049',
    whatsapp: '+244 923 479 049',
    whatsappLink: 'https://wa.me/244923479049',
    email: 'geral@nxrscripts.co.ao',
    emailLink: 'mailto:geral@nxrscripts.co.ao',
  },
  social: {
    facebook: 'https://www.facebook.com/share/1EPagNsqv3/',
    instagram: 'https://www.instagram.com/nxrscripts?igsh=eGM3bXJ6MTN1c3l0',
    linkedin: null,
    twitter: null,
  },
  geo: {
    latitude: -8.8147,
    longitude: 13.2302,
  },
} as const;

export const NAV_ITEMS: NavigationItem[] = [
  { label: 'Início', path: '/' },
  { label: 'Sobre', path: '/about' },
  { label: 'Serviços', path: '/services' },
  { label: 'Pedir Orçamento', path: '/quote' },
  { label: 'Loja', path: '/store' },
  { label: 'Tecnologias', path: '/technologies' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contacto', path: '/contact' },
];

export const SERVICES: Service[] = [
  {
    id: 'consulting',
    title: 'Consultoria em Cibersegurança',
    description: 'Orientação estratégica para alinhar a sua postura de segurança com os objetivos de negócio e conformidade regulatória.',
    icon: 'ShieldCheck'
  },
  {
    id: 'vulnerability',
    title: 'Avaliação de Vulnerabilidades',
    description: 'Monitorização contínua e testes de penetração profundos para identificar pontos fracos antes dos atacantes.',
    icon: 'ScanEye'
  },
  {
    id: 'infra',
    title: 'Segurança de Infraestruturas',
    description: 'Fortalecimento de redes, servidores e ambientes cloud contra ameaças persistentes avançadas (APTs).',
    icon: 'Server'
  },
  {
    id: 'cloud',
    title: 'Segurança Cloud & Email',
    description: 'Proteção de nível empresarial para comunicação corporativa e arquiteturas cloud distribuídas.',
    icon: 'Cloud'
  },
  {
    id: 'dev',
    title: 'Desenvolvimento Seguro',
    description: 'Abordagem Security-by-design para desenvolvimento web e sistemas, integrando segurança no pipeline CI/CD.',
    icon: 'Code2'
  },
  {
    id: 'web-dev',
    title: 'Desenvolvimento Web',
    description: 'Criação de sites institucionais, landing pages e plataformas corporativas com arquitetura moderna, escalável e segura.',
    icon: 'Globe'
  },
  {
    id: 'mobile-dev',
    title: 'Desenvolvimento Mobile',
    description: 'Aplicações nativas e híbridas para Android e iOS, desenhadas para performance superior e experiência de utilizador robusta.',
    icon: 'Smartphone'
  },
  {
    id: 'networks',
    title: 'Redes e Infraestruturas',
    description: 'Instalação, configuração e manutenção integral de redes corporativas, garantindo conectividade estável e gestão eficiente.',
    icon: 'Network'
  },
  {
    id: 'support',
    title: 'Manutenção e Suporte',
    description: 'Suporte técnico 24/7 e equipas de resposta a incidentes prontas para mitigar ameaças ativas.',
    icon: 'Activity'
  }
];

export const TECHNOLOGIES: TechItem[] = [
  { name: 'Arquitetura Zero Trust', category: 'Metodologia', description: 'Nunca confiar, verificar sempre. Verificação rigorosa de identidade para cada pessoa e dispositivo.' },
  { name: 'SIEM de Próxima Geração', category: 'Monitorização', description: 'Análise em tempo real de alertas de segurança gerados por aplicações e hardware de rede.' },
  { name: 'Deteção de Ameaças por IA', category: 'Inovação', description: 'Algoritmos de machine learning que preveem e neutralizam vetores de ataque desconhecidos.' },
  { name: 'Criptografia Pós-Quântica', category: 'Criptografia', description: 'Integridade de dados à prova de futuro contra ameaças de computação quântica.' },
];