import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCoverage, updateProvinceCoverage } from '../services/coverageService';
import { Province, CoverageStatus } from '../types';
import { MapPin, X, Save, ShieldAlert, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_OPTIONS: { value: CoverageStatus; label: string; color: string }[] = [
  { value: 'active', label: 'Activo', color: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30' },
  { value: 'partial', label: 'Parcial', color: 'text-blue-400 bg-blue-400/10 border-blue-400/30' },
  {
    value: 'planned',
    label: 'Planeado',
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
  },
  {
    value: 'none',
    label: 'Sem Cobertura',
    color: 'text-slate-400 bg-slate-400/10 border-slate-400/30',
  },
];

// Predefined list of typical services for quick selection
const AVAILABLE_SERVICES = [
  'Desenvolvimento de Software',
  'Desenvolvimento Web',
  'Desenvolvimento Mobile',
  'Cibersegurança',
  'Redes e Infraestrutura',
  'Telecomunicações',
  'Cloud Computing',
  'Consultoria IT',
  'IA e Automação',
  'Serviços Geridos',
];

export const AdminCoverage: React.FC = () => {
  const [editingProv, setEditingProv] = useState<Province | null>(null);

  // Edit form state
  const [editStatus, setEditStatus] = useState<CoverageStatus>('none');
  const [editServices, setEditServices] = useState<string[]>([]);
  const [editNote, setEditNote] = useState('');

  const queryClient = useQueryClient();

  const { data: provinces = [], isLoading } = useQuery({
    queryKey: ['coverage'],
    queryFn: getCoverage,
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { status: CoverageStatus; services: string[]; note: string | null };
    }) => updateProvinceCoverage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coverage'] });
      toast.success('Cobertura actualizada com sucesso!');
      setEditingProv(null);
    },
    onError: () => {
      toast.error('Erro ao actualizar cobertura.');
    },
  });

  const openEditor = (prov: Province) => {
    setEditingProv(prov);
    setEditStatus(prov.status);
    setEditServices(prov.services || []);
    setEditNote(prov.note || '');
  };

  const toggleService = (svc: string) => {
    setEditServices(prev => (prev.includes(svc) ? prev.filter(s => s !== svc) : [...prev, svc]));
  };

  const handleSave = () => {
    if (!editingProv) return;
    updateMutation.mutate({
      id: editingProv.province_id,
      data: {
        status: editStatus,
        services: editServices,
        note: editNote || null,
      },
    });
  };

  return (
    <div className="flex gap-6 relative">
      {/* Lista Principal */}
      <div
        className={`flex-1 transition-all duration-300 ${editingProv ? 'lg:w-2/3 pr-80 lg:pr-96' : 'w-full'}`}
      >
        <div className="bg-nxr-panel border border-nxr-border rounded-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-nxr-border bg-slate-900/50 flex items-center justify-between">
            <h3 className="text-white font-bold flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-nxr-primary" />
              Gestão de Cobertura Regional
            </h3>
            <p className="text-xs text-slate-400 font-mono">18 PROVÍNCIAS</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="bg-slate-900/50 text-xs uppercase font-mono text-slate-500 border-b border-nxr-border">
                <tr>
                  <th className="px-6 py-4">Província</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4">Serviços Activos</th>
                  <th className="px-6 py-4">Nota/Expansão</th>
                  <th className="px-6 py-4 text-right">Acções</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-nxr-border">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-nxr-primary" />
                    </td>
                  </tr>
                ) : (
                  provinces
                    .sort((a, b) => a.province_name.localeCompare(b.province_name))
                    .map(prov => {
                      const statusOpt = STATUS_OPTIONS.find(s => s.value === prov.status);
                      return (
                        <tr
                          key={prov.id}
                          onClick={() => openEditor(prov)}
                          className={`cursor-pointer transition-colors ${editingProv?.id === prov.id ? 'bg-slate-800' : 'hover:bg-slate-800/50'}`}
                        >
                          <td className="px-6 py-4 font-bold text-white">{prov.province_name}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded text-[10px] font-mono border ${statusOpt?.color || ''}`}
                            >
                              {statusOpt?.label}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {prov.services.length === 0 ? (
                              '-'
                            ) : (
                              <span className="text-xs text-slate-300">
                                {prov.services.length} serviço(s)
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-xs truncate max-w-[200px]" title={prov.note || ''}>
                              {prov.note || '-'}
                            </p>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="text-nxr-primary hover:text-cyan-300 text-xs font-mono underline">
                              Editar
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
      </div>

      {/* Editor Lateral (Drawer) */}
      {editingProv && (
        <div className="fixed lg:absolute inset-y-0 right-0 w-full sm:w-80 lg:w-96 bg-nxr-dark lg:bg-nxr-panel border-l border-nxr-border shadow-2xl lg:shadow-none z-50 lg:z-10 flex flex-col h-full animate-in slide-in-from-right-8 duration-300">
          <div className="px-6 py-4 border-b border-nxr-border flex items-center justify-between bg-slate-900/80 sticky top-0">
            <h4 className="text-white font-bold flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-slate-400" />
              {editingProv.province_name}
            </h4>
            <button
              onClick={() => setEditingProv(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1">
            <div className="mb-6">
              <label className="block text-xs font-mono text-slate-400 mb-2 uppercase tracking-widest">
                Estado de Cobertura
              </label>
              <select
                value={editStatus}
                onChange={e => setEditStatus(e.target.value as CoverageStatus)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white focus:border-nxr-primary focus:outline-none"
              >
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-mono text-slate-400 mb-2 uppercase tracking-widest flex items-center justify-between">
                Serviços Disponíveis
                <span className="text-[10px] text-slate-500">
                  {editServices.length} selecionado(s)
                </span>
              </label>
              <div className="space-y-2 border border-slate-800 rounded p-3 bg-slate-900 max-h-48 overflow-y-auto">
                {AVAILABLE_SERVICES.map(svc => (
                  <label key={svc} className="flex items-start cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={editServices.includes(svc)}
                      onChange={() => toggleService(svc)}
                      className="mt-1 mr-3 rounded border-slate-600 bg-slate-800 text-nxr-primary focus:ring-nxr-primary focus:ring-offset-slate-900"
                    />
                    <span
                      className={`text-sm ${editServices.includes(svc) ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'}`}
                    >
                      {svc}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-mono text-slate-400 mb-2 uppercase tracking-widest">
                Nota Interna / Pública
              </label>
              <textarea
                value={editNote}
                onChange={e => setEditNote(e.target.value)}
                placeholder="Ex: Expansão prevista para Q4 2026..."
                className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-sm text-white focus:border-nxr-primary focus:outline-none min-h-[100px] resize-y"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                A nota será exibida publicamente na página de cobertura.
              </p>
            </div>

            {editingProv.province_id === 'luanda' && editStatus !== 'active' && (
              <div className="p-3 bg-red-900/20 border border-red-900/50 rounded flex items-start mb-4 text-xs text-red-200">
                <ShieldAlert className="w-4 h-4 mr-2 flex-shrink-0 text-red-400" />
                Aviso: Luanda é a sede. Alterar o status pode causar impacto na apresentação
                institucional.
              </div>
            )}
          </div>

          <div className="p-4 border-t border-nxr-border bg-slate-900/80 sticky bottom-0 flex justify-end gap-3">
            <button
              onClick={() => setEditingProv(null)}
              className="px-4 py-2 text-sm text-slate-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="flex items-center px-4 py-2 text-sm bg-nxr-primary text-nxr-dark font-bold rounded hover:bg-cyan-300 disabled:opacity-50"
            >
              {updateMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Guardar Alterações
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
