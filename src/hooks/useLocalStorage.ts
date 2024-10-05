import { useState } from 'react';

const isBrowser = typeof window !== 'undefined';

export const useLocalStorage = (key: string, initialValue: string) => {
  const [storedValue, setStoredValue] = useState<string>(() => {
    if (!isBrowser) return initialValue;

    try {
      const item = window.localStorage.getItem(key);
      return item ? item : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: string) => {
    try {
      setStoredValue(value);
      if (isBrowser) {
        window.localStorage.setItem(key, value);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
};