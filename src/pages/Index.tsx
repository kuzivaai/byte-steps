import React, { useEffect, useState } from 'react';
import DigitalSkillsCoach from '../components/DigitalSkillsCoach';

const Index = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Small delay to let everything initialize
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    // Global error handler
    const handleError = (event: ErrorEvent) => {
      console.error('Runtime error caught:', event.error);
      setError(`Runtime Error: ${event.error?.message || 'Unknown error'}`);
    };

    window.addEventListener('error', handleError);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('error', handleError);
    };
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-8">
        <div className="max-w-2xl text-center space-y-4">
          <h1 className="text-3xl font-bold text-destructive">Runtime Error Detected</h1>
          <div className="bg-muted p-4 rounded-lg text-left">
            <pre className="text-sm overflow-auto">{error}</pre>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg"
          >
            Reload App
          </button>
          <p className="text-sm text-muted-foreground">
            Check the browser console for more details
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary text-primary-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Loading ByteSteps...</h1>
        </div>
      </div>
    );
  }

  try {
    return <DigitalSkillsCoach />;
  } catch (renderError) {
    console.error('Render error:', renderError);
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-8">
        <div className="max-w-2xl text-center space-y-4">
          <h1 className="text-3xl font-bold text-destructive">Render Error</h1>
          <div className="bg-muted p-4 rounded-lg text-left">
            <pre className="text-sm overflow-auto">{String(renderError)}</pre>
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
};

export default Index;
