import { apiCall } from './apiWrapper';

export const runStressTests = async () => {
  if (import.meta.env.PROD) {
    console.warn('Stress tests are disabled in production');
    return;
  }

  console.log('🧪 Starting ByteSteps stress test suite...');
  const results: { name: string; duration: number; success: boolean; error?: string }[] = [];

  const tests = [
    {
      name: 'Rapid Navigation Simulation',
      test: async () => {
        // Simulate rapid page changes
        const routes = ['assessment', 'modules', 'resources', 'help', 'about'];
        
        for (let i = 0; i < 20; i++) {
          // Simulate route change by updating hash
          window.location.hash = `#/${routes[i % routes.length]}`;
          
          // Simulate component mounting/unmounting
          const event = new CustomEvent('route-change', { 
            detail: { route: routes[i % routes.length] } 
          });
          window.dispatchEvent(event);
          
          // Wait a bit to let React process
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        // Reset hash
        window.location.hash = '';
      }
    },

    {
      name: 'Concurrent Data Operations',
      test: async () => {
        // Simulate multiple simultaneous saves
        const operations = Array(10).fill(0).map((_, i) => 
          apiCall(
            () => new Promise(resolve => {
              // Simulate localStorage operations
              localStorage.setItem(`stress_concurrent_${i}`, JSON.stringify({
                timestamp: Date.now(),
                data: `test_data_${i}`,
                iteration: i
              }));
              
              setTimeout(resolve, Math.random() * 100);
            }),
            { operation: `concurrent_save_${i}` }
          )
        );
        
        await Promise.all(operations);
        
        // Clean up
        for (let i = 0; i < 10; i++) {
          localStorage.removeItem(`stress_concurrent_${i}`);
        }
      }
    },

    {
      name: 'Storage Pressure Test',
      test: async () => {
        const sizePerKey = 100000; // 100KB per key
        const testKeys: string[] = [];
        
        try {
          for (let i = 0; i < 50; i++) {
            const key = `stress_storage_${i}`;
            const data = 'x'.repeat(sizePerKey);
            
            localStorage.setItem(key, data);
            testKeys.push(key);
          }
          
          console.log(`Storage test: Successfully stored ${testKeys.length} keys (${(testKeys.length * sizePerKey / 1000000).toFixed(2)}MB)`);
          
        } catch (e) {
          console.log(`Storage limit reached at ${testKeys.length} keys:`, e);
        } finally {
          // Clean up all test keys
          testKeys.forEach(key => {
            try {
              localStorage.removeItem(key);
            } catch (e) {
              console.warn(`Failed to remove ${key}:`, e);
            }
          });
        }
      }
    },

    {
      name: 'Memory Pressure Test',
      test: async () => {
        const arrays: any[] = [];
        const targetMB = 50; // Try to allocate 50MB
        const chunkSize = 1000000; // 1MB chunks
        
        try {
          for (let i = 0; i < targetMB; i++) {
            // Allocate 1MB array
            const chunk = new Array(chunkSize).fill(`memory_test_${i}`);
            arrays.push(chunk);
            
            // Check if we're approaching memory limits
            if ('memory' in performance) {
              const memoryMB = (performance as any).memory.usedJSHeapSize / 1048576;
              if (memoryMB > 200) {
                console.log(`Memory test stopped at ${i}MB allocated (${memoryMB.toFixed(2)}MB total)`);
                break;
              }
            }
            
            // Allow garbage collection between allocations
            if (i % 10 === 0) {
              await new Promise(resolve => setTimeout(resolve, 10));
            }
          }
          
          console.log(`Memory test: Allocated ${arrays.length}MB in arrays`);
          
        } finally {
          // Clean up
          arrays.length = 0;
          
          // Force garbage collection if available
          if ((window as any).gc) {
            (window as any).gc();
          }
        }
      }
    },

    {
      name: 'Event System Stress Test',
      test: async () => {
        const eventTypes = ['resize', 'scroll', 'click', 'keydown', 'storage'];
        const listeners: Array<{ type: string; listener: () => void }> = [];
        
        // Add many event listeners
        for (let i = 0; i < 100; i++) {
          const eventType = eventTypes[i % eventTypes.length];
          const listener = () => {
            // Simulate some work
            JSON.stringify({ test: i, timestamp: Date.now() });
          };
          
          window.addEventListener(eventType, listener);
          listeners.push({ type: eventType, listener });
        }
        
        // Trigger events rapidly
        for (let i = 0; i < 50; i++) {
          const event = new Event(eventTypes[i % eventTypes.length]);
          window.dispatchEvent(event);
          
          if (i % 10 === 0) {
            await new Promise(resolve => setTimeout(resolve, 1));
          }
        }
        
        // Clean up listeners
        listeners.forEach(({ type, listener }) => {
          window.removeEventListener(type, listener);
        });
      }
    },

    {
      name: 'Component Mount/Unmount Stress',
      test: async () => {
        // Simulate rapid component mounting/unmounting
        const events = [];
        
        for (let i = 0; i < 30; i++) {
          // Simulate component lifecycle events
          events.push(new CustomEvent('component-mount', { detail: { id: i } }));
          events.push(new CustomEvent('component-unmount', { detail: { id: i } }));
        }
        
        // Dispatch events rapidly
        for (const event of events) {
          window.dispatchEvent(event);
          await new Promise(resolve => setTimeout(resolve, 5));
        }
      }
    }
  ];

  // Run each test
  for (const { name, test } of tests) {
    console.log(`🔧 Running: ${name}`);
    const start = performance.now();
    
    try {
      await test();
      const duration = performance.now() - start;
      results.push({ name, duration, success: true });
      console.log(`✅ ${name} completed in ${duration.toFixed(2)}ms`);
      
    } catch (error) {
      const duration = performance.now() - start;
      const errorMessage = error instanceof Error ? error.message : String(error);
      results.push({ name, duration, success: false, error: errorMessage });
      console.error(`❌ ${name} failed:`, error);
    }
    
    // Brief pause between tests
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Summary
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);

  console.log('\n📊 Stress Test Results:');
  console.log(`Tests run: ${results.length}`);
  console.log(`Successful: ${successful}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total duration: ${totalDuration.toFixed(2)}ms`);
  console.log(`Average duration: ${(totalDuration / results.length).toFixed(2)}ms`);
  
  if (failed > 0) {
    console.log('\n❌ Failed tests:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.name}: ${r.error}`);
    });
  }

  // Memory check after tests
  if ('memory' in performance) {
    const memoryMB = (performance as any).memory.usedJSHeapSize / 1048576;
    console.log(`\n🧠 Memory usage after tests: ${memoryMB.toFixed(2)}MB`);
    
    if (memoryMB > 100) {
      console.warn('⚠️ High memory usage detected after stress tests');
    }
  }

  return results;
};

// Auto-run stress tests in development if URL contains ?stress-test
if (import.meta.env.DEV && window.location.search.includes('stress-test')) {
  console.log('Auto-running stress tests due to ?stress-test parameter');
  setTimeout(() => runStressTests(), 2000);
}