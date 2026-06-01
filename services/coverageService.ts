import { supabase } from '../lib/supabase';
import { Province, CoverageStatus } from '../types';

export const getCoverage = async (): Promise<Province[]> => {
  const { data, error } = await supabase
    .from('province_coverage')
    .select('*')
    .order('province_name');

  if (error) throw error;
  return data as Province[];
};

export const updateProvinceCoverage = async (
  provinceId: string,
  updates: { status: CoverageStatus; services: string[]; note: string | null }
): Promise<void> => {
  const { error } = await supabase
    .from('province_coverage')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('province_id', provinceId);

  if (error) throw error;
};
