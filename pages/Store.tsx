import React, { useState, useEffect } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import {
  Laptop,
  Cpu,
  Router,
  ShieldCheck,
  MonitorPlay,
  Briefcase,
  ArrowRight,
  ShoppingBag,
  X,
  Check,
  Activity,
  Filter,
  MousePointer2,
  HardDrive,
  Search,
} from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { SEO_PAGES } from '../lib/seo';
import { organizationSchema } from '../lib/jsonld';
import { AnimateIn } from '../components/AnimateIn';

interface Product {
  id: string;
  title: string;
  description: string;
  iconName: string;
  specs: string[];
  category: string;
}

const PRODUCTS: Product[] = [
  {
    id: 'ram-kingston-16gb',
    title: 'Kingston Fury Beast 16GB',
    description:
      'Memória RAM DDR5 de alta velocidade otimizada para multitarefa intensiva e processamento de segurança.',
    iconName: 'Cpu',
    specs: ['DDR5 5200MHz', 'Latência CL40', 'Dissipador de Alumínio', 'Garantia Vitalícia'],
    category: 'Memória RAM',
  },
  {
    id: 'ram-corsair-32gb',
    title: 'Corsair Vengeance 32GB',
    description:
      'Kit de memória premium para servidores e estações de trabalho que exigem estabilidade absoluta.',
    iconName: 'Cpu',
    specs: [
      '2x 16GB DDR4 3600MHz',
      'Perfil XMP 2.0',
      'Iluminação RGB Customizável',
      'Compatível com Intel/AMD',
    ],
    category: 'Memória RAM',
  },
  {
    id: 'hd-seagate-4tb',
    title: 'Seagate IronWolf 4TB',
    description:
      'Disco rígido especializado para sistemas NAS e armazenamento de logs de segurança em larga escala.',
    iconName: 'HardDrive',
    specs: ['Interface SATA 6Gb/s', '5400 RPM', 'Cache 256MB', 'AgileArray Firmware'],
    category: 'Disco duro',
  },
  {
    id: 'ssd-samsung-990-1tb',
    title: 'Samsung 990 Pro 1TB',
    description:
      'SSD NVMe de última geração com velocidades extremas para carregamento instantâneo de ferramentas de análise.',
    iconName: 'HardDrive',
    specs: ['PCIe Gen 4.0 x4', '7,450 MB/s Leitura', '6,900 MB/s Escrita', 'Tecnologia V-NAND'],
    category: 'SSD',
  },
  {
    id: 'cpu-intel-i9',
    title: 'Intel Core i9-14900K',
    description:
      'Processador topo de gama com arquitetura híbrida para processamento paralelo de alto nível.',
    iconName: 'Cpu',
    specs: ['24 Cores (8P + 16E)', 'Até 6.0 GHz Turbo', 'Cache 36MB L3', 'Gráficos UHD 770'],
    category: 'Processador',
  },
  {
    id: 'laptop-alienware-m18',
    title: 'Alienware m18 R2',
    description:
      'Estação de trabalho móvel com ecrã gigante e poder de processamento equivalente a um desktop.',
    iconName: 'Laptop',
    specs: ['RTX 4080 12GB', 'Core i9-14900HX', 'Ecrã 18" QHD+', '32GB DDR5'],
    category: 'Computadores',
  },
  {
    id: 'desktop-nxr-workstation',
    title: 'NXR Workstation Elite',
    description:
      'Desktop empresarial montado sob medida para máxima segurança e desempenho em redes corporativas.',
    iconName: 'Laptop',
    specs: ['Xeon Gold 6226R', '64GB RAM ECC', 'Quadro RTX 4000', 'Windows 11 Pro Enterprise'],
    category: 'Computadores',
  },
  {
    id: 'monitor-lg-32',
    title: 'LG UltraGear 32"',
    description:
      'Monitor de alta definição com fidelidade de cor excepcional para visualização de sistemas complexos.',
    iconName: 'MonitorPlay',
    specs: ['Resolução 4K UHD', '144Hz Refresh Rate', 'Painel Nano IPS', 'G-Sync Compatible'],
    category: 'Monitores',
  },
  {
    id: 'keyboard-razer-blackwidow',
    title: 'Razer BlackWidow V4',
    description:
      'Teclado mecânico de resposta rápida para operadores que exigem precisão em cada tecla pressionada.',
    iconName: 'Router',
    specs: [
      'Switches Amarelos Silenciosos',
      'Chapas de Alumínio',
      'Teclas Macro Dedicadas',
      'RGB Chroma',
    ],
    category: 'Teclado',
  },
  {
    id: 'mouse-logitech-g502',
    title: 'Logitech G502 X Plus',
    description:
      'O rato sem fios mais avançado para ergonomia e produtividade em ambientes de monitorização.',
    iconName: 'MousePointer2',
    specs: ['Sensor Hero 25K', 'Lightspeed Wireless', 'Botão DPI Ajustável', 'Switches Lightforce'],
    category: 'Mouse',
  },
  {
    id: 'gpu-rtx-4090',
    title: 'ASUS ROG Strix RTX 4090',
    description:
      'A placa de vídeo definitiva para computação acelerada por GPU e inteligência artificial.',
    iconName: 'Cpu',
    specs: [
      '24GB GDDR6X',
      'Arquitetura Ada Lovelace',
      'Núcleos Tensor 4.ª Gen',
      'Ventoinhas Axial-tech',
    ],
    category: 'Placa de vídeo',
  },
  {
    id: 'gamer-bundle-pro',
    title: 'Cadeira NXR Stealth Pro',
    description:
      'Equipamento ergonómico desenhado para longas horas de operação sem comprometer o conforto.',
    iconName: 'Briefcase',
    specs: [
      'Ajuste 4D Braços',
      'Pele Sintética Respirável',
      'Base de Aço Reforçada',
      'Almofadas Lombares',
    ],
    category: 'Gamer',
  },
];

const CATEGORIES = [
  'Todos',
  'Memória RAM',
  'Disco duro',
  'SSD',
  'Processador',
  'Computadores',
  'Monitores',
  'Teclado',
  'Mouse',
  'Placa de vídeo',
  'Gamer',
];

const getIcon = (name: string) => {
  switch (name) {
    case 'Laptop':
      return <Laptop className="w-8 h-8" />;
    case 'MonitorPlay':
      return <MonitorPlay className="w-8 h-8" />;
    case 'Router':
      return <Router className="w-8 h-8" />;
    case 'ShieldCheck':
      return <ShieldCheck className="w-8 h-8" />;
    case 'Briefcase':
      return <Briefcase className="w-8 h-8" />;
    case 'Cpu':
      return <Cpu className="w-8 h-8" />;
    case 'MousePointer2':
      return <MousePointer2 className="w-8 h-8" />;
    case 'HardDrive':
      return <HardDrive className="w-8 h-8" />;
    default:
      return <Laptop className="w-8 h-8" />;
  }
};

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => (
  <div className="group bg-nxr-panel border border-nxr-border p-6 rounded-sm hover:border-nxr-primary transition-all duration-300 relative overflow-hidden flex flex-col h-full animate-in fade-in zoom-in duration-500">
    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
      <ShoppingBag className="w-20 h-20 text-nxr-primary" />
    </div>

    <div className="relative z-10 flex-grow">
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 bg-slate-900 rounded-sm flex items-center justify-center text-nxr-primary border border-nxr-border group-hover:border-nxr-primary/50 transition-colors">
          {getIcon(product.iconName)}
        </div>
        <span className="text-[9px] font-mono uppercase tracking-widest text-nxr-primary/70 bg-nxr-primary/10 px-2 py-1 rounded-sm border border-nxr-primary/20">
          {product.category}
        </span>
      </div>

      <h3 className="text-lg font-bold text-white mb-2">{product.title}</h3>
      <p className="text-slate-400 text-xs leading-relaxed mb-4 line-clamp-2">
        {product.description}
      </p>

      <ul className="mb-6 space-y-1.5">
        {product.specs.slice(0, 2).map((spec, idx) => (
          <li key={idx} className="flex items-center text-[10px] text-slate-500">
            <Check className="w-3 h-3 text-nxr-primary mr-1.5 flex-shrink-0" />
            {spec}
          </li>
        ))}
      </ul>
    </div>

    <div className="relative z-10">
      <button
        onClick={() => onViewDetails(product)}
        className="w-full py-2.5 px-4 bg-nxr-dark border border-nxr-primary/20 text-nxr-primary font-bold text-[10px] uppercase tracking-widest hover:bg-nxr-primary hover:text-nxr-dark transition-all duration-300 flex items-center justify-center"
      >
        Especificações
        <ArrowRight className="ml-2 w-3 h-3" />
      </button>
    </div>
  </div>
);

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen && product) {
      setShouldRender(true);
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, product]);

  if (!shouldRender || !product) return null;

  const handleRequestQuote = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
      navigate('/contact', { state: { productInterest: product.title } });
    }, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            e.currentTarget.click();
          }
        }}
        role="button"
        tabIndex={0}
      />
      <div
        className={`relative bg-nxr-dark border border-nxr-primary w-full max-w-xl shadow-[0_0_50px_rgba(6,182,212,0.1)] transition-all duration-300 transform ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}
      >
        <div className="flex justify-between items-center p-6 border-b border-nxr-border">
          <div className="flex items-center space-x-3">
            <div className="text-nxr-primary">{getIcon(product.iconName)}</div>
            <h3 className="text-xl font-bold text-white">{product.title}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-5 sm:p-8">
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
            {product.description} Este hardware é selecionado criteriosamente pela nossa equipa de
            engenharia para máxima compatibilidade com protocolos de segurança avançados.
          </p>

          <div className="bg-slate-900 p-4 border border-nxr-border rounded-sm mb-6">
            <h4 className="text-[9px] sm:text-[10px] font-mono text-nxr-primary uppercase tracking-widest mb-3 flex items-center">
              <Activity className="w-3 h-3 mr-2" /> DATA_SHEET
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {product.specs.map((spec, idx) => (
                <div
                  key={idx}
                  className="flex items-center text-[10px] sm:text-xs text-slate-400 font-mono"
                >
                  <span className="text-nxr-primary mr-2">/</span> {spec}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleRequestQuote}
              className="w-full sm:flex-1 py-3 bg-nxr-primary text-nxr-dark font-bold uppercase text-[10px] sm:text-xs tracking-widest hover:bg-white transition-colors"
            >
              Solicitar Cotação
            </button>
            <button
              onClick={onClose}
              className="w-full sm:px-6 py-3 border border-nxr-border text-slate-400 hover:text-white transition-colors text-[10px] sm:text-xs uppercase"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Store: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 350);
  };

  const filteredProducts = PRODUCTS.filter(product => {
    const matchesCategory = activeCategory === 'Todos' || product.category === activeCategory;
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <SEOHead page={SEO_PAGES.store} jsonLd={organizationSchema()} />
      <div className="pt-16 sm:pt-20 pb-24">
        <ProductModal product={selectedProduct} isOpen={isModalOpen} onClose={handleCloseModal} />

        {/* Simplified Store Header */}
        <section className="bg-nxr-dark pt-8 pb-16 border-b border-nxr-border">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center px-4 py-1.5 bg-nxr-primary/5 border border-nxr-primary/20 rounded-full mb-6">
              <ShoppingBag className="w-4 h-4 text-nxr-primary mr-2" />
              <span className="text-[10px] font-mono text-nxr-primary uppercase tracking-widest">
                Hardware_Certificado
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Catálogo de <span className="text-nxr-primary">Sistemas</span>
            </h1>
            <p className="text-sm text-slate-500 max-w-xl mx-auto">
              Equipamentos de grau militar e infraestrutura de rede robusta para operações críticas.
            </p>
          </div>
        </section>

        {/* Search and Filters Navigation & Results */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center mb-16 space-y-8">
            {/* Search Bar */}
            <div className="relative w-full max-w-lg">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-500" />
              </div>
              <input
                type="text"
                placeholder="Pesquisar sistemas ou componentes..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-4 py-3 bg-nxr-panel border border-nxr-border rounded-sm text-sm text-white focus:outline-none focus:border-nxr-primary focus:ring-1 focus:ring-nxr-primary transition-all duration-300"
              />
            </div>

            {/* Category Filters Bar */}
            <div className="flex flex-col items-center w-full">
              <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-nxr-panel border border-nxr-border rounded-sm w-full sm:w-auto">
                {CATEGORIES.map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-sm text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                      activeCategory === category
                        ? 'bg-nxr-primary text-nxr-dark shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                        : 'text-slate-500 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <div className="mt-4 text-[9px] sm:text-[10px] font-mono text-slate-600 uppercase tracking-widest text-center">
                A mostrar {filteredProducts.length} de {PRODUCTS.length} sistemas encontrados
              </div>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <AnimateIn key={product.id} delay={Math.min(index * 80, 400)}>
                  <ProductCard product={product} onViewDetails={handleOpenModal} />
                </AnimateIn>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-nxr-panel/30 border border-dashed border-nxr-border rounded-sm">
              <Filter className="w-10 h-10 text-slate-700 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Nenhum equipamento encontrado</h3>
              <p className="text-slate-500 text-sm mb-6">
                Tente ajustar os termos de pesquisa ou o filtro de categoria.
              </p>
              <button
                onClick={() => {
                  setActiveCategory('Todos');
                  setSearchQuery('');
                }}
                className="text-nxr-primary hover:underline text-xs uppercase font-bold tracking-widest"
              >
                Redefinir filtros
              </button>
            </div>
          )}
        </section>

        {/* Bottom CTA */}
        <section className="max-w-7xl mx-auto px-4">
          <div className="p-8 md:p-12 bg-nxr-panel border border-nxr-border flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold text-white mb-3">Configurações Personalizadas?</h2>
              <p className="text-sm text-slate-400">
                A nossa engenharia de vendas pode desenhar sistemas redundantes e arquiteturas de
                rede completas sob medida para a sua necessidade governamental ou bancária.
              </p>
            </div>
            <Link
              to="/contact"
              className="whitespace-nowrap px-8 py-4 bg-white text-nxr-dark font-bold text-xs uppercase tracking-widest hover:bg-nxr-primary transition-colors flex items-center"
            >
              Falar com Engenharia
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default Store;
