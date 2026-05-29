import { Lead } from '../types';

export function groupLeadsByWeek(leads: Lead[]) {
  // Last 8 weeks (56 days)
  const now = new Date();
  const weeks: { week: string; count: number }[] = [];
  
  // Create 8 buckets
  for (let i = 7; i >= 0; i--) {
    weeks.push({
      week: `Sem ${8 - i}`,
      count: 0
    });
  }

  const fiftySixDaysAgo = now.getTime() - 56 * 24 * 60 * 60 * 1000;

  leads.forEach(lead => {
    if (lead.createdAt >= fiftySixDaysAgo) {
      // Find which week bucket it belongs to
      const diffTime = Math.abs(now.getTime() - lead.createdAt);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
      const weekIndex = 7 - Math.floor(diffDays / 7);
      
      if (weekIndex >= 0 && weekIndex < 8) {
        weeks[weekIndex].count++;
      }
    }
  });

  return weeks;
}

export function groupByCategory(leads: Lead[]) {
  const categories = {
    Sales: 0,
    Support: 0,
    Partnership: 0,
    General: 0
  };

  leads.forEach(lead => {
    const cat = (lead.category || 'General').toLowerCase();
    if (cat.includes('sales') || cat.includes('venda')) categories.Sales++;
    else if (cat.includes('support') || cat.includes('suporte')) categories.Support++;
    else if (cat.includes('partner') || cat.includes('parceir')) categories.Partnership++;
    else categories.General++;
  });

  return [
    { name: 'Sales', value: categories.Sales, fill: '#00E5FF' },
    { name: 'Support', value: categories.Support, fill: '#0066FF' },
    { name: 'Partnership', value: categories.Partnership, fill: '#00FF9D' },
    { name: 'General', value: categories.General, fill: '#64748B' }
  ].filter(item => item.value > 0);
}

export function groupByStatus(leads: Lead[]) {
  const counts = {
    NEW: 0,
    CONTACTED: 0,
    QUALIFIED: 0,
    CLOSED: 0
  };

  leads.forEach(lead => {
    if (lead.status === 'NEW') counts.NEW++;
    if (lead.status === 'CONTACTED') counts.CONTACTED++;
    if (lead.status === 'QUALIFIED') counts.QUALIFIED++;
    if (lead.status === 'CLOSED' || lead.status === 'ARCHIVED') counts.CLOSED++;
  });

  return [
    { name: 'Novo', count: counts.NEW, fill: '#D97706' },
    { name: 'Contactado', count: counts.CONTACTED, fill: '#0891B2' },
    { name: 'Qualificado', count: counts.QUALIFIED, fill: '#16A34A' },
    { name: 'Fechado', count: counts.CLOSED, fill: '#64748B' }
  ];
}

export function calcKPIs(leads: Lead[]) {
  const total = leads.length;
  if (total === 0) {
    return {
      total: 0,
      hoje: 0,
      taxaResposta: 0,
      taxaResolucao: 0
    };
  }

  // Taxa de resposta: CONTACTED + QUALIFIED + CLOSED / total
  const respostas = leads.filter(l => ['CONTACTED', 'QUALIFIED', 'CLOSED', 'ARCHIVED'].includes(l.status)).length;
  const taxaResposta = Math.round((respostas / total) * 100);

  // Taxa resolução: QUALIFIED + CLOSED / total
  const resolucoes = leads.filter(l => ['QUALIFIED', 'CLOSED', 'ARCHIVED'].includes(l.status)).length;
  const taxaResolucao = Math.round((resolucoes / total) * 100);

  // Novos hoje
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const hoje = leads.filter(l => l.createdAt >= today.getTime()).length;

  return {
    total,
    hoje,
    taxaResposta,
    taxaResolucao
  };
}
