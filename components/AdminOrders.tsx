import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Order } from '../types';
import { fetchAllOrdersAdmin, updateOrderStatus, updateOrderNotes } from '../services/storeService';
import { supabase } from '../lib/supabase';
import { Eye, MessageCircle, Mail, X, Save, Box } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminOrders: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>('all');
  const [internalNotes, setInternalNotes] = useState('');

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: fetchAllOrdersAdmin,
  });

  // Supabase Realtime Subscription for Orders
  useEffect(() => {
    const channel = supabase
      .channel('public:orders')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, _payload => {
        queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
        toast('Nova requisição de compra recebida!', { icon: '🛍️' });
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, _payload => {
        queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Order['status'] }) =>
      updateOrderStatus(id, status),
    onSuccess: (_, variables) => {
      toast.success('Status atualizado');
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      if (selectedOrder) {
        setSelectedOrder({ ...selectedOrder, status: variables.status });
      }
    },
    onError: err => toast.error(`Erro: ${(err as Error).message}`),
  });

  const updateNotesMutation = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes: string }) => updateOrderNotes(id, notes),
    onSuccess: (_, variables) => {
      toast.success('Notas guardadas');
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      if (selectedOrder) {
        setSelectedOrder({ ...selectedOrder, notes: variables.notes });
      }
    },
    onError: err => toast.error(`Erro: ${(err as Error).message}`),
  });

  const stats = useMemo(
    () => ({
      total: orders.length,
      new: orders.filter(o => o.status === 'new').length,
      processing: orders.filter(o => o.status === 'processing').length,
      completed: orders.filter(o => o.status === 'completed').length,
    }),
    [orders]
  );

  const filteredOrders =
    statusFilter === 'all' ? orders : orders.filter(o => o.status === statusFilter);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'new':
        return { label: 'Nova', color: 'bg-cyan-900/40 text-cyan-400 border-cyan-500/50' };
      case 'contacted':
        return {
          label: 'Contactado',
          color: 'bg-yellow-900/40 text-yellow-400 border-yellow-500/50',
        };
      case 'processing':
        return { label: 'Em Processo', color: 'bg-blue-900/40 text-blue-400 border-blue-500/50' };
      case 'completed':
        return { label: 'Concluída', color: 'bg-green-900/40 text-green-400 border-green-500/50' };
      case 'cancelled':
        return { label: 'Cancelada', color: 'bg-slate-800 text-slate-400 border-slate-700' };
      default:
        return { label: status, color: 'bg-slate-800 text-slate-400 border-slate-700' };
    }
  };

  const openOrderModal = (order: Order) => {
    setSelectedOrder(order);
    setInternalNotes(order.notes || '');
  };

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1 bg-slate-900 border border-slate-700 p-4 rounded-xl flex flex-col justify-center">
          <h2 className="text-xl font-bold text-white">Requisições</h2>
          <p className="text-sm text-slate-400">Gestão de encomendas da loja</p>
        </div>
        <div className="bg-slate-900 border-l-2 border-cyan-500 border-y border-r border-slate-700 p-4 rounded-xl">
          <div className="text-cyan-400 text-xs font-mono uppercase">Novas Requisições</div>
          <div className="text-3xl font-bold text-white mt-1">{stats.new}</div>
        </div>
        <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl">
          <div className="text-blue-400 text-xs font-mono uppercase">Em Processo</div>
          <div className="text-3xl font-bold text-white mt-1">{stats.processing}</div>
        </div>
        <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl">
          <div className="text-green-400 text-xs font-mono uppercase">Concluídas</div>
          <div className="text-3xl font-bold text-white mt-1">{stats.completed}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700">
        {[
          { value: 'all', label: 'Todas' },
          { value: 'new', label: 'Novas' },
          { value: 'contacted', label: 'Contactado' },
          { value: 'processing', label: 'Em Processo' },
          { value: 'completed', label: 'Concluídas' },
          { value: 'cancelled', label: 'Canceladas' },
        ].map(filter => (
          <button
            key={filter.value}
            onClick={() => setStatusFilter(filter.value as Order['status'] | 'all')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg border transition-colors whitespace-nowrap ${
              statusFilter === filter.value
                ? 'bg-cyan-900 text-cyan-300 border-cyan-500'
                : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-500'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/50 text-xs uppercase font-mono text-slate-500 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Produto</th>
                <th className="px-6 py-4 text-center">Origem</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Acções</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    A carregar requisições...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Nenhuma requisição encontrada.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => {
                  const statusInfo = getStatusInfo(order.status);
                  return (
                    <tr
                      key={order.id}
                      className={`hover:bg-slate-800/30 transition-colors ${order.status === 'new' ? 'bg-cyan-950/10 border-l-2 border-l-cyan-400' : ''}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs text-slate-400">
                          {new Date(order.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {new Date(order.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{order.customer_name}</div>
                        <div className="text-xs text-slate-400">{order.customer_email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className="font-medium text-slate-300 line-clamp-1 max-w-[200px]"
                          title={order.product_name}
                        >
                          {order.quantity}x {order.product_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            order.source === 'whatsapp'
                              ? 'bg-green-900/30 text-green-400'
                              : 'bg-blue-900/30 text-blue-400'
                          }`}
                        >
                          {order.source === 'whatsapp' ? '💬 WhatsApp' : '📋 Formulário'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border ${statusInfo.color}`}
                        >
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => openOrderModal(order)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white text-xs font-medium rounded transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" /> Detalhes
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detalhes Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-950/50">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Box className="w-5 h-5 text-cyan-400" /> Detalhes da Requisição
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                    <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">
                      Dados do Cliente
                    </h4>
                    <p className="text-white font-medium">{selectedOrder.customer_name}</p>
                    <p className="text-slate-400 text-sm mt-1">{selectedOrder.customer_email}</p>
                    {selectedOrder.customer_phone && (
                      <p className="text-slate-400 text-sm mt-1 font-mono">
                        {selectedOrder.customer_phone}
                      </p>
                    )}
                  </div>

                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                    <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">
                      Pedido via {selectedOrder.source}
                    </h4>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-slate-700 flex items-center justify-center shrink-0">
                        {/* selectedOrder.products is joined via relation, if available */}
                        {(selectedOrder as Order & { products?: { cover_image?: string } }).products
                          ?.cover_image ? (
                          <img
                            src={
                              (selectedOrder as Order & { products?: { cover_image?: string } })
                                .products?.cover_image
                            }
                            className="w-full h-full object-cover rounded"
                            alt="cover"
                          />
                        ) : (
                          <Box className="w-4 h-4 text-slate-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm leading-tight">
                          {selectedOrder.product_name}
                        </p>
                        <p className="text-slate-400 text-xs mt-0.5">
                          {selectedOrder.quantity}x •{' '}
                          {selectedOrder.product_price
                            ? `Preço un: ${selectedOrder.product_price.toLocaleString('pt-AO')}`
                            : 'Sob consulta'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                    <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">
                      Gerir Status
                    </h4>
                    <select
                      value={selectedOrder.status}
                      onChange={e =>
                        updateStatusMutation.mutate({
                          id: selectedOrder.id,
                          status: e.target.value as Order['status'],
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-700 text-white px-3 py-2 text-sm rounded focus:outline-none focus:border-cyan-500"
                    >
                      <option value="new">Nova (Pendente)</option>
                      <option value="contacted">Contactado</option>
                      <option value="processing">Em Processo</option>
                      <option value="completed">Concluída</option>
                      <option value="cancelled">Cancelada</option>
                    </select>
                  </div>

                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 flex flex-col gap-2">
                    <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">
                      Contactar
                    </h4>
                    <a
                      href={`https://wa.me/${selectedOrder.customer_phone?.replace(/\D/g, '') || ''}?text=Olá ${selectedOrder.customer_name}, contactamos da NXRSCRIPTS relativamente à sua requisição do produto ${selectedOrder.product_name}.`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-medium rounded transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" /> WhatsApp
                    </a>
                    <a
                      href={`mailto:${selectedOrder.customer_email}?subject=A sua requisição na NXRSCRIPTS - ${selectedOrder.product_name}`}
                      className="flex items-center justify-center gap-2 w-full py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded transition-colors"
                    >
                      <Mail className="w-4 h-4" /> Email
                    </a>
                  </div>
                </div>
              </div>

              {selectedOrder.message && (
                <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/30 mb-6">
                  <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">
                    Mensagem do Cliente
                  </h4>
                  <p className="text-slate-300 text-sm italic border-l-2 border-slate-600 pl-3">
                    "{selectedOrder.message}"
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                  Notas Internas da Equipa (Invisível ao cliente)
                </label>
                <textarea
                  value={internalNotes}
                  onChange={e => setInternalNotes(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-300 px-3 py-2 text-sm rounded focus:outline-none focus:border-cyan-500"
                  placeholder="Ex: Produto encomendado ao fornecedor em X data..."
                />
                <button
                  onClick={() =>
                    updateNotesMutation.mutate({ id: selectedOrder.id, notes: internalNotes })
                  }
                  disabled={updateNotesMutation.isPending || internalNotes === selectedOrder.notes}
                  className="flex items-center gap-2 px-4 py-1.5 bg-slate-800 text-cyan-400 text-xs font-bold uppercase rounded border border-slate-700 hover:bg-slate-700 hover:border-cyan-500/50 disabled:opacity-50 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" /> Gravar Notas
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
