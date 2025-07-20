import React from 'react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WifiOff, Wifi } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const { isOnline, wasOffline } = useNetworkStatus();

  if (isOnline && !wasOffline) return null;

  return (
    <Alert className={`fixed top-4 right-4 z-50 w-auto ${
      isOnline ? 'bg-success/10 border-success text-success-foreground' : 'bg-destructive/10 border-destructive text-destructive-foreground'
    }`}>
      <div className="flex items-center gap-2">
        {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
        <AlertDescription className="text-sm font-medium">
          {isOnline 
            ? 'Back online - syncing data...' 
            : 'You\'re offline - data will sync when reconnected'
          }
        </AlertDescription>
      </div>
    </Alert>
  );
};