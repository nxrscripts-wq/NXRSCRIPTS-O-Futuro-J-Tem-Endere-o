import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
            <h1 className="text-8xl md:text-9xl font-black text-nxr-primary tracking-tighter mb-4 animate-pulse drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">404</h1>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 uppercase tracking-widest">
                Página não encontrada
            </h2>
            <p className="text-slate-400 font-mono text-sm mb-10 max-w-md">
                O DIRETÓRIO OU RECURSO QUE TENTASTE ACEDER FOI MOVIDO, ELIMINADO OU NUNCA EXISTIU.
            </p>
            <button
                onClick={() => navigate('/')}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-nxr-panel border border-nxr-primary text-nxr-primary font-bold uppercase tracking-widest text-xs hover:bg-nxr-primary hover:text-nxr-dark transition-all duration-300"
            >
                <Home className="w-4 h-4" />
                <span>Voltar ao Início</span>
            </button>
        </div>
    );
};

export default NotFound;
