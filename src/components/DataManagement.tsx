import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft, Download, Trash2, Shield, AlertTriangle, Check } from 'lucide-react';
import { useAuditLogger } from '../hooks/useAuditLogger';
import { useToast } from '../hooks/use-toast';

interface DataManagementProps {
  onBack: () => void;
}

const DataManagement: React.FC<DataManagementProps> = ({ onBack }) => {
  const auditLogger = useAuditLogger();
  const { toast } = useToast();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDataExport = () => {
    const userData = {
      profile: JSON.parse(localStorage.getItem('bytesteps-user-profile') || 'null'),
      completedModules: JSON.parse(localStorage.getItem('bytesteps-completed-modules') || '[]'),
      accessibilitySettings: JSON.parse(localStorage.getItem('bytesteps-accessibility') || 'null'),
      consentHistory: auditLogger.getUserConsentHistory(),
      auditTrail: auditLogger.getUserAuditTrail(),
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bytesteps-data-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    auditLogger.logEvent('data_accessed', { type: 'export', format: 'json' });
    
    toast({
      title: "Data exported successfully",
      description: "Your data has been downloaded to your device.",
    });
  };

  const handleDataDeletion = async () => {
    setIsDeleting(true);
    
    try {
      // Log deletion before removing data
      auditLogger.deleteUserData();
      
      // Clear all localStorage items
      const keysToRemove = [
        'bytesteps-user-profile',
        'bytesteps-completed-modules', 
        'bytesteps-accessibility',
        'bytesteps-privacy-consent',
        'bytesteps-consent-timestamp',
        'bytesteps-help-requests'
      ];
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing
      
      toast({
        title: "All data deleted successfully",
        description: "Your information has been completely removed from our system.",
      });
      
      // Redirect to home after deletion
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
      
    } catch (error) {
      toast({
        title: "Deletion failed",
        description: "Please contact support for assistance with data deletion.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const getStoredDataSummary = () => {
    const profile = JSON.parse(localStorage.getItem('bytesteps-user-profile') || 'null');
    const modules = JSON.parse(localStorage.getItem('bytesteps-completed-modules') || '[]');
    const accessibility = JSON.parse(localStorage.getItem('bytesteps-accessibility') || 'null');
    const consent = localStorage.getItem('bytesteps-privacy-consent');
    const consentTimestamp = localStorage.getItem('bytesteps-consent-timestamp');
    
    return {
      hasProfile: !!profile,
      moduleCount: modules.length,
      hasAccessibilitySettings: !!accessibility,
      hasConsent: !!consent,
      consentDate: consentTimestamp ? new Date(consentTimestamp).toLocaleDateString() : null,
      auditEventCount: auditLogger.getUserAuditTrail().length
    };
  };

  const dataSummary = getStoredDataSummary();

  if (showDeleteConfirm) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-destructive text-destructive-foreground py-6">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold">Confirm Data Deletion</h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-3 text-destructive">
                <AlertTriangle className="h-6 w-6" />
                Permanently Delete All Data
              </CardTitle>
              <CardDescription className="text-base">
                This action cannot be undone. All your information will be permanently removed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
                <h3 className="font-semibold mb-2">What will be deleted:</h3>
                <ul className="space-y-1 text-sm">
                  <li>• Your learning progress and preferences</li>
                  <li>• Accessibility settings</li>
                  <li>• Any help requests you've submitted</li>
                  <li>• Consent records and audit trail</li>
                  <li>• All stored preferences and data</li>
                </ul>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">After deletion:</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• You'll need to start over if you return to ByteSteps</li>
                  <li>• Your progress in modules will be lost</li>
                  <li>• You'll need to give consent again to use the service</li>
                  <li>• Any pending help requests will be cancelled</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1"
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDataDeletion}
                  className="flex-1"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Yes, Delete Everything'}
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
      <div className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          <h1 className="text-3xl font-bold">Your Data & Privacy</h1>
          <p className="text-lg opacity-90">
            Manage your personal information and privacy settings
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Data Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Shield className="h-6 w-6 text-primary" />
                Your Data Summary
              </CardTitle>
              <CardDescription className="text-base">
                Overview of the information we store about you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Learning Profile</span>
                    <Badge variant={dataSummary.hasProfile ? "default" : "secondary"}>
                      {dataSummary.hasProfile ? "Created" : "Not set"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Completed Modules</span>
                    <Badge variant="outline">{dataSummary.moduleCount}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Accessibility Settings</span>
                    <Badge variant={dataSummary.hasAccessibilitySettings ? "default" : "secondary"}>
                      {dataSummary.hasAccessibilitySettings ? "Customized" : "Default"}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Privacy Consent</span>
                    <Badge variant={dataSummary.hasConsent ? "default" : "destructive"}>
                      {dataSummary.hasConsent ? "Given" : "Not given"}
                    </Badge>
                  </div>
                  {dataSummary.consentDate && (
                    <div className="flex items-center justify-between">
                      <span>Consent Date</span>
                      <Badge variant="outline">{dataSummary.consentDate}</Badge>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span>Activity Records</span>
                    <Badge variant="outline">{dataSummary.auditEventCount} events</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Actions */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Download Your Data
                </CardTitle>
                <CardDescription>
                  Get a copy of all information we have about you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  This includes your learning progress, preferences, consent history, and activity log. 
                  The data will be provided in a readable format.
                </p>
                <Button onClick={handleDataExport} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Data (JSON)
                </Button>
              </CardContent>
            </Card>

            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2 text-destructive">
                  <Trash2 className="h-5 w-5" />
                  Delete All Data
                </CardTitle>
                <CardDescription>
                  Permanently remove all your information from our system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  This will delete everything we have stored about you. You'll lose all progress 
                  and will need to start over if you return to ByteSteps.
                </p>
                <Button 
                  variant="destructive" 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete All My Data
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Legal Information */}
          <Card className="bg-muted">
            <CardHeader>
              <CardTitle className="text-lg">Your Rights Under GDPR</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Data Protection Rights:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Right to access your data</li>
                    <li>• Right to correct inaccurate data</li>
                    <li>• Right to delete your data</li>
                    <li>• Right to restrict processing</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">How We Handle Data:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Stored locally on your device</li>
                    <li>• Not shared with third parties</li>
                    <li>• Used only for learning purposes</li>
                    <li>• Deleted on request</li>
                  </ul>
                </div>
              </div>
              <p className="text-muted-foreground pt-2 border-t">
                If you have questions about your data or privacy, contact us through the "Get Human Help" feature 
                or visit your local library for assistance.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DataManagement;