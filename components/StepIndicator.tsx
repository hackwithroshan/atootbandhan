
import React from 'react';
import { FormStep } from '../types';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: FormStep[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps, steps }) => {
  return (
    <div className="mb-6 md:mb-8">
      <h2 className="text-xl font-semibold text-gray-700 mb-1 text-center">{steps[currentStep-1]?.title || `Step ${currentStep}`}</h2>
      <p className="text-sm text-gray-500 mb-6 text-center">Step {currentStep} of {totalSteps}</p>
      <nav aria-label="Progress">
        <ol role="list" className="flex items-start"> {/* items-start for variable height labels */}
          {steps.map((step, index) => (
            <li key={step.id} className={`relative flex-1 ${index < totalSteps -1 ? 'pr-4 sm:pr-8' : ''}`}>
              <div className="flex flex-col items-center">
                <div className="relative">
                    {currentStep > step.id ? (
                        <div className="absolute inset-0 top-1/2 -translate-y-1/2 flex items-center" aria-hidden="true" style={{left: '-50%', right: '50%'}}>
                        <div className="h-1 w-full bg-rose-500"></div>
                        </div>
                    ) : currentStep === step.id && index > 0 ? (
                        <div className="absolute inset-0 top-1/2 -translate-y-1/2 flex items-center" aria-hidden="true" style={{left: '-50%', right: '50%'}}>
                        <div className="h-1 w-full bg-gray-200"></div>
                        <div className="h-1 w-1/2 bg-rose-500 ml-auto"></div>
                        </div>
                    ) : index > 0 ? (
                         <div className="absolute inset-0 top-1/2 -translate-y-1/2 flex items-center" aria-hidden="true" style={{left: '-50%', right: '50%'}}>
                            <div className="h-1 w-full bg-gray-200"></div>
                         </div>
                    ): null}
                     {index < totalSteps - 1 && currentStep > step.id +1 ? (
                        <div className="absolute inset-0 top-1/2 -translate-y-1/2 flex items-center" aria-hidden="true" style={{left: '50%', right: '-50%'}}>
                        <div className="h-1 w-full bg-rose-500"></div>
                        </div>
                    ) : index < totalSteps - 1 && currentStep === step.id +1 ? (
                         <div className="absolute inset-0 top-1/2 -translate-y-1/2 flex items-center" aria-hidden="true" style={{left: '50%', right: '-50%'}}>
                            <div className="h-1 w-full bg-gray-200"></div>
                            <div className="h-1 w-1/2 bg-rose-500"></div>
                        </div>
                    ) : index < totalSteps -1 ? (
                        <div className="absolute inset-0 top-1/2 -translate-y-1/2 flex items-center" aria-hidden="true" style={{left: '50%', right: '-50%'}}>
                            <div className="h-1 w-full bg-gray-200"></div>
                        </div>
                    ) : null}


                    <div
                        className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-300 ease-in-out
                        ${currentStep > step.id ? 'bg-rose-500 hover:bg-rose-600' : currentStep === step.id ? 'border-2 border-rose-500 bg-white scale-110 shadow-lg' : 'border-2 border-gray-300 bg-white hover:border-gray-400'}
                        `}
                    >
                        {currentStep > step.id ? (
                        <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                        </svg>
                        ) : (
                        <span className={`text-sm font-medium ${currentStep === step.id ? 'text-rose-500' : 'text-gray-500'}`}>
                            {step.id}
                        </span>
                        )}
                    </div>
                </div>
                <p className={`mt-2.5 text-xs text-center w-20 break-words ${currentStep >= step.id ? 'text-rose-600 font-medium' : 'text-gray-500'}`}>
                    {step.name}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default StepIndicator;
