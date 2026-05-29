import { useEffect, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Lead, LeadStatus } from '../types';

export function useLeadsRealtime() {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const [recentLeadIds, setRecentLeadIds] = useState<Set<string>>(new Set());

  // Helper: check if a lead ID was recently added via Realtime
  const isNewLead = useCallback(
    (id: string) => recentLeadIds.has(id),
    [recentLeadIds]
  );

  useEffect(() => {
    const channel = supabase
      .channel('leads-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'leads' },
        (payload) => {
          // Log para debug (remover em produção)
          console.log('[Realtime] Lead change:', payload.eventType, payload.new);

          if (payload.eventType === 'INSERT' && payload.new) {
            const raw = payload.new as Record<string, unknown>;

            // Optimistic UI: adicionar o novo lead imediatamente no topo
            const optimisticLead: Lead = {
              id: raw.id as string,
              name: raw.name as string,
              email: raw.email as string,
              company: (raw.company as string) || '',
              message: (raw.message as string) || '',
              category: (raw.category as string) || '',
              status: (raw.status as LeadStatus) || 'NEW',
              createdAt: new Date(raw.created_at as string).getTime(),
            };

            queryClient.setQueryData<Lead[]>(['leads'], (old) =>
              old ? [optimisticLead, ...old.filter(l => l.id !== optimisticLead.id)] : [optimisticLead]
            );

            // Marcar o lead como recente para destaque visual
            setRecentLeadIds((prev) => new Set(prev).add(optimisticLead.id));

            // Remover destaque após 3 segundos
            setTimeout(() => {
              setRecentLeadIds((prev) => {
                const next = new Set(prev);
                next.delete(optimisticLead.id);
                return next;
              });
            }, 3000);
          }

          // Invalidar a query para re-fetch automático (garante dados frescos do servidor)
          queryClient.invalidateQueries({ queryKey: ['leads'] });
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
          console.log('[Realtime] Leads channel connected');
        }
        if (status === 'CLOSED') {
          setIsConnected(false);
          console.log('[Realtime] Leads channel closed');
        }
        if (status === 'CHANNEL_ERROR') {
          setIsConnected(false);
          console.error('[Realtime] Leads channel error');
        }
      });

    // Cleanup: desligar o canal ao desmontar
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return { isConnected, isNewLead };
}
