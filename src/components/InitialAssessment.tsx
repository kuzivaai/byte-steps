import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { assessmentQuestions } from '../data/sampleData';

interface InitialAssessmentProps {
  onComplete: (profile: any) => void;
}

const InitialAssessment: React.FC<InitialAssessmentProps> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

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
  const isAnswered = currentAnswer.length > 0;
  const progress = ((currentQuestion + (isAnswered ? 1 : 0)) / assessmentQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {assessmentQuestions.length}
            </p>
            <p className="text-sm text-muted-foreground">
              {Math.round(progress)}% complete
            </p>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        {/* Question Card */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-xl leading-relaxed">
              {currentQ.question}
            </CardTitle>
            {currentQ.note && (
              <CardDescription className="text-base">
                {currentQ.note}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {currentQ.type === 'radio' && currentQ.options && (
              <div className="space-y-3">
                {currentQ.options.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <input
                      type="radio"
                      name={currentQ.id}
                      value={option.value}
                      checked={currentAnswer === option.value}
                      onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
                      className="mt-1 h-4 w-4 text-primary"
                    />
                    <span className="text-base leading-relaxed">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {currentQ.type === 'text' && (
              <div className="space-y-2">
                <Label htmlFor={currentQ.id} className="text-base">
                  {currentQ.question}
                </Label>
                <Input
                  id={currentQ.id}
                  placeholder={currentQ.placeholder}
                  value={currentAnswer}
                  onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
                  className="text-lg py-3"
                />
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <Button
                onClick={handleNext}
                disabled={!isAnswered}
                size="lg"
              >
                {currentQuestion === assessmentQuestions.length - 1 ? (
                  <>
                    Complete <CheckCircle className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            These questions help us recommend the best learning path for you. 
            You can change your preferences anytime.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InitialAssessment;