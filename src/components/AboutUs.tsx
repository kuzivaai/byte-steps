import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft, Shield, Users, AlertTriangle, Phone, Mail, Clock } from 'lucide-react';

interface AboutUsProps {
  onBack: () => void;
}

const AboutUs: React.FC<AboutUsProps> = ({ onBack }) => {
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
          <h1 className="text-3xl font-bold">About ByteSteps</h1>
          <p className="text-lg opacity-90">
            Who we are, what we do, and how we can help you
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Mission */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Users className="h-6 w-6 text-primary" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg leading-relaxed">
                ByteSteps exists to help everyone in the UK gain essential digital skills. We particularly focus on supporting older adults, people with disabilities, and those on low incomes who may have been left behind by rapid technological change.
              </p>
              <p className="text-base leading-relaxed text-muted-foreground">
                We believe that everyone deserves to feel confident and safe when using technology, whether that's staying in touch with family, accessing vital services, or simply browsing the web.
              </p>
            </CardContent>
          </Card>

          {/* Service Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Shield className="h-6 w-6 text-primary" />
                How We Help
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">What We Provide</h3>
                  <ul className="space-y-2 text-base">
                    <li>• Free, easy-to-follow learning modules</li>
                    <li>• Step-by-step guidance at your own pace</li>
                    <li>• Safety advice to protect you online</li>
                    <li>• Local support centre directory</li>
                    <li>• Human help when you need it</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3">Our Approach</h3>
                  <ul className="space-y-2 text-base">
                    <li>• No jargon - everything explained simply</li>
                    <li>• No pressure - learn at your own speed</li>
                    <li>• No judgement - everyone starts somewhere</li>
                    <li>• Accessible design for all abilities</li>
                    <li>• Privacy-first - your data stays safe</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Limitations */}
          <Card className="border-warning">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Understanding Our AI Assistant
              </CardTitle>
              <CardDescription className="text-base">
                Important information about our automated learning system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-warning/10 p-4 rounded-lg border border-warning/20">
                <h4 className="font-semibold mb-2">What our AI can do:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Provide structured learning modules</li>
                  <li>• Answer basic questions about digital skills</li>
                  <li>• Guide you through simple technical tasks</li>
                  <li>• Help you find local support services</li>
                </ul>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">What our AI cannot do:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Provide technical support for specific devices</li>
                  <li>• Offer financial or legal advice</li>
                  <li>• Replace human support for complex issues</li>
                  <li>• Guarantee solutions to all technical problems</li>
                </ul>
              </div>
              <p className="text-sm text-muted-foreground">
                When you need more help than our AI can provide, we'll connect you with real people who can assist you properly.
              </p>
            </CardContent>
          </Card>

          {/* Contact and Support */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Phone className="h-6 w-6 text-primary" />
                Getting Human Help
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Support Hours</h3>
                  <div className="space-y-2 text-base">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Monday - Friday: 9am - 5pm</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Response time: Within 24 hours</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3">Emergency Help</h3>
                  <p className="text-base text-muted-foreground mb-3">
                    If you need immediate help with digital issues, visit your local library or community centre. They often have volunteers who can assist you in person.
                  </p>
                  <Badge variant="outline" className="text-sm">
                    Find local centres using our Local Support feature
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Partnership */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Our Partners</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-relaxed text-muted-foreground">
                ByteSteps works closely with libraries, community centres, and digital inclusion charities across the UK. We follow the 
                <strong> Essential Digital Skills Framework</strong> developed by the government to ensure our content meets national standards.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="secondary">Age UK Partnership</Badge>
                <Badge variant="secondary">Library Network Member</Badge>
                <Badge variant="secondary">Digital Inclusion Alliance</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Legal Information */}
          <Card className="bg-muted">
            <CardHeader>
              <CardTitle className="text-lg">Legal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>
                <strong>Service Provider:</strong> ByteSteps Digital Inclusion Initiative<br />
                <strong>Status:</strong> Non-profit community service (prototype phase)<br />
                <strong>Regulation:</strong> Operating under UK data protection law (GDPR)
              </p>
              <p className="text-muted-foreground">
                This service is currently in development. All content is provided for educational purposes. 
                For official government services, please visit gov.uk directly.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;