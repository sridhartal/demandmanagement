import React, { useState } from 'react';
import { 
  BarChart3, 
  FileText, 
  Upload, 
  Bot, 
  Users, 
  Settings, 
  ChevronDown, 
  ChevronRight,
  Plus,
  List,
  Menu,
  X,
  Building2,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  children?: MenuItem[];
  badge?: number;
  badgeColor?: string;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(['demand-plans']);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems: MenuItem[] = [
    {
      id: 'demand-plans',
      label: 'Requisitions',
      icon: FileText,
      children: [
        { id: 'demand-plans', label: 'All Requisitions', icon: List },
        { id: 'create-manual', label: 'Create Requisition', icon: Plus },
        { id: 'bulk-upload', label: 'Bulk Import', icon: Upload },
        { id: 'ai-create', label: 'AI Assistant', icon: Bot }
      ]
    },
    {
      id: 'approvals',
      label: 'Approvals',
      icon: CheckCircle,
      badge: 4,
      badgeColor: 'bg-amber-100 text-amber-700'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: TrendingUp
    },
    {
      id: 'org-chart',
      label: 'Organization',
      icon: Building2
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings
    }
  ];

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleItemClick = (itemId: string, hasChildren: boolean) => {
    if (hasChildren) {
      toggleExpanded(itemId);
    } else {
      onTabChange(itemId);
      setIsMobileMenuOpen(false);
    }
  };

  const isItemActive = (itemId: string, children?: MenuItem[]) => {
    if (activeTab === itemId) return true;
    if (children) {
      return children.some(child => child.id === activeTab);
    }
    return false;
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const isActive = isItemActive(item.id, item.children);
    const IconComponent = item.icon;

    return (
      <div key={item.id} className="mb-1">
        <button
          onClick={() => handleItemClick(item.id, hasChildren)}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all duration-200 group ${
            level === 0 ? '' : 'ml-6'
          } ${
            isActive && !hasChildren
              ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-600 font-medium'
              : isActive && hasChildren
              ? 'bg-slate-100 text-slate-900 font-medium'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <div className="flex items-center space-x-3">
            <IconComponent className={`w-5 h-5 ${
              level === 0 ? '' : 'w-4 h-4'
            } ${
              isActive && !hasChildren ? 'text-indigo-600' : 'text-slate-500 group-hover:text-slate-700'
            }`} />
            <span className={`text-sm ${level === 0 ? 'font-medium' : ''}`}>
              {item.label}
            </span>
            {item.badge && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                item.badgeColor || 'bg-red-100 text-red-700'
              }`}>
                {item.badge}
              </span>
            )}
          </div>
          
          {hasChildren && (
            <div className="flex items-center">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400" />
              )}
            </div>
          )}
        </button>

        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children!.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-medium border border-slate-200 focus-ring"
      >
        {isMobileMenuOpen ? (
          <X className="w-5 h-5 text-slate-600" />
        ) : (
          <Menu className="w-5 h-5 text-slate-600" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-200 
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-sm">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">Navigation</h2>
                <p className="text-xs text-slate-500">Talent Management</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map(item => renderMenuItem(item))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-slate-200 bg-slate-50">
            <div className="text-center">
              <p className="text-xs text-slate-500 mb-2">Need assistance?</p>
              <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}