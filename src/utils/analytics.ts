import { supabase } from '@/integrations/supabase/client';

interface EventProperties {
  [key: string]: any;
}

export const trackEvent = async (eventName: string, properties: EventProperties = {}) => {
  try {
    // Check consent first
    const hasConsent = localStorage.getItem('bytesteps-privacy-consent');
    if (hasConsent !== 'true') {
      return; // Don't track without consent
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return; // Only track authenticated users
    }

    // Log to audit_logs table for GDPR compliance
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: `analytics_${eventName}`,
      details: {
        event_name: eventName,
        properties,
        timestamp: new Date().toISOString(),
        session_id: sessionStorage.getItem('session_id') || 'anonymous',
        user_agent: navigator.userAgent,
        url: window.location.href,
        referrer: document.referrer,
        screen_resolution: `${screen.width}x${screen.height}`,
        viewport_size: `${window.innerWidth}x${window.innerHeight}`
      }
    });

    console.log(`📊 Event tracked: ${eventName}`, properties);
  } catch (error) {
    console.warn('Failed to track event:', eventName, error);
  }
};

// Pre-defined tracking functions for common events
export const analytics = {
  assessmentStarted: () => trackEvent('assessment_started'),
  
  assessmentCompleted: (duration: number) => trackEvent('assessment_completed', { 
    duration_seconds: duration 
  }),
  
  moduleStarted: (moduleId: string) => trackEvent('module_started', { 
    module_id: moduleId 
  }),
  
  moduleCompleted: (moduleId: string, score?: number, duration?: number) => 
    trackEvent('module_completed', { 
      module_id: moduleId, 
      score, 
      duration_seconds: duration 
    }),
  
  helpRequested: (urgency: string) => trackEvent('help_requested', { 
    urgency 
  }),
  
  errorOccurred: (component: string, errorType: string, errorMessage?: string) => 
    trackEvent('error_occurred', { 
      component, 
      error_type: errorType,
      error_message: errorMessage 
    }),
  
  pageView: (page: string) => trackEvent('page_view', { 
    page 
  }),
  
  featureUsed: (feature: string) => trackEvent('feature_used', { 
    feature 
  }),
  
  sessionStarted: () => trackEvent('session_started'),
  
  sessionEnded: (duration: number) => trackEvent('session_ended', { 
    duration_seconds: duration 
  })
};

// Session tracking
let sessionStartTime = Date.now();

// Track session start
analytics.sessionStarted();

// Track session end on page unload
window.addEventListener('beforeunload', () => {
  const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000);
  analytics.sessionEnded(sessionDuration);
});