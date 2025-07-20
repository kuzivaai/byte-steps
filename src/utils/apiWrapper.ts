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

// Circuit Breaker Pattern for Enhanced Error Recovery
class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  private readonly failureThreshold = 5;
  private readonly recoveryTimeout = 60000; // 1 minute
  private readonly name: string;

  constructor(name: string = 'default') {
    this.name = name;
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    // Check if circuit is open
    if (this.state === 'open') {
      const timeSinceLastFailure = Date.now() - this.lastFailureTime;
      
      if (timeSinceLastFailure > this.recoveryTimeout) {
        console.log(`Circuit breaker ${this.name}: Attempting recovery (half-open)`);
        this.state = 'half-open';
      } else {
        const remainingTime = Math.ceil((this.recoveryTimeout - timeSinceLastFailure) / 1000);
        throw new Error(`Service temporarily unavailable. Retry in ${remainingTime} seconds.`);
      }
    }

    try {
      const result = await operation();
      
      // Success - reset circuit breaker if it was half-open
      if (this.state === 'half-open') {
        console.log(`Circuit breaker ${this.name}: Recovery successful, closing circuit`);
        this.state = 'closed';
        this.failures = 0;
      }
      
      return result;
      
    } catch (error) {
      this.failures++;
      this.lastFailureTime = Date.now();
      
      console.warn(`Circuit breaker ${this.name}: Failure ${this.failures}/${this.failureThreshold}`);
      
      // Open circuit if threshold reached
      if (this.failures >= this.failureThreshold) {
        this.state = 'open';
        console.error(`Circuit breaker ${this.name}: Circuit opened due to ${this.failures} consecutive failures`);
        
        // Log circuit breaker event for monitoring
        await logAuditEvent('circuit_breaker_opened', {
          circuit_name: this.name,
          failure_count: this.failures,
          last_error: error instanceof Error ? error.message : String(error)
        }).catch(() => {}); // Don't let audit logging break the circuit breaker
      }
      
      throw error;
    }
  }

  getState() {
    return {
      state: this.state,
      failures: this.failures,
      lastFailureTime: this.lastFailureTime
    };
  }

  reset() {
    this.state = 'closed';
    this.failures = 0;
    this.lastFailureTime = 0;
    console.log(`Circuit breaker ${this.name}: Manual reset`);
  }
}

// Create circuit breakers for different services
export const supabaseCircuitBreaker = new CircuitBreaker('supabase');
export const storageCircuitBreaker = new CircuitBreaker('storage');

// Enhanced API call with circuit breaker
export const apiCallWithCircuitBreaker = async <T>(
  operation: () => Promise<T>,
  options: ApiCallOptions & { circuitBreaker?: CircuitBreaker } = {}
): Promise<T | null> => {
  const {
    circuitBreaker = supabaseCircuitBreaker,
    ...apiOptions
  } = options;

  try {
    return await circuitBreaker.execute(() => apiCall(operation, apiOptions));
  } catch (error) {
    console.error('Circuit breaker execution failed:', error);
    
    // If circuit is open, show user-friendly message
    if (error instanceof Error && error.message.includes('Service temporarily unavailable')) {
      // Could trigger a toast notification here if needed
      console.warn('Service is temporarily unavailable due to repeated failures');
    }
    
    return null;
  }
};