import { useState, useEffect } from 'react';

const LIMIT_SECONDS = 120;
const STORAGE_KEY = 'nxr_last_contact';

export const useRateLimit = () => {
  const [isLimited, setIsLimited] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    const checkLimit = () => {
      const lastContactStr = localStorage.getItem(STORAGE_KEY);
      if (!lastContactStr) {
        setIsLimited(false);
        setSecondsLeft(0);
        return;
      }

      const lastContact = parseInt(lastContactStr, 10);
      const now = Date.now();
      const diffSeconds = Math.floor((now - lastContact) / 1000);

      if (diffSeconds < LIMIT_SECONDS) {
        setIsLimited(true);
        setSecondsLeft(LIMIT_SECONDS - diffSeconds);
      } else {
        setIsLimited(false);
        setSecondsLeft(0);
      }
    };

    checkLimit();
    const interval = setInterval(checkLimit, 1000);

    return () => clearInterval(interval);
  }, []);

  const recordSubmission = () => {
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
    setIsLimited(true);
    setSecondsLeft(LIMIT_SECONDS);
  };

  return { isLimited, secondsLeft, recordSubmission };
};
