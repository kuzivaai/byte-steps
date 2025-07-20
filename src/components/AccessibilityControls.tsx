import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Eye, EyeOff, Type, Volume2, VolumeX, Settings, X } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  speechEnabled: boolean;
}

interface AccessibilityControlsProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccessibilityControls: React.FC<AccessibilityControlsProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useLocalStorage<AccessibilitySettings>('bytesteps-accessibility', {
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    speechEnabled: false
  });

  // Apply accessibility settings to document
  useEffect(() => {
    const root = document.documentElement;
    
    // High contrast mode
    if (settings.highContrast) {
      root.style.setProperty('--background', '0 0% 0%');
      root.style.setProperty('--foreground', '0 0% 100%');
      root.style.setProperty('--card', '0 0% 10%');
      root.style.setProperty('--card-foreground', '0 0% 100%');
      root.style.setProperty('--border', '0 0% 30%');
      root.style.setProperty('--primary', '60 100% 50%');
      root.style.setProperty('--primary-foreground', '0 0% 0%');
      root.style.setProperty('--muted', '0 0% 15%');
      root.style.setProperty('--muted-foreground', '0 0% 85%');
    } else {
      // Reset to default values
      root.style.removeProperty('--background');
      root.style.removeProperty('--foreground');
      root.style.removeProperty('--card');
      root.style.removeProperty('--card-foreground');
      root.style.removeProperty('--border');
      root.style.removeProperty('--primary');
      root.style.removeProperty('--primary-foreground');
      root.style.removeProperty('--muted');
      root.style.removeProperty('--muted-foreground');
    }

    // Large text mode
    if (settings.largeText) {
      root.style.fontSize = '22px';
    } else {
      root.style.fontSize = '18px';
    }

    // Reduced motion
    if (settings.reducedMotion) {
      root.style.setProperty('--transition-duration', '0ms');
      document.body.style.setProperty('animation-duration', '0.01ms', 'important');
      document.body.style.setProperty('animation-iteration-count', '1', 'important');
      document.body.style.setProperty('transition-duration', '0.01ms', 'important');
    } else {
      root.style.removeProperty('--transition-duration');
      document.body.style.removeProperty('animation-duration');
      document.body.style.removeProperty('animation-iteration-count');
      document.body.style.removeProperty('transition-duration');
    }

  }, [settings]);

  const updateSetting = (key: keyof AccessibilitySettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings({
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      speechEnabled: false
    });
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window && settings.speechEnabled) {
      speechSynthesis.cancel(); // Stop any current speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="accessibility-title"
    >
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle id="accessibility-title" className="text-xl flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Accessibility Settings
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              aria-label="Close accessibility settings"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* High Contrast */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  {settings.highContrast ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  High Contrast Mode
                </h3>
                <p className="text-sm text-muted-foreground">
                  Use high contrast colors for better visibility
                </p>
              </div>
              <Button
                variant={settings.highContrast ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  updateSetting('highContrast', !settings.highContrast);
                  speakText(settings.highContrast ? "High contrast disabled" : "High contrast enabled");
                }}
                aria-pressed={settings.highContrast}
              >
                {settings.highContrast ? 'ON' : 'OFF'}
              </Button>
            </div>
            {settings.highContrast && (
              <Badge variant="secondary" className="text-xs">
                Using yellow-on-black high contrast theme
              </Badge>
            )}
          </div>

          {/* Large Text */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  Large Text Size
                </h3>
                <p className="text-sm text-muted-foreground">
                  Increase text size throughout the site
                </p>
              </div>
              <Button
                variant={settings.largeText ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  updateSetting('largeText', !settings.largeText);
                  speakText(settings.largeText ? "Large text disabled" : "Large text enabled");
                }}
                aria-pressed={settings.largeText}
              >
                {settings.largeText ? 'ON' : 'OFF'}
              </Button>
            </div>
            {settings.largeText && (
              <Badge variant="secondary" className="text-xs">
                Text size increased to 22px
              </Badge>
            )}
          </div>

          {/* Speech */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  {settings.speechEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  Text-to-Speech
                </h3>
                <p className="text-sm text-muted-foreground">
                  Enable automatic text reading for buttons and content
                </p>
              </div>
              <Button
                variant={settings.speechEnabled ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  const newValue = !settings.speechEnabled;
                  updateSetting('speechEnabled', newValue);
                  if (newValue && 'speechSynthesis' in window) {
                    speakText("Text to speech enabled. I will now read content aloud when you interact with it.");
                  }
                }}
                aria-pressed={settings.speechEnabled}
              >
                {settings.speechEnabled ? 'ON' : 'OFF'}
              </Button>
            </div>
            {settings.speechEnabled && (
              <div className="space-y-2">
                <Badge variant="secondary" className="text-xs">
                  Text will be read aloud automatically
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => speakText("This is a test of the text to speech feature. You can use this to hear content read aloud.")}
                  className="text-xs"
                >
                  Test Speech
                </Button>
              </div>
            )}
          </div>

          {/* Reduced Motion */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Reduce Motion</h3>
                <p className="text-sm text-muted-foreground">
                  Minimize animations and transitions
                </p>
              </div>
              <Button
                variant={settings.reducedMotion ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  updateSetting('reducedMotion', !settings.reducedMotion);
                  speakText(settings.reducedMotion ? "Motion reduction disabled" : "Motion reduction enabled");
                }}
                aria-pressed={settings.reducedMotion}
              >
                {settings.reducedMotion ? 'ON' : 'OFF'}
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t space-y-3">
            <Button
              variant="outline"
              onClick={resetSettings}
              className="w-full"
            >
              Reset All Settings
            </Button>
            
            <div className="bg-muted p-3 rounded-lg text-sm">
              <p className="font-medium mb-1">💡 Tip:</p>
              <p className="text-muted-foreground">
                These settings are saved on your device and will be remembered for next time.
                You can also ask for help from a volunteer if you need assistance with accessibility.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessibilityControls;