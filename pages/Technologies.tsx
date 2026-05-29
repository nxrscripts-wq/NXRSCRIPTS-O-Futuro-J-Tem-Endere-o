import React, { useState } from 'react';
import { TECHNOLOGIES } from '../constants';
import { SectionHeader } from '../components/SectionHeader';
import { Cpu, Lock, Zap, Brain } from 'lucide-react';
import { generateSecurityInsight } from '../services/geminiService';
import { SEOHead } from '../components/SEOHead';
import { SEO_PAGES } from '../lib/seo';
import { organizationSchema } from '../lib/jsonld';

const Technologies: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    
    setLoading(true);
    setInsight('');
    
    const result = await generateSecurityInsight(topic);
    setInsight(result);
    setLoading(false);
  };

  return (
    <>
    <SEOHead page={SEO_PAGES.technologies} jsonLd={organizationSchema()} />
    <div className="pt-16 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title="Inovação" subtitle="A Tech Stack da NXR" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">Metodologia de Ponta</h3>
            <div className="space-y-6">
              {TECHNOLOGIES.map((tech) => (
                <div key={tech.name} className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-nxr-primary shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-white">{tech.name}</h4>
                    <span className="text-xs font-mono text-nxr-primary uppercase mb-1 block">{tech.category}</span>
                    <p className="text-slate-400 text-sm">{tech.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-nxr-panel border border-nxr-border p-8 rounded-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-20 h-20 bg-nxr-primary/10 blur-xl"></div>
             <Cpu className="w-12 h-12 text-nxr-primary mb-6" />
             <h3 className="text-2xl font-bold text-white mb-4">Segurança por Design</h3>
             <p className="text-slate-400 leading-relaxed mb-6">
               Não tratamos a segurança como um pensamento secundário. Cada linha de código, cada configuração de servidor e cada rota de rede é estabelecida com uma política de "negar por defeito". A nossa stack utiliza o que há de mais recente em containerização, infraestrutura imutável e verificação criptográfica.
             </p>
             <div className="grid grid-cols-3 gap-4 mt-8 border-t border-nxr-border pt-8">
               <div className="text-center">
                 <div className="text-3xl font-bold text-white">99.9%</div>
                 <div className="text-xs text-slate-500 uppercase mt-1">Uptime</div>
               </div>
               <div className="text-center">
                 <div className="text-3xl font-bold text-white">0</div>
                 <div className="text-xs text-slate-500 uppercase mt-1">Violações</div>
               </div>
               <div className="text-center">
                 <div className="text-3xl font-bold text-white">24/7</div>
                 <div className="text-xs text-slate-500 uppercase mt-1">Monitorização</div>
               </div>
             </div>
          </div>
        </div>

        {/* AI Feature using Gemini */}
        <div className="border border-nxr-primary/30 bg-slate-900/50 p-8 rounded-lg max-w-3xl mx-auto">
          <div className="flex items-center space-x-3 mb-6">
            <Brain className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-bold text-white">NXR Insight de Segurança IA</h3>
          </div>
          <p className="text-slate-400 text-sm mb-6">
            Aproveite o nosso modelo de IA experimental (alimentado pelo Google Gemini) para obter resumos instantâneos sobre tópicos de segurança.
          </p>
          
          <form onSubmit={handleAskAI} className="flex gap-4 mb-6">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ex: Tendências de Ransomware 2024, Zero Trust..."
              className="flex-grow bg-nxr-dark border border-nxr-border text-white px-4 py-3 focus:outline-none focus:border-nxr-primary transition-colors"
            />
            <button 
              type="submit" 
              disabled={loading || !topic}
              className={`px-6 py-3 bg-nxr-primary text-nxr-dark font-bold hover:bg-cyan-400 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'A analisar...' : 'Gerar Insight'}
            </button>
          </form>
          
          {insight && (
            <div className="bg-nxr-panel p-4 border-l-2 border-nxr-primary">
              <p className="text-slate-200 font-mono text-sm leading-relaxed typing-effect">
                {">"} {insight}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
    </>
  );
};

export default Technologies;