import React, { useCallback, ReactElement } from 'react';
import { FormStep } from '../types';
import StepIndicator from './StepIndicator';
import Button from './ui/Button';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';
import { CheckIcon } from './icons/CheckIcon';

interface MultiStepFormProps {
  steps: FormStep[];
  children: ReactElement[];
  onFormSubmit: (e: React.FormEvent) => void;
  validateStep: (step: number) => boolean | Promise<boolean>;
  currentStep: number;
  setCurrentStep: (step: number | ((prevStep: number) => number)) => void;
}

const MultiStepForm: React.FC<MultiStepFormProps> = ({ steps, children, onFormSubmit, validateStep, currentStep, setCurrentStep }) => {
  const totalSteps = steps.length;

  const handleNext = useCallback(async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      if (currentStep < totalSteps) {
        setCurrentStep(prev => prev + 1);
      }
    }
  }, [validateStep, currentStep, totalSteps, setCurrentStep]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep, setCurrentStep]);

  return (
    <div className="w-full">
      <StepIndicator currentStep={currentStep} totalSteps={totalSteps} steps={steps} />
      <form onSubmit={onFormSubmit} className="mt-6 space-y-4">
        <div className="min-h-[280px] md:min-h-[320px]">
          {React.Children.toArray(children)[currentStep - 1]}
        </div>
        <div className="flex justify-between items-center pt-5 border-t border-gray-200">
          <Button type="button" onClick={handlePrevious} disabled={currentStep === 1} variant="secondary" className="flex items-center">
            <ArrowLeftIcon className="w-5 h-5 mr-2" /> Previous
          </Button>
          {currentStep < totalSteps ? (
            <Button type="button" onClick={handleNext} variant="primary" className="flex items-center">
              Next <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Button>
          ) : (
            <Button type="submit" variant="primary" className="flex items-center bg-green-500 hover:bg-green-600">
              Complete Profile <CheckIcon className="w-5 h-5 ml-2" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default MultiStepForm;