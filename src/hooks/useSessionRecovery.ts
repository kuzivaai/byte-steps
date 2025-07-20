import { useEffect, useCallback } from 'react';
import { usePersistentStorage } from './usePersistentStorage';
import { analytics } from '@/utils/analytics';

interface SessionData {
  currentStep: string;
  assessmentProgress: any;
  moduleProgress: any;
  lastSaved: string;
  userId?: string;
}

export const useSessionRecovery = () => {
  const [sessionData, setSessionData, clearSession] = usePersistentStorage<SessionData | null>(
    'bytesteps-session-recovery',
    null,
    { syncWithServer: true, showSyncStatus: false }
  );

  // Auto-save session data every 30 seconds
  const saveSession = useCallback((data: Partial<SessionData>) => {
    const updatedSession: SessionData = {
      currentStep: data.currentStep || 'start',
      assessmentProgress: data.assessmentProgress || null,
      moduleProgress: data.moduleProgress || null,
      lastSaved: new Date().toISOString(),
      userId: data.userId
    };

    setSessionData(updatedSession);
    analytics.featureUsed('auto_save');
  }, [setSessionData]);

  // Check for existing session on mount
  const checkForSession = useCallback((): SessionData | null => {
    if (!sessionData) return null;

    // Check if session is recent (less than 24 hours old)
    const lastSaved = new Date(sessionData.lastSaved);
    const now = new Date();
    const hoursOld = (now.getTime() - lastSaved.getTime()) / (1000 * 60 * 60);

    if (hoursOld > 24) {
      clearSession();
      return null;
    }

    analytics.featureUsed('session_recovery');
    return sessionData;
  }, [sessionData, clearSession]);

  // Set up auto-save interval and visibility change detection
  useEffect(() => {
    let lastActiveTime = Date.now();
    let syncTimeout: NodeJS.Timeout;

    // Auto-save interval
    const interval = setInterval(() => {
      // Only auto-save if there's existing session data
      if (sessionData && sessionData.currentStep !== 'start') {
        saveSession(sessionData);
      }
    }, 30000); // 30 seconds

    // Handle device sleep/wake and tab switching
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden (user switched tabs or device went to sleep)
        lastActiveTime = Date.now();
        console.log('Page hidden, marking last active time');
      } else {
        // Page is visible again
        const inactiveTime = Date.now() - lastActiveTime;
        
        console.log(`Page visible again after ${Math.round(inactiveTime / 1000)}s`);
        
        // If inactive for more than 5 minutes, sync immediately
        if (inactiveTime > 5 * 60 * 1000) {
          console.log('Device wake detected, syncing data...');
          
          if (sessionData) {
            saveSession(sessionData);
          }
          
          // Show sync notification using analytics (since we don't have direct toast access here)
          analytics.featureUsed('device_wake_sync');
        }
      }
    };

    // Additional sync on window focus (covers more cases than visibility)
    const handleFocus = () => {
      console.log('Window focused, scheduling sync');
      clearTimeout(syncTimeout);
      syncTimeout = setTimeout(() => {
        if (sessionData) {
          saveSession(sessionData);
          analytics.featureUsed('window_focus_sync');
        }
      }, 1000);
    };

    // Handle page unload - save current state
    const handleBeforeUnload = () => {
      if (sessionData) {
        // Synchronous save for beforeunload
        try {
          const updatedSession = {
            ...sessionData,
            lastSaved: new Date().toISOString()
          };
          localStorage.setItem('bytesteps-session-recovery', JSON.stringify(updatedSession));
        } catch (e) {
          console.warn('Failed to save session on unload:', e);
        }
      }
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(interval);
      clearTimeout(syncTimeout);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [sessionData, saveSession]);

  return {
    sessionData,
    saveSession,
    clearSession,
    checkForSession
  };
};