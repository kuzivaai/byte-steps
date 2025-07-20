import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertTriangle, Info } from 'lucide-react';

export const StorageWarning: React.FC = () => {
  const [isPrivateMode, setIsPrivateMode] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [storageQuota, setStorageQuota] = useState<number | null>(null);

  useEffect(() => {
    // Test localStorage availability
    const testStorage = () => {
      try {
        const test = '__storage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
      } catch (e) {
        return false;
      }
    };

    // Detect private browsing mode
    const detectPrivateMode = async () => {
      const storageWorks = testStorage();
      setStorageAvailable(storageWorks);
      
      let isPrivate = false;
      let quota: number | null = null;

      // Method 1: Storage API (most reliable for modern browsers)
      if (navigator.storage && navigator.storage.estimate) {
        try {
          const estimate = await navigator.storage.estimate();
          quota = estimate.quota || 0;
          setStorageQuota(quota);
          
          // Private mode typically has very limited quota (< 120MB)
          isPrivate = quota < 120000000; // 120MB threshold
        } catch (e) {
          console.warn('Storage estimate failed:', e);
        }
      }

      // Method 2: localStorage quota test (fallback)
      if (!isPrivate && storageWorks) {
        try {
          // Try to use a significant amount of storage
          const testData = 'x'.repeat(1000000); // 1MB
          for (let i = 0; i < 50; i++) {
            localStorage.setItem(`private_test_${i}`, testData);
          }
          // Clean up
          for (let i = 0; i < 50; i++) {
            localStorage.removeItem(`private_test_${i}`);
          }
        } catch (e) {
          // If we can't store 50MB, likely private mode
          isPrivate = true;
        }
      }

      // Method 3: Check for other private mode indicators
      if (!isPrivate) {
        // Check for reduced functionality indicators
        const hasReducedStorage = !storageWorks;
        const hasNoIndexedDB = !window.indexedDB;
        const suspiciousQuota = quota !== null && quota < 50000000; // < 50MB
        
        isPrivate = hasReducedStorage || hasNoIndexedDB || suspiciousQuota;
      }

      setIsPrivateMode(isPrivate);
    };

    detectPrivateMode();
  }, []);

  // Show warning for private mode or no storage
  if (!storageAvailable || isPrivateMode) {
    return (
      <Alert className="mb-6 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertTitle className="text-orange-800 dark:text-orange-200">
          Limited Functionality Mode Detected
        </AlertTitle>
        <AlertDescription className="text-orange-700 dark:text-orange-300">
          <div className="space-y-2">
            <p>
              You appear to be using private/incognito browsing mode or have storage disabled. 
              This affects how ByteSteps can save your progress.
            </p>
            <div className="text-sm space-y-1">
              <p><strong>What this means:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Your progress will only be saved during this browser session</li>
                <li>All data will be lost when you close your browser</li>
                <li>Session recovery won't work between visits</li>
                <li>Some features may have reduced functionality</li>
              </ul>
            </div>
            <div className="text-sm bg-orange-100 dark:bg-orange-800/30 p-3 rounded border border-orange-200 dark:border-orange-700">
              <p><strong>For the full ByteSteps experience:</strong></p>
              <ol className="list-decimal list-inside space-y-1 ml-2 mt-1">
                <li>Close this private/incognito window</li>
                <li>Open ByteSteps in a normal browser window</li>
                <li>Enable cookies and local storage if disabled</li>
              </ol>
            </div>
            {storageQuota !== null && (
              <p className="text-xs text-orange-600 dark:text-orange-400">
                Detected storage quota: {Math.round(storageQuota / 1000000)}MB
              </p>
            )}
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  // Show info about storage for transparency
  if (storageQuota !== null && storageQuota > 120000000) {
    return (
      <Alert className="mb-4 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-700 dark:text-blue-300 text-sm">
          Storage available: {Math.round(storageQuota / 1000000)}MB. 
          Your progress will be saved automatically as you learn.
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};