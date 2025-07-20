import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { ArrowLeft, Phone, Mail, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

interface HumanHelpRequestProps {
  onBack: () => void;
  userPostcode?: string;
}

interface HelpRequest {
  name: string;
  phone: string;
  email: string;
  urgency: 'low' | 'medium' | 'high';
  description: string;
  preferredContact: 'phone' | 'email';
  postcode: string;
}

const HumanHelpRequest: React.FC<HumanHelpRequestProps> = ({ onBack, userPostcode }) => {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [request, setRequest] = useState<HelpRequest>({
    name: '',
    phone: '',
    email: '',
    urgency: 'medium',
    description: '',
    preferredContact: 'phone',
    postcode: userPostcode || ''
  });
  const [errors, setErrors] = useState<Partial<HelpRequest>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<HelpRequest> = {};

    if (!request.name.trim()) {
      newErrors.name = 'Please enter your name';
    }

    if (!request.description.trim()) {
      newErrors.description = 'Please describe how we can help you';
    }

    if (request.preferredContact === 'phone' && !request.phone.trim()) {
      newErrors.phone = 'Please enter your phone number';
    }

    if (request.preferredContact === 'email' && !request.email.trim()) {
      newErrors.email = 'Please enter your email address';
    }

    if (request.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (request.phone && !/^[\d\s\-\+\(\)]{10,}$/.test(request.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid UK phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real implementation, this would send to your backend/Airtable
      // For now, we'll simulate the submission and log the data
      const escalationData = {
        ...request,
        timestamp: new Date().toISOString(),
        id: Math.random().toString(36).substr(2, 9),
        status: 'pending'
      };

      // Log the escalation request (in production, this would go to your system)
      console.log('Human help request submitted:', escalationData);
      
      // Store in localStorage as backup
      const existingRequests = JSON.parse(localStorage.getItem('bytesteps-help-requests') || '[]');
      existingRequests.push(escalationData);
      localStorage.setItem('bytesteps-help-requests', JSON.stringify(existingRequests));

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      setIsSubmitted(true);
      
      toast({
        title: "Help request submitted successfully",
        description: "A volunteer will contact you within 24 hours.",
      });

    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Please try again or contact your local library for immediate help.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-primary text-primary-foreground py-6">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold">Help Request Submitted</h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Card className="border-success">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-3 text-success">
                <CheckCircle className="h-6 w-6" />
                Request Received
              </CardTitle>
              <CardDescription className="text-base">
                We've received your request for help and will respond soon.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-success/10 p-4 rounded-lg border border-success/20">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  What happens next:
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• A trained volunteer will review your request</li>
                  <li>• You'll receive contact within 24 hours (Monday-Friday)</li>
                  <li>• They'll help you with your specific question or problem</li>
                  <li>• All support is completely free</li>
                </ul>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Need immediate help?</h3>
                <p className="text-sm text-muted-foreground">
                  Visit your local library or community centre. Many have drop-in digital support sessions 
                  where volunteers can help you in person right away.
                </p>
              </div>

              <div className="flex gap-3">
                <Button onClick={onBack} className="flex-1">
                  Continue Learning
                </Button>
                <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                  Submit Another Request
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-primary-foreground hover:bg-primary-foreground/20 focus:ring-4 focus:ring-primary-foreground/20 focus:outline-none"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          <h1 className="text-3xl font-bold">Get Human Help</h1>
          <p className="text-lg opacity-90">
            Connect with a real person who can help with your digital questions
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Tell us about yourself</CardTitle>
              <CardDescription className="text-base">
                This helps us match you with the right volunteer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-base font-medium">Your name</Label>
                <Input
                  id="name"
                  value={request.name}
                  onChange={(e) => setRequest(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. John Smith"
                  className={`mt-1 text-lg py-3 ${errors.name ? 'border-destructive' : ''}`}
                  aria-invalid={!!errors.name}
                />
                {errors.name && (
                  <p className="text-sm text-destructive mt-1" role="alert">{errors.name}</p>
                )}
              </div>

              <div>
                <Label className="text-base font-medium">How would you prefer to be contacted?</Label>
                <div className="mt-2 space-y-3">
                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                    <input
                      type="radio"
                      name="contact-method"
                      value="phone"
                      checked={request.preferredContact === 'phone'}
                      onChange={(e) => setRequest(prev => ({ ...prev, preferredContact: e.target.value as 'phone' | 'email' }))}
                      className="h-4 w-4 text-primary"
                    />
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>Phone call (we'll call you at a convenient time)</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                    <input
                      type="radio"
                      name="contact-method"
                      value="email"
                      checked={request.preferredContact === 'email'}
                      onChange={(e) => setRequest(prev => ({ ...prev, preferredContact: e.target.value as 'phone' | 'email' }))}
                      className="h-4 w-4 text-primary"
                    />
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>Email (we'll send you detailed help via email)</span>
                  </label>
                </div>
              </div>

              {request.preferredContact === 'phone' && (
                <div>
                  <Label htmlFor="phone" className="text-base font-medium">Your phone number</Label>
                  <Input
                    id="phone"
                    value={request.phone}
                    onChange={(e) => setRequest(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="e.g. 01234 567890"
                    className={`mt-1 text-lg py-3 ${errors.phone ? 'border-destructive' : ''}`}
                    aria-invalid={!!errors.phone}
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive mt-1" role="alert">{errors.phone}</p>
                  )}
                </div>
              )}

              {request.preferredContact === 'email' && (
                <div>
                  <Label htmlFor="email" className="text-base font-medium">Your email address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={request.email}
                    onChange={(e) => setRequest(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="e.g. john.smith@example.com"
                    className={`mt-1 text-lg py-3 ${errors.email ? 'border-destructive' : ''}`}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive mt-1" role="alert">{errors.email}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">What do you need help with?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="description" className="text-base font-medium">
                  Describe your question or problem
                </Label>
                <Textarea
                  id="description"
                  value={request.description}
                  onChange={(e) => setRequest(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="e.g. I can't send emails on my tablet, or I want to learn about online banking"
                  className={`mt-1 text-lg min-h-24 ${errors.description ? 'border-destructive' : ''}`}
                  aria-invalid={!!errors.description}
                />
                {errors.description && (
                  <p className="text-sm text-destructive mt-1" role="alert">{errors.description}</p>
                )}
                <p className="text-sm text-muted-foreground mt-1">
                  Don't worry about using technical terms - just explain in your own words
                </p>
              </div>

              <div>
                <Label className="text-base font-medium">How urgent is this?</Label>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { value: 'low', label: 'Not urgent', desc: 'Can wait a few days', color: 'bg-info/10 border-info/20' },
                    { value: 'medium', label: 'Quite important', desc: 'Would like help soon', color: 'bg-warning/10 border-warning/20' },
                    { value: 'high', label: 'Urgent', desc: 'Need help quickly', color: 'bg-destructive/10 border-destructive/20' }
                  ].map((urgency) => (
                    <label
                      key={urgency.value}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        request.urgency === urgency.value 
                          ? urgency.color 
                          : 'border-muted hover:bg-muted/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="urgency"
                        value={urgency.value}
                        checked={request.urgency === urgency.value}
                        onChange={(e) => setRequest(prev => ({ ...prev, urgency: e.target.value as 'low' | 'medium' | 'high' }))}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <div className="font-medium">{urgency.label}</div>
                        <div className="text-sm text-muted-foreground">{urgency.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-info/5 border-info/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-info mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium mb-1">Your privacy is protected</p>
                  <p className="text-muted-foreground">
                    We only use your contact details to help you with your question. We'll never share them 
                    with anyone else or use them for marketing. You can ask us to delete your information at any time.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button 
            type="submit" 
            size="lg" 
            className="w-full text-lg py-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Help Request'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default HumanHelpRequest;