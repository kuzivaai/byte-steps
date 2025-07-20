import { useState, useEffect } from 'react';

interface AuditEvent {
  id: string;
  timestamp: string;
  userId: string;
  eventType: 'consent_given' | 'consent_withdrawn' | 'data_accessed' | 'data_deleted' | 'assessment_completed' | 'module_completed' | 'help_requested';
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

interface ConsentRecord {
  id: string;
  userId: string;
  consentGiven: boolean;
  timestamp: string;
  consentVersion: string;
  ipAddress?: string;
  userAgent?: string;
  withdrawnAt?: string;
}

class AuditLogger {
  private static instance: AuditLogger;
  
  static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger();
    }
    return AuditLogger.instance;
  }

  private generateUserId(): string {
    const stored = localStorage.getItem('bytesteps-user-id');
    if (stored) return stored;
    
    const newId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    localStorage.setItem('bytesteps-user-id', newId);
    return newId;
  }

  private getCurrentUserAgent(): string {
    return navigator.userAgent || 'unknown';
  }

  logEvent(eventType: AuditEvent['eventType'], details: Record<string, any> = {}): void {
    const event: AuditEvent = {
      id: 'event_' + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      userId: this.generateUserId(),
      eventType,
      details,
      userAgent: this.getCurrentUserAgent()
    };

    // Store in localStorage (in production, this would go to secure backend)
    const existingEvents = JSON.parse(localStorage.getItem('bytesteps-audit-log') || '[]');
    existingEvents.push(event);
    
    // Keep only last 1000 events to prevent storage bloat
    if (existingEvents.length > 1000) {
      existingEvents.splice(0, existingEvents.length - 1000);
    }
    
    localStorage.setItem('bytesteps-audit-log', JSON.stringify(existingEvents));
    
    console.log('Audit Event Logged:', event);
  }

  logConsentEvent(consentGiven: boolean): void {
    const consentRecord: ConsentRecord = {
      id: 'consent_' + Math.random().toString(36).substr(2, 9),
      userId: this.generateUserId(),
      consentGiven,
      timestamp: new Date().toISOString(),
      consentVersion: '1.0',
      userAgent: this.getCurrentUserAgent()
    };

    const existingConsents = JSON.parse(localStorage.getItem('bytesteps-consent-log') || '[]');
    existingConsents.push(consentRecord);
    localStorage.setItem('bytesteps-consent-log', JSON.stringify(existingConsents));

    this.logEvent(consentGiven ? 'consent_given' : 'consent_withdrawn', {
      consentVersion: '1.0'
    });
  }

  getUserAuditTrail(): AuditEvent[] {
    const userId = this.generateUserId();
    const allEvents = JSON.parse(localStorage.getItem('bytesteps-audit-log') || '[]');
    return allEvents.filter((event: AuditEvent) => event.userId === userId);
  }

  getUserConsentHistory(): ConsentRecord[] {
    const userId = this.generateUserId();
    const allConsents = JSON.parse(localStorage.getItem('bytesteps-consent-log') || '[]');
    return allConsents.filter((consent: ConsentRecord) => consent.userId === userId);
  }

  deleteUserData(): void {
    const userId = this.generateUserId();
    
    // Log the deletion event first
    this.logEvent('data_deleted', { 
      reason: 'user_request',
      deletedData: ['profile', 'progress', 'preferences', 'audit_trail']
    });

    // Remove user-specific data
    localStorage.removeItem('bytesteps-user-profile');
    localStorage.removeItem('bytesteps-completed-modules');
    localStorage.removeItem('bytesteps-accessibility');
    localStorage.removeItem('bytesteps-privacy-consent');
    localStorage.removeItem('bytesteps-help-requests');
    
    // Filter out user's events from logs
    const auditLog = JSON.parse(localStorage.getItem('bytesteps-audit-log') || '[]');
    const filteredAudit = auditLog.filter((event: AuditEvent) => event.userId !== userId);
    localStorage.setItem('bytesteps-audit-log', JSON.stringify(filteredAudit));

    const consentLog = JSON.parse(localStorage.getItem('bytesteps-consent-log') || '[]');
    const filteredConsent = consentLog.filter((consent: ConsentRecord) => consent.userId !== userId);
    localStorage.setItem('bytesteps-consent-log', JSON.stringify(filteredConsent));

    // Generate new user ID for future sessions
    localStorage.removeItem('bytesteps-user-id');
  }
}

export const useAuditLogger = () => {
  const [auditLogger] = useState(() => AuditLogger.getInstance());
  
  return auditLogger;
};

export default AuditLogger;
