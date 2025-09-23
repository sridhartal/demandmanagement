import React, { useState } from 'react';
import { useOnboarding } from './hooks/useOnboarding';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { OnboardingTooltip } from './components/onboarding/OnboardingTooltip';
import { Dashboard } from './components/dashboard/Dashboard';
import { CreateManualPlan } from './components/demand-plans/CreateManualPlan';
import { BulkUpload } from './components/demand-plans/BulkUpload';
import { AICreate } from './components/demand-plans/AICreate';
import { DemandPlansList } from './components/demand-plans/DemandPlansList';
import { ApprovalsList } from './components/approvals/ApprovalsList';
import { Analytics } from './components/analytics/Analytics';
import { Settings } from './components/settings/Settings';

function App() {
  const { steps, currentStep, isOnboardingActive, completeStep, skipOnboarding } = useOnboarding();
  const [activeTab, setActiveTab] = useState('demand-plans');

  // Mock user data
  const mockUser = {
    email: 'john.doe@company.com',
    full_name: 'John Doe',
    role: 'hr' as const,
    department: 'Human Resources'
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    // Complete onboarding steps based on navigation
    if (isOnboardingActive) {
      const stepMapping: { [key: string]: string } = {
        'create-manual': '2',
        'bulk-upload': '3',
        'ai-create': '4'
      };
      
      if (stepMapping[tab]) {
        completeStep(stepMapping[tab]);
      }
    }
  };

  const renderMainContent = () => {
    switch (activeTab) {
      case 'create-manual':
        return <CreateManualPlan onBack={() => setActiveTab('dashboard')} onBulkUpload={() => setActiveTab('bulk-upload')} />;
      case 'bulk-upload':
        return <BulkUpload onBack={() => setActiveTab('demand-plans')} />;
      case 'ai-create':
        return <AICreate onBack={() => setActiveTab('demand-plans')} />;
      case 'demand-plans':
        return <DemandPlansList onNavigate={handleTabChange} />;
      case 'approvals':
        return <ApprovalsList />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <DemandPlansList onNavigate={handleTabChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header userEmail={mockUser.email} />
      
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
        
        <main className="flex-1 p-8">
          {renderMainContent()}
        </main>
      </div>

      {/* Onboarding Overlay */}
      {isOnboardingActive && (
        <OnboardingTooltip
          step={steps[currentStep]}
          currentStep={currentStep}
          totalSteps={steps.length}
          onNext={() => completeStep(steps[currentStep].id)}
          onSkip={skipOnboarding}
        />
      )}
    </div>
  );
}

export default App;