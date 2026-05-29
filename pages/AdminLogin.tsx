import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { validateRedirect } from '../lib/security';
import { Lock, User, ShieldAlert, Loader2 } from 'lucide-react';

const AdminLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            // Open Redirect Protection: Validate the 'next' parameter if present
            const params = new URLSearchParams(location.search);
            const nextPath = params.get('next');
            const safePath = validateRedirect(nextPath, '/admin');

            navigate(safePath);
        } catch (err: any) {
            setError(err.message || 'Falha na autenticação. Verifique os códigos de acesso.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-nxr-dark px-4 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-nxr-primary rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-nxr-primary rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-md w-full">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-4 bg-nxr-primary/10 border border-nxr-primary/20 rounded-full mb-6">
                        <Lock className="w-8 h-8 text-nxr-primary" />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">
                        Acesso <span className="text-nxr-primary italic">Restrito</span>
                    </h1>
                    <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.2em]">
                        Protocolo de Segurança NXR-772
                    </p>
                </div>

                <div className="bg-nxr-panel border border-nxr-border p-8 rounded-sm shadow-2xl relative overflow-hidden group">
                    {/* Scanning Line Effect */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-nxr-primary/50 animate-scan pointer-events-none"></div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-400 text-sm animate-shake">
                            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-xs font-mono text-slate-500 uppercase mb-2 ml-1">
                                Identificador (Email)
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-4 w-4 text-slate-500" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3 bg-nxr-dark border border-nxr-border text-white placeholder-slate-600 focus:outline-none focus:border-nxr-primary focus:ring-1 focus:ring-nxr-primary transition-all duration-300 rounded-sm font-mono text-sm"
                                    placeholder="admin@nxrscripts.co.ao"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-mono text-slate-500 uppercase mb-2 ml-1">
                                Código de Acesso
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-slate-500" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3 bg-nxr-dark border border-nxr-border text-white placeholder-slate-600 focus:outline-none focus:border-nxr-primary focus:ring-1 focus:ring-nxr-primary transition-all duration-300 rounded-sm font-mono text-sm"
                                    placeholder="••••••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full relative group overflow-hidden bg-nxr-primary text-nxr-dark font-black py-4 uppercase tracking-widest text-sm hover:bg-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Validando...
                                    </>
                                ) : (
                                    'Autenticar no Sistema'
                                )}
                            </span>
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-nxr-border text-center">
                        <p className="text-[10px] text-slate-600 font-mono uppercase leading-relaxed">
                            ATENÇÃO: Todas as tentativas de acesso são monitorizadas e encriptadas via AES-256.
                            O uso não autorizado será reportado às autoridades competentes.
                        </p>
                    </div>
                </div>

                <div className="mt-6 flex justify-center">
                    <button
                        onClick={() => navigate('/')}
                        className="text-slate-500 hover:text-white text-xs font-mono uppercase transition-colors"
                    >
                        ← Voltar para Área Pública
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
