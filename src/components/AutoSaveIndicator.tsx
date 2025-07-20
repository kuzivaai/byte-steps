import React, { useEffect, useState } from 'react';
import { Check, AlertCircle } from 'lucide-react';

interface AutoSaveIndicatorProps {
  lastSaved: Date | null;
  saving?: boolean;
  error?: boolean;
}

export const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({ lastSaved, saving, error }) => {
  const [relativeTime, setRelativeTime] = useState('');

  useEffect(() => {
    if (!lastSaved) return;

    const updateRelativeTime = () => {
      const seconds = Math.floor((Date.now() - lastSaved.getTime()) / 1000);
      
      if (seconds < 5) setRelativeTime('just now');
      else if (seconds < 60) setRelativeTime(`${seconds} seconds ago`);
      else if (seconds < 3600) setRelativeTime(`${Math.floor(seconds / 60)} minutes ago`);
      else setRelativeTime('over an hour ago');
    };

    updateRelativeTime();
    const interval = setInterval(updateRelativeTime, 5000);
    return () => clearInterval(interval);
  }, [lastSaved]);

  if (error) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-100 p-4 rounded-lg shadow-lg flex items-center" role="alert">
        <AlertCircle className="h-6 w-6 text-red-600 mr-2" />
        <span className="text-lg">Unable to save. Please check your connection.</span>
      </div>
    );
  }

  if (saving) {
    return (
      <div className="fixed bottom-4 right-4 bg-blue-100 p-4 rounded-lg shadow-lg flex items-center" role="status">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
        <span className="text-lg">Saving...</span>
      </div>
    );
  }

  if (lastSaved) {
    return (
      <div className="fixed bottom-4 right-4 bg-green-100 p-4 rounded-lg shadow-lg flex items-center" role="status">
        <Check className="h-6 w-6 text-green-600 mr-2" />
        <span className="text-lg">Saved {relativeTime}</span>
      </div>
    );
  }

  return null;
};