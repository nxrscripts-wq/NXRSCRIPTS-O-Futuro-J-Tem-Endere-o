import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useRateLimit } from '../../lib/useRateLimit';

describe('useRateLimit', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => { 
    vi.useRealTimers(); 
  });

  it('não está em rate limit inicialmente', () => {
    const { result } = renderHook(() => useRateLimit());
    expect(result.current.isLimited).toBe(false);
    expect(result.current.secondsLeft).toBe(0);
  });

  it('fica limitado após recordSubmission()', () => {
    const { result } = renderHook(() => useRateLimit());
    act(() => { result.current.recordSubmission(); });
    expect(result.current.isLimited).toBe(true);
    expect(result.current.secondsLeft).toBeGreaterThan(0);
  });

  it('isLimited volta a false após o cooldown', () => {
    // We override the global Date inside timers to verify this
    const { result } = renderHook(() => useRateLimit());
    act(() => { result.current.recordSubmission(); });
    expect(result.current.isLimited).toBe(true);
    
    // Advance 121 seconds (LIMIT_SECONDS is 120 in implementation)
    act(() => { vi.advanceTimersByTime(121000); });
    
    expect(result.current.isLimited).toBe(false);
  });

  it('persiste estado entre renders via localStorage', () => {
    const key = 'nxr_last_contact';
    localStorage.setItem(key, String(Date.now()));
    const { result } = renderHook(() => useRateLimit());
    expect(result.current.isLimited).toBe(true);
  });
});
