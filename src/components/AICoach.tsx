import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, MessageSquare, Volume2, VolumeX, Lightbulb, Target, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AICoachProps {
  assessmentData?: any;
  currentProgress?: any;
  userContext?: string;
}

export const AICoach: React.FC<AICoachProps> = ({ 
  assessmentData, 
  currentProgress, 
  userContext 
}) => {
  const [guidance, setGuidance] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const getAIGuidance = async (requestType: 'guidance' | 'encouragement' | 'explanation' | 'next-steps' = 'guidance') => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-coach', {
        body: {
          assessmentData,
          currentProgress,
          userContext,
          requestType
        }
      });

      if (error) throw error;

      setGuidance(data.guidance);
      toast({
        title: "AI Coach Ready",
        description: "Your personalized guidance is ready!",
      });
    } catch (error) {
      console.error('Error getting AI guidance:', error);
      toast({
        title: "Unable to get guidance",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const speakText = async (text: string) => {
    if (speaking) {
      // Stop current audio
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        setCurrentAudio(null);
      }
      setSpeaking(false);
      return;
    }

    try {
      setSpeaking(true);
      
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: {
          text,
          voice: 'alloy', // Warm, friendly voice suitable for elderly users
          speed: 0.9 // Slightly slower for better comprehension
        }
      });

      if (error) throw error;

      // Create audio element and play
      const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
      setCurrentAudio(audio);
      
      audio.onended = () => {
        setSpeaking(false);
        setCurrentAudio(null);
      };
      
      audio.onerror = () => {
        setSpeaking(false);
        setCurrentAudio(null);
        toast({
          title: "Audio Error",
          description: "Unable to play audio. Please try again.",
          variant: "destructive",
        });
      };

      await audio.play();
      
    } catch (error) {
      console.error('Error with text-to-speech:', error);
      setSpeaking(false);
      toast({
        title: "Voice unavailable",
        description: "Text-to-speech is temporarily unavailable.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto border-primary/20 bg-gradient-to-br from-background to-primary/5">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <MessageSquare className="h-6 w-6 text-primary" />
          Your AI Learning Coach
        </CardTitle>
        <p className="text-muted-foreground">
          Get personalized guidance tailored to your digital skills journey
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <Button
            onClick={() => getAIGuidance('guidance')}
            disabled={loading}
            variant="default"
            className="h-auto py-3 px-4 flex flex-col items-center gap-2"
          >
            <Target className="h-5 w-5" />
            <span className="text-sm">Get Guidance</span>
          </Button>
          
          <Button
            onClick={() => getAIGuidance('encouragement')}
            disabled={loading}
            variant="outline"
            className="h-auto py-3 px-4 flex flex-col items-center gap-2"
          >
            <Heart className="h-5 w-5" />
            <span className="text-sm">Need Encouragement</span>
          </Button>
          
          <Button
            onClick={() => getAIGuidance('next-steps')}
            disabled={loading}
            variant="outline"
            className="h-auto py-3 px-4 flex flex-col items-center gap-2"
          >
            <Lightbulb className="h-5 w-5" />
            <span className="text-sm">What's Next?</span>
          </Button>
          
          {guidance && (
            <Button
              onClick={() => speakText(guidance)}
              disabled={loading}
              variant="secondary"
              className="h-auto py-3 px-4 flex flex-col items-center gap-2"
            >
              {speaking ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              <span className="text-sm">
                {speaking ? "Stop Voice" : "Listen"}
              </span>
            </Button>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg">Your AI coach is thinking...</span>
          </div>
        )}

        {/* AI Guidance Display */}
        {guidance && !loading && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                AI Coach Guidance
              </Badge>
              {speaking && (
                <Badge variant="outline" className="animate-pulse">
                  🔊 Speaking
                </Badge>
              )}
            </div>
            
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <div className="prose prose-sm max-w-none">
                {guidance.split('\n').map((paragraph, index) => (
                  paragraph.trim() && (
                    <p key={index} className="mb-3 last:mb-0 text-base leading-relaxed">
                      {paragraph}
                    </p>
                  )
                ))}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                onClick={() => getAIGuidance('guidance')}
                variant="ghost"
                size="sm"
                disabled={loading}
              >
                Get New Guidance
              </Button>
              <Button
                onClick={() => speakText(guidance)}
                variant="ghost"
                size="sm"
                disabled={loading}
              >
                {speaking ? "Stop Voice" : "🔊 Read Aloud"}
              </Button>
            </div>
          </div>
        )}

        {/* Welcome Message */}
        {!guidance && !loading && (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Welcome to your personal AI coach!
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                I'm here to help you on your digital skills journey. Click any button above to get started 
                with personalized guidance, encouragement, or to discover what you should learn next.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};