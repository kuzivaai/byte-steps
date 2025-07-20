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

  // Set up auto-save interval
  useEffect(() => {
    const interval = setInterval(() => {
      // Only auto-save if there's existing session data
      if (sessionData && sessionData.currentStep !== 'start') {
        saveSession(sessionData);
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [sessionData, saveSession]);

  return {
    sessionData,
    saveSession,
    clearSession,
    checkForSession
  };
};