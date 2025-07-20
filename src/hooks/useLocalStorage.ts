import { useState, useEffect, useCallback, useRef } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  requiresConsent: boolean = true
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Prevent infinite loops with refs
  const isUpdatingRef = useRef(false);
  const currentTabIdRef = useRef(Math.random().toString(36));
  
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
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Memoized setValue to prevent recreating on every render
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    if (isUpdatingRef.current) return; // Prevent loops
    
    try {
      isUpdatingRef.current = true;
      
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
      
      // Save to local storage with tab identifier to prevent self-triggering
      const dataWithTabId = { data: valueToStore, tabId: currentTabIdRef.current };
      window.localStorage.setItem(key, JSON.stringify(dataWithTabId));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    } finally {
      isUpdatingRef.current = false;
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

  // Listen for changes to this key from other tabs/windows ONLY
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // Only respond to storage events from other tabs
      if (e.key !== key || e.newValue === null || isUpdatingRef.current) return;
      
      try {
        const parsed = JSON.parse(e.newValue);
        
        // Check if this update came from this tab (prevent self-triggering)
        if (parsed.tabId === currentTabIdRef.current) return;
        
        // Extract the actual data
        const newValue = parsed.data || parsed; // Handle both old and new format
        setStoredValue(newValue);
      } catch (error) {
        console.warn(`Error parsing localStorage value for key "${key}":`, error);
      }
    };

    // Only listen to storage events (cross-tab changes)
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, clearValue];
}

export default useLocalStorage;