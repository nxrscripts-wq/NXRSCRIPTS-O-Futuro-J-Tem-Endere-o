import { Lead, LeadStatus } from '../types';
import { supabase } from '../lib/supabase';
import { isValidUUID } from '../lib/security';

export const getLeads = async (): Promise<Lead[]> => {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching leads:', error);
    return [];
  }

  return (data || []).map(row => ({
    id: row.id,
    name: row.name,
    email: row.email,
    company: row.company,
    message: row.message,
    category: row.category,
    status: row.status as LeadStatus,
    notes: row.notes || '',
    createdAt: new Date(row.created_at).getTime(),
  }));
};

export const createLead = async (leadData: Omit<Lead, 'id' | 'createdAt' | 'status'>): Promise<Lead | null> => {
  const { data, error } = await supabase
    .from('leads')
    .insert([{
      name: leadData.name,
      email: leadData.email,
      company: leadData.company,
      message: leadData.message,
      category: leadData.category,
      status: 'NEW'
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating lead:', error);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    company: data.company,
    message: data.message,
    category: data.category,
    status: data.status as LeadStatus,
    notes: data.notes || '',
    createdAt: new Date(data.created_at).getTime(),
  };
};

export const updateLeadStatus = async (id: string, status: LeadStatus): Promise<boolean> => {
  if (!isValidUUID(id)) {
    console.error(`[Security] IDOR Prevention: Blocked update with invalid UUID: ${id}`);
    return false;
  }

  const { error } = await supabase
    .from('leads')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error('Error updating lead status:', error);
    return false;
  }
  return true;
};

export const updateLeadNotes = async (id: string, notes: string): Promise<boolean> => {
  if (!isValidUUID(id)) {
    console.error(`[Security] IDOR Prevention: Blocked update with invalid UUID: ${id}`);
    return false;
  }

  const { error } = await supabase
    .from('leads')
    .update({ notes })
    .eq('id', id);

  if (error) {
    console.error('Error updating lead notes:', error);
    throw error;
  }
  return true;
};

export const deleteLead = async (id: string): Promise<boolean> => {
  if (!isValidUUID(id)) {
    console.error(`[Security] IDOR Prevention: Blocked delete with invalid UUID: ${id}`);
    return false;
  }

  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting lead:', error);
    return false;
  }
  return true;
};

export const getLeadStats = async () => {
  const leads = await getLeads();
  return {
    total: leads.length,
    new: leads.filter(l => l.status === 'NEW').length,
    qualified: leads.filter(l => l.status === 'QUALIFIED').length,
    closed: leads.filter(l => l.status === 'CLOSED').length,
  };
};