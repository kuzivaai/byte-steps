import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ArrowLeft, ArrowRight, CheckCircle, PlayCircle, Volume2, RefreshCw } from 'lucide-react';
import { LearningModule, LearningStep } from '../types';

interface LearningModuleViewProps {
  module: LearningModule;
  onComplete: () => void;
  onBack: () => void;
}

const LearningModuleView: React.FC<LearningModuleViewProps> = ({ 
  module, 
  onComplete, 
  onBack 
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [showQuizResult, setShowQuizResult] = useState(false);

  const currentStep = module.steps[currentStepIndex];
  const isLastStep = currentStepIndex === module.steps.length - 1;
  const progress = ((completedSteps.length) / module.steps.length) * 100;

  const handleStepComplete = () => {
    if (!completedSteps.includes(currentStep.id)) {
      setCompletedSteps(prev => [...prev, currentStep.id]);
    }

    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStepIndex(prev => prev + 1);
      setQuizAnswer(null);
      setShowQuizResult(false);
    }
  };

  const handleQuizSubmit = () => {
    if (quizAnswer !== null) {
      setShowQuizResult(true);
      if (!completedSteps.includes(currentStep.id)) {
        setCompletedSteps(prev => [...prev, currentStep.id]);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      setQuizAnswer(null);
      setShowQuizResult(false);
    }
  };

  const handleRetryQuiz = () => {
    setQuizAnswer(null);
    setShowQuizResult(false);
  };

  // Simple text-to-speech for accessibility
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8; // Slightly slower for older adults
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="text-primary-foreground hover:bg-primary-foreground/20"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Lessons
              </Button>
            </div>
            <Badge variant="secondary" className="text-sm">
              Step {currentStepIndex + 1} of {module.steps.length}
            </Badge>
          </div>
          <h1 className="text-2xl font-bold mt-2">{module.title}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-muted-foreground">Progress</p>
            <p className="text-sm text-muted-foreground">
              {completedSteps.length} of {module.steps.length} steps completed
            </p>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        {/* Current Step */}
        <div className="max-w-4xl mx-auto">
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{currentStep.title}</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => speakText(currentStep.content)}
                  title="Listen to this step"
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step Content */}
              <div className="prose prose-lg max-w-none">
                <p className="text-lg leading-relaxed">{currentStep.content}</p>
              </div>

              {/* Media */}
              {currentStep.media && (
                <div className="text-center">
                  {currentStep.media.type === 'image' && (
                    <img
                      src={currentStep.media.url}
                      alt={currentStep.media.alt || 'Instructional image'}
                      className="mx-auto max-w-md rounded-lg border"
                    />
                  )}
                  {currentStep.media.type === 'audio' && (
                    <audio controls className="mx-auto">
                      <source src={currentStep.media.url} type="audio/mpeg" />
                      Your browser does not support audio playback.
                    </audio>
                  )}
                </div>
              )}

              {/* Quiz */}
              {currentStep.type === 'quiz' && currentStep.quiz && (
                <Card className="bg-muted">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Quick Check
                    </CardTitle>
                    <CardDescription>
                      {currentStep.quiz.question}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!showQuizResult ? (
                      <div className="space-y-3">
                        {currentStep.quiz.options.map((option, index) => (
                          <label
                            key={index}
                            className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-background transition-colors"
                          >
                            <input
                              type="radio"
                              name="quiz-answer"
                              value={index}
                              checked={quizAnswer === index}
                              onChange={() => setQuizAnswer(index)}
                              className="mt-1 h-4 w-4 text-primary"
                            />
                            <span className="leading-relaxed">{option}</span>
                          </label>
                        ))}
                        <Button
                          onClick={handleQuizSubmit}
                          disabled={quizAnswer === null}
                          className="mt-4"
                        >
                          Check Answer
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {quizAnswer === currentStep.quiz.correctAnswer ? (
                          <div className="p-4 bg-success/10 border border-success rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle className="h-5 w-5 text-success" />
                              <span className="font-semibold text-success">Correct!</span>
                            </div>
                            <p>{currentStep.quiz.explanation}</p>
                          </div>
                        ) : (
                          <div className="p-4 bg-warning/10 border border-warning rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <RefreshCw className="h-5 w-5 text-warning" />
                              <span className="font-semibold text-warning">Not quite right</span>
                            </div>
                            <p className="mb-3">{currentStep.quiz.explanation}</p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleRetryQuiz}
                            >
                              Try Again
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStepIndex === 0}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous Step
                </Button>

                <Button
                  onClick={handleStepComplete}
                  size="lg"
                  disabled={
                    currentStep.type === 'quiz' && 
                    (!showQuizResult || quizAnswer !== currentStep.quiz?.correctAnswer)
                  }
                >
                  {isLastStep ? (
                    <>
                      Complete Module <CheckCircle className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Next Step <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Step Summary */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-2">
            {module.steps.map((step, index) => (
              <div
                key={step.id}
                className={`p-2 text-center rounded-lg border ${
                  index === currentStepIndex
                    ? 'bg-primary text-primary-foreground border-primary'
                    : completedSteps.includes(step.id)
                    ? 'bg-success/10 border-success text-success'
                    : 'bg-muted border-muted-foreground/20'
                }`}
              >
                <div className="text-xs font-medium">
                  Step {index + 1}
                </div>
                <div className="text-xs truncate mt-1">
                  {step.title}
                </div>
                {completedSteps.includes(step.id) && (
                  <CheckCircle className="h-3 w-3 mx-auto mt-1" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningModuleView;