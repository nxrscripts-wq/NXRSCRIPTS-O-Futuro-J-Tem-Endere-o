import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Laptop,
  MonitorPlay,
  Router,
  Briefcase,
  Cpu,
  MousePointer2,
  HardDrive,
  Box,
} from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { SEO_PAGES } from '../lib/seo';
import { organizationSchema } from '../lib/jsonld';
import { AnimateIn } from '../components/AnimateIn';
import { ProductModal } from '../components/ProductModal';
import { Product } from '../types';
import {
  fetchActiveProducts,
  formatPrice,
  getCategoryList,
  buildWhatsAppLink,
} from '../services/storeService';

const getIcon = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('computador') || cat.includes('laptop')) return <Laptop className="w-8 h-8" />;
  if (cat.includes('monitor')) return <MonitorPlay className="w-8 h-8" />;
  if (cat.includes('rede') || cat.includes('telecom')) return <Router className="w-8 h-8" />;
  if (cat.includes('segurança')) return <ShieldCheck className="w-8 h-8" />;
  if (cat.includes('software')) return <Briefcase className="w-8 h-8" />;
  if (cat.includes('processador') || cat.includes('placa')) return <Cpu className="w-8 h-8" />;
  if (cat.includes('mouse') || cat.includes('rato')) return <MousePointer2 className="w-8 h-8" />;
  if (cat.includes('disco') || cat.includes('ssd') || cat.includes('armazenamento'))
    return <HardDrive className="w-8 h-8" />;
  return <Box className="w-8 h-8" />;
};

export const Store: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['products', activeCategory],
    queryFn: () => fetchActiveProducts(activeCategory),
  });

  const categories = getCategoryList();

  const filteredProducts = products.filter(p => {
    const search = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(search) ||
      p.description.toLowerCase().includes(search) ||
      p.tags?.some(t => t.toLowerCase().includes(search))
    );
  });

  return (
    <>
      <SEOHead page={SEO_PAGES.store} jsonLd={organizationSchema()} />
      <div className="pt-16 sm:pt-20 pb-24 bg-slate-950 min-h-screen">
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />

        {/* Hero Section */}
        <section className="bg-slate-950 pt-8 pb-12 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center px-4 py-1.5 bg-cyan-900/20 border border-cyan-500/30 rounded-full mb-6">
              <ShoppingBag className="w-4 h-4 text-cyan-400 mr-2" />
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                {products.length > 0
                  ? `Produtos disponíveis: ${products.length} itens`
                  : 'Catálogo em actualização'}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Loja <span className="text-cyan-400">Tecnológica</span>
            </h1>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              Hardware, software e soluções tecnológicas para a sua empresa.
            </p>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-12">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 w-full lg:w-auto">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 border ${
                    activeCategory === category
                      ? 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                      : 'bg-transparent border-slate-700 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-500" />
              </div>
              <input
                type="text"
                placeholder="Pesquisar produto..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors"
              />
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden animate-pulse"
                >
                  <div className="w-full aspect-square bg-slate-800" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 w-1/3 bg-slate-800 rounded" />
                    <div className="h-5 w-3/4 bg-slate-800 rounded" />
                    <div className="h-3 w-full bg-slate-800 rounded" />
                    <div className="h-8 w-full bg-slate-800 rounded mt-4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-medium text-slate-300 mb-2">Erro ao carregar catálogo</h3>
              <p className="text-slate-500 text-sm mb-8 max-w-md">
                Ocorreu uma falha na comunicação com os nossos servidores. Por favor, verifique a
                sua ligação ou tente novamente.
              </p>
              <button
                onClick={() => refetch()}
                className="px-6 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors border border-slate-700"
              >
                Tentar Novamente
              </button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isError && filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Box className="w-20 h-20 text-slate-600 mb-6" />
              <h3 className="text-xl font-medium text-slate-300 mb-2">Sem produtos disponíveis</h3>
              <p className="text-slate-500 text-sm mb-8">
                {searchQuery
                  ? 'Nenhum produto corresponde à pesquisa.'
                  : activeCategory !== 'Todos'
                    ? 'Sem produtos nesta categoria por agora.'
                    : 'O catálogo está a ser preparado. Volte em breve.'}
              </p>
              <a
                href="https://wa.me/244923479049?text=Olá+NXRSCRIPTS!+Preciso+de+informações+sobre+produtos+disponíveis."
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 text-sm font-medium hover:underline flex items-center gap-1"
              >
                Interessado em algo específico? Contacte-nos via WhatsApp{' '}
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          )}

          {/* Product Grid */}
          {!isLoading && !isError && filteredProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <AnimateIn key={product.id} delay={Math.min(index * 50, 300)}>
                  <div
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') setSelectedProduct(product);
                    }}
                    onClick={() => setSelectedProduct(product)}
                    className="cursor-pointer group flex flex-col h-full bg-slate-900 border border-slate-700 rounded-xl overflow-hidden hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all duration-300"
                  >
                    {/* Image Area */}
                    <div className="relative w-full aspect-square bg-slate-800 flex items-center justify-center overflow-hidden">
                      {product.cover_image ? (
                        <img
                          src={product.cover_image}
                          alt={product.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-slate-700 group-hover:scale-110 transition-transform duration-500">
                          {getIcon(product.category)}
                        </div>
                      )}

                      {/* Top Left Badge (Featured) */}
                      {product.featured && (
                        <span className="absolute top-3 left-3 px-2 py-1 bg-cyan-900/80 text-cyan-300 text-[10px] font-bold rounded backdrop-blur-sm">
                          ⭐ Destaque
                        </span>
                      )}

                      {/* Top Right Badge (Stock) */}
                      {product.stock_status === 'out_of_stock' && (
                        <span className="absolute top-3 right-3 px-2 py-1 bg-red-900/80 text-red-300 text-[10px] font-bold rounded backdrop-blur-sm">
                          Esgotado
                        </span>
                      )}
                      {product.stock_status === 'on_request' && (
                        <span className="absolute top-3 right-3 px-2 py-1 bg-orange-900/80 text-orange-300 text-[10px] font-bold rounded backdrop-blur-sm">
                          Sob Encomenda
                        </span>
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="flex flex-col flex-grow p-4">
                      <span className="text-[10px] font-mono text-cyan-400/70 uppercase tracking-wide mb-1 block">
                        {product.category}
                      </span>
                      <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-slate-400 text-xs line-clamp-2 mt-2 flex-grow">
                        {product.description}
                      </p>

                      {/* Footer */}
                      <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-800">
                        <div className="text-cyan-400 font-bold font-mono text-sm">
                          {product.price ? formatPrice(product) : 'Consulte-nos'}
                        </div>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            window.open(buildWhatsAppLink(product), '_blank');
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600/20 border border-green-600/30 text-green-400 text-xs font-medium rounded-lg hover:bg-green-600/30 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                          </svg>
                          WhatsApp
                        </button>
                      </div>
                    </div>
                  </div>
                </AnimateIn>
              ))}
            </div>
          )}
        </section>

        {/* Bottom CTA */}
        <section className="max-w-7xl mx-auto px-4 mt-8">
          <div className="p-8 md:p-12 bg-slate-900 border border-slate-700 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold text-white mb-3">Configurações Personalizadas?</h2>
              <p className="text-sm text-slate-400">
                A nossa engenharia de vendas pode desenhar sistemas redundantes e arquiteturas de
                rede completas sob medida para a sua necessidade governamental ou bancária.
              </p>
            </div>
            <Link
              to="/contact"
              className="whitespace-nowrap px-8 py-4 bg-cyan-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-cyan-500 rounded-xl transition-colors flex items-center"
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
