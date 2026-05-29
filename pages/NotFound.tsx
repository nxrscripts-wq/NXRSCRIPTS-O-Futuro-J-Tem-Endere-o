import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>404 — Página Não Encontrada | NXRSCRIPTS</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden px-4">
        <div className="relative z-10 flex flex-col items-center text-center w-full">
          <div
            className="font-orbitron text-[120px] sm:text-[150px] md:text-[200px] leading-none text-slate-800/30 select-none mb-6"
            style={{ WebkitTextStroke: '1px rgba(0, 229, 255, 0.2)' }}
          >
            404
          </div>

          <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent mb-8" />

          <h1 className="font-orbitron text-xl sm:text-2xl text-white tracking-[0.3em] uppercase mb-4">
            Rota Não Encontrada
          </h1>

          <p className="font-rajdhani text-slate-400 text-lg mb-10 max-w-lg">
            O recurso que procuras não existe ou foi movido.
          </p>

          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 font-mono text-xs sm:text-sm text-left max-w-sm w-full mb-10 text-slate-300 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500/50 to-transparent" />
            <div className="flex items-center space-x-2 mb-3 border-b border-slate-800 pb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              <span className="text-[10px] text-slate-500 ml-2">nxr-sys-error</span>
            </div>
            <div className="space-y-2 opacity-80 mt-2">
              <p>
                <span className="text-cyan-400">{'>'}</span> ERROR_CODE:{' '}
                <span className="text-red-400">404_NOT_FOUND</span>
              </p>
              <p className="truncate">
                <span className="text-cyan-400">{'>'}</span> PATH: {window.location.pathname}
              </p>
              <p>
                <span className="text-cyan-400">{'>'}</span> TIMESTAMP: {new Date().toISOString()}
              </p>
              <p>
                <span className="text-cyan-400">{'>'}</span> STATUS:{' '}
                <span className="text-yellow-400">UNRESOLVED</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
            <button
              onClick={() => navigate('/')}
              className="flex-1 py-3.5 px-6 bg-[#00E5FF] text-slate-950 font-bold uppercase tracking-widest text-[11px] hover:bg-white transition-colors"
            >
              ← Voltar ao Início
            </button>
            <button
              onClick={() => navigate('/services')}
              className="flex-1 py-3.5 px-6 bg-transparent text-slate-300 font-bold uppercase tracking-widest text-[11px] border border-slate-700 hover:border-[#00E5FF] hover:text-[#00E5FF] transition-colors"
            >
              Ver Serviços
            </button>
          </div>
        </div>

        {/* Decorative background element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-900/5 rounded-full blur-3xl pointer-events-none" />
      </div>
    </>
  );
};

export default NotFound;
