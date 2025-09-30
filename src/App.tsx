import React, { useState, useEffect } from 'react';
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

export default function App() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('demand-plans');
  const { steps, currentStep, isOnboardingActive, completeStep, skipOnboarding } = useOnboarding();

  const handleAuthSuccess = () => {
    // Auth success handled by useAuth hook
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 flex flex-col lg:ml-0">
        <Header userEmail={user.email} />
        
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
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