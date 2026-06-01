import React, { useState } from 'react';
import {
  Shield,
  Smartphone,
  Lightbulb,
  Zap,
  HelpCircle,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { createQuote } from '../services/quoteService';
import { useRateLimit } from '../lib/useRateLimit';
import { SEOHead } from '../components/SEOHead';
import { SEO_PAGES } from '../lib/seo';
import { Link } from 'react-router-dom';

interface QuoteState {
  step: 1 | 2 | 3 | 4 | 'success';
  serviceType: string;
  companySize: string;
  urgency: string;
  budget: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  description: string;
  honeypot: string;
}

const SERVICE_OPTIONS = [
  {
    id: 'Cibersegurança',
    icon: <Shield className="w-6 h-6 mb-3" />,
    desc: 'Proteção e auditoria de sistemas',
  },
  {
    id: 'Desenvolvimento Web/Mobile',
    icon: <Smartphone className="w-6 h-6 mb-3" />,
    desc: 'Plataformas seguras',
  },
  {
    id: 'Consultoria IT',
    icon: <Lightbulb className="w-6 h-6 mb-3" />,
    desc: 'Estratégia e planeamento',
  },
  {
    id: 'Transformação Digital',
    icon: <Zap className="w-6 h-6 mb-3" />,
    desc: 'Modernização de infraestrutura',
  },
  { id: 'Outro', icon: <HelpCircle className="w-6 h-6 mb-3" />, desc: 'Necessidades específicas' },
];

const COMPANY_SIZES = ['Startup (1-10)', 'PME (11-50)', 'Média (51-200)', 'Grande (200+)'];

const URGENCIES = ['Imediato (<1 mês)', 'Curto prazo (1-3m)', 'Planeamento (3-6m)', 'Exploratório'];

const BUDGETS = [
  '< 5.000 USD',
  '5.000–20.000 USD',
  '20.000–50.000 USD',
  '> 50.000 USD',
  'Não definido',
];

const Quote: React.FC = () => {
  const [state, setState] = useState<QuoteState>({
    step: 1,
    serviceType: '',
    companySize: '',
    urgency: '',
    budget: '',
    name: '',
    company: '',
    email: '',
    phone: '',
    description: '',
    honeypot: '',
  });

  const [loading, setLoading] = useState(false);
  const { isLimited, secondsLeft, recordSubmission } = useRateLimit();

  const handleNext = () => {
    if (typeof state.step === 'number' && state.step < 4) {
      setState({ ...state, step: (state.step + 1) as 1 | 2 | 3 | 4 });
    }
  };

  const handlePrev = () => {
    if (typeof state.step === 'number' && state.step > 1) {
      setState({ ...state, step: (state.step - 1) as 1 | 2 | 3 | 4 });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state.honeypot || isLimited) return;

    setLoading(true);

    const success = await createQuote({
      serviceType: state.serviceType,
      companySize: state.companySize,
      urgency: state.urgency,
      budget: state.budget,
      name: state.name,
      company: state.company,
      email: state.email,
      phone: state.phone,
      description: state.description,
    });

    setLoading(false);

    if (success) {
      recordSubmission();
      setState({ ...state, step: 'success' });
    }
  };

  const currentStep = typeof state.step === 'number' ? state.step : 4;

  if (state.step === 'success') {
    return (
      <>
        <SEOHead page={SEO_PAGES.quote} />
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 py-20 text-center">
          <div className="w-24 h-24 bg-cyan-900/30 rounded-full flex items-center justify-center mb-8 animate-pulse">
            <CheckCircle className="w-12 h-12 text-cyan-400" />
          </div>
          <h1 className="font-orbitron text-3xl md:text-5xl text-white font-bold mb-4">
            Pedido Recebido!
          </h1>
          <p className="font-rajdhani text-slate-400 text-lg mb-8 max-w-md">
            A nossa equipa comercial e de engenharia irá analisar os seus requisitos. Respondemos em
            48 horas úteis.
          </p>
          <Link
            to="/"
            className="px-8 py-3 bg-cyan-400 text-slate-950 font-bold uppercase tracking-widest hover:bg-white transition-colors"
          >
            Voltar ao Início
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead page={SEO_PAGES.quote} />
      <div className="min-h-screen bg-slate-950 pt-24 pb-20 px-4 flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-orbitron text-3xl md:text-4xl text-white font-bold mb-3 uppercase tracking-wider">
            Pedir Orçamento
          </h1>
          <p className="font-rajdhani text-slate-400">
            Configure as necessidades da sua infraestrutura.
          </p>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-sm p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Progress Bar */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
                Passo {currentStep} de 4
              </span>
            </div>
            <div className="flex space-x-2">
              {[1, 2, 3, 4].map(step => (
                <div
                  key={step}
                  className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                    currentStep === step
                      ? 'bg-cyan-400'
                      : currentStep > step
                        ? 'bg-white'
                        : 'bg-slate-800'
                  }`}
                />
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <input
              type="text"
              name="honeypot"
              tabIndex={-1}
              aria-hidden="true"
              value={state.honeypot}
              onChange={e => setState({ ...state, honeypot: e.target.value })}
              style={{ position: 'absolute', left: '-9999px', opacity: 0 }}
            />

            {state.step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-xl text-white font-bold mb-6 font-rajdhani">
                  Qual é o tipo de serviço principal?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {SERVICE_OPTIONS.map(service => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => setState({ ...state, serviceType: service.id })}
                      className={`flex flex-col items-start p-5 border text-left transition-all duration-200 ${
                        state.serviceType === service.id
                          ? 'border-cyan-400 bg-cyan-950/20 text-white'
                          : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-600 hover:text-white'
                      }`}
                    >
                      <div
                        className={
                          state.serviceType === service.id ? 'text-cyan-400' : 'text-slate-500'
                        }
                      >
                        {service.icon}
                      </div>
                      <h3 className="font-bold mb-1 text-sm">{service.id}</h3>
                      <p className="text-xs opacity-70">{service.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {state.step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-8">
                <div>
                  <h2 className="text-xl text-white font-bold mb-6 font-rajdhani">
                    Dimensão da Empresa
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {COMPANY_SIZES.map(size => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setState({ ...state, companySize: size })}
                        className={`py-3 px-4 border text-sm font-medium transition-colors ${
                          state.companySize === size
                            ? 'border-cyan-400 bg-cyan-950/20 text-cyan-400'
                            : 'border-slate-800 text-slate-400 hover:border-slate-600'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h2 className="text-xl text-white font-bold mb-6 font-rajdhani">
                    Urgência do Projeto
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {URGENCIES.map(urg => (
                      <button
                        key={urg}
                        type="button"
                        onClick={() => setState({ ...state, urgency: urg })}
                        className={`py-3 px-4 border text-sm font-medium transition-colors ${
                          state.urgency === urg
                            ? 'border-cyan-400 bg-cyan-950/20 text-cyan-400'
                            : 'border-slate-800 text-slate-400 hover:border-slate-600'
                        }`}
                      >
                        {urg}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {state.step === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-baseline justify-between mb-6">
                  <h2 className="text-xl text-white font-bold font-rajdhani">Orçamento Estimado</h2>
                  <span className="text-xs text-slate-500 uppercase tracking-widest">Opcional</span>
                </div>
                <div className="flex flex-col space-y-3">
                  {BUDGETS.map(b => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setState({ ...state, budget: b })}
                      className={`py-4 px-6 border text-left font-medium transition-colors ${
                        state.budget === b
                          ? 'border-cyan-400 bg-cyan-950/20 text-cyan-400'
                          : 'border-slate-800 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {state.step === 4 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-5">
                <h2 className="text-xl text-white font-bold mb-6 font-rajdhani">Detalhes Finais</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="quote-name"
                      className="block text-xs font-mono text-slate-400 mb-2 uppercase"
                    >
                      Nome Completo *
                    </label>
                    <input
                      id="quote-name"
                      required
                      type="text"
                      value={state.name}
                      onChange={e => setState({ ...state, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 text-white text-base sm:text-sm px-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="quote-company"
                      className="block text-xs font-mono text-slate-400 mb-2 uppercase"
                    >
                      Empresa *
                    </label>
                    <input
                      id="quote-company"
                      required
                      type="text"
                      value={state.company}
                      onChange={e => setState({ ...state, company: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 text-white text-base sm:text-sm px-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="quote-email"
                      className="block text-xs font-mono text-slate-400 mb-2 uppercase"
                    >
                      Email Profissional *
                    </label>
                    <input
                      id="quote-email"
                      required
                      type="email"
                      value={state.email}
                      onChange={e => setState({ ...state, email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 text-white text-base sm:text-sm px-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="quote-phone"
                      className="block text-xs font-mono text-slate-400 mb-2 uppercase"
                    >
                      Telefone (Opcional)
                    </label>
                    <input
                      id="quote-phone"
                      type="tel"
                      value={state.phone}
                      onChange={e => setState({ ...state, phone: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 text-white text-base sm:text-sm px-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="quote-description"
                    className="block text-xs font-mono text-slate-400 mb-2 uppercase"
                  >
                    Descrição do Projeto *
                  </label>
                  <textarea
                    id="quote-description"
                    required
                    rows={4}
                    value={state.description}
                    onChange={e => setState({ ...state, description: e.target.value })}
                    placeholder="Conte-nos sobre os seus objetivos e desafios principais..."
                    className="w-full bg-slate-950 border border-slate-800 text-white text-base sm:text-sm px-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors resize-y"
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="pt-6 mt-8 border-t border-slate-800 flex justify-between">
              {state.step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="flex items-center text-slate-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </button>
              ) : (
                <div />
              )}

              {state.step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={
                    (state.step === 1 && !state.serviceType) ||
                    (state.step === 2 && (!state.companySize || !state.urgency))
                  }
                  className="flex items-center px-6 py-3 bg-cyan-400 text-slate-950 font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Avançar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={
                    loading ||
                    isLimited ||
                    !state.name ||
                    !state.company ||
                    !state.email ||
                    !state.description
                  }
                  className="flex items-center px-8 py-3 bg-cyan-400 text-slate-950 font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'A processar...' : 'Submeter Pedido'}
                </button>
              )}
            </div>

            {isLimited && state.step === 4 && (
              <p className="text-xs text-red-400 text-right mt-2 font-mono">
                Muitas submissões. Aguarde {Math.floor(secondsLeft / 60)}m {secondsLeft % 60}s.
              </p>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default Quote;
