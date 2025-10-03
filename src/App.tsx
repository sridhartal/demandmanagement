import React, { useState, useEffect } from 'react';
import { useOnboarding } from './hooks/useOnboarding';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Breadcrumbs } from './components/layout/Breadcrumbs';
import { OnboardingTooltip } from './components/onboarding/OnboardingTooltip';
import { CreateManualPlan } from './components/demand-plans/CreateManualPlan';
import { BulkUpload } from './components/demand-plans/BulkUpload';
import { AICreate } from './components/demand-plans/AICreate';
import { DemandPlansList } from './components/demand-plans/DemandPlansList';
import { ApprovalsList } from './components/approvals/ApprovalsList';
import { Analytics } from './components/analytics/Analytics';
import { OrgChartBuilder } from './components/org-chart/OrgChartBuilder';
import { Settings } from './components/settings/Settings';

function App() {
  const { steps, currentStep, isOnboardingActive, completeStep, skipOnboarding } = useOnboarding();
  const [activeTab, setActiveTab] = useState('demand-plans');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

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

  const getBreadcrumbs = () => {
    const breadcrumbMap: { [key: string]: { label: string; parent?: string } } = {
      'demand-plans': { label: 'Dashboard' },
      'create-manual': { label: 'Create Manually', parent: 'demand-plans' },
      'bulk-upload': { label: 'Bulk Upload', parent: 'demand-plans' },
      'ai-create': { label: 'AI Assistant', parent: 'demand-plans' },
      'approvals': { label: 'Approvals' },
      'analytics': { label: 'Analytics & Reports' },
      'org-chart': { label: 'Org Chart Builder' },
      'settings': { label: 'Settings' }
    };

    const current = breadcrumbMap[activeTab];
    if (!current) return [];

    const items = [];
    if (current.parent) {
      const parent = breadcrumbMap[current.parent];
      items.push({
        label: parent.label,
        onClick: () => setActiveTab(current.parent!)
      });
    }
    items.push({ label: current.label });
    
    return items;
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
      case 'org-chart':
        return <OrgChartBuilder />;
      case 'settings':
        return <Settings />;
      default:
        return <DemandPlansList onNavigate={handleTabChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header userEmail={mockUser.email} />
      
      <div className="flex min-h-screen">
        <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
        
        <main className={`flex-1 p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden transition-all duration-300 ${
          isFullscreen ? 'lg:ml-0' : 'lg:ml-72'
        }`}>
          <Breadcrumbs items={getBreadcrumbs()} />
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