import React, { useState, useMemo } from 'react';
import { getLeads, updateLeadStatus, deleteLead, updateLeadNotes } from '../services/leadService';
import { fetchAllOrdersAdmin } from '../services/storeService';
import { Lead, LeadStatus } from '../types';
import { LeadModal } from '../components/LeadModal';
import { AdminCharts } from '../components/AdminCharts';
import { AdminBlog } from '../components/AdminBlog';
import { AdminProducts } from '../components/AdminProducts';
import { AdminOrders } from '../components/AdminOrders';
import { AdminCoverage } from '../components/AdminCoverage';
import {
  Trash2,
  ChevronDown,
  RefreshCw,
  LayoutDashboard,
  Download,
  List,
  FileText,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLeadsRealtime } from '../hooks/useLeadsRealtime';
import toast from 'react-hot-toast';

const TABS = ['Leads', 'Produtos', 'Requisições', 'Cobertura'] as const;
type AdminTab = (typeof TABS)[number];

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('Leads');
  const [viewMode, setViewMode] = useState<'dashboard' | 'table' | 'blog'>('dashboard');
  const [filter, setFilter] = useState<'ALL' | LeadStatus>('ALL');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const queryClient = useQueryClient();
  const { isConnected, isNewLead } = useLeadsRealtime();

  const {
    data: leads = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['leads'],
    queryFn: getLeads,
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: fetchAllOrdersAdmin,
  });
  const newOrdersCount = orders.filter(o => o.status === 'new').length;

  const stats = useMemo(
    () => ({
      total: leads.length,
      new: leads.filter(l => l.status === 'NEW').length,
      qualified: leads.filter(l => l.status === 'QUALIFIED').length,
      closed: leads.filter(l => l.status === 'CLOSED').length,
    }),
    [leads]
  );

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: LeadStatus }) =>
      updateLeadStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success(`Lead movido para ${variables.status}`);
    },
    onError: err => {
      console.error('Erro ao actualizar status:', err);
      toast.error('Erro ao actualizar status');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteLead(id),
    onMutate: async id => {
      await queryClient.cancelQueries({ queryKey: ['leads'] });
      const previous = queryClient.getQueryData(['leads']);
      queryClient.setQueryData(
        ['leads'],
        (old: Lead[] | undefined) => old?.filter(l => l.id !== id) ?? []
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(['leads'], context?.previous);
      toast.error('Erro ao eliminar lead');
    },
    onSuccess: () => {
      toast.success('Lead eliminado');
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
      if (selectedLead?.id === id) setSelectedLead(null);
    }
  };

  const handleSaveNotes = async (id: string, notes: string) => {
    await updateLeadNotes(id, notes);
    queryClient.invalidateQueries({ queryKey: ['leads'] });
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead({ ...selectedLead, notes });
    }
  };

  const filteredLeads = filter === 'ALL' ? leads : leads.filter(l => l.status === filter);

  const handleExportCSV = () => {
    if (filteredLeads.length === 0) {
      toast.error('Não existem dados para exportar com o filtro atual.');
      return;
    }

    const toastId = toast.loading('A exportar leads...');
    const headers = ['ID', 'Data', 'Nome', 'Email', 'Empresa', 'Categoria', 'Estado', 'Mensagem'];

    const csvRows = filteredLeads.map(lead => {
      const date =
        new Date(lead.createdAt).toLocaleDateString('pt-PT') +
        ' ' +
        new Date(lead.createdAt).toLocaleTimeString('pt-PT');
      const escape = (text: string) => `"${(text || '').replace(/"/g, '""')}"`;
      return [
        escape(lead.id),
        escape(date),
        escape(lead.name),
        escape(lead.email),
        escape(lead.company),
        escape(lead.category),
        escape(lead.status),
        escape(lead.message),
      ].join(',');
    });

    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `nxr_leads_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exportação concluída. ${filteredLeads.length} leads exportados`, {
      id: toastId,
    });
  };

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case 'NEW':
        return 'text-nxr-primary bg-nxr-primary/10 border-nxr-primary/30';
      case 'CONTACTED':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'QUALIFIED':
        return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'CLOSED':
        return 'text-slate-400 bg-slate-400/10 border-slate-400/30';
      case 'ARCHIVED':
        return 'text-slate-600 bg-slate-900 border-slate-700';
      default:
        return 'text-white';
    }
  };

  return (
    <div className="pt-24 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER GERAL */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center">
              <LayoutDashboard className="mr-3 text-nxr-primary" />
              Centro de Comando
            </h1>
            <p className="text-slate-500 text-sm font-mono mt-1">SISTEMA INTEGRADO DE GESTÃO NXR</p>
            {activeTab === 'Leads' && (
              <div className="flex items-center gap-2 mt-2">
                <span className="relative flex h-2.5 w-2.5">
                  {isConnected && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  )}
                  <span
                    className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                      isConnected ? 'bg-green-500' : 'bg-yellow-500'
                    }`}
                  />
                </span>
                <span
                  className={`text-xs font-mono ${
                    isConnected ? 'text-green-400' : 'text-yellow-400'
                  }`}
                >
                  {isConnected ? 'Tempo real activo' : 'Reconectando...'}
                </span>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            {activeTab === 'Leads' && (
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2 bg-nxr-panel border border-nxr-border rounded hover:text-nxr-primary hover:border-nxr-primary transition-colors text-slate-300 text-sm font-medium"
              >
                <Download className="w-4 h-4" /> Exportar CSV
              </button>
            )}
            <button
              onClick={() => {
                if (activeTab === 'Leads') refetch();
                if (activeTab === 'Produtos')
                  queryClient.invalidateQueries({ queryKey: ['admin-products'] });
                if (activeTab === 'Requisições')
                  queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
              }}
              className="p-2 bg-nxr-panel border border-nxr-border rounded hover:text-nxr-primary transition-colors text-slate-300"
              title="Atualizar dados"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TABS NAVEGAÇÃO */}
        <div className="flex gap-2 mb-8 border-b border-slate-800 pb-px">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-6 py-3 border-b-2 text-sm font-bold transition-all ${
                activeTab === tab
                  ? 'border-cyan-500 text-cyan-400 bg-cyan-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-700'
              }`}
            >
              {tab}
              {tab === 'Requisições' && newOrdersCount > 0 && (
                <span className="bg-cyan-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {newOrdersCount}
                </span>
              )}
              {tab === 'Leads' && stats.new > 0 && (
                <span className="bg-nxr-primary text-nxr-dark text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {stats.new}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* CONTEÚDO DAS TABS */}

        {/* --- ABA LEADS --- */}
        {activeTab === 'Leads' && (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div className="flex bg-slate-900 border border-slate-700 rounded-lg p-1 w-fit">
                <button
                  onClick={() => setViewMode('dashboard')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'dashboard'
                      ? 'bg-slate-800 text-cyan-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'table'
                      ? 'bg-slate-800 text-cyan-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <List className="w-4 h-4" /> Tabela de Leads
                </button>
              </div>
              <div className="flex bg-slate-900 border border-slate-700 rounded-lg p-1 w-fit">
                <button
                  onClick={() => setViewMode('blog')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'blog'
                      ? 'bg-slate-800 text-cyan-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-4 h-4" /> Gestão de Blog
                </button>
              </div>
            </div>

            {viewMode === 'blog' ? (
              <AdminBlog />
            ) : viewMode === 'dashboard' ? (
              <AdminCharts leads={leads} />
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-nxr-panel border border-nxr-border p-4 rounded-sm">
                    <div className="text-slate-400 text-xs font-mono uppercase">
                      Total de Inquéritos
                    </div>
                    <div className="text-3xl font-bold text-white mt-2">{stats.total}</div>
                  </div>
                  <div className="bg-nxr-panel border-l-4 border-l-nxr-primary border-y border-r border-r-nxr-border border-y-nxr-border p-4 rounded-sm">
                    <div className="text-nxr-primary text-xs font-mono uppercase">
                      Novos / Ação Necessária
                    </div>
                    <div className="text-3xl font-bold text-white mt-2">{stats.new}</div>
                  </div>
                  <div className="bg-nxr-panel border border-nxr-border p-4 rounded-sm">
                    <div className="text-green-400 text-xs font-mono uppercase">
                      Alvos Qualificados
                    </div>
                    <div className="text-3xl font-bold text-white mt-2">{stats.qualified}</div>
                  </div>
                  <div className="bg-nxr-panel border border-nxr-border p-4 rounded-sm">
                    <div className="text-slate-500 text-xs font-mono uppercase">
                      Fechado / Arquivado
                    </div>
                    <div className="text-3xl font-bold text-white mt-2">{stats.closed}</div>
                  </div>
                </div>

                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                  {['ALL', 'NEW', 'CONTACTED', 'QUALIFIED', 'CLOSED'].map(f => (
                    <button
                      key={f}
                      onClick={() => setFilter(f as 'ALL' | LeadStatus)}
                      className={`px-4 py-1.5 text-xs font-bold rounded-sm border transition-colors ${
                        filter === f
                          ? 'bg-nxr-primary text-nxr-dark border-nxr-primary'
                          : 'bg-nxr-panel text-slate-400 border-nxr-border hover:border-slate-500'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

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
                          <tr>
                            <td colSpan={6} className="px-6 py-12 text-center">
                              A carregar leads...
                            </td>
                          </tr>
                        ) : filteredLeads.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                              Nenhum lead encontrado
                            </td>
                          </tr>
                        ) : (
                          filteredLeads.map(lead => (
                            <tr
                              key={lead.id}
                              onClick={() => setSelectedLead(lead)}
                              className={`cursor-pointer hover:bg-slate-800/50 transition-all duration-500 ${
                                isNewLead(lead.id)
                                  ? 'border-l-2 border-l-cyan-400 bg-cyan-950/20'
                                  : ''
                              }`}
                            >
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
                              <td className="px-6 py-4">{lead.company || '-'}</td>
                              <td className="px-6 py-4">
                                <span className="inline-block px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-xs text-cyan-200">
                                  {lead.category}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="relative inline-block text-left group">
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(lead.status)}`}
                                  >
                                    {lead.status}
                                    <ChevronDown className="w-3 h-3 ml-1" />
                                  </span>
                                  <div className="absolute left-0 mt-2 w-36 bg-nxr-dark border border-nxr-border shadow-xl rounded-sm z-50 hidden group-hover:block">
                                    {['NEW', 'CONTACTED', 'QUALIFIED', 'CLOSED'].map(status => (
                                      <button
                                        key={status}
                                        onClick={e => {
                                          e.stopPropagation();
                                          handleStatusChange(lead.id, status as LeadStatus);
                                        }}
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
                                  onClick={e => {
                                    e.stopPropagation();
                                    handleDelete(lead.id);
                                  }}
                                  className="text-slate-600 hover:text-red-500 transition-colors"
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
              </>
            )}

            {/* Modal de Leads */}
            {selectedLead && (
              <LeadModal
                lead={selectedLead}
                onClose={() => setSelectedLead(null)}
                onStatusChange={handleStatusChange}
                onSaveNotes={handleSaveNotes}
                onDelete={handleDelete}
              />
            )}
          </>
        )}

        {/* --- ABA PRODUTOS --- */}
        {activeTab === 'Produtos' && <AdminProducts />}

        {/* --- ABA REQUISIÇÕES --- */}
        {activeTab === 'Requisições' && <AdminOrders />}

        {/* --- ABA COBERTURA --- */}
        {activeTab === 'Cobertura' && <AdminCoverage />}
      </div>
    </div>
  );
};

export default Admin;
