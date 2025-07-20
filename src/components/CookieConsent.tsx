import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export const CookieConsent: React.FC = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hasConsent = localStorage.getItem('cookie-consent');
    if (!hasConsent) {
      setShow(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'true');
    setShow(false);
  };

  const rejectCookies = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur-sm border-t shadow-lg">
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Cookie Notice</h3>
              <p className="text-sm text-muted-foreground mb-4">
                We use essential cookies to provide our digital skills learning platform. 
                We also use analytics cookies to understand how you use ByteSteps to improve our service. 
                You can manage your preferences below.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button onClick={acceptCookies} size="sm">
                  Accept All
                </Button>
                <Button onClick={rejectCookies} variant="outline" size="sm">
                  Essential Only
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <a href="/privacy">Privacy Policy</a>
                </Button>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={rejectCookies}
              className="flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};