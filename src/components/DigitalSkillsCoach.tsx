import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Heart, Shield, Users, Phone, MessageSquare, Computer, ArrowRight, CheckCircle, Clock, MapPin, HelpCircle, Settings } from 'lucide-react';

// Lazy load heavy components to prevent cascading failures
const InitialAssessment = React.lazy(() => import('./InitialAssessment'));
const LearningModuleView = React.lazy(() => import('./LearningModuleView'));
const LocalResourceFinder = React.lazy(() => import('./LocalResourceFinder'));
const PrivacyNotice = React.lazy(() => import('./PrivacyNotice'));
const AboutUs = React.lazy(() => import('./AboutUs'));
const HumanHelpRequest = React.lazy(() => import('./HumanHelpRequest'));
const AccessibilityControls = React.lazy(() => import('./AccessibilityControls'));
const DataManagement = React.lazy(() => import('./DataManagement'));

import { LearningModule } from '../types';
import { sampleLearningModules } from '../data/sampleData';
import { useLocalStorage } from '../hooks/useLocalStorage';

type View = 'home' | 'assessment' | 'learning' | 'resources' | 'progress' | 'about' | 'help' | 'data';

interface UserProfile {
  priority: string;
  accessibility: string;
  postcode: string;
}

const DigitalSkillsCoach: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [userProfile, setUserProfile] = useLocalStorage<UserProfile | null>('bytesteps-user-profile', null);
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null);
  const [completedModules, setCompletedModules] = useLocalStorage<string[]>('bytesteps-completed-modules', []);
  const [showAccessibilityControls, setShowAccessibilityControls] = useState(false);

  // Initialize privacy consent from localStorage
  const [hasPrivacyConsent, setHasPrivacyConsent] = useState<boolean | null>(() => {
    try {
      const storedConsent = localStorage.getItem('bytesteps-privacy-consent');
      return storedConsent ? storedConsent === 'true' : null;
    } catch (error) {
      console.error('Error reading privacy consent from localStorage:', error);
      return null;
    }
  });

  const handleAssessmentComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setCurrentView('learning');
  };

  const handleStartModule = (module: LearningModule) => {
    setSelectedModule(module);
  };

  const handleModuleComplete = (moduleId: string) => {
    setCompletedModules(prev => [...prev, moduleId]);
    setSelectedModule(null);
  };

  const handlePrivacyConsent = (consent: boolean) => {
    setHasPrivacyConsent(consent);
    try {
      localStorage.setItem('bytesteps-privacy-consent', consent.toString());
    } catch (error) {
      console.error('Error saving privacy consent to localStorage:', error);
    }
  };

  // Show privacy notice if consent hasn't been determined
  if (hasPrivacyConsent === null) {
    return (
      <React.Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="text-lg">Loading Privacy Notice...</div></div>}>
        <PrivacyNotice onAccept={handlePrivacyConsent} />
      </React.Suspense>
    );
  }

  const getRecommendedModules = () => {
    if (!userProfile) return sampleLearningModules;
    
    // Simple recommendation logic based on user priority
    const priorityMap: Record<string, string[]> = {
      'basic-phone': ['basic-phone-setup'],
      'internet': ['online-safety'],
      'communication': ['email-basics'],
      'services': ['basic-phone-setup', 'email-basics'],
      'safety': ['online-safety']
    };

    const prioritized = priorityMap[userProfile.priority] || [];
    const others = sampleLearningModules.filter(m => !prioritized.includes(m.id));
    
    return [
      ...sampleLearningModules.filter(m => prioritized.includes(m.id)),
      ...others
    ];
  };

  if (currentView === 'assessment') {
    return (
      <React.Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="text-lg">Loading Assessment...</div></div>}>
        <InitialAssessment onComplete={handleAssessmentComplete} />
      </React.Suspense>
    );
  }

  if (selectedModule) {
    return (
      <React.Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="text-lg">Loading Module...</div></div>}>
        <LearningModuleView
          module={selectedModule}
          onComplete={() => handleModuleComplete(selectedModule.id)}
          onBack={() => setSelectedModule(null)}
        />
      </React.Suspense>
    );
  }

  if (currentView === 'resources') {
    return (
      <React.Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="text-lg">Loading Resources...</div></div>}>
        <LocalResourceFinder
          userPostcode={userProfile?.postcode}
          onBack={() => setCurrentView('learning')}
        />
      </React.Suspense>
    );
  }

  if (currentView === 'about') {
    return (
      <React.Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="text-lg">Loading About...</div></div>}>
        <AboutUs onBack={() => setCurrentView('home')} />
      </React.Suspense>
    );
  }

  if (currentView === 'data') {
    return (
      <React.Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="text-lg">Loading Data Management...</div></div>}>
        <DataManagement onBack={() => setCurrentView('home')} />
      </React.Suspense>
    );
  }

  if (currentView === 'help') {
    return (
      <React.Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="text-lg">Loading Help...</div></div>}>
        <HumanHelpRequest onBack={() => setCurrentView('learning')} userPostcode={userProfile?.postcode} />
      </React.Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Skip to main content link for screen readers */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium"
        aria-label="Skip to main content"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header className="bg-primary text-primary-foreground py-6" role="banner">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="h-8 w-8" aria-hidden="true" />
              <div>
                <h1 className="text-3xl font-bold">Byte Steps</h1>
                <p className="text-lg opacity-90">Learning digital skills, one manageable step at a time</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAccessibilityControls(true)}
              className="text-primary-foreground hover:bg-primary-foreground/20"
              aria-label="Open accessibility settings"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <React.Suspense fallback={null}>
        <AccessibilityControls 
          isOpen={showAccessibilityControls}
          onClose={() => setShowAccessibilityControls(false)}
        />
      </React.Suspense>

      <main id="main-content" className="container mx-auto px-4 py-8" role="main">
        {currentView === 'home' && (
          <div className="space-y-8">
            {/* Welcome Section */}
            <Card className="border-2 border-accent">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl mb-2">Welcome to Byte Steps</CardTitle>
                <CardDescription className="text-lg">
                  We're here to help you build confidence with technology. Whether you're starting fresh or want to learn something new, we'll take it one small step at a time—no pressure, just support.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button 
                  size="lg" 
                  onClick={() => setCurrentView('assessment')}
                  className="text-xl px-8 py-6 focus:ring-4 focus:ring-primary/20 focus:outline-none"
                  aria-describedby="get-started-info"
                >
                  Get Started <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </Button>
                <p id="get-started-info" className="text-base text-muted-foreground mt-4">
                  Takes just 2 minutes • Completely free • No personal information required
                </p>
              </CardContent>
            </Card>

            {/* Features */}
            <section aria-labelledby="features-heading">
              <h2 id="features-heading" className="sr-only">Key Features</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <Computer className="h-8 w-8 text-accent mb-2" aria-hidden="true" />
                    <CardTitle className="text-xl">Learn at Your Pace</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base leading-relaxed">Short, easy lessons designed for beginners. Practice as many times as you need.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Shield className="h-8 w-8 text-accent mb-2" aria-hidden="true" />
                    <CardTitle className="text-xl">Stay Safe Online</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base leading-relaxed">Learn how to protect yourself from scams and use the internet safely.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Users className="h-8 w-8 text-accent mb-2" aria-hidden="true" />
                    <CardTitle className="text-xl">Find Local Help</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base leading-relaxed">Connect with friendly volunteers and classes in your area.</p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Learning Channels */}
            <section aria-labelledby="channels-heading">
              <Card>
                <CardHeader>
                  <CardTitle id="channels-heading" className="text-xl">Choose How You'd Like to Learn</CardTitle>
                  <CardDescription className="text-base">
                    We offer different ways to access help, so you can choose what works best for you.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4" role="group" aria-labelledby="channels-heading">
                    <div className="text-center p-4 border rounded-lg focus-within:ring-2 focus-within:ring-primary/20">
                      <Computer className="h-8 w-8 mx-auto mb-2 text-primary" aria-hidden="true" />
                      <h3 className="font-semibold text-lg">This Website</h3>
                      <p className="text-base text-muted-foreground leading-relaxed">
                        Learn through your computer, tablet, or smartphone
                      </p>
                    </div>
                    <div className="text-center p-4 border rounded-lg focus-within:ring-2 focus-within:ring-primary/20">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2 text-primary" aria-hidden="true" />
                      <h3 className="font-semibold text-lg">Text Messages</h3>
                      <p className="text-base text-muted-foreground leading-relaxed">
                        Get tips and lessons sent to your phone
                      </p>
                    </div>
                    <div className="text-center p-4 border rounded-lg focus-within:ring-2 focus-within:ring-primary/20">
                      <Phone className="h-8 w-8 mx-auto mb-2 text-primary" aria-hidden="true" />
                      <h3 className="font-semibold text-lg">Phone Calls</h3>
                      <p className="text-base text-muted-foreground leading-relaxed">
                        Listen to lessons over the phone at your own pace
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        )}

        {currentView === 'learning' && (
          <div className="space-y-6">
            {/* Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="text-3xl font-bold">Your Learning Journey</h1>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentView('resources')}
                  className="focus:ring-4 focus:ring-primary/20 focus:outline-none"
                  aria-describedby="local-help-desc"
                >
                  <MapPin className="h-4 w-4 mr-2" aria-hidden="true" />
                  Find Local Help
                </Button>
                <span id="local-help-desc" className="sr-only">Find support centres and classes near you</span>
                
                <Button 
                  variant="secondary"
                  onClick={() => setCurrentView('help')}
                  className="focus:ring-4 focus:ring-secondary/20 focus:outline-none"
                  aria-describedby="human-help-desc"
                >
                  <HelpCircle className="h-4 w-4 mr-2" aria-hidden="true" />
                  Get Human Help
                </Button>
                <span id="human-help-desc" className="sr-only">Connect with a real person for personalized assistance</span>
                
                <Button 
                  variant="outline"
                  onClick={() => setCurrentView('about')}
                  className="focus:ring-4 focus:ring-primary/20 focus:outline-none"
                >
                  About Us
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setCurrentView('home')}
                  className="focus:ring-4 focus:ring-primary/20 focus:outline-none"
                >
                  Back to Home
                </Button>
              </div>
            </div>

            {userProfile && (
              <Card className="bg-muted">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Recommended for you:</h3>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">
                      Wants to learn: {userProfile.priority.replace('-', ' ')}
                    </Badge>
                    {userProfile.accessibility !== 'none' && (
                      <Badge variant="secondary">
                        Accessibility: {userProfile.accessibility.replace('-', ' ')}
                      </Badge>
                    )}
                    {userProfile.postcode && (
                      <Badge variant="secondary">
                        Area: {userProfile.postcode}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Learning Modules */}
            <section aria-labelledby="modules-heading">
              <h2 id="modules-heading" className="sr-only">Available Learning Modules</h2>
              <div className="grid gap-6">
                {getRecommendedModules().map((module) => {
                  const isCompleted = completedModules.includes(module.id);
                  return (
                    <Card 
                      key={module.id} 
                      className={`${isCompleted ? 'bg-success/10 border-success' : ''} focus-within:ring-2 focus-within:ring-primary/20`}
                      role="article"
                      aria-labelledby={`module-title-${module.id}`}
                      aria-describedby={`module-desc-${module.id}`}
                    >
                      <CardHeader>
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <CardTitle id={`module-title-${module.id}`} className="text-xl">
                                {module.title}
                              </CardTitle>
                              {isCompleted && (
                                <CheckCircle 
                                  className="h-5 w-5 text-success" 
                                  aria-label="Module completed"
                                />
                              )}
                            </div>
                            <CardDescription id={`module-desc-${module.id}`} className="text-base mb-3 leading-relaxed">
                              {module.description}
                            </CardDescription>
                            <div className="flex flex-wrap items-center gap-4 text-base text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" aria-hidden="true" />
                                <span aria-label={`Estimated time: ${module.estimatedTime} minutes`}>
                                  {module.estimatedTime} minutes
                                </span>
                              </div>
                              <Badge variant="outline" aria-label={`Difficulty level: ${module.difficulty}`}>
                                {module.difficulty}
                              </Badge>
                              <Badge variant="outline" aria-label={`Category: ${module.category.replace('-', ' ')}`}>
                                {module.category.replace('-', ' ')}
                              </Badge>
                            </div>
                          </div>
                          <Button 
                            size="lg"
                            onClick={() => handleStartModule(module)}
                            disabled={isCompleted}
                            className="ml-0 lg:ml-4 text-lg px-6 py-3 focus:ring-4 focus:ring-primary/20 focus:outline-none"
                            aria-describedby={`module-desc-${module.id}`}
                          >
                            {isCompleted ? 'Completed' : 'Start Learning'}
                            {!isCompleted && <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />}
                          </Button>
                        </div>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default DigitalSkillsCoach;