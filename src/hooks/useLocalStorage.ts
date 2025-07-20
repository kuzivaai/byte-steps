import { useState, useEffect, useCallback, useRef } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  requiresConsent: boolean = true
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Use ref to prevent infinite loops
  const isInitialized = useRef(false);
  
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Check for privacy consent if required
      if (requiresConsent) {
        const hasConsent = localStorage.getItem('bytesteps-privacy-consent');
        if (hasConsent !== 'true') {
          return initialValue;
        }
      }

      const item = window.localStorage.getItem(key);
      const result = item ? JSON.parse(item) : initialValue;
      isInitialized.current = true;
      return result;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      isInitialized.current = true;
      return initialValue;
    }
  });

  // Memoized setValue to prevent recreating on every render
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Check for privacy consent if required
      if (requiresConsent) {
        const hasConsent = localStorage.getItem('bytesteps-privacy-consent');
        if (hasConsent !== 'true') {
          return;
        }
      }
      
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue, requiresConsent]);

  // Memoized clearValue
  const clearValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Error clearing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Listen for changes to this key from other tabs/windows
  useEffect(() => {
    if (!isInitialized.current) return;
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = JSON.parse(e.newValue);
          setStoredValue(newValue);
        } catch (error) {
          console.warn(`Error parsing localStorage value for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, clearValue];
}

export default useLocalStorage;