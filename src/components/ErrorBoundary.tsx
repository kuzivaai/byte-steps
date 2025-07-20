import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      hasError: true,
      error,
      errorInfo: errorInfo.componentStack
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
          <Card className="w-full max-w-2xl text-center">
            <CardHeader>
              <div className="mx-auto mb-4">
                <AlertTriangle className="h-16 w-16 text-warning" aria-hidden="true" />
              </div>
              <CardTitle className="text-2xl">Something went wrong</CardTitle>
              <CardDescription className="text-lg leading-relaxed">
                We're sorry, but something unexpected happened. Don't worry - your progress is saved 
                and you can try again.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={this.handleRetry}
                  className="text-lg px-6 py-3"
                  aria-label="Try again to continue where you left off"
                >
                  <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
                  Try Again
                </Button>
                <Button 
                  variant="outline"
                  onClick={this.handleReload}
                  className="text-lg px-6 py-3"
                  aria-label="Refresh the page to start fresh"
                >
                  <Home className="h-4 w-4 mr-2" aria-hidden="true" />
                  Start Fresh
                </Button>
              </div>
              
              <details className="text-left mt-6">
                <summary className="cursor-pointer text-base font-medium hover:text-primary">
                  Technical details (for support)
                </summary>
                <div className="mt-2 p-4 bg-muted rounded-lg">
                  <p className="text-sm font-mono break-all">
                    {this.state.error?.message}
                  </p>
                  {this.state.errorInfo && (
                    <pre className="text-xs mt-2 overflow-x-auto">
                      {this.state.errorInfo}
                    </pre>
                  )}
                </div>
              </details>

              <p className="text-base text-muted-foreground mt-6">
                If this keeps happening, please call our helpline or visit your local library for assistance.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;