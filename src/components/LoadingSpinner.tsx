import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = 'Loading...', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div 
      className={`flex flex-col items-center justify-center space-y-2 ${className}`}
      role="status"
      aria-live="polite"
      aria-label={text}
    >
      <Loader2 
        className={`animate-spin text-primary ${sizeClasses[size]}`}
        aria-hidden="true"
      />
      <span className={`text-muted-foreground ${textSizeClasses[size]}`}>
        {text}
      </span>
    </div>
  );
};

export default LoadingSpinner;