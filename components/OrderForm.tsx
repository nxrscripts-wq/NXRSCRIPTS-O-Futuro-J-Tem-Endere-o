import React, { useState } from 'react';
import { Product } from '../types';
import { createOrder, buildWhatsAppLink } from '../services/storeService';
import { Loader2, CheckCircle2 } from 'lucide-react';

interface OrderFormProps {
  product: Product;
  onSuccess: () => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({ product, onSuccess }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    quantity: 1,
    message: '',
  });
  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check for bots
    if (honeypot) {
      setSubmitted(true);
      return;
    }

    if (!form.name || !form.email) {
      setError('Por favor, preencha os campos obrigatórios.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await createOrder({
        product_id: product.id,
        product_name: product.name,
        product_price: product.price,
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone || null,
        quantity: Number(form.quantity),
        message: form.message || null,
        source: 'form',
      });
      setSubmitted(true);
      onSuccess();
    } catch (err: unknown) {
      setError('Ocorreu um erro ao enviar o seu pedido. Tente novamente ou use o WhatsApp.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-900 border border-slate-700 rounded-xl">
        <CheckCircle2 className="w-16 h-16 text-green-500 mb-4 animate-in zoom-in duration-500" />
        <h3 className="text-xl font-bold text-white mb-2">Requisição Recebida!</h3>
        <p className="text-slate-400 text-sm mb-6">
          A nossa equipa comercial entrará em contacto consigo o mais brevemente possível com os
          detalhes.
        </p>
        <button
          onClick={() => window.open(buildWhatsAppLink(product, form.quantity), '_blank')}
          className="w-full flex items-center justify-center gap-2 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
          </svg>
          Contactar via WhatsApp
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-900/50 border border-red-500/50 text-red-200 text-sm rounded">
          {error}
        </div>
      )}

      {/* Honeypot */}
      <input
        type="text"
        name="website_url"
        value={honeypot}
        onChange={e => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="absolute w-0 h-0 opacity-0 -z-10"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Nome Completo *</label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Email *</label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">
            Telefone / WhatsApp
          </label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+244 9XX XXX XXX"
            className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Quantidade *</label>
          <input
            type="number"
            name="quantity"
            min="1"
            max="999"
            required
            value={form.quantity}
            onChange={handleChange}
            className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1">
          Mensagem Adicional (Opcional)
        </label>
        <textarea
          name="message"
          rows={3}
          value={form.message}
          onChange={handleChange}
          className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
          placeholder="Ex: Preciso disto para a minha empresa com urgência."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center py-3 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:hover:bg-cyan-600 text-white font-bold rounded-lg transition-colors"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" /> A Processar...
          </>
        ) : (
          'Confirmar Requisição'
        )}
      </button>
    </form>
  );
};
