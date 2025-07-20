import React, { useState, useEffect } from 'react';
import { Shield, X, Check, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';

interface PrivacyNoticeProps {
  onAccept: (consent: boolean) => void;
}

const PrivacyNotice: React.FC<PrivacyNoticeProps> = ({ onAccept }) => {
  const [showNotice, setShowNotice] = useState(false);
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    // Check if user has already provided consent
    const hasConsent = localStorage.getItem('bytesteps-privacy-consent');
    if (!hasConsent) {
      setShowNotice(true);
    } else {
      onAccept(hasConsent === 'true');
    }
  }, [onAccept]);

  const handleAccept = () => {
    localStorage.setItem('bytesteps-privacy-consent', 'true');
    onAccept(true);
    setShowNotice(false);
  };

  const handleDecline = () => {
    localStorage.setItem('bytesteps-privacy-consent', 'false');
    onAccept(false);
    setShowNotice(false);
  };

  if (!showNotice) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-title"
      aria-describedby="privacy-description"
    >
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" aria-hidden="true" />
              <div>
                <CardTitle id="privacy-title" className="text-xl">
                  Your Privacy Matters
                </CardTitle>
                <CardDescription id="privacy-description" className="text-base">
                  We respect your privacy and want to be transparent about how we handle your information.
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-primary mt-1 flex-shrink-0" aria-hidden="true" />
              <div>
                <h3 className="font-semibold text-lg mb-2">What we collect</h3>
                <ul className="text-base space-y-1 text-muted-foreground">
                  <li>• Your learning progress and preferences (stored locally on your device)</li>
                  <li>• Your postcode (only to find local resources, stored locally)</li>
                  <li>• Anonymous usage statistics to improve our service</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-success mt-1 flex-shrink-0" aria-hidden="true" />
              <div>
                <h3 className="font-semibold text-lg mb-2">What we don't collect</h3>
                <ul className="text-base space-y-1 text-muted-foreground">
                  <li>• Your name, email, or personal details</li>
                  <li>• Information about other websites you visit</li>
                  <li>• Your exact location or GPS coordinates</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold text-lg mb-3">Your Rights</h3>
            <p className="text-base text-muted-foreground leading-relaxed mb-4">
              You can delete all your data at any time by clearing your browser's local storage for this website. 
              You also have the right to request information about any data we may process.
            </p>
            
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox 
                id="consent-checkbox"
                checked={consent}
                onCheckedChange={(checked) => setConsent(checked as boolean)}
                className="h-5 w-5"
                aria-describedby="consent-description"
              />
              <label 
                htmlFor="consent-checkbox" 
                className="text-base leading-relaxed cursor-pointer"
              >
                I understand and agree to this privacy notice
              </label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              onClick={handleAccept}
              disabled={!consent}
              className="text-lg px-6 py-3 flex-1"
              aria-describedby="consent-description"
            >
              Accept & Continue
            </Button>
            <Button 
              variant="outline"
              onClick={handleDecline}
              className="text-lg px-6 py-3"
            >
              Decline
            </Button>
          </div>
          
          <p id="consent-description" className="text-sm text-muted-foreground text-center">
            If you decline, you can still browse the website but some features may be limited.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyNotice;