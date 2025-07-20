import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Heart, Shield, Users, Phone, MessageSquare, Computer, ArrowRight, CheckCircle, Clock, MapPin, HelpCircle } from 'lucide-react';
import InitialAssessment from './InitialAssessment';
import LearningModuleView from './LearningModuleView';
import LocalResourceFinder from './LocalResourceFinder';
import { LearningModule } from '../types';
import { sampleLearningModules } from '../data/sampleData';

type View = 'home' | 'assessment' | 'learning' | 'resources' | 'progress';

interface UserProfile {
  confidence: string;
  device: string;
  priority: string;
  support: string;
  postcode: string;
}

const DigitalSkillsCoach: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null);
  const [completedModules, setCompletedModules] = useState<string[]>([]);

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
    return <InitialAssessment onComplete={handleAssessmentComplete} />;
  }

  if (selectedModule) {
    return (
      <LearningModuleView
        module={selectedModule}
        onComplete={() => handleModuleComplete(selectedModule.id)}
        onBack={() => setSelectedModule(null)}
      />
    );
  }

  if (currentView === 'resources') {
    return (
      <LocalResourceFinder
        userPostcode={userProfile?.postcode}
        onBack={() => setCurrentView('learning')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Byte Steps</h1>
          </div>
          <p className="text-lg opacity-90">
            Learning digital skills, one manageable step at a time
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {currentView === 'home' && (
          <div className="space-y-8">
            {/* Welcome Section */}
            <Card className="border-2 border-accent">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl mb-2">Welcome to Byte Steps</CardTitle>
                <CardDescription className="text-lg">
                  We're here to help you build confidence with technology. Whether you're starting fresh or want to learn something new, we'll take it one small step at a time—no pressure, just support.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button 
                  size="lg" 
                  onClick={() => setCurrentView('assessment')}
                  className="text-lg px-8 py-6"
                >
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  Takes just 2 minutes • Completely free • No personal information required
                </p>
              </CardContent>
            </Card>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <Computer className="h-8 w-8 text-accent mb-2" />
                  <CardTitle>Learn at Your Pace</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Short, easy lessons designed for beginners. Practice as many times as you need.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Shield className="h-8 w-8 text-accent mb-2" />
                  <CardTitle>Stay Safe Online</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Learn how to protect yourself from scams and use the internet safely.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Users className="h-8 w-8 text-accent mb-2" />
                  <CardTitle>Find Local Help</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Connect with friendly volunteers and classes in your area.</p>
                </CardContent>
              </Card>
            </div>

            {/* Channels */}
            <Card>
              <CardHeader>
                <CardTitle>Choose How You'd Like to Learn</CardTitle>
                <CardDescription>
                  We offer different ways to access help, so you can choose what works best for you.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <Computer className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-semibold">This Website</h3>
                    <p className="text-sm text-muted-foreground">
                      Learn through your computer, tablet, or smartphone
                    </p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-semibold">Text Messages</h3>
                    <p className="text-sm text-muted-foreground">
                      Get tips and lessons sent to your phone
                    </p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Phone className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-semibold">Phone Calls</h3>
                    <p className="text-sm text-muted-foreground">
                      Listen to lessons over the phone at your own pace
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentView === 'learning' && (
          <div className="space-y-6">
            {/* Navigation */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Your Learning Journey</h2>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentView('resources')}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Find Local Help
                </Button>
                <Button 
                  variant="secondary"
                  onClick={() => {
                    // In a real implementation, this would trigger an alert to a volunteer
                    alert('A friendly volunteer will contact you within 24 hours to help with your question. You can also visit your local library or community centre for immediate help.');
                  }}
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Get Human Help
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setCurrentView('home')}
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
                      {userProfile.device.replace('-', ' ')} user
                    </Badge>
                    <Badge variant="secondary">
                      Wants to learn: {userProfile.priority.replace('-', ' ')}
                    </Badge>
                    <Badge variant="secondary">
                      Prefers: {userProfile.support} help
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Learning Modules */}
            <div className="grid gap-6">
              {getRecommendedModules().map((module) => {
                const isCompleted = completedModules.includes(module.id);
                return (
                  <Card key={module.id} className={isCompleted ? 'bg-success/10 border-success' : ''}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-xl">{module.title}</CardTitle>
                            {isCompleted && <CheckCircle className="h-5 w-5 text-success" />}
                          </div>
                          <CardDescription className="text-base mb-3">
                            {module.description}
                          </CardDescription>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {module.estimatedTime} minutes
                            </div>
                            <Badge variant="outline">
                              {module.difficulty}
                            </Badge>
                            <Badge variant="outline">
                              {module.category.replace('-', ' ')}
                            </Badge>
                          </div>
                        </div>
                        <Button 
                          size="lg"
                          onClick={() => handleStartModule(module)}
                          disabled={isCompleted}
                          className="ml-4"
                        >
                          {isCompleted ? 'Completed' : 'Start Learning'}
                          {!isCompleted && <ArrowRight className="ml-2 h-4 w-4" />}
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DigitalSkillsCoach;