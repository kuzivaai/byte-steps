import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Enhanced error boundary for debugging
class GlobalErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Global Error Boundary caught an error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Component Stack:', errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-8">
          <div className="max-w-md w-full space-y-4 text-center">
            <h1 className="text-2xl font-bold text-destructive">Something went wrong</h1>
            <details className="text-left">
              <summary className="font-medium cursor-pointer">Error Details</summary>
              <pre className="mt-2 bg-muted p-4 rounded-md text-sm overflow-auto">
                {this.state.error?.toString()}
              </pre>
            </details>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Check for missing imports or runtime issues
try {
  const root = createRoot(document.getElementById("root")!);
  root.render(
    <GlobalErrorBoundary>
      <App />
    </GlobalErrorBoundary>
  );
} catch (error) {
  console.error('Failed to render app:', error);
  document.body.innerHTML = `
    <div class="min-h-screen bg-background text-foreground flex items-center justify-center p-8">
      <div class="max-w-md w-full space-y-4 text-center">
        <h1 class="text-2xl font-bold text-destructive">App Failed to Load</h1>
        <p class="text-muted-foreground">Check the console for details</p>
        <pre class="bg-muted p-4 rounded-md text-sm text-left overflow-auto">${error}</pre>
      </div>
    </div>
  `;
}
