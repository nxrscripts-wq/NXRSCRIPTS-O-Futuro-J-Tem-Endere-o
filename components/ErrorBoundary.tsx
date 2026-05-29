import React, { useState } from 'react';
import { TerminalSquare, RefreshCw } from 'lucide-react';

interface ErrorFallbackProps {
  error: Error;
  onReset: () => void;
  routeName?: string;
  isAdmin?: boolean;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, onReset, routeName, isAdmin }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-slate-950">
      <TerminalSquare className="w-16 h-16 text-cyan-400 mb-6" />
      <h2 className="text-3xl font-orbitron font-bold text-white tracking-widest uppercase">
        {isAdmin ? 'System Error' : 'Módulo Indisponível'}
      </h2>
      <p className="text-lg font-rajdhani text-slate-400 mt-2 mb-8">
        {routeName ? `O módulo ${routeName}` : 'A aplicação'} encontrou um erro inesperado.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {isAdmin ? (
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 border border-red-500 text-red-500 hover:bg-red-500/10 px-6 py-3 rounded text-sm font-bold uppercase tracking-wider transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Recarregar Página
          </button>
        ) : (
          <button 
            onClick={onReset}
            className="border border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 px-6 py-3 rounded text-sm font-bold uppercase tracking-wider transition-colors"
          >
            Tentar novamente
          </button>
        )}
        
        <button 
          onClick={() => { window.location.href = '/'; }}
          className="text-slate-500 hover:text-slate-300 px-6 py-3 text-sm underline transition-colors"
        >
          Voltar ao início
        </button>
      </div>

      <button 
        onClick={() => setShowDetails(!showDetails)}
        className="text-xs text-slate-600 hover:text-slate-400 transition-colors mb-4"
      >
        {showDetails ? '[-] Ocultar Detalhes Técnicos' : '[+] Mostrar Detalhes Técnicos'}
      </button>

      {showDetails && (
        <div className="bg-slate-900 border border-slate-700 p-4 rounded text-left max-w-2xl w-full overflow-x-auto text-xs font-mono text-cyan-200">
          <p className="font-bold mb-2">Message:</p>
          <p className="whitespace-pre-wrap">{error.message}</p>
        </div>
      )}
    </div>
  );
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  routeName?: string;
  isAdmin?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[NXRSCRIPTS ErrorBoundary]', error, info.componentStack);
    // Future Sentry Integration
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return <ErrorFallback error={this.state.error} onReset={this.handleReset} routeName={this.props.routeName} isAdmin={this.props.isAdmin} />;
    }

    return this.props.children;
  }
}
