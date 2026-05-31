import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Linkedin, Twitter, Facebook, MessageCircle, Instagram } from 'lucide-react';
import { NAV_ITEMS, COMPANY_INFO } from '../constants';
import { Chatbot } from './Chatbot';

const prefetchRoute = (path: string) => {
  switch (path) {
    case '/':
      import('../pages/Home');
      break;
    case '/about':
      import('../pages/About');
      break;
    case '/services':
      import('../pages/Services');
      break;
    case '/store':
      import('../pages/Store');
      break;
    case '/technologies':
      import('../pages/Technologies');
      break;
    case '/blog':
      import('../pages/Blog');
      break;
    case '/quote':
      import('../pages/Quote');
      break;
    case '/contact':
      import('../pages/Contact');
      break;
  }
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <nav
      ref={navRef}
      className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-nxr-dark/95 backdrop-blur-md border-b border-nxr-border' : 'bg-transparent'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link to="/" className="flex items-center group">
            <img
              src="/nxrscripts-logo.png"
              alt="NXRSCRIPTS"
              width="400"
              height="133"
              loading="eager"
              fetchPriority="high"
              className="h-10 sm:h-16 md:h-24 w-auto aspect-[3/1] object-contain transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]"
            />
          </Link>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {NAV_ITEMS.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  onMouseEnter={() => prefetchRoute(item.path)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:text-nxr-primary ${
                    location.pathname === item.path ? 'text-nxr-primary' : 'text-slate-300'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-nxr-dark border-b border-nxr-border animate-in slide-in-from-top duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {NAV_ITEMS.map(item => (
              <Link
                key={item.path}
                to={item.path}
                onMouseEnter={() => prefetchRoute(item.path)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === item.path
                    ? 'text-nxr-primary bg-nxr-panel'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-nxr-panel border-t border-nxr-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="inline-block mb-4 group">
              <img
                src="/nxrscripts-logo.png"
                alt="NXRSCRIPTS"
                width="400"
                height="133"
                loading="lazy"
                className="h-16 w-auto aspect-[3/1] object-contain transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]"
              />
            </Link>
            <p className="text-nxr-text text-sm leading-relaxed max-w-xs">
              Protegendo a fronteira digital com inteligência avançada e defesa robusta de
              infraestruturas críticas mundiais.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4 tracking-wide uppercase text-xs font-mono">
              Serviços
            </h3>
            <ul className="space-y-2 text-sm text-nxr-text">
              <li>
                <Link to="/services" className="hover:text-nxr-primary transition-colors">
                  Avaliação de Vulnerabilidades
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-nxr-primary transition-colors">
                  Desenvolvimento Seguro
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-nxr-primary transition-colors">
                  Segurança Cloud
                </Link>
              </li>
              <li>
                <Link to="/store" className="hover:text-nxr-primary transition-colors">
                  Hardware Certificado
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4 tracking-wide uppercase text-xs font-mono">
              Empresa
            </h3>
            <ul className="space-y-2 text-sm text-nxr-text">
              <li>
                <Link to="/about" className="hover:text-nxr-primary transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link to="/technologies" className="hover:text-nxr-primary transition-colors">
                  Tecnologias
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-nxr-primary transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-nxr-primary transition-colors">
                  Carreiras
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4 tracking-wide uppercase text-xs font-mono">
              Conecte-se
            </h3>
            <div className="flex space-x-4 mb-6">
              {COMPANY_INFO.social.linkedin && (
                <a
                  href={COMPANY_INFO.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded bg-nxr-border flex items-center justify-center text-nxr-text hover:bg-nxr-primary hover:text-nxr-dark transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={16} />
                </a>
              )}
              {COMPANY_INFO.social.twitter && (
                <a
                  href={COMPANY_INFO.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded bg-nxr-border flex items-center justify-center text-nxr-text hover:bg-nxr-primary hover:text-nxr-dark transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter size={16} />
                </a>
              )}
              {COMPANY_INFO.social.facebook && (
                <a
                  href={COMPANY_INFO.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded bg-nxr-border flex items-center justify-center text-nxr-text hover:bg-nxr-primary hover:text-nxr-dark transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={16} />
                </a>
              )}
              {COMPANY_INFO.social.instagram && (
                <a
                  href={COMPANY_INFO.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded bg-nxr-border flex items-center justify-center text-nxr-text hover:bg-nxr-primary hover:text-nxr-dark transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={16} />
                </a>
              )}
              <a
                href={COMPANY_INFO.contact.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded bg-nxr-border flex items-center justify-center text-nxr-text hover:bg-nxr-primary hover:text-nxr-dark transition-colors"
                aria-label="Whatsapp"
              >
                <MessageCircle size={16} />
              </a>
            </div>
            <p className="text-[10px] text-slate-600 font-mono">ESTADO: SISTEMAS_NOMINAIS</p>
          </div>
        </div>
        <div className="border-t border-nxr-border pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600">
          <div className="flex space-x-6 mb-4 md:mb-0">
            <Link to="/privacy" className="hover:text-slate-400 transition-colors">
              Política de Privacidade
            </Link>
            <Link to="/contact" className="hover:text-slate-400 transition-colors">
              Termos de Serviço
            </Link>
            <Link to="/contact" className="hover:text-slate-400 transition-colors">
              Cookies
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <p>
              ©{' '}
              {COMPANY_INFO.founded === currentYear
                ? currentYear
                : `${COMPANY_INFO.founded}–${currentYear}`}{' '}
              {COMPANY_INFO.name}. Operações Seguras.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-nxr-dark text-slate-300 flex flex-col selection:bg-nxr-primary selection:text-nxr-dark">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      {!location.pathname.startsWith('/admin') && <Chatbot />}
    </div>
  );
};
