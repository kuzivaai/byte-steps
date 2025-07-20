import { useToast } from '@/hooks/use-toast';

export class PerformanceMonitor {
  private measurements: Map<string, number> = new Map();
  private memoryCheckInterval: NodeJS.Timeout | null = null;
  private longTaskObserver: PerformanceObserver | null = null;
  private isMonitoring = false;
  private toast: any = null;

  constructor() {
    // Initialize toast if available
    try {
      this.toast = useToast;
    } catch (e) {
      // Toast not available in this context
    }
  }

  startMonitoring() {
    if (this.isMonitoring) return;
    this.isMonitoring = true;

    // Monitor memory usage (Chrome only)
    if ('memory' in performance) {
      this.memoryCheckInterval = setInterval(() => {
        const memory = (performance as any).memory;
        const memoryMB = memory.usedJSHeapSize / 1048576;
        const limitMB = memory.jsHeapSizeLimit / 1048576;
        
        // Log memory usage for debugging
        if (import.meta.env.DEV) {
          console.log(`Memory: ${memoryMB.toFixed(2)}MB / ${limitMB.toFixed(2)}MB`);
        }
        
        // Warning threshold: 100MB
        if (memoryMB > 100) {
          console.warn(`High memory usage: ${memoryMB.toFixed(2)}MB`);
          this.triggerCleanup();
        }
        
        // Critical threshold: 150MB or 70% of limit
        const criticalThreshold = Math.min(150, limitMB * 0.7);
        if (memoryMB > criticalThreshold) {
          this.emergencyCleanup();
        }
      }, 5000); // Check every 5 seconds
    }

    // Monitor long tasks (tasks that block main thread > 50ms)
    if ('PerformanceObserver' in window) {
      try {
        this.longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
              console.warn('Long task detected:', {
                name: entry.name,
                duration: entry.duration,
                startTime: entry.startTime
              });
              
              // Track frequent long tasks
              const taskCount = this.measurements.get('longTasks') || 0;
              this.measurements.set('longTasks', taskCount + 1);
              
              // Alert if too many long tasks
              if (taskCount > 10) {
                console.error('Too many long tasks detected - performance may be degraded');
              }
            }
          }
        });
        
        this.longTaskObserver.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        console.warn('Long task monitoring not available:', e);
      }
    }

    // Monitor navigation timing
    this.trackNavigationPerformance();

    console.log('Performance monitoring started');
  }

  private trackNavigationPerformance() {
    // Track page load performance
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          const metrics = {
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
            firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
            firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
          };

          console.log('Navigation performance:', metrics);
          
          // Warn about slow loading
          if (metrics.domContentLoaded > 3000) {
            console.warn('Slow DOM content loading:', metrics.domContentLoaded);
          }
        }
      }, 1000);
    });
  }

  private triggerCleanup() {
    console.log('Triggering performance cleanup...');
    
    // Clear any cached data that's not essential
    try {
      // Clear old session storage items
      const sessionKeys = Object.keys(sessionStorage);
      sessionKeys.forEach(key => {
        if (key.startsWith('temp_') || key.startsWith('cache_')) {
          sessionStorage.removeItem(key);
        }
      });

      // Clear performance entries older than 5 minutes
      const fiveMinutesAgo = performance.now() - (5 * 60 * 1000);
      performance.clearResourceTimings();
      
      // Force garbage collection if available (Chrome DevTools)
      if ((window as any).gc) {
        (window as any).gc();
      }

      console.log('Performance cleanup completed');
    } catch (e) {
      console.warn('Cleanup failed:', e);
    }
  }

  private emergencyCleanup() {
    console.error('Emergency performance cleanup triggered!');
    
    this.triggerCleanup();
    
    // Clear all non-essential localStorage items
    try {
      const localKeys = Object.keys(localStorage);
      localKeys.forEach(key => {
        // Keep essential keys only
        if (!key.startsWith('bytesteps-')) {
          localStorage.removeItem(key);
        }
      });

      // Show user warning if toast is available
      if (this.toast) {
        try {
          this.toast({
            title: "Performance Notice",
            description: "Clearing temporary data to improve performance",
            variant: "destructive"
          });
        } catch (e) {
          console.warn('Could not show toast:', e);
        }
      }

      // Suggest page reload if memory is still high
      setTimeout(() => {
        if ('memory' in performance) {
          const memoryMB = (performance as any).memory.usedJSHeapSize / 1048576;
          if (memoryMB > 120) {
            console.error('Memory still high after cleanup, suggesting page reload');
            if (confirm('The app is using a lot of memory. Would you like to reload the page to improve performance?')) {
              window.location.reload();
            }
          }
        }
      }, 2000);
      
    } catch (e) {
      console.error('Emergency cleanup failed:', e);
    }
  }

  getMetrics() {
    const metrics: any = Object.fromEntries(this.measurements);
    
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      metrics.memoryUsageMB = memory.usedJSHeapSize / 1048576;
      metrics.memoryLimitMB = memory.jsHeapSizeLimit / 1048576;
    }
    
    return metrics;
  }

  stopMonitoring() {
    if (!this.isMonitoring) return;
    
    this.isMonitoring = false;
    
    if (this.memoryCheckInterval) {
      clearInterval(this.memoryCheckInterval);
      this.memoryCheckInterval = null;
    }
    
    if (this.longTaskObserver) {
      this.longTaskObserver.disconnect();
      this.longTaskObserver = null;
    }
    
    console.log('Performance monitoring stopped');
  }
}

// Global instance
export const perfMonitor = new PerformanceMonitor();
