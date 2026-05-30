import React, { useState, useEffect } from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { Mail, Phone, MapPin, Send, Plus, Minus } from 'lucide-react';
import { analyzeMessageIntent } from '../services/geminiService';
import { createLead } from '../services/leadService';
import { useLocation, Link } from 'react-router-dom';
import { useRateLimit } from '../lib/useRateLimit';
import { COMPANY_INFO } from '../constants';
import { SEOHead } from '../components/SEOHead';
import { SEO_PAGES } from '../lib/seo';
import { organizationSchema, localBusinessSchema } from '../lib/jsonld';
import { AnimateIn } from '../components/AnimateIn';

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-nxr-border">
      <button
        className="w-full py-6 flex justify-between items-center text-left focus:outline-none group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span
          className={`text-lg font-medium transition-colors ${isOpen ? 'text-nxr-primary' : 'text-white group-hover:text-nxr-primary'}`}
        >
          {question}
        </span>
        <span
          className={`ml-4 text-nxr-primary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        >
          {isOpen ? <Minus size={20} /> : <Plus size={20} />}
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}
      >
        <p className="text-slate-400 text-sm leading-relaxed pr-8">{answer}</p>
      </div>
    </div>
  );
};

const Contact: React.FC = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'success' | 'error'>('idle');
  const [category, setCategory] = useState<string | null>(null);
  const { isLimited, secondsLeft, recordSubmission } = useRateLimit();

  // Check for product interest from Store page
  useEffect(() => {
    if (location.state && location.state.productInterest) {
      setFormData(prev => ({
        ...prev,
        subject: `Interesse: ${location.state.productInterest}`,
        message: '',
      }));
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Honeypot check
    const formDataObj = new FormData(e.currentTarget);
    if (formDataObj.get('website')) {
      // Abort silently, simulate success
      setStatus('success');
      setFormData({ name: '', email: '', company: '', subject: '', message: '' });
      return;
    }

    if (isLimited) return;

    setStatus('analyzing');

    const fullMessage = `Assunto: ${formData.subject}\n\nMensagem: ${formData.message}`;

    // Simulate AI categorization before "sending"
    let detectedCategory = 'General';
    try {
      detectedCategory = await analyzeMessageIntent(fullMessage);
    } catch (err: unknown) {
      console.warn(err);
    }
    {
      console.warn('AI analysis failed, defaulting to General');
    }
    setCategory(detectedCategory);

    // Save lead to Supabase
    await createLead({
      name: formData.name,
      email: formData.email,
      company: formData.company,
      message: fullMessage,
      category: detectedCategory,
    });

    recordSubmission();
    setStatus('success');
    setFormData({ name: '', email: '', company: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <SEOHead page={SEO_PAGES.contact} jsonLd={[organizationSchema(), localBusinessSchema()]} />
      <div className="pt-20 sm:pt-28 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Fale Connosco" subtitle="Canal de Comunicação Seguro" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
            {/* Contact Info */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-8">Operações Globais</h3>
              <div className="space-y-8">
                <AnimateIn delay={0}>
                  <div className="flex items-start">
                    <MapPin className="w-6 h-6 text-nxr-primary mt-1" />
                    <div className="ml-4">
                      <h4 className="text-white font-semibold">Sede</h4>
                      <p className="text-slate-400 mt-1">
                        {COMPANY_INFO.address.street}, {COMPANY_INFO.address.district}
                        <br />
                        {COMPANY_INFO.address.city}, {COMPANY_INFO.address.country}
                      </p>
                    </div>
                  </div>
                </AnimateIn>
                <AnimateIn delay={80}>
                  <div className="flex items-start">
                    <Mail className="w-6 h-6 text-nxr-primary mt-1" />
                    <div className="ml-4">
                      <h4 className="text-white font-semibold">Email</h4>
                      <a
                        href={COMPANY_INFO.contact.emailLink}
                        className="text-slate-400 mt-1 hover:text-nxr-primary transition-colors block"
                      >
                        {COMPANY_INFO.contact.email}
                      </a>
                    </div>
                  </div>
                </AnimateIn>
                <AnimateIn delay={160}>
                  <div className="flex items-start">
                    <Phone className="w-6 h-6 text-nxr-primary mt-1" />
                    <div className="ml-4">
                      <h4 className="text-white font-semibold">Telefone / WhatsApp</h4>
                      <a
                        href={COMPANY_INFO.contact.phoneLink}
                        className="text-slate-400 mt-1 hover:text-nxr-primary transition-colors block"
                      >
                        {COMPANY_INFO.contact.phone}
                      </a>
                      <a
                        href={COMPANY_INFO.contact.whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-nxr-primary text-xs mt-1 hover:underline block"
                      >
                        Abrir conversa no WhatsApp
                      </a>
                    </div>
                  </div>
                </AnimateIn>
              </div>

              <div className="mt-12 bg-slate-900 border border-slate-800 p-6 rounded-sm">
                <p className="text-xs text-slate-500 font-mono mb-2">
                  ESTADO DO SISTEMA DE COMUNICAÇÕES
                </p>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-white text-sm font-bold">OPERACIONAL</span>
                </div>
                <p className="text-slate-400 text-sm mt-2">
                  Todos os canais encriptados estão ativos. O tempo médio de resposta é de &lt; 2
                  horas.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="bg-nxr-panel p-8 border border-nxr-border relative">
              <h3 className="text-xl font-bold text-white mb-6">Enviar Mensagem</h3>

              {status === 'success' ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="text-green-500 w-8 h-8" />
                  </div>
                  <h4 className="text-white text-lg font-bold">Transmissão Recebida</h4>
                  <p className="text-slate-400 mt-2">
                    A nossa equipa irá desencriptar e rever a sua mensagem em breve.
                    {category && <br />}
                    <span className="text-xs text-nxr-primary font-mono mt-2 block">
                      Categorizado por IA como: {category}
                    </span>
                  </p>
                  <button
                    onClick={() => {
                      setStatus('idle');
                      setCategory(null);
                    }}
                    className="mt-6 text-sm text-nxr-primary hover:text-white underline"
                  >
                    Enviar outra mensagem
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    aria-hidden="true"
                    style={{ position: 'absolute', left: '-9999px', opacity: 0 }}
                  />
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-400 mb-2">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-nxr-dark border border-nxr-border text-white px-4 py-3 focus:outline-none focus:border-nxr-primary focus:ring-1 focus:ring-nxr-primary transition-all"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-slate-400 mb-2"
                    >
                      Email Profissional
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-nxr-dark border border-nxr-border text-white px-4 py-3 focus:outline-none focus:border-nxr-primary focus:ring-1 focus:ring-nxr-primary transition-all"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="company"
                      className="block text-sm font-medium text-slate-400 mb-2"
                    >
                      Empresa
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full bg-nxr-dark border border-nxr-border text-white px-4 py-3 focus:outline-none focus:border-nxr-primary focus:ring-1 focus:ring-nxr-primary transition-all"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-slate-400 mb-2"
                    >
                      Interesse no Produto / Assunto
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full bg-nxr-dark border border-nxr-border text-white px-4 py-3 focus:outline-none focus:border-nxr-primary focus:ring-1 focus:ring-nxr-primary transition-all"
                      placeholder="Ex: Consultoria Geral"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-slate-400 mb-2"
                    >
                      Mensagem
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full bg-nxr-dark border border-nxr-border text-white px-4 py-3 focus:outline-none focus:border-nxr-primary focus:ring-1 focus:ring-nxr-primary transition-all"
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      disabled={status === 'analyzing' || isLimited}
                      className={`w-full bg-nxr-primary text-nxr-dark font-bold py-4 hover:bg-white transition-colors duration-300 ${status === 'analyzing' || isLimited ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {status === 'analyzing'
                        ? 'A Encriptar e Enviar...'
                        : 'Iniciar Contacto Seguro'}
                    </button>
                    {isLimited && (
                      <p className="text-xs text-slate-500 text-center mt-2">
                        Aguarda {Math.floor(secondsLeft / 60)}m {secondsLeft % 60}s para enviar
                        novamente
                      </p>
                    )}
                    <p className="text-xs text-slate-500 text-center mt-4">
                      Ao enviar este formulário, aceitas a nossa{' '}
                      <Link to="/privacy" className="text-nxr-primary hover:underline">
                        Política de Privacidade
                      </Link>
                      .
                    </p>
                  </div>
                </form>
              )}

              {/* Corner Accent */}
              <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-r-[40px] border-t-transparent border-r-nxr-primary/20" />
            </div>
          </div>

          {/* FAQ Section */}
          <section className="max-w-3xl mx-auto">
            <SectionHeader title="FAQ" subtitle="Perguntas Frequentes" align="center" />
            <div className="mt-8">
              <AnimateIn delay={0}>
                <FAQItem
                  question="A NXRSCRIPTS trabalha com pequenas empresas?"
                  answer="Sim, oferecemos pacotes escaláveis adaptados às necessidades de PMEs, garantindo proteção de nível empresarial independentemente da dimensão."
                />
              </AnimateIn>
              <AnimateIn delay={80}>
                <FAQItem
                  question="Qual é o tempo de resposta a incidentes críticos?"
                  answer="Para clientes com contrato SLA Enterprise, o nosso tempo de resposta garantido é inferior a 15 minutos para incidentes de severidade crítica."
                />
              </AnimateIn>
              <AnimateIn delay={160}>
                <FAQItem
                  question="Realizam auditorias de conformidade (GDPR/ISO 27001)?"
                  answer="Absolutamente. A nossa equipa de consultoria está certificada para preparar a sua organização para auditorias de conformidade e regulamentação internacional."
                />
              </AnimateIn>
              <AnimateIn delay={240}>
                <FAQItem
                  question="Como funciona a arquitetura Zero Trust?"
                  answer="O Zero Trust assume que nenhuma entidade (interna ou externa) é confiável por defeito. Implementamos verificação contínua de identidade e privilégios mínimos em todos os pontos de acesso."
                />
              </AnimateIn>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Contact;
