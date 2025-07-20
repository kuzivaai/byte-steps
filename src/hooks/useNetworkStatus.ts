import { useState, useEffect } from 'react';

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(() => {
    // Check if navigator is available (SSR safety)
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        setWasOffline(false);
        // Trigger sync when coming back online
        window.dispatchEvent(new CustomEvent('network-reconnected'));
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  return { 
    isOnline, 
    wasOffline,
    connectionType: (navigator as any)?.connection?.effectiveType || 'unknown'
  };
};