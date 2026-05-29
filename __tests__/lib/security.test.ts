import { describe, it, expect } from 'vitest';
import { isValidUUID, validateRedirect } from '../../lib/security';

describe('isValidUUID', () => {
  it('aceita UUID v4 válido', () => {
    expect(isValidUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
  });
  it('aceita UUID gerado pelo Supabase', () => {
    expect(isValidUUID('a3bb189e-8bf9-3888-9912-ace4e6543002')).toBe(true);
  });
  it('rejeita string vazia', () => {
    expect(isValidUUID('')).toBe(false);
  });
  it('rejeita UUID malformado — falta segmento', () => {
    expect(isValidUUID('550e8400-e29b-41d4-a716')).toBe(false);
  });
  it('rejeita UUID com caracteres inválidos', () => {
    expect(isValidUUID('550e8400-e29b-41d4-a716-44665544000g')).toBe(false);
  });
  it('rejeita tentativa de SQL injection', () => {
    expect(isValidUUID("'; DROP TABLE leads; --")).toBe(false);
  });
  it('rejeita undefined/null como string', () => {
    expect(isValidUUID('undefined')).toBe(false);
    expect(isValidUUID('null')).toBe(false);
  });
});

describe('validateRedirect', () => {
  it('aceita path interno simples', () => {
    expect(validateRedirect('/dashboard')).toBe('/dashboard');
  });
  it('aceita path com subpágina', () => {
    expect(validateRedirect('/admin/leads')).toBe('/admin/leads');
  });
  it('rejeita URL externa com https', () => {
    expect(validateRedirect('https://evil.com')).toBe('/');
  });
  it('rejeita URL externa com http', () => {
    expect(validateRedirect('http://phishing.com')).toBe('/');
  });
  it('rejeita open redirect com //', () => {
    expect(validateRedirect('//evil.com')).toBe('/');
  });
  it('retorna fallback para undefined', () => {
    expect(validateRedirect(undefined as unknown as string)).toBe('/');
  });
  it('retorna fallback para string vazia', () => {
    expect(validateRedirect('')).toBe('/');
  });
});
