import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '../../lib/supabase';
import { createLead, getLeads } from '../../services/leadService';

describe('createLead', () => {
  it('chama supabase.from("leads").insert() com dados correctos', async () => {
    const mockChain: any = {};
    mockChain.insert = vi.fn().mockReturnValue(mockChain);
    mockChain.select = vi.fn().mockReturnValue(mockChain);
    mockChain.single = vi.fn().mockResolvedValue({ data: { id: 'uuid-1', created_at: new Date().toISOString() }, error: null });
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(mockChain);

    const input = { name: 'João Silva', email: 'joao@empresa.ao', company: 'Empresa', message: 'Preciso de ajuda' };
    await createLead(input);

    expect(supabase.from).toHaveBeenCalledWith('leads');
    expect(mockChain.insert).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ name: 'João Silva', email: 'joao@empresa.ao' })])
    );
  });

  it('retorna null quando Supabase retorna error', async () => {
    const mockChain: any = {};
    mockChain.insert = vi.fn().mockReturnValue(mockChain);
    mockChain.select = vi.fn().mockReturnValue(mockChain);
    mockChain.single = vi.fn().mockResolvedValue({ data: null, error: { message: 'Duplicate email' } });
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(mockChain);

    const result = await createLead({ name: 'Test', email: 'test@test.ao', company: '', message: 'msg' });
    expect(result).toBeNull();
  });
});

describe('getLeads', () => {
  it('chama select com order por created_at descendente', async () => {
    const mockChain: any = {};
    mockChain.select = vi.fn().mockReturnValue(mockChain);
    mockChain.order = vi.fn().mockResolvedValue({ data: [], error: null });
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(mockChain);

    await getLeads();

    expect(supabase.from).toHaveBeenCalledWith('leads');
    expect(mockChain.select).toHaveBeenCalled();
    expect(mockChain.order).toHaveBeenCalledWith('created_at', { ascending: false });
  });

  it('retorna array vazio se não há leads', async () => {
    const mockChain: any = {};
    mockChain.select = vi.fn().mockReturnValue(mockChain);
    mockChain.order = vi.fn().mockResolvedValue({ data: null, error: null });
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(mockChain);

    const result = await getLeads();
    expect(result).toEqual([]);
  });
});
