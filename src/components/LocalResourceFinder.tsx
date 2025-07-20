import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  Accessibility, 
  Search,
  ExternalLink
} from 'lucide-react';
import { sampleLocalResources } from '../data/sampleData';
import { LocalResource } from '../types';

interface LocalResourceFinderProps {
  userPostcode?: string;
  onBack: () => void;
}

const LocalResourceFinder: React.FC<LocalResourceFinderProps> = ({ 
  userPostcode, 
  onBack 
}) => {
  const [searchTerm, setSearchTerm] = useState(userPostcode || '');
  const [selectedType, setSelectedType] = useState<string>('all');

  const resourceTypes = [
    { value: 'all', label: 'All Resources' },
    { value: 'library', label: 'Libraries' },
    { value: 'community-centre', label: 'Community Centres' },
    { value: 'charity', label: 'Charities' },
    { value: 'adult-education', label: 'Adult Education' },
    { value: 'council', label: 'Council Services' }
  ];

  const filteredResources = useMemo(() => {
    let filtered = sampleLocalResources;

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(resource => resource.type === selectedType);
    }

    // Filter by search term (postcode, name, or services)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(resource =>
        resource.postcode.toLowerCase().includes(term) ||
        resource.name.toLowerCase().includes(term) ||
        resource.services.some(service => service.toLowerCase().includes(term)) ||
        resource.description.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [searchTerm, selectedType]);

  const getTypeIcon = (type: string) => {
    const iconClass = "h-5 w-5";
    switch (type) {
      case 'library': return '📚';
      case 'community-centre': return '🏢';
      case 'charity': return '❤️';
      case 'adult-education': return '🎓';
      case 'council': return '🏛️';
      default: return '📍';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'library': return 'bg-blue-100 text-blue-800';
      case 'community-centre': return 'bg-green-100 text-green-800';
      case 'charity': return 'bg-red-100 text-red-800';
      case 'adult-education': return 'bg-purple-100 text-purple-800';
      case 'council': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Learning
            </Button>
          </div>
          <h1 className="text-3xl font-bold">Find Local Digital Support</h1>
          <p className="text-lg opacity-90">
            Discover friendly places near you where you can get hands-on help with digital skills
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search for Help Near You</CardTitle>
            <CardDescription>
              Enter your postcode or area to find the closest digital support services
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter your postcode (e.g. B1 2ND, M2 5BH)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Type Filter */}
            <div className="flex flex-wrap gap-2">
              {resourceTypes.map((type) => (
                <Button
                  key={type.value}
                  variant={selectedType === type.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedType(type.value)}
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {filteredResources.length} {filteredResources.length === 1 ? 'result' : 'results'} found
            </h2>
            {searchTerm && (
              <p className="text-sm text-muted-foreground">
                Showing results for "{searchTerm}"
              </p>
            )}
          </div>

          {filteredResources.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No resources found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or selecting a different resource type.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedType('all');
                  }}
                >
                  Clear filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredResources.map((resource) => (
                <Card key={resource.id} className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{getTypeIcon(resource.type)}</span>
                          <div>
                            <CardTitle className="text-xl">{resource.name}</CardTitle>
                            <Badge className={getTypeColor(resource.type)}>
                              {resource.type.replace('-', ' ')}
                            </Badge>
                          </div>
                        </div>
                        <CardDescription className="text-base">
                          {resource.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Contact Info */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{resource.address}, {resource.postcode}</span>
                        </div>
                        {resource.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <a href={`tel:${resource.phone}`} className="hover:underline">
                              {resource.phone}
                            </a>
                          </div>
                        )}
                        {resource.email && (
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <a href={`mailto:${resource.email}`} className="hover:underline">
                              {resource.email}
                            </a>
                          </div>
                        )}
                        {resource.website && (
                          <div className="flex items-center gap-2 text-sm">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            <a
                              href={resource.website.startsWith('http') ? resource.website : `https://${resource.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline flex items-center gap-1"
                            >
                              Visit website <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <span>{resource.openingHours}</span>
                        </div>
                      </div>
                    </div>

                    {/* Services */}
                    <div>
                      <h4 className="font-semibold mb-2">Services offered:</h4>
                      <div className="flex flex-wrap gap-2">
                        {resource.services.map((service, index) => (
                          <Badge key={index} variant="secondary">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Accessibility */}
                    {resource.accessibility.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Accessibility className="h-4 w-4" />
                          Accessibility features:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {resource.accessibility.map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      {resource.phone && (
                        <Button size="sm">
                          <Phone className="h-4 w-4 mr-2" />
                          Call Now
                        </Button>
                      )}
                      {resource.website && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(
                            resource.website!.startsWith('http') ? resource.website! : `https://${resource.website!}`,
                            '_blank'
                          )}
                        >
                          <Globe className="h-4 w-4 mr-2" />
                          Visit Website
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Help Text */}
        <Card className="mt-8 bg-muted">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">💡 Tips for getting the most from local support</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Call ahead to check availability and book a session</li>
              <li>• Bring your own device if you have one - volunteers can help you learn on your own equipment</li>
              <li>• Don't worry about your skill level - everyone starts somewhere!</li>
              <li>• Many services are completely free and run by friendly volunteers</li>
              <li>• Some locations offer regular classes, while others provide drop-in support</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LocalResourceFinder;