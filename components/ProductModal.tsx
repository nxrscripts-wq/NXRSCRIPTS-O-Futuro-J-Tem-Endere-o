import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Product } from '../types';
import { formatPrice, buildWhatsAppLink } from '../services/storeService';
import { OrderForm } from './OrderForm';
import { X, Box } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (product) {
      setActiveImage(product.cover_image || (product.images?.length ? product.images[0] : null));
      setShowForm(false);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [product]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!product) return null;

  const allImages = [
    ...(product.cover_image ? [product.cover_image] : []),
    ...(product.images || []),
  ].filter((v, i, a) => a.indexOf(v) === i); // Unique images

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
    >
      {/* Overlay click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-black/60 overflow-y-auto z-10 flex flex-col md:flex-row">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-slate-800/80 hover:bg-slate-700 rounded-full text-slate-300 hover:text-white transition-colors"
          aria-label="Fechar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* COLUNA ESQUERDA - IMAGENS */}
        <div className="w-full md:w-1/2 p-6 bg-slate-950/50 flex flex-col">
          <div className="w-full aspect-square md:aspect-auto md:h-80 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden relative">
            {activeImage ? (
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-600">
                <Box className="w-16 h-16 mb-2 opacity-50" />
                <span className="text-sm font-mono">Imagem não disponível</span>
              </div>
            )}
            
            {/* Badges on main image */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.featured && (
                <span className="px-3 py-1 bg-cyan-900/90 text-cyan-300 text-xs font-bold rounded-lg backdrop-blur-md shadow-lg border border-cyan-500/30">
                  ⭐ Destaque
                </span>
              )}
              {product.stock_status === 'out_of_stock' && (
                <span className="px-3 py-1 bg-red-900/90 text-red-300 text-xs font-bold rounded-lg backdrop-blur-md shadow-lg border border-red-500/30">
                  Esgotado
                </span>
              )}
              {product.stock_status === 'on_request' && (
                <span className="px-3 py-1 bg-orange-900/90 text-orange-300 text-xs font-bold rounded-lg backdrop-blur-md shadow-lg border border-orange-500/30">
                  Sob Encomenda
                </span>
              )}
            </div>
          </div>

          {allImages.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${activeImage === img ? 'border-cyan-400' : 'border-slate-800 hover:border-slate-600 opacity-70 hover:opacity-100'}`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* COLUNA DIREITA - DETALHES */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="px-2 py-1 bg-cyan-950 text-cyan-400 border border-cyan-800/50 text-[10px] font-mono uppercase tracking-wider rounded">
              {product.category}
            </span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-4 leading-tight">{product.name}</h2>
          
          <div className="mb-6">
            <div className="text-3xl font-mono text-cyan-400 font-bold tracking-tight">
              {formatPrice(product)}
            </div>
            {!product.price && (
              <p className="text-xs text-slate-400 mt-1">Contacte-nos para obter proposta personalizada</p>
            )}
          </div>

          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            {product.description}
          </p>

          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="bg-slate-800/50 rounded-lg p-4 mb-6 border border-slate-700/50">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Especificações Técnicas</h4>
              <div className="space-y-2">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-start text-sm border-b border-slate-700/50 pb-2 last:border-0 last:pb-0">
                    <span className="text-slate-400 pr-4">{key}</span>
                    <span className="text-white font-mono text-right break-words max-w-[60%]">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {product.tags.map(tag => (
                <span key={tag} className="text-xs px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-400 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* ACCÕES */}
          <div className="mt-auto space-y-3">
            <button
              onClick={() => window.open(buildWhatsAppLink(product), '_blank')}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-green-900/20"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
              </svg>
              Encomendar via WhatsApp
            </button>
            
            <button
              onClick={() => setShowForm(!showForm)}
              className="w-full py-3.5 border border-cyan-500/30 text-cyan-300 font-medium rounded-xl hover:bg-cyan-950/40 transition-colors"
            >
              {showForm ? 'Cancelar requisição' : 'Preencher formulário de requisição'}
            </button>
          </div>

          {/* REQUISIÇÃO FORM (EXPANDÍVEL) */}
          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showForm ? 'max-h-[800px] opacity-100 mt-6 pt-6 border-t border-slate-800' : 'max-h-0 opacity-0'}`}>
            <OrderForm product={product} onSuccess={() => {}} />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
