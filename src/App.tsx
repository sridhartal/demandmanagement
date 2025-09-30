import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useOnboarding } from './hooks/useOnboarding';
import { AuthForm } from './components/auth/AuthForm';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DemandPlansList } from './components/demand-plans/DemandPlansList';
import { CreateManualPlan } from './components/demand-plans/CreateManualPlan';
import { BulkUpload } from './components/demand-plans/BulkUpload';
import { AICreate } from './components/demand-plans/AICreate';
import { ApprovalsList } from './components/approvals/ApprovalsList';
import { Analytics } from './components/analytics/Analytics';
import { Settings } from './components/settings/Settings';
import { OnboardingTooltip } from './components/onboarding/OnboardingTooltip';
import { OrgChartBuilder } from './components/org-chart/OrgChartBuilder';

function App() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('demand-plans');
  const { steps, currentStep, isOnboardingActive, completeStep, skipOnboarding } = useOnboarding();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onAuthSuccess={() => window.location.reload()} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'demand-plans':
        return <DemandPlansList />;
      case 'create-manual':
        return (
          <CreateManualPlan
            onBack={() => setActiveTab('demand-plans')}
            onBulkUpload={() => setActiveTab('bulk-upload')}
          />
        );
      case 'bulk-upload':
        return <BulkUpload onBack={() => setActiveTab('demand-plans')} />;
      case 'ai-create':
        return <AICreate onBack={() => setActiveTab('demand-plans')} />;
      case 'approvals':
        return <ApprovalsList />;
      case 'analytics':
        return <Analytics />;
      case 'org-chart':
        return <OrgChartBuilder />;
      case 'settings':
        return <Settings />;
      default:
        return <DemandPlansList />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userEmail={user.email} />
      
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="flex-1 lg:ml-72">
          <div className="p-6">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Onboarding */}
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