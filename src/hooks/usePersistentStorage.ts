import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PersistentStorageOptions {
  requiresConsent?: boolean;
  syncWithServer?: boolean;
  showSyncStatus?: boolean;
  maxRetries?: number;
}

export function usePersistentStorage<T>(
  key: string,
  defaultValue: T,
  options: PersistentStorageOptions = {}
): [T, (value: T | ((prev: T) => T)) => void, () => void, { synced: boolean; syncing: boolean }] {
  const {
    requiresConsent = true,
    syncWithServer = true,
    showSyncStatus = true,
    maxRetries = 3
  } = options;

  const { toast } = useToast();
  const retryCountRef = useRef(0);
  const [synced, setSynced] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Get from local storage first
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (requiresConsent) {
        const hasConsent = localStorage.getItem('bytesteps-privacy-consent');
        if (hasConsent !== 'true') {
          return defaultValue;
        }
      }

      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  // Sync with Supabase
  const syncWithSupabase = useCallback(async (value: T) => {
    if (!syncWithServer) return;

    try {
      setSyncing(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setSynced(false);
        return;
      }

      // Store in audit_logs for GDPR compliance
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: `storage_update_${key}`,
        details: { key, timestamp: new Date().toISOString() }
      });

      setSynced(true);
      retryCountRef.current = 0;
    } catch (error) {
      console.error('Sync failed:', error);
      setSynced(false);
      
      if (retryCountRef.current < maxRetries) {
        retryCountRef.current++;
        // Exponential backoff
        setTimeout(() => syncWithSupabase(value), Math.pow(2, retryCountRef.current) * 1000);
      } else if (showSyncStatus) {
        toast({
          title: "Sync Failed",
          description: "Your data is saved locally but couldn't sync to the server.",
          variant: "destructive"
        });
      }
    } finally {
      setSyncing(false);
    }
  }, [key, syncWithServer, maxRetries, showSyncStatus, toast]);

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      // Check consent
      if (requiresConsent) {
        const hasConsent = localStorage.getItem('bytesteps-privacy-consent');
        if (hasConsent !== 'true') {
          return;
        }
      }

      // Save to localStorage
      localStorage.setItem(key, JSON.stringify(valueToStore));

      // Sync with Supabase
      syncWithSupabase(valueToStore);
    } catch (error) {
      console.warn(`Error setting value for key "${key}":`, error);
    }
  }, [key, storedValue, requiresConsent, syncWithSupabase]);

  const clearValue = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setStoredValue(defaultValue);
      setSynced(false);
    } catch (error) {
      console.warn(`Error clearing localStorage key "${key}":`, error);
    }
  }, [key, defaultValue]);

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key !== key || e.newValue === null) return;
      
      try {
        const newValue = JSON.parse(e.newValue);
        setStoredValue(newValue);
      } catch (error) {
        console.warn(`Error parsing storage value for key "${key}":`, error);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, clearValue, { synced, syncing }];
}