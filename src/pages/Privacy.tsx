import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Download, Trash2 } from 'lucide-react';
import { exportUserData, secureStorage } from '@/utils/secureStorage';
import { useToast } from '@/hooks/use-toast';

export const Privacy: React.FC = () => {
  const { toast } = useToast();

  const downloadData = () => {
    const data = exportUserData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bytesteps-data-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data exported",
      description: "Your personal data has been downloaded.",
    });
  };

  const deleteAllData = () => {
    if (confirm('Are you sure you want to delete all your ByteSteps data? This cannot be undone.')) {
      localStorage.clear();
      secureStorage.clear();
      
      toast({
        title: "Data deleted",
        description: "All your local data has been removed.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
        </div>
        <Badge variant="secondary">Last updated: {new Date().toLocaleDateString()}</Badge>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Data Rights (GDPR)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button onClick={downloadData} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export My Data
              </Button>
              <Button onClick={deleteAllData} variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete All Data
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              You have the right to access, modify, or delete your personal data at any time.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What Data We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div>
                <h4 className="font-semibold">Essential Data</h4>
                <p className="text-sm text-muted-foreground">
                  Assessment responses, learning progress, and preferences to provide our digital skills service.
                </p>
              </div>
              <div>
                <h4 className="font-semibold">Optional Data</h4>
                <p className="text-sm text-muted-foreground">
                  Postcode prefix (first 2-3 characters only) to find local resources. Help requests if you contact us.
                </p>
              </div>
              <div>
                <h4 className="font-semibold">Technical Data</h4>
                <p className="text-sm text-muted-foreground">
                  Browser type, IP address (for security), and usage analytics (only if you consent).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How We Protect Your Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>All data is encrypted in transit using HTTPS</li>
              <li>Local data is stored securely in your browser</li>
              <li>AI interactions are processed securely without storing personal details</li>
              <li>Rate limiting prevents abuse of our services</li>
              <li>Regular security audits and monitoring</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cookies and Tracking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div>
                <h4 className="font-semibold">Essential Cookies</h4>
                <p className="text-sm text-muted-foreground">
                  Required for the website to function (authentication, preferences, progress saving).
                </p>
              </div>
              <div>
                <h4 className="font-semibold">Analytics Cookies (Optional)</h4>
                <p className="text-sm text-muted-foreground">
                  Help us understand how you use ByteSteps to improve the service. You can opt out anytime.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Third-Party Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div>
                <h4 className="font-semibold">OpenAI (AI Coach)</h4>
                <p className="text-sm text-muted-foreground">
                  Your questions are sent to OpenAI to generate personalized guidance. No personal data is stored by OpenAI.
                </p>
              </div>
              <div>
                <h4 className="font-semibold">Supabase (Data Storage)</h4>
                <p className="text-sm text-muted-foreground">
                  Securely hosts your learning data with enterprise-grade security and GDPR compliance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              If you have any questions about this privacy policy or your data:
            </p>
            <div className="space-y-2 text-sm">
              <p><strong>Data Controller:</strong> ByteSteps Digital Skills Platform</p>
              <p><strong>Email:</strong> privacy@bytesteps.co.uk</p>
              <p><strong>Response Time:</strong> Within 30 days as required by GDPR</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};