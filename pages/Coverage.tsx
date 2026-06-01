import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getCoverage } from '../services/coverageService';
import AngolaMap from '../components/AngolaMap';
import { SEOHead } from '../components/SEOHead';
import { SEO_PAGES } from '../lib/seo';
import { ArrowRight, MapPin, Loader2, CheckCircle2, Navigation } from 'lucide-react';
import { AnimateIn } from '../components/AnimateIn';

const Coverage: React.FC = () => {
  const { data: provinces = [], isLoading } = useQuery({
    queryKey: ['coverage'],
    queryFn: getCoverage,
  });

  const activeProvinces = provinces.filter(p => p.status === 'active');
  const partialProvinces = provinces.filter(p => p.status === 'partial');
  const plannedProvinces = provinces.filter(p => p.status === 'planned');

  const coveragePercentage =
    Math.round(((activeProvinces.length + partialProvinces.length) / 18) * 100) || 0;

  return (
    <div className="pt-24 pb-20 min-h-screen bg-nxr-dark font-sans">
      <SEOHead page={SEO_PAGES.home} /> {/* TODO: create specific SEO_PAGES.coverage if needed */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block mb-4 px-3 py-1 rounded-full border border-nxr-primary/30 bg-nxr-primary/5 text-nxr-primary font-mono text-xs tracking-wider uppercase">
            NXRSCRIPTS — Sede: Luanda, Viana
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Cobertura de Serviços</h1>
          <p className="text-lg text-slate-400">
            Presença activa em Angola, com um plano estratégico de expansão contínua para responder
            às necessidades tecnológicas em todas as províncias e na região SADC.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Esquerda: Mapa */}
          <div className="lg:col-span-6">
            <AnimateIn delay={0}>
              <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 sm:p-6 lg:sticky lg:top-28">
                {isLoading ? (
                  <div className="aspect-[4/5] flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-nxr-primary animate-spin" />
                  </div>
                ) : (
                  <AngolaMap provinces={provinces} interactive={false} />
                )}
              </div>
            </AnimateIn>
          </div>

          {/* Direita: Métricas e Lista */}
          <div className="lg:col-span-6 flex flex-col gap-8">
            <AnimateIn delay={100}>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-nxr-panel border border-nxr-border rounded-xl p-4 sm:p-6">
                  <div className="text-cyan-400 text-xs font-mono uppercase mb-2">Activas</div>
                  <div className="text-3xl font-bold text-white">{activeProvinces.length}</div>
                </div>
                <div className="bg-nxr-panel border border-nxr-border rounded-xl p-4 sm:p-6">
                  <div className="text-blue-400 text-xs font-mono uppercase mb-2">Parciais</div>
                  <div className="text-3xl font-bold text-white">{partialProvinces.length}</div>
                </div>
                <div className="bg-nxr-panel border border-nxr-border rounded-xl p-4 sm:p-6">
                  <div className="text-amber-500 text-xs font-mono uppercase mb-2">
                    Em Planeamento
                  </div>
                  <div className="text-3xl font-bold text-white">{plannedProvinces.length}</div>
                </div>
                <div className="bg-nxr-panel border-l-4 border-l-nxr-primary border-y border-r border-r-nxr-border border-y-nxr-border rounded-xl p-4 sm:p-6 relative overflow-hidden">
                  <div className="text-slate-400 text-xs font-mono uppercase mb-2 relative z-10">
                    Cobertura Total
                  </div>
                  <div className="text-3xl font-bold text-white relative z-10">
                    {coveragePercentage}%
                  </div>
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Navigation className="w-16 h-16 text-nxr-primary" />
                  </div>
                </div>
              </div>
            </AnimateIn>

            <AnimateIn delay={200}>
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-5 border-b border-slate-800 bg-slate-950">
                  <h3 className="text-lg font-bold text-white flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-nxr-primary" />
                    Detalhes por Região
                  </h3>
                </div>

                <div className="p-5 flex flex-col gap-6">
                  {/* Activas */}
                  {activeProvinces.length > 0 && (
                    <div>
                      <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-4 flex items-center">
                        <span className="w-2 h-2 rounded-full bg-cyan-500 mr-2 animate-pulse" />
                        Operação Activa
                      </h4>
                      <div className="space-y-4">
                        {activeProvinces
                          .sort((a, _b) => (a.province_id === 'luanda' ? -1 : 1))
                          .map(prov => (
                            <div
                              key={prov.id}
                              className="bg-slate-950 border border-slate-800 rounded-lg p-4"
                            >
                              <h5 className="font-bold text-white text-base mb-2">
                                {prov.province_name}
                              </h5>
                              <div className="flex flex-wrap gap-2 mb-3">
                                {prov.services.map((svc, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-[10px] text-slate-300 font-mono"
                                  >
                                    {svc}
                                  </span>
                                ))}
                              </div>
                              {prov.note && (
                                <p className="text-xs text-slate-500 italic mt-2 border-t border-slate-800 pt-2 flex items-start">
                                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-cyan-600 flex-shrink-0 mt-0.5" />
                                  {prov.note}
                                </p>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Parciais */}
                  {partialProvinces.length > 0 && (
                    <div
                      className={activeProvinces.length > 0 ? 'pt-6 border-t border-slate-800' : ''}
                    >
                      <h4 className="text-xs font-mono text-blue-400 uppercase tracking-widest mb-4 flex items-center">
                        <span className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
                        Operação Parcial
                      </h4>
                      <div className="space-y-3">
                        {partialProvinces.map(prov => (
                          <div
                            key={prov.id}
                            className="flex justify-between items-center bg-slate-950 border border-slate-800 rounded-lg p-3"
                          >
                            <span className="font-semibold text-slate-300 text-sm">
                              {prov.province_name}
                            </span>
                            {prov.note && (
                              <span className="text-xs text-slate-500 italic">{prov.note}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Planeado */}
                  {plannedProvinces.length > 0 && (
                    <div
                      className={
                        activeProvinces.length > 0 || partialProvinces.length > 0
                          ? 'pt-6 border-t border-slate-800'
                          : ''
                      }
                    >
                      <h4 className="text-xs font-mono text-amber-500 uppercase tracking-widest mb-4 flex items-center">
                        <span className="w-2 h-2 rounded-full bg-amber-500 mr-2" />
                        Em Expansão
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {plannedProvinces.map(prov => (
                          <div
                            key={prov.id}
                            className="bg-slate-950 border border-slate-800 border-l-2 border-l-amber-600/30 rounded-lg p-3"
                          >
                            <span className="font-semibold text-slate-400 text-sm block mb-1">
                              {prov.province_name}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono uppercase">
                              {prov.note || 'Expansão planeada'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeProvinces.length === 0 &&
                    partialProvinces.length === 0 &&
                    plannedProvinces.length === 0 &&
                    !isLoading && (
                      <p className="text-slate-500 text-sm text-center py-4">
                        Informação de cobertura não disponível.
                      </p>
                    )}
                </div>
              </div>
            </AnimateIn>

            {/* CTA */}
            <AnimateIn delay={300}>
              <div className="bg-gradient-to-br from-nxr-primary/10 to-nxr-dark border border-nxr-primary/30 rounded-xl p-6 md:p-8 text-center flex flex-col items-center">
                <h3 className="text-xl font-bold text-white mb-3">
                  A tua empresa está noutra província?
                </h3>
                <p className="text-sm text-slate-400 mb-6 max-w-md">
                  A nossa equipa realiza projectos e deslocações para qualquer ponto do país. Fala
                  connosco para analisarmos a viabilidade da operação.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <Link
                    to="/contact"
                    className="px-6 py-3 bg-nxr-primary text-nxr-dark font-bold rounded hover:bg-white transition-colors flex items-center justify-center text-sm"
                  >
                    Contactar Equipa <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                  <a
                    href="https://wa.me/244923479049"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 border border-slate-600 text-white font-medium rounded hover:border-slate-400 transition-colors flex items-center justify-center text-sm"
                  >
                    Falar no WhatsApp
                  </a>
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Coverage;
