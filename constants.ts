import { Service, TechItem, NavigationItem } from './types';

export const COMPANY_INFO = {
  name: 'NXRSCRIPTS',
  tagline: 'O Futuro Já Tem Endereço',
  founded: 2026,
  domain: 'https://www.nxrscripts.com',
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
    email: 'nxrscripts@gmail.com',
    emailLink: 'mailto:nxrscripts@gmail.com',
  },
  social: {
    facebook: 'https://www.facebook.com/profile.php?id=61577761835754',
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
  { label: 'Cobertura', path: '/coverage' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contacto', path: '/contact' },
];

export const SERVICES: Service[] = [
  {
    id: 'dev-software',
    category: 'Desenvolvimento',
    title: 'Desenvolvimento de Software',
    description:
      'Sistemas empresariais, ERP, CRM, faturação, POS, SaaS, plataformas web, APIs, portais corporativos, dashboards, automação e sistemas financeiros à medida.',
    icon: 'Code2',
    subServices: [
      'Sistemas ERP / CRM',
      'Sistemas de Faturação e POS',
      'Plataformas SaaS',
      'APIs e Integrações',
      'Dashboards Administrativos',
      'Automação Empresarial',
      'Sistemas Financeiros e Fintech',
      'Gestão Escolar / Hospitalar',
      'Gestão de Stock e Documental',
      'Sistemas Governamentais',
    ],
  },
  {
    id: 'dev-web',
    category: 'Desenvolvimento',
    title: 'Desenvolvimento Web',
    description:
      'Websites institucionais, landing pages, e-commerce, portais corporativos, intranets, CMS, SEO técnico, performance e manutenção web.',
    icon: 'Globe',
    subServices: [
      'Websites Institucionais',
      'Landing Pages',
      'E-commerce',
      'Portais Corporativos',
      'Intranets e Extranets',
      'Portais de Clientes',
      'CMS',
      'SEO Técnico e Performance',
      'Hospedagem e Manutenção',
    ],
  },
  {
    id: 'dev-mobile',
    category: 'Desenvolvimento',
    title: 'Desenvolvimento Mobile',
    description:
      'Aplicações Android e iOS nativas e híbridas, PWA, apps empresariais, financeiras, delivery, educação, saúde e logística.',
    icon: 'Smartphone',
    subServices: [
      'Android',
      'iOS',
      'Aplicações Híbridas',
      'PWA',
      'Apps Empresariais',
      'Apps Financeiras',
      'Delivery e Logística',
      'Educação e Saúde',
    ],
  },
  {
    id: 'redes-infra',
    category: 'Infraestrutura',
    title: 'Redes e Infraestrutura',
    description:
      'Instalação e configuração de redes LAN/WAN/WLAN, cabeamento estruturado, fibra óptica, datacenter, VPN, firewall, Wi-Fi corporativo e monitorização.',
    icon: 'Network',
    subServices: [
      'Redes LAN / WAN / WLAN',
      'Cabeamento Estruturado',
      'Fibra Óptica',
      'Rack e Patch Panel',
      'Configuração de Switches e Routers',
      'VPN e Firewall',
      'Wi-Fi Corporativo',
      'Datacenter',
      'Monitorização de Rede',
      'Balanceamento de Tráfego',
    ],
  },
  {
    id: 'telecom',
    category: 'Infraestrutura',
    title: 'Telecomunicações',
    description:
      'Soluções ISP, redes FTTH, VoIP, PBX IP, telefonia IP, comunicação unificada, interligação de filiais, rádio enlace e infraestrutura telecom.',
    icon: 'Radio',
    subServices: [
      'Soluções ISP',
      'Redes FTTH',
      'VoIP e PBX IP',
      'Telefonia IP',
      'Comunicação Unificada',
      'Interligação de Filiais',
      'Rádio Enlace',
      'Infraestrutura Telecom',
    ],
  },
  {
    id: 'cybersecurity',
    category: 'Segurança',
    title: 'Cibersegurança',
    description:
      'Auditorias e análise de vulnerabilidades, pentest, hardening, SIEM, SOC, resposta a incidentes, backup, disaster recovery, segurança cloud e forense digital.',
    icon: 'ShieldCheck',
    subServices: [
      'Auditoria de Segurança',
      'Pentest',
      'Hardening de Sistemas',
      'Gestão de Vulnerabilidades',
      'SIEM e SOC',
      'Resposta a Incidentes',
      'Backup e Disaster Recovery',
      'Segurança de Redes e Cloud',
      'IAM e MFA',
      'Políticas de Segurança',
      'Forense Digital',
      'Compliance',
    ],
  },
  {
    id: 'cloud',
    category: 'Cloud',
    title: 'Cloud Computing',
    description:
      'Migração para cloud, infraestrutura cloud, backup, servidores virtuais, containers, Kubernetes, DevOps, CI/CD, VPS, email corporativo e cloud privada/híbrida.',
    icon: 'Cloud',
    subServices: [
      'Cloud Migration',
      'Infraestrutura Cloud',
      'Backup Cloud',
      'Servidores Virtuais (VPS)',
      'Containers e Kubernetes',
      'DevOps e CI/CD',
      'Hosting e Domínios',
      'Email Corporativo',
      'Cloud Privada e Híbrida',
    ],
  },
  {
    id: 'consultoria',
    category: 'Consultoria',
    title: 'Consultoria Tecnológica',
    description:
      'Transformação digital, planeamento TI, auditoria, roadmap tecnológico, governança, compliance, PMO, gestão de projectos, CTO as a Service e CISO as a Service.',
    icon: 'Lightbulb',
    subServices: [
      'Transformação Digital',
      'Planeamento e Auditoria TI',
      'Roadmap Tecnológico',
      'Governança e Compliance',
      'Arquitectura Empresarial',
      'PMO e Gestão de Projectos',
      'CTO as a Service',
      'CISO as a Service',
      'Optimização de Recursos TI',
    ],
  },
  {
    id: 'ia-automacao',
    category: 'IA & Automação',
    title: 'IA e Automação',
    description:
      'Chatbots IA, assistentes inteligentes, automação de processos, OCR, IA empresarial, agentes IA, workflows, Business Intelligence e Machine Learning.',
    icon: 'BrainCircuit',
    subServices: [
      'Chatbots e Assistentes IA',
      'Automação de Processos (RPA)',
      'OCR e Processamento de Documentos',
      'IA Empresarial e Integrações',
      'Agentes IA',
      'Business Intelligence',
      'Analytics e Dashboards',
      'Machine Learning',
      'Workflow Automation',
    ],
  },
  {
    id: 'managed-services',
    category: 'Suporte',
    title: 'Serviços Geridos (MSP)',
    description:
      'Helpdesk, suporte remoto, outsourcing TI, monitorização contínua, gestão de servidores e endpoints, gestão de utilizadores e SLA corporativo.',
    icon: 'Headphones',
    subServices: [
      'Helpdesk e Suporte Remoto',
      'Outsourcing TI',
      'Monitorização Contínua',
      'Gestão de Servidores',
      'Gestão de Endpoints',
      'Gestão de Utilizadores (IAM)',
      'SLA Corporativo',
      'Suporte Empresarial',
    ],
  },
];

export const TECHNOLOGIES: TechItem[] = [
  {
    name: 'Arquitetura Zero Trust',
    category: 'Metodologia',
    description:
      'Nunca confiar, verificar sempre. Verificação rigorosa de identidade para cada pessoa e dispositivo.',
  },
  {
    name: 'SIEM de Próxima Geração',
    category: 'Monitorização',
    description:
      'Análise em tempo real de alertas de segurança gerados por aplicações e hardware de rede.',
  },
  {
    name: 'Deteção de Ameaças por IA',
    category: 'Inovação',
    description:
      'Algoritmos de machine learning que preveem e neutralizam vetores de ataque desconhecidos.',
  },
  {
    name: 'Criptografia Pós-Quântica',
    category: 'Criptografia',
    description: 'Integridade de dados à prova de futuro contra ameaças de computação quântica.',
  },
];
