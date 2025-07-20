import { supabase } from '@/integrations/supabase/client';

interface ApiCallOptions {
  onError?: (error: Error) => void;
  retries?: number;
  showUserError?: boolean;
  operation?: string;
}

export const apiCall = async <T>(
  operation: () => Promise<T>,
  options: ApiCallOptions = {}
): Promise<T | null> => {
  const {
    onError,
    retries = 2,
    showUserError = true,
    operation: operationName = 'API call'
  } = options;

  let lastError: Error;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const result = await operation();
      
      // Log successful operation
      await logAuditEvent('api_success', {
        operation: operationName,
        attempt: attempt + 1
      });

      return result;
    } catch (error) {
      lastError = error as Error;
      
      // Log the error
      await logAuditEvent('api_error', {
        operation: operationName,
        attempt: attempt + 1,
        error: lastError.message,
        stack: lastError.stack
      });

      // If this is the last attempt, handle the error
      if (attempt === retries) {
        if (onError) {
          onError(lastError);
        }

        if (showUserError) {
          // Show user-friendly error message
          console.error(`${operationName} failed:`, lastError.message);
        }

        break;
      }

      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }

  return null;
};

// Log audit events for GDPR compliance
const logAuditEvent = async (action: string, details: Record<string, any>) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action,
      details: {
        ...details,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      }
    });
  } catch (error) {
    // Silent fail for audit logging to prevent infinite loops
    console.warn('Failed to log audit event:', error);
  }
};

// Queue for offline operations
class OfflineQueue {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;

  add(operation: () => Promise<any>) {
    this.queue.push(operation);
    this.process();
  }

  private async process() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    
    while (this.queue.length > 0) {
      const operation = this.queue.shift();
      if (operation) {
        try {
          await operation();
        } catch (error) {
          // Re-queue failed operations
          this.queue.unshift(operation);
          break;
        }
      }
    }
    
    this.processing = false;
  }
}

export const offlineQueue = new OfflineQueue();