import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Lead, LeadStatus } from '../types';
import { X, Mail, Trash2, Save, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

interface LeadModalProps {
  lead: Lead | null;
  onClose: () => void;
  onStatusChange: (id: string, status: LeadStatus) => void;
  onSaveNotes: (id: string, notes: string) => Promise<void>;
  onDelete: (id: string) => void;
}

export const LeadModal: React.FC<LeadModalProps> = ({
  lead,
  onClose,
  onStatusChange,
  onSaveNotes,
  onDelete,
}) => {
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lead) {
      setNotes(lead.notes || '');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [lead]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (lead) {
      document.addEventListener('keydown', handleKeyDown);
      // Focus trap basic (focus first input or modal itself)
      modalRef.current?.focus();
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [lead, onClose]);

  if (!lead) return null;

  const handleSaveNotes = async () => {
    setIsSaving(true);
    try {
      await onSaveNotes(lead.id, notes);
      toast.success('Notas guardadas com sucesso');
    } catch (error: unknown) {
      console.error(error);
      toast.error('Erro ao guardar notas');
    } finally {
      setIsSaving(false);
    }
  };

  const getCategoryColor = (category: string) => {
    if (!category) return 'text-slate-400 bg-slate-400/10 border-slate-400/30';
    const cat = category.toLowerCase();
    if (cat.includes('sales') || cat.includes('venda'))
      return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30';
    if (cat.includes('support') || cat.includes('suporte'))
      return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
    if (cat.includes('partner') || cat.includes('parceir'))
      return 'text-green-400 bg-green-400/10 border-green-400/30';
    return 'text-slate-400 bg-slate-400/10 border-slate-400/30';
  };

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case 'NEW':
        return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30';
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

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-xl flex flex-col shadow-2xl focus:outline-none"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-800">
          <div>
            <h2 id="modal-title" className="text-2xl font-bold text-white mb-1">
              {lead.name}{' '}
              <span className="text-slate-500 font-normal">
                {lead.company && `— ${lead.company}`}
              </span>
            </h2>
            <div className="flex items-center gap-3 mt-3">
              <span
                className={`px-2.5 py-0.5 rounded text-xs font-medium border ${getCategoryColor(lead.category)}`}
              >
                {lead.category || 'Geral'}
              </span>

              <div className="relative inline-block text-left group">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium border cursor-pointer ${getStatusColor(lead.status)}`}
                >
                  {lead.status}
                  <ChevronDown className="w-3 h-3 ml-1" />
                </span>
                <div className="absolute left-0 mt-1 w-36 bg-slate-800 border border-slate-700 shadow-xl rounded z-50 hidden group-hover:block">
                  {['NEW', 'CONTACTED', 'QUALIFIED', 'CLOSED', 'ARCHIVED'].map(status => (
                    <button
                      key={status}
                      onClick={() => onStatusChange(lead.id, status as LeadStatus)}
                      className="block w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-700 hover:text-white"
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <span className="text-xs text-slate-500 font-mono ml-2">
                {new Date(lead.createdAt).toLocaleString('pt-PT')}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1"
            aria-label="Fechar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-6">
          {/* Contact Info */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Informação de Contacto
            </h3>
            <div className="flex gap-4">
              <a
                href={`mailto:${lead.email}`}
                className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <Mail className="w-4 h-4" />
                {lead.email}
              </a>
            </div>
          </div>

          <hr className="border-slate-800" />

          {/* Original Message */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Mensagem Original
            </h3>
            <div className="bg-slate-800 rounded-lg p-4 text-slate-300 font-mono text-[13px] whitespace-pre-wrap leading-relaxed">
              {lead.message || (
                <span className="italic text-slate-500">Sem mensagem original.</span>
              )}
            </div>
          </div>

          <hr className="border-slate-800" />

          {/* Internal Notes */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Notas Internas
            </h3>
            <textarea
              className="w-full h-32 bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-y"
              placeholder="Adicionar notas internas sobre esta lead..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
            <div className="flex justify-end mt-3">
              <button
                onClick={handleSaveNotes}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-400 text-sm font-medium rounded transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'A guardar...' : 'Guardar notas'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 flex justify-between items-center bg-slate-900/50 rounded-b-xl">
          <button
            onClick={() => {
              if (confirm('Tem a certeza absoluta que deseja eliminar esta lead?')) {
                onDelete(lead.id);
                onClose();
              }
            }}
            className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded transition-colors text-sm font-medium"
          >
            <Trash2 className="w-4 h-4" />
            Eliminar lead
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
