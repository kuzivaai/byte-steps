import React, { useEffect, useState } from 'react';
import DigitalSkillsCoach from '../components/DigitalSkillsCoach';

const Index = () => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Minimal error handler - no progressive loading complexity
    const handleError = (event: ErrorEvent) => {
      console.error('Runtime error:', event.error);
      setError(`${event.error?.message || 'Unknown error'}`);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Promise rejection:', event.reason);
      setError(`Promise Error: ${event.reason}`);
    };

    // Add memory monitoring only in preview mode
    let memoryInterval: NodeJS.Timeout | null = null;
    if (import.meta.env.MODE === 'preview') {
      memoryInterval = setInterval(() => {
        if ((performance as any).memory) {
          const used = Math.round((performance as any).memory.usedJSHeapSize / 1048576);
          console.log(`Memory: ${used}MB`);
          if (used > 400) {
            console.warn('🚨 High memory usage detected:', used, 'MB');
          }
        }
      }, 5000); // Check every 5 seconds, not every second
    }

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      if (memoryInterval) clearInterval(memoryInterval);
    };
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-8">
        <div className="max-w-2xl text-center space-y-4">
          <h1 className="text-3xl font-bold text-destructive">Error Detected</h1>
          <div className="bg-muted p-4 rounded-lg text-left">
            <pre className="text-sm overflow-auto">{error}</pre>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg"
          >
            Reload App
          </button>
        </div>
      </div>
    );
  }

  return <DigitalSkillsCoach />;
};

export default Index;
