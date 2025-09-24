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
  X
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
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(['demand-plans']);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems: MenuItem[] = [
    {
      id: 'demand-plan',
      label: 'Demand Plan',
      icon: FileText,
      children: [
        { id: 'demand-plans', label: 'Dashboard', icon: List },
        { id: 'create-manual', label: 'Create Manually', icon: Plus },
        { id: 'bulk-upload', label: 'Bulk Upload', icon: Upload },
        { id: 'ai-create', label: 'AI Assistant', icon: Bot }
      ]
    },
    {
      id: 'approvals',
      label: 'Approvals',
      icon: Users,
      badge: 4
    },
    {
      id: 'analytics',
      label: 'Analytics & Reports',
      icon: BarChart3
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
      <div key={item.id}>
        <button
          onClick={() => handleItemClick(item.id, hasChildren)}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all duration-200 group ${
            level === 0 ? 'mb-1' : 'mb-0.5 ml-4'
          } ${
            isActive && !hasChildren
              ? 'bg-blue-600 text-white shadow-md'
              : isActive && hasChildren
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center space-x-3">
            <IconComponent className={`w-5 h-5 ${
              level === 0 ? '' : 'w-4 h-4'
            } ${
              isActive && !hasChildren ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
            }`} />
            <span className={`font-medium ${
              level === 0 ? 'text-sm' : 'text-xs'
            }`}>
              {item.label}
            </span>
            {item.badge && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full min-w-[20px] text-center">
                {item.badge}
              </span>
            )}
          </div>
          
          {hasChildren && (
            <div className="flex items-center">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </div>
          )}
        </button>

        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-0.5">
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
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-gray-600" />
        ) : (
          <Menu className="w-6 h-6 text-gray-600" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-200 
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Navigation</h2>
                <p className="text-xs text-gray-500">Demand Management</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map(item => renderMenuItem(item))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              <p>Need help?</p>
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}