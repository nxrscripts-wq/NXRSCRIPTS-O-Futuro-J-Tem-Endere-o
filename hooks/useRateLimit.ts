import { useState, useEffect, useCallback } from 'react';

interface RateLimitConfig {
  maxAttempts?: number;
  lockoutDurationMs?: number;
}

export const useRateLimit = ({
  maxAttempts = 3,
  lockoutDurationMs = 60000,
}: RateLimitConfig = {}) => {
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutEndTime, setLockoutEndTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  // Load state from localStorage on mount to persist across page reloads
  useEffect(() => {
    const storedLockout = localStorage.getItem('nxr_admin_lockout');
    const storedAttempts = localStorage.getItem('nxr_admin_attempts');

    if (storedLockout) {
      const endTime = parseInt(storedLockout, 10);
      if (Date.now() < endTime) {
        setIsLocked(true);
        setLockoutEndTime(endTime);
      } else {
        localStorage.removeItem('nxr_admin_lockout');
        localStorage.removeItem('nxr_admin_attempts');
      }
    } else if (storedAttempts) {
      setAttempts(parseInt(storedAttempts, 10));
    }
  }, []);

  // Countdown timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isLocked && lockoutEndTime) {
      // Immediate update
      setTimeLeft(Math.max(0, Math.ceil((lockoutEndTime - Date.now()) / 1000)));

      interval = setInterval(() => {
        const remaining = Math.max(0, Math.ceil((lockoutEndTime - Date.now()) / 1000));
        setTimeLeft(remaining);

        if (remaining <= 0) {
          setIsLocked(false);
          setAttempts(0);
          setLockoutEndTime(null);
          localStorage.removeItem('nxr_admin_lockout');
          localStorage.removeItem('nxr_admin_attempts');
          clearInterval(interval);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLocked, lockoutEndTime]);

  const recordAttempt = useCallback(() => {
    setAttempts(prev => {
      const next = prev + 1;
      localStorage.setItem('nxr_admin_attempts', next.toString());

      if (next >= maxAttempts) {
        const endTime = Date.now() + lockoutDurationMs;
        setIsLocked(true);
        setLockoutEndTime(endTime);
        localStorage.setItem('nxr_admin_lockout', endTime.toString());
      }

      return next;
    });
  }, [maxAttempts, lockoutDurationMs]);

  const resetAttempts = useCallback(() => {
    setAttempts(0);
    setIsLocked(false);
    setLockoutEndTime(null);
    localStorage.removeItem('nxr_admin_lockout');
    localStorage.removeItem('nxr_admin_attempts');
  }, []);

  return {
    isLocked,
    attempts,
    timeLeft,
    recordAttempt,
    resetAttempts,
  };
};
