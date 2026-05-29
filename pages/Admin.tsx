import React, { useState, useMemo } from 'react';
import { getLeads, updateLeadStatus, deleteLead } from '../services/leadService';
import { Lead, LeadStatus } from '../types';
import { Trash2, Filter, ChevronDown, RefreshCw, LayoutDashboard, Download } from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLeadsRealtime } from '../hooks/useLeadsRealtime';

const Admin: React.FC = () => {
    const [filter, setFilter] = useState<'ALL' | LeadStatus>('ALL');
    const queryClient = useQueryClient();
    const { isConnected, isNewLead } = useLeadsRealtime();

    const {
        data: leads = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ['leads'],
        queryFn: getLeads,
    });

    const stats = useMemo(() => ({
        total: leads.length,
        new: leads.filter(l => l.status === 'NEW').length,
        qualified: leads.filter(l => l.status === 'QUALIFIED').length,
        closed: leads.filter(l => l.status === 'CLOSED').length,
    }), [leads]);

    const updateStatus = useMutation({
        mutationFn: ({ id, status }: { id: string; status: LeadStatus }) =>
            updateLeadStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leads'] });
        },
        onError: (err) => {
            console.error('Erro ao actualizar status:', err);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteLead(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ['leads'] });
            const previous = queryClient.getQueryData(['leads']);
            queryClient.setQueryData(['leads'], (old: Lead[] | undefined) =>
                old?.filter(l => l.id !== id) ?? []
            );
            return { previous };
        },
        onError: (_err, _id, context) => {
            queryClient.setQueryData(['leads'], context?.previous);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['leads'] });
        },
    });

    const handleStatusChange = (id: string, newStatus: LeadStatus) => {
        updateStatus.mutate({ id, status: newStatus });
    };

    const handleDelete = (id: string) => {
        if (confirm('Tem a certeza que deseja eliminar este registo?')) {
            deleteMutation.mutate(id);
        }
    };

    const filteredLeads = filter === 'ALL' ? leads : leads.filter(l => l.status === filter);

    const handleExportCSV = () => {
        if (filteredLeads.length === 0) {
            alert("Não existem dados para exportar com o filtro atual.");
            return;
        }

        // Define Headers
        const headers = ['ID', 'Data', 'Nome', 'Email', 'Empresa', 'Categoria', 'Estado', 'Mensagem'];

        // Convert Data to CSV format
        const csvRows = filteredLeads.map(lead => {
            const date = new Date(lead.createdAt).toLocaleDateString('pt-PT') + ' ' + new Date(lead.createdAt).toLocaleTimeString('pt-PT');

            // Helper to escape CSV fields (wrap in quotes, escape internal quotes)
            const escape = (text: string) => `"${(text || '').replace(/"/g, '""')}"`;

            return [
                escape(lead.id),
                escape(date),
                escape(lead.name),
                escape(lead.email),
                escape(lead.company),
                escape(lead.category),
                escape(lead.status),
                escape(lead.message)
            ].join(',');
        });

        // Combine headers and rows
        const csvContent = [headers.join(','), ...csvRows].join('\n');

        // Create Blob and download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `nxr_leads_export_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getStatusColor = (status: LeadStatus) => {
        switch (status) {
            case 'NEW': return 'text-nxr-primary bg-nxr-primary/10 border-nxr-primary/30';
            case 'CONTACTED': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
            case 'QUALIFIED': return 'text-green-400 bg-green-400/10 border-green-400/30';
            case 'CLOSED': return 'text-slate-400 bg-slate-400/10 border-slate-400/30';
            case 'ARCHIVED': return 'text-slate-600 bg-slate-900 border-slate-700';
            default: return 'text-white';
        }
    };

    return (
        <div className="pt-24 pb-24 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center">
                            <LayoutDashboard className="mr-3 text-nxr-primary" />
                            Centro de Comando
                        </h1>
                        <p className="text-slate-500 text-sm font-mono mt-1">PROTOCOLO SEGURO DE GESTÃO DE LEADS</p>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="relative flex h-2.5 w-2.5">
                                {isConnected && (
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                )}
                                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                                    isConnected ? 'bg-green-500' : 'bg-yellow-500'
                                }`}></span>
                            </span>
                            <span className={`text-xs font-mono ${
                                isConnected ? 'text-green-400' : 'text-yellow-400'
                            }`}>
                                {isConnected ? 'Tempo real activo' : 'Reconectando...'}
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleExportCSV}
                            className="flex items-center gap-2 px-4 py-2 bg-nxr-panel border border-nxr-border rounded hover:text-nxr-primary hover:border-nxr-primary transition-colors text-slate-300 text-sm font-medium"
                            title="Exportar dados visíveis para CSV"
                        >
                            <Download className="w-4 h-4" />
                            Exportar CSV
                        </button>
                        <button
                            onClick={() => refetch()}
                            className="p-2 bg-nxr-panel border border-nxr-border rounded hover:text-nxr-primary transition-colors text-slate-300"
                            title="Atualizar dados"
                        >
                            <RefreshCw className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-nxr-panel border border-nxr-border p-4 rounded-sm">
                        <div className="text-slate-400 text-xs font-mono uppercase">Total de Inquéritos</div>
                        <div className="text-3xl font-bold text-white mt-2">{stats.total}</div>
                    </div>
                    <div className="bg-nxr-panel border-l-4 border-l-nxr-primary border-y border-r border-r-nxr-border border-y-nxr-border p-4 rounded-sm">
                        <div className="text-nxr-primary text-xs font-mono uppercase">Novos / Ação Necessária</div>
                        <div className="text-3xl font-bold text-white mt-2">{stats.new}</div>
                    </div>
                    <div className="bg-nxr-panel border border-nxr-border p-4 rounded-sm">
                        <div className="text-green-400 text-xs font-mono uppercase">Alvos Qualificados</div>
                        <div className="text-3xl font-bold text-white mt-2">{stats.qualified}</div>
                    </div>
                    <div className="bg-nxr-panel border border-nxr-border p-4 rounded-sm">
                        <div className="text-slate-500 text-xs font-mono uppercase">Fechado / Arquivado</div>
                        <div className="text-3xl font-bold text-white mt-2">{stats.closed}</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {['ALL', 'NEW', 'CONTACTED', 'QUALIFIED', 'CLOSED'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`px-4 py-1.5 text-xs font-bold rounded-sm border transition-colors ${filter === f
                                    ? 'bg-nxr-primary text-nxr-dark border-nxr-primary'
                                    : 'bg-nxr-panel text-slate-400 border-nxr-border hover:border-slate-500'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Data Table */}
                <div className="bg-nxr-panel border border-nxr-border overflow-hidden rounded-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-400">
                            <thead className="bg-slate-900/50 text-xs uppercase font-mono text-slate-500 border-b border-nxr-border">
                                <tr>
                                    <th className="px-6 py-4">ID / Data</th>
                                    <th className="px-6 py-4">Contacto</th>
                                    <th className="px-6 py-4">Empresa</th>
                                    <th className="px-6 py-4">Intenção (IA)</th>
                                    <th className="px-6 py-4">Estado</th>
                                    <th className="px-6 py-4 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-nxr-border">
                                {isLoading ? (
                                    Array.from({ length: 5 }).map((_, idx) => (
                                        <tr key={`skeleton-${idx}`} className="animate-pulse hover:bg-slate-800/30">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="h-4 bg-slate-800 rounded w-16 mb-2"></div>
                                                <div className="h-4 bg-slate-800 rounded w-24"></div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="h-4 bg-slate-800 rounded w-32 mb-2"></div>
                                                <div className="h-4 bg-slate-800 rounded w-48"></div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="h-4 bg-slate-800 rounded w-28"></div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="h-4 bg-slate-800 rounded w-20"></div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="h-4 bg-slate-800 rounded w-24"></div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="h-4 bg-slate-800 rounded w-8 ml-auto"></div>
                                            </td>
                                        </tr>
                                    ))
                                ) : isError ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <svg className="w-12 h-12 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                                <h3 className="text-xl font-bold text-white mb-2">Erro ao carregar leads</h3>
                                                <p className="text-slate-400 mb-6">{error?.message || 'Não foi possível ligar à base de dados. Tenta novamente.'}</p>
                                                <button 
                                                    onClick={() => refetch()}
                                                    className="px-6 py-2 bg-nxr-primary text-nxr-dark font-bold rounded hover:bg-cyan-400 transition-colors"
                                                >
                                                    Tentar novamente
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredLeads.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <svg className="w-12 h-12 text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                </svg>
                                                <h3 className="text-xl font-bold text-white mb-1">Nenhum lead encontrado</h3>
                                                <p className="text-slate-500">Ajusta os filtros ou aguarda novos contactos</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredLeads.map((lead) => (
                                        <tr key={lead.id} className={`hover:bg-slate-800/30 transition-all duration-500 ${
                                            isNewLead(lead.id)
                                                ? 'border-l-2 border-l-cyan-400 bg-cyan-950/20'
                                                : ''
                                        }`}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-white font-mono text-xs">{lead.id}</div>
                                                <div className="text-slate-600 text-xs mt-1">
                                                    {new Date(lead.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-white">{lead.name}</div>
                                                <div className="text-xs mt-0.5">{lead.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {lead.company || '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-block px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-xs text-cyan-200">
                                                    {lead.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="relative inline-block text-left group">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(lead.status)}`}>
                                                        {lead.status}
                                                        <ChevronDown className="w-3 h-3 ml-1" />
                                                    </span>
                                                    {/* Dropdown for status */}
                                                    <div className="absolute left-0 mt-2 w-36 bg-nxr-dark border border-nxr-border shadow-xl rounded-sm z-50 hidden group-hover:block">
                                                        {['NEW', 'CONTACTED', 'QUALIFIED', 'CLOSED'].map((status) => (
                                                            <button
                                                                key={status}
                                                                onClick={() => handleStatusChange(lead.id, status as LeadStatus)}
                                                                className="block w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-nxr-primary hover:text-nxr-dark"
                                                            >
                                                                {status}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleDelete(lead.id)}
                                                    className="text-slate-600 hover:text-red-500 transition-colors"
                                                    title="Eliminar Lead"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;