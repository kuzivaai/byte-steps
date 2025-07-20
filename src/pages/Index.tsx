import React, { useEffect, useState, useRef } from 'react';

// Lazy load components to isolate crash source
const DigitalSkillsCoach = React.lazy(() => import('../components/DigitalSkillsCoach'));

const Index = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadStage, setLoadStage] = useState(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    let timeouts: NodeJS.Timeout[] = [];

    const progressiveLoad = () => {
      // Stage 0: Initial load
      timeouts.push(setTimeout(() => {
        if (!mountedRef.current) return;
        setLoadStage(1);
        console.log('✅ Stage 1: Basic initialization complete');
      }, 100));

      // Stage 1: DOM ready
      timeouts.push(setTimeout(() => {
        if (!mountedRef.current) return;
        setLoadStage(2);
        console.log('✅ Stage 2: DOM stabilized');
      }, 300));

      // Stage 2: Load main component
      timeouts.push(setTimeout(() => {
        if (!mountedRef.current) return;
        setIsLoading(false);
        console.log('✅ Stage 3: Loading main component');
      }, 500));
    };

    // Enhanced error handler with crash detection
    const handleError = (event: ErrorEvent) => {
      console.error('🔴 Runtime error caught at stage', loadStage, ':', event.error);
      console.error('Stack trace:', event.error?.stack);
      
      if (mountedRef.current) {
        setError(`Stage ${loadStage} Error: ${event.error?.message || 'Unknown error'}\n\nStack: ${event.error?.stack || 'No stack trace'}`);
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('🔴 Unhandled promise rejection at stage', loadStage, ':', event.reason);
      
      if (mountedRef.current) {
        setError(`Stage ${loadStage} Promise Rejection: ${event.reason}\n\nThis usually indicates an async operation failed.`);
      }
    };

    // Add comprehensive error listeners
    window.addEventListener('error', handleError, true);
    window.addEventListener('unhandledrejection', handleUnhandledRejection, true);
    
    progressiveLoad();
    
    return () => {
      mountedRef.current = false;
      timeouts.forEach(clearTimeout);
      window.removeEventListener('error', handleError, true);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection, true);
    };
  }, [loadStage]);

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-8">
        <div className="max-w-4xl w-full text-center space-y-6">
          <h1 className="text-3xl font-bold text-destructive">🔍 Crash Analysis Report</h1>
          <div className="bg-muted p-6 rounded-lg text-left">
            <h3 className="font-semibold mb-2">Error Details:</h3>
            <pre className="text-sm overflow-auto whitespace-pre-wrap bg-background p-4 rounded border">
              {error}
            </pre>
          </div>
          <div className="text-sm text-muted-foreground space-y-2">
            <p><strong>Load Stage:</strong> {loadStage}/3</p>
            <p><strong>Analysis:</strong> Crash occurred during stage {loadStage} initialization</p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold"
          >
            Restart Analysis
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    const stageLabels = [
      'Initializing runtime...',
      'Setting up hooks...',
      'Preparing components...'
    ];

    return (
      <div className="min-h-screen bg-primary text-primary-foreground flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🔧</div>
          <h1 className="text-3xl font-bold">ByteSteps Diagnostic Mode</h1>
          <p className="text-xl">{stageLabels[loadStage] || 'Loading...'}</p>
          <div className="bg-white/20 rounded-full h-2 w-64 mx-auto">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${((loadStage + 1) / 3) * 100}%` }}
            />
          </div>
          <p className="text-sm opacity-75">Stage {loadStage + 1} of 3</p>
        </div>
      </div>
    );
  }

  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">Loading ByteSteps...</p>
        </div>
      </div>
    }>
      <DigitalSkillsCoach />
    </React.Suspense>
  );
};

export default Index;
