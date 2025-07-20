// Development tools and debugging utilities
import { runStressTests } from './stressTester';
import { perfMonitor } from './performanceMonitor';
import { supabaseCircuitBreaker, storageCircuitBreaker } from './apiWrapper';

// Only available in development
if (import.meta.env.DEV) {
  // Add global debugging functions
  (window as any).ByteStepsDebug = {
    // Performance monitoring
    startPerformanceMonitoring: () => perfMonitor.startMonitoring(),
    stopPerformanceMonitoring: () => perfMonitor.stopMonitoring(),
    getPerformanceMetrics: () => perfMonitor.getMetrics(),

    // Stress testing
    runStressTests,

    // Circuit breakers
    getCircuitBreakerStatus: () => ({
      supabase: supabaseCircuitBreaker.getState(),
      storage: storageCircuitBreaker.getState()
    }),
    resetCircuitBreakers: () => {
      supabaseCircuitBreaker.reset();
      storageCircuitBreaker.reset();
      console.log('All circuit breakers reset');
    },

    // Storage utilities
    clearAllData: () => {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('bytesteps-')) {
          localStorage.removeItem(key);
        }
      });
      console.log('Cleared all ByteSteps data');
    },

    // Memory utilities
    forceGarbageCollection: () => {
      if ((window as any).gc) {
        (window as any).gc();
        console.log('Garbage collection triggered');
      } else {
        console.log('Garbage collection not available (requires --js-flags="--expose-gc")');
      }
    },

    // Storage simulation
    simulateStorageFailure: () => {
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = () => {
        throw new Error('Simulated storage failure');
      };
      
      setTimeout(() => {
        localStorage.setItem = originalSetItem;
        console.log('Storage failure simulation ended');
      }, 10000);
      
      console.log('Simulating storage failure for 10 seconds');
    },

    // Network simulation
    simulateNetworkFailure: (duration = 10000) => {
      const originalFetch = window.fetch;
      window.fetch = () => Promise.reject(new Error('Simulated network failure'));
      
      setTimeout(() => {
        window.fetch = originalFetch;
        console.log('Network failure simulation ended');
      }, duration);
      
      console.log(`Simulating network failure for ${duration}ms`);
    },

    // Help
    help: () => {
      console.log(`
🔧 ByteSteps Debug Tools
========================

Performance:
- ByteStepsDebug.startPerformanceMonitoring()
- ByteStepsDebug.stopPerformanceMonitoring()
- ByteStepsDebug.getPerformanceMetrics()

Testing:
- ByteStepsDebug.runStressTests()
- ByteStepsDebug.simulateStorageFailure()
- ByteStepsDebug.simulateNetworkFailure(duration)

Circuit Breakers:
- ByteStepsDebug.getCircuitBreakerStatus()
- ByteStepsDebug.resetCircuitBreakers()

Storage:
- ByteStepsDebug.clearAllData()

Memory:
- ByteStepsDebug.forceGarbageCollection()

URL Parameters:
- ?stress-test - Auto-run stress tests on load
- ?debug=perf - Enable performance logging
- ?debug=circuit - Enable circuit breaker logging

Console Commands:
- perfMonitor.getMetrics() - Get current performance metrics
- localStorage.getItem('bytesteps-session-recovery') - View session data
      `);
    }
  };

  // Auto-enable features based on URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  
  if (urlParams.get('debug') === 'perf') {
    perfMonitor.startMonitoring();
    console.log('Performance monitoring auto-enabled via URL parameter');
  }

  if (urlParams.get('debug') === 'circuit') {
    // Enable circuit breaker logging
    console.log('Circuit breaker debug mode enabled');
  }

  // Show debug info
  console.log('🔧 ByteSteps Development Mode');
  console.log('Type ByteStepsDebug.help() for available debugging tools');
  
  // Performance baseline
  setTimeout(() => {
    const metrics = perfMonitor.getMetrics();
    console.log('📊 Initial performance metrics:', metrics);
  }, 2000);
}