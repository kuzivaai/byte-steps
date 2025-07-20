import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { assessmentQuestions } from '../data/sampleData';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { AutoSaveIndicator } from '@/components/AutoSaveIndicator';
import { simplifiedCopy } from '@/content/simplifiedCopy';

interface InitialAssessmentProps {
  onComplete: (profile: any) => void;
}

const InitialAssessment: React.FC<InitialAssessmentProps> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saving, setSaving] = useState(false);

  const validatePostcode = (postcode: string): boolean => {
    // UK postcode first part validation: 1-2 letters followed by 1-2 numbers
    const regex = /^[A-Za-z]{1,2}[0-9]{1,2}$/;
    return regex.test(postcode.trim());
  };

  const sanitizeInput = (input: string): string => {
    // Remove any HTML tags and limit length
    return input.replace(/<[^>]*>/g, '').trim().slice(0, 10);
  };

  const handleAnswer = (questionId: string, value: string) => {
    let processedValue = value;
    
    // Validate and sanitize postcode input
    if (questionId === 'postcode') {
      processedValue = sanitizeInput(value).toUpperCase();
    }
    
    setAnswers(prev => ({ ...prev, [questionId]: processedValue }));
  };

  // Auto-save logic
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      setSaving(true);
      // Simulate save operation
      setTimeout(() => {
        setSaving(false);
        setLastSaved(new Date());
      }, 1000);
    }, 2000);

    return () => clearTimeout(saveTimer);
  }, [answers]);

  const handleNext = () => {
    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Assessment complete
      onComplete(answers);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const currentQ = assessmentQuestions[currentQuestion];
  const currentAnswer = answers[currentQ.id] || '';
  
  const isAnswered = () => {
    if (currentQ.type === 'text' && currentQ.id === 'postcode') {
      return currentAnswer.length > 0 && validatePostcode(currentAnswer);
    }
    return currentAnswer.length > 0;
  };
  
  const answeredStatus = isAnswered();
  const progress = ((currentQuestion + (answeredStatus ? 1 : 0)) / assessmentQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      {/* Skip to main content link */}
      <a 
        href="#assessment-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium"
        aria-label="Skip to assessment questions"
      >
        Skip to assessment questions
      </a>

      <div className="w-full max-w-2xl" role="main">
        {/* Progress */}
        <ProgressIndicator 
          current={currentQuestion + 1} 
          total={assessmentQuestions.length} 
          label={simplifiedCopy.assessment.title}
        />

        {/* Question Card */}
        <Card id="assessment-content" className="border-2 focus-within:ring-2 focus-within:ring-primary/20">
          <CardHeader>
            <CardTitle 
              className="text-2xl leading-relaxed" 
              id={`question-${currentQuestion}`}
              role="heading" 
              aria-level={1}
            >
              {currentQ.question}
            </CardTitle>
            {currentQ.note && (
              <CardDescription className="text-lg leading-relaxed">
                {currentQ.note}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {currentQ.type === 'radio' && currentQ.options && (
              <fieldset className="space-y-3">
                <legend className="sr-only">
                  {currentQ.question}
                </legend>
                {currentQ.options.map((option, index) => (
                  <label
                    key={option.value}
                    className="block p-6 border-2 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors focus-within:ring-4 focus-within:ring-primary/20"
                  >
                    <input
                      type="radio"
                      name={currentQ.id}
                      value={option.value}
                      checked={currentAnswer === option.value}
                      onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
                      className="mr-4 w-6 h-6 text-primary focus:ring-4 focus:ring-primary/20"
                      aria-describedby={`option-${currentQuestion}-${index}`}
                    />
                    <span 
                      className="text-xl leading-relaxed"
                      id={`option-${currentQuestion}-${index}`}
                    >
                      {option.label}
                    </span>
                  </label>
                ))}
              </fieldset>
            )}

            {currentQ.type === 'text' && (
              <div className="space-y-2">
                <Label htmlFor={currentQ.id} className="text-lg font-medium">
                  {currentQ.question}
                </Label>
                <Input
                  id={currentQ.id}
                  placeholder={currentQ.placeholder}
                  value={currentAnswer}
                  onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
                  className={`text-lg py-4 focus:ring-4 focus:ring-primary/20 focus:outline-none ${
                    currentQ.id === 'postcode' && currentAnswer && !validatePostcode(currentAnswer) 
                      ? 'border-destructive focus:ring-destructive/20' 
                      : ''
                  }`}
                  aria-describedby={currentQ.note ? `note-${currentQuestion}` : undefined}
                  aria-invalid={currentQ.id === 'postcode' && currentAnswer && !validatePostcode(currentAnswer)}
                />
                {currentQ.note && (
                  <p id={`note-${currentQuestion}`} className="text-base text-muted-foreground">
                    {currentQ.note}
                  </p>
                )}
                {currentQ.id === 'postcode' && currentAnswer && !validatePostcode(currentAnswer) && (
                  <p className="text-sm text-destructive mt-1" role="alert">
                    Please enter a valid UK postcode area (e.g. B1, M2, CF3)
                  </p>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="text-xl px-8 py-4 min-h-[48px] min-w-[120px] focus:ring-4 focus:ring-primary/20 focus:outline-none"
                aria-label={currentQuestion === 0 ? "Previous question (not available)" : "Go to previous question"}
              >
                <ArrowLeft className="h-5 w-5 mr-2" aria-hidden="true" />
                {simplifiedCopy.assessment.backButton}
              </Button>

              <Button
                onClick={handleNext}
                disabled={!answeredStatus}
                className="text-xl px-8 py-4 min-h-[48px] min-w-[120px] focus:ring-4 focus:ring-primary/20 focus:outline-none"
                aria-label={
                  currentQuestion === assessmentQuestions.length - 1 
                    ? "Complete assessment" 
                    : "Go to next question"
                }
              >
                {currentQuestion === assessmentQuestions.length - 1 ? (
                  <>
                    {simplifiedCopy.assessment.finishButton} <CheckCircle className="ml-2 h-5 w-5" aria-hidden="true" />
                  </>
                ) : (
                  <>
                    {simplifiedCopy.assessment.nextButton} <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {simplifiedCopy.assessment.subtitle}
          </p>
          <ul className="mt-4 text-base text-muted-foreground space-y-1">
            {simplifiedCopy.assessment.instructions.map((instruction, index) => (
              <li key={index}>• {instruction}</li>
            ))}
          </ul>
        </div>

        {/* Auto-save indicator */}
        <AutoSaveIndicator lastSaved={lastSaved} saving={saving} />
      </div>
    </div>
  );
};

export default InitialAssessment;