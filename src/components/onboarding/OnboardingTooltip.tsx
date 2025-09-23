import React from 'react';
import { X, ArrowRight } from 'lucide-react';
import { OnboardingStep } from '../../types';

interface OnboardingTooltipProps {
  step: OnboardingStep;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onSkip: () => void;
}

export function OnboardingTooltip({ 
  step, 
  currentStep, 
  totalSteps, 
  onNext, 
  onSkip 
}: OnboardingTooltipProps) {
  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative h-full flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full pointer-events-auto">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
              <p className="text-sm text-gray-500 mt-1">
                Step {currentStep + 1} of {totalSteps}
              </p>
            </div>
            <button
              onClick={onSkip}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-gray-700 mb-6">{step.description}</p>

          <div className="flex items-center justify-between">
            <button
              onClick={onSkip}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium"
            >
              Skip Tour
            </button>
            
            <button
              onClick={onNext}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span>{currentStep === totalSteps - 1 ? 'Finish' : 'Next'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 flex space-x-1">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded ${
                  index <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}