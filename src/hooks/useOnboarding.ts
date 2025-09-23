import { useState, useEffect } from 'react';
import { OnboardingStep } from '../types';

export function useOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isOnboardingActive, setIsOnboardingActive] = useState(false);
  const [steps] = useState<OnboardingStep[]>([
    {
      id: '1',
      title: 'Welcome to Demand Management',
      description: 'Let\'s get you started with creating your first demand plan.',
      completed: false,
      target_element: '#welcome-card'
    },
    {
      id: '2',
      title: 'Create Your First Demand Plan',
      description: 'Click the "Create Demand Plan" button to start the wizard.',
      completed: false,
      target_element: '#create-plan-btn'
    },
    {
      id: '3',
      title: 'Explore Bulk Upload',
      description: 'You can upload multiple requisitions using our Excel template.',
      completed: false,
      target_element: '#bulk-upload-btn'
    },
    {
      id: '4',
      title: 'Try AI Creation',
      description: 'Use natural language to describe your hiring needs.',
      completed: false,
      target_element: '#ai-create-btn'
    }
  ]);

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem('onboarding-completed');
    if (!hasCompletedOnboarding) {
      setIsOnboardingActive(true);
    }
  }, []);

  const completeStep = (stepId: string) => {
    const updatedSteps = steps.map(step =>
      step.id === stepId ? { ...step, completed: true } : step
    );
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsOnboardingActive(false);
      localStorage.setItem('onboarding-completed', 'true');
    }
  };

  const skipOnboarding = () => {
    setIsOnboardingActive(false);
    localStorage.setItem('onboarding-completed', 'true');
  };

  return {
    steps,
    currentStep,
    isOnboardingActive,
    completeStep,
    skipOnboarding
  };
}