import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (items.length === 0) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm text-slate-600 mb-6" aria-label="Breadcrumb">
      <button 
        onClick={() => window.location.href = '/'}
        className="flex items-center p-1 rounded-md hover:bg-slate-100 transition-colors focus-ring"
        aria-label="Home"
      >
        <Home className="w-4 h-4" />
      </button>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          {index === items.length - 1 ? (
            <span className="font-medium text-slate-900 px-1">{item.label}</span>
          ) : (
            <button
              onClick={item.onClick}
              className="px-1 py-0.5 rounded-md hover:text-slate-900 hover:bg-slate-100 transition-colors focus-ring"
            >
              {item.label}
            </button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}