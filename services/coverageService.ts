import { supabase } from '../lib/supabase';
import { Province, CoverageStatus } from '../types';

/** Validates province_id format: only lowercase letters, numbers, and underscores */
const isValidProvinceId = (id: string): boolean => /^[a-z][a-z0-9_]{0,49}$/.test(id);

export const getCoverage = async (): Promise<Province[]> => {
  const { data, error } = await supabase
    .from('province_coverage')
    .select('province_id, province_name, status, services, note, updated_at')
    .order('province_name');

  if (error) throw error;
  return data as Province[];
};

export const updateProvinceCoverage = async (
  provinceId: string,
  updates: { status: CoverageStatus; services: string[]; note: string | null }
): Promise<void> => {
  if (!isValidProvinceId(provinceId)) {
    throw new Error(`[Security] Invalid province ID format: ${provinceId}`);
  }

  const { error } = await supabase
    .from('province_coverage')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('province_id', provinceId);

  if (error) throw error;
};
