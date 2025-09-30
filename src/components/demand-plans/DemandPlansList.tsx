import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Building2, Users, Download, Upload, Plus, Trash2, CreditCard as Edit2, Save, Eye, EyeOff, ZoomIn, ZoomOut, RotateCcw, FileText, CheckCircle, AlertCircle, Loader2, ArrowRight, ArrowLeft, X, Info, ChevronDown, ChevronRight, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

// Accessibility utilities
const announceToScreenReader = (message) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(() => document.body.removeChild(announcement), 1000);
};

const trapFocus = (element) => {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleTabKey = (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  };

  element.addEventListener('keydown', handleTabKey);
  firstElement?.focus();

  return () => element.removeEventListener('keydown', handleTabKey);
};

// Validation utilities with accessibility
const validateDepartmentName = (name) => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, message: 'Department name is required', severity: 'error' };
  }
  if (name.trim().length < 2) {
    return { isValid: false, message: 'Department name must be at least 2 characters', severity: 'error' };
  }
  if (name.trim().length > 50) {
    return { isValid: false, message: 'Department name must be less than 50 characters', severity: 'error' };
  }
  if (!/^[a-zA-Z0-9\s&-]+$/.test(name.trim())) {
    return { isValid: false, message: 'Only letters, numbers, spaces, & and - are allowed', severity: 'error' };
  }
  return { isValid: true, message: 'Valid department name', severity: 'success' };
};

const validatePersonName = (name) => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, message: 'Name is required', severity: 'error' };
  }
  if (name.trim().length < 2) {
    return { isValid: false, message: 'Name must be at least 2 characters', severity: 'error' };
  }
  if (name.trim().length > 100) {
    return { isValid: false, message: 'Name must be less than 100 characters', severity: 'error' };
  }
  if (!/^[a-zA-Z\s'-]+$/.test(name.trim())) {
    return { isValid: false, message: 'Only letters, spaces, apostrophes and hyphens are allowed', severity: 'error' };
  }
  return { isValid: true, message: 'Valid name', severity: 'success' };
};

const validateJobTitle = (title) => {
  if (!title || title.trim().length === 0) {
    return { isValid: false, message: 'Job title is required', severity: 'error' };
  }
  if (title.trim().length < 2) {
    return { isValid: false, message: 'Job title must be at least 2 characters', severity: 'error' };
  }
  if (title.trim().length > 100) {
    return { isValid: false, message: 'Job title must be less than 100 characters', severity: 'error' };
  }
  return { isValid: true, message: 'Valid job title', severity: 'success' };
};

const validateEmail = (email) => {
  if (!email || email.trim().length === 0) {
    return { isValid: true, message: 'Email is optional', severity: 'info' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, message: 'Please enter a valid email address', severity: 'error' };
  }
  return { isValid: true, message: 'Valid email address', severity: 'success' };
};

// Accessible Toast Component
const AccessibleToast = ({ message, type, onClose, id }) => {
  const toastRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(onClose, 5000); // Increased from 3s to 5s for accessibility
    
    // Focus management for screen readers
    if (toastRef.current) {
      toastRef.current.focus();
    }

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const getAriaLabel = () => {
    const typeText = type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Information';
    return `${typeText} notification: ${message}`;
  };

  return (
    <div
      ref={toastRef}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      aria-label={getAriaLabel()}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300 min-w-80 max-w-md ${
        type === 'success' ? 'bg-green-600 text-white' : 
        type === 'error' ? 'bg-red-600 text-white' : 
        'bg-blue-600 text-white'
      } focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {type === 'success' && <CheckCircle className="w-5 h-5" aria-hidden="true" />}
          {type === 'error' && <AlertCircle className="w-5 h-5" aria-hidden="true" />}
          {type === 'info' && <Info className="w-5 h-5" aria-hidden="true" />}
        </div>
        <div className="flex-1">
          <p className="font-medium">{message}</p>
          <p className="text-sm opacity-90 mt-1">Press Escape to dismiss</p>
        </div>
        <button
          onClick={onClose}
          aria-label="Close notification"
          className="flex-shrink-0 p-1 rounded hover:bg-white hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-current transition-colors"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

// Accessible Input Component with Progressive Enhancement
const AccessibleInput = ({ 
  label, 
  value, 
  onChange, 
  validator, 
  placeholder, 
  required = false,
  type = 'text',
  className = '',
  id,
  describedBy,
  autoComplete,
  ...props
}) => {
  const [touched, setTouched] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validation, setValidation] = useState({ isValid: true, message: '', severity: 'info' });
  const inputRef = useRef(null);
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = `${inputId}-error`;
  const helpId = `${inputId}-help`;

  const validateInput = useCallback((inputValue) => {
    if (!validator) return { isValid: true, message: '', severity: 'info' };
    return validator(inputValue);
  }, [validator]);

  useEffect(() => {
    if (touched && value !== undefined) {
      setIsValidating(true);
      const timer = setTimeout(() => {
        const result = validateInput(value);
        setValidation(result);
        setIsValidating(false);
        
        // Announce validation result to screen readers
        if (result.severity === 'error') {
          announceToScreenReader(`Error: ${result.message}`);
        } else if (result.severity === 'success') {
          announceToScreenReader(`Valid: ${result.message}`);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [value, touched, validateInput]);

  const handleBlur = () => {
    setTouched(true);
  };

  const getInputClassName = () => {
    let baseClass = `w-full px-3 py-2 border rounded-lg transition-all duration-200 ${className}`;
    
    if (!touched) {
      return `${baseClass} border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200`;
    }
    
    if (isValidating) {
      return `${baseClass} border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200`;
    }
    
    if (validation.isValid && validation.severity === 'success') {
      return `${baseClass} border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-green-50`;
    } else if (!validation.isValid) {
      return `${baseClass} border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50`;
    }
    
    return `${baseClass} border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200`;
  };

  const getAriaDescribedBy = () => {
    const ids = [];
    if (describedBy) ids.push(describedBy);
    if (touched && validation.message) ids.push(errorId);
    if (placeholder) ids.push(helpId);
    return ids.length > 0 ? ids.join(' ') : undefined;
  };

  return (
    <div className="space-y-1">
      <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
      </label>
      
      <div className="relative">
        <input
          ref={inputRef}
          id={inputId}
          type={type}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={getInputClassName()}
          aria-required={required}
          aria-invalid={touched && !validation.isValid}
          aria-describedby={getAriaDescribedBy()}
          autoComplete={autoComplete}
          {...props}
        />
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2" aria-hidden="true">
          {isValidating && <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />}
          {!isValidating && touched && validation.isValid && validation.severity === 'success' && (
            <CheckCircle className="w-4 h-4 text-green-500" />
          )}
          {!isValidating && touched && !validation.isValid && (
            <AlertCircle className="w-4 h-4 text-red-500" />
          )}
        </div>
      </div>
      
      {placeholder && (
        <div id={helpId} className="text-xs text-gray-500">
          {placeholder}
        </div>
      )}
      
      {touched && validation.message && (
        <div
          id={errorId}
          role={validation.severity === 'error' ? 'alert' : 'status'}
          aria-live="polite"
          className={`text-sm flex items-center space-x-1 ${
            validation.severity === 'success' ? 'text-green-600' : 
            validation.severity === 'error' ? 'text-red-600' : 
            'text-blue-600'
          }`}
        >
          {validation.severity === 'success' ? (
            <CheckCircle className="w-4 h-4" aria-hidden="true" />
          ) : validation.severity === 'error' ? (
            <AlertCircle className="w-4 h-4" aria-hidden="true" />
          ) : (
            <Info className="w-4 h-4" aria-hidden="true" />
          )}
          <span>{validation.message}</span>
        </div>
      )}
    </div>
  );
};

// Accessible Modal Component
const AccessibleModal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      const cleanup = trapFocus(modalRef.current);
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      return () => {
        cleanup();
        document.body.style.overflow = 'unset';
        previousFocusRef.current?.focus();
      };
    }
  }, [isOpen]);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} transform transition-all duration-200`}
        role="document"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Accessible Dropdown Alternative (Listbox)
const AccessibleSelect = ({ 
  label, 
  value, 
  onChange, 
  options, 
  placeholder = "Select an option",
  required = false,
  id,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const selectRef = useRef(null);
  const listboxRef = useRef(null);
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  const listboxId = `${selectId}-listbox`;

  const selectedOption = options.find(opt => opt.value === value);

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (isOpen && focusedIndex >= 0) {
          onChange(options[focusedIndex].value);
          setIsOpen(false);
          setFocusedIndex(-1);
        } else {
          setIsOpen(!isOpen);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setFocusedIndex(-1);
        selectRef.current?.focus();
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(0);
        } else {
          setFocusedIndex(Math.min(focusedIndex + 1, options.length - 1));
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(options.length - 1);
        } else {
          setFocusedIndex(Math.max(focusedIndex - 1, 0));
        }
        break;
      case 'Home':
        e.preventDefault();
        setFocusedIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setFocusedIndex(options.length - 1);
        break;
    }
  };

  const handleOptionClick = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
    setFocusedIndex(-1);
    selectRef.current?.focus();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-1" ref={selectRef}>
      <label htmlFor={selectId} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
      </label>
      
      <div className="relative">
        <button
          id={selectId}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby={`${selectId}-label`}
          aria-describedby={isOpen ? listboxId : undefined}
          className={`w-full px-3 py-2 text-left border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${className}`}
        >
          <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown 
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </button>

        {isOpen && (
          <ul
            ref={listboxRef}
            id={listboxId}
            role="listbox"
            aria-labelledby={`${selectId}-label`}
            className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
          >
            {options.map((option, index) => (
              <li
                key={option.value}
                role="option"
                aria-selected={value === option.value}
                onClick={() => handleOptionClick(option.value)}
                className={`px-3 py-2 cursor-pointer transition-colors ${
                  value === option.value 
                    ? 'bg-blue-100 text-blue-900' 
                    : focusedIndex === index
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {option.label}
                {value === option.value && (
                  <CheckCircle className="inline w-4 h-4 ml-2 text-blue-600" aria-hidden="true" />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

// Accessible Progress Indicator
const AccessibleProgress = ({ steps, currentStep, onStepClick }) => {
  return (
    <nav aria-label="Progress" className="bg-white border border-gray-200 rounded-lg p-6">
      <ol className="flex items-center justify-between" role="list">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isClickable = index <= currentStep;

          return (
            <li key={index} className="flex items-center">
              <div className="flex items-center">
                <button
                  onClick={() => isClickable && onStepClick(index)}
                  disabled={!isClickable}
                  aria-current={isCurrent ? 'step' : undefined}
                  aria-label={`${step.title}: ${step.description}${
                    isCompleted ? ' (completed)' : isCurrent ? ' (current)' : ''
                  }`}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isCompleted
                      ? 'bg-blue-600 text-white focus:ring-blue-500'
                      : isCurrent
                      ? 'bg-blue-600 text-white focus:ring-blue-500'
                      : isClickable
                      ? 'bg-gray-200 text-gray-600 hover:bg-gray-300 focus:ring-gray-500'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" aria-hidden="true" />
                  ) : (
                    <span aria-hidden="true">{index + 1}</span>
                  )}
                </button>
                <div className="ml-3">
                  <div className={`font-medium ${
                    isCurrent ? 'text-gray-900' : isCompleted ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-sm text-gray-500">{step.description}</div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div 
                  className={`w-16 h-px mx-8 transition-colors ${
                    isCompleted ? 'bg-blue-600' : 'bg-gray-300'
                  }`} 
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

// Main Organization Chart Builder Component
export function OrgChartBuilder() {
  const [currentStep, setCurrentStep] = useState(0);
  const [orgLevels, setOrgLevels] = useState(3);
  const [departments, setDepartments] = useState([]);
  const [personnel, setPersonnel] = useState([]);
  const [hierarchy, setHierarchy] = useState([]);
  const [showPersonnel, setShowPersonnel] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [toast, setToast] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Form states
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    color: '#3B82F6',
    level: 1,
    description: ''
  });

  const [newPerson, setNewPerson] = useState({
    name: '',
    title: '',
    email: '',
    departmentId: ''
  });

  const [editingDepartment, setEditingDepartment] = useState(null);
  const [editingPerson, setEditingPerson] = useState(null);

  const steps = [
    { title: 'Setup Levels', description: 'Define organizational structure' },
    { title: 'Departments', description: 'Create departments and add personnel' },
    { title: 'Hierarchy', description: 'Define reporting relationships' },
    { title: 'Visualize', description: 'View and export your org chart' }
  ];

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    
    const handleChange = (e) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const showToast = (message, type = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToast({ message, type, id });
  };

  const saveToHistory = () => {
    const state = { departments, personnel, hierarchy, orgLevels };
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(state);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setDepartments(prevState.departments);
      setPersonnel(prevState.personnel);
      setHierarchy(prevState.hierarchy);
      setOrgLevels(prevState.orgLevels);
      setHistoryIndex(historyIndex - 1);
      showToast('Action undone', 'info');
      announceToScreenReader('Previous action has been undone');
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setDepartments(nextState.departments);
      setPersonnel(nextState.personnel);
      setHierarchy(nextState.hierarchy);
      setOrgLevels(nextState.orgLevels);
      setHistoryIndex(historyIndex + 1);
      showToast('Action redone', 'info');
      announceToScreenReader('Action has been redone');
    }
  };

  const addDepartment = () => {
    const nameValidation = validateDepartmentName(newDepartment.name);
    if (!nameValidation.isValid) {
      showToast(nameValidation.message, 'error');
      return;
    }

    if (departments.some(dept => dept.name.toLowerCase() === newDepartment.name.toLowerCase())) {
      showToast('Department name already exists', 'error');
      return;
    }

    saveToHistory();
    const department = {
      id: Date.now().toString(),
      ...newDepartment,
      name: newDepartment.name.trim()
    };
    
    setDepartments([...departments, department]);
    setNewDepartment({ name: '', color: '#3B82F6', level: 1, description: '' });
    showToast('Department added successfully!', 'success');
    announceToScreenReader(`Department ${department.name} has been added`);
  };

  const updateDepartment = (id, updates) => {
    if (updates.name) {
      const nameValidation = validateDepartmentName(updates.name);
      if (!nameValidation.isValid) {
        showToast(nameValidation.message, 'error');
        return;
      }

      if (departments.some(dept => dept.id !== id && dept.name.toLowerCase() === updates.name.toLowerCase())) {
        showToast('Department name already exists', 'error');
        return;
      }
    }

    saveToHistory();
    setDepartments(departments.map(dept => 
      dept.id === id ? { ...dept, ...updates, name: updates.name?.trim() || dept.name } : dept
    ));
    setEditingDepartment(null);
    showToast('Department updated successfully!', 'success');
    announceToScreenReader('Department has been updated');
  };

  const deleteDepartment = (id) => {
    const dept = departments.find(d => d.id === id);
    if (!dept) return;

    saveToHistory();
    setDepartments(departments.filter(dept => dept.id !== id));
    setPersonnel(personnel.filter(person => person.departmentId !== id));
    setHierarchy(hierarchy.filter(rel => rel.parentId !== id && rel.childId !== id));
    showToast('Department deleted successfully!', 'success');
    announceToScreenReader(`Department ${dept.name} has been deleted`);
  };

  const addPerson = () => {
    const nameValidation = validatePersonName(newPerson.name);
    const titleValidation = validateJobTitle(newPerson.title);
    const emailValidation = validateEmail(newPerson.email);

    if (!nameValidation.isValid) {
      showToast(nameValidation.message, 'error');
      return;
    }
    if (!titleValidation.isValid) {
      showToast(titleValidation.message, 'error');
      return;
    }
    if (!emailValidation.isValid) {
      showToast(emailValidation.message, 'error');
      return;
    }
    if (!newPerson.departmentId) {
      showToast('Please select a department', 'error');
      return;
    }

    saveToHistory();
    const person = {
      id: Date.now().toString(),
      ...newPerson,
      name: newPerson.name.trim(),
      title: newPerson.title.trim(),
      email: newPerson.email.trim()
    };
    
    setPersonnel([...personnel, person]);
    setNewPerson({ name: '', title: '', email: '', departmentId: '' });
    showToast('Person added successfully!', 'success');
    announceToScreenReader(`${person.name} has been added to the organization`);
  };

  const updatePerson = (id, updates) => {
    if (updates.name) {
      const nameValidation = validatePersonName(updates.name);
      if (!nameValidation.isValid) {
        showToast(nameValidation.message, 'error');
        return;
      }
    }
    if (updates.title) {
      const titleValidation = validateJobTitle(updates.title);
      if (!titleValidation.isValid) {
        showToast(titleValidation.message, 'error');
        return;
      }
    }
    if (updates.email !== undefined) {
      const emailValidation = validateEmail(updates.email);
      if (!emailValidation.isValid) {
        showToast(emailValidation.message, 'error');
        return;
      }
    }

    saveToHistory();
    setPersonnel(personnel.map(person => 
      person.id === id ? { 
        ...person, 
        ...updates,
        name: updates.name?.trim() || person.name,
        title: updates.title?.trim() || person.title,
        email: updates.email?.trim() || person.email
      } : person
    ));
    setEditingPerson(null);
    showToast('Person updated successfully!', 'success');
    announceToScreenReader('Person information has been updated');
  };

  const deletePerson = (id) => {
    const person = personnel.find(p => p.id === id);
    if (!person) return;

    saveToHistory();
    setPersonnel(personnel.filter(person => person.id !== id));
    showToast('Person deleted successfully!', 'success');
    announceToScreenReader(`${person.name} has been removed from the organization`);
  };

  const downloadTemplate = () => {
    const headers = ['Level', 'Department', 'Person', 'Job Title', 'Email', 'Parent Department'];
    const sampleData = [
      ['1', 'Executive', 'John Smith', 'CEO', 'john@company.com', ''],
      ['2', 'Engineering', 'Jane Doe', 'VP Engineering', 'jane@company.com', 'Executive'],
      ['2', 'Sales', 'Bob Johnson', 'VP Sales', 'bob@company.com', 'Executive'],
      ['3', 'Frontend', 'Alice Brown', 'Frontend Lead', 'alice@company.com', 'Engineering'],
      ['3', 'Backend', 'Charlie Wilson', 'Backend Lead', 'charlie@company.com', 'Engineering']
    ];

    const csvContent = [headers, ...sampleData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'org-chart-template.csv';
    link.click();
    window.URL.revokeObjectURL(url);
    showToast('Template downloaded successfully!', 'success');
    announceToScreenReader('Organization chart template has been downloaded');
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
        
        if (!headers.includes('Department') || !headers.includes('Level')) {
          showToast('Invalid file format. Please use the provided template.', 'error');
          return;
        }

        const newDepartments = [];
        const newPersonnel = [];
        const newHierarchy = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim());
          const rowData = {};
          headers.forEach((header, index) => {
            rowData[header] = values[index] || '';
          });

          if (rowData.Department) {
            const deptId = `dept-${i}`;
            if (!newDepartments.find(d => d.name === rowData.Department)) {
              newDepartments.push({
                id: deptId,
                name: rowData.Department,
                level: parseInt(rowData.Level) || 1,
                color: '#3B82F6',
                description: ''
              });
            }

            if (rowData.Person) {
              newPersonnel.push({
                id: `person-${i}`,
                name: rowData.Person,
                title: rowData['Job Title'] || '',
                email: rowData.Email || '',
                departmentId: newDepartments.find(d => d.name === rowData.Department)?.id || deptId
              });
            }

            if (rowData['Parent Department']) {
              const parentDept = newDepartments.find(d => d.name === rowData['Parent Department']);
              const childDept = newDepartments.find(d => d.name === rowData.Department);
              if (parentDept && childDept) {
                newHierarchy.push({
                  id: `rel-${i}`,
                  parentId: parentDept.id,
                  childId: childDept.id
                });
              }
            }
          }
        }

        saveToHistory();
        setDepartments(newDepartments);
        setPersonnel(newPersonnel);
        setHierarchy(newHierarchy);
        setOrgLevels(Math.max(...newDepartments.map(d => d.level)));
        showToast(`Imported ${newDepartments.length} departments and ${newPersonnel.length} people!`, 'success');
        announceToScreenReader(`Successfully imported ${newDepartments.length} departments and ${newPersonnel.length} people`);
        
      } catch (error) {
        showToast('Error reading file. Please check the format.', 'error');
        announceToScreenReader('Error reading file. Please check the format and try again.');
      }
    };
    reader.readAsText(file);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Organization Levels</h3>
              <p className="text-blue-700 mb-6">
                Define how many hierarchical levels your organization has. This helps structure your departments properly.
              </p>
              
              <div className="space-y-4">
                <label htmlFor="org-levels-slider" className="block text-sm font-medium text-gray-700">
                  Number of Levels (1-10)
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    id="org-levels-slider"
                    type="range"
                    min="1"
                    max="10"
                    value={orgLevels}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value);
                      setOrgLevels(newValue);
                      announceToScreenReader(`Organization levels set to ${newValue}`);
                    }}
                    aria-describedby="org-levels-help"
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div 
                    className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold"
                    aria-live="polite"
                    aria-label={`${orgLevels} levels selected`}
                  >
                    {orgLevels}
                  </div>
                </div>
                
                <div id="org-levels-help" className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Typical Structure:</h4>
                  <ul className="text-sm text-gray-600 space-y-1" role="list">
                    <li>• Level 1: Executive (CEO, President)</li>
                    <li>• Level 2: Vice Presidents, Directors</li>
                    <li>• Level 3: Managers, Department Heads</li>
                    <li>• Level 4+: Team Leads, Individual Contributors</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            {/* Add Department Form */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                <Building2 className="w-4 h-4 mr-2 text-blue-600" />
                Add Department
              </h3>
              <div className="grid grid-cols-4 gap-3">
                <AccessibleInput
                  label="Department Name"
                  value={newDepartment.name}
                  onChange={(value) => setNewDepartment({...newDepartment, name: value})}
                  validator={validateDepartmentName}
                  placeholder="e.g., Engineering"
                  required
                  className="text-sm py-2"
                  autoComplete="organization"
                />

                <AccessibleSelect
                  label="Level"
                  value={newDepartment.level}
                  onChange={(value) => setNewDepartment({...newDepartment, level: parseInt(value)})}
                  options={Array.from({length: orgLevels}, (_, i) => ({
                    value: i + 1,
                    label: `Level ${i + 1}`
                  }))}
                  required
                  className="text-sm"
                />

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-700">Color</label>
                  <input
                    type="color"
                    value={newDepartment.color}
                    onChange={(e) => setNewDepartment({...newDepartment, color: e.target.value})}
                    className="w-full h-8 border border-gray-300 rounded-lg cursor-pointer"
                  />
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={addDepartment}
                    disabled={!newDepartment.name.trim()}
                    className="w-full bg-blue-600 text-white px-3 py-2 text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Add Department
                  </button>
                </div>
              </div>
            </div>

            {/* Add Personnel Form */}
            {departments.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                  <Users className="w-4 h-4 mr-2 text-green-600" />
                  Add Personnel
                </h3>
                <div className="grid grid-cols-5 gap-3">
                  <AccessibleInput
                    label="Full Name"
                    value={newPerson.name}
                    onChange={(value) => setNewPerson({...newPerson, name: value})}
                    validator={validatePersonName}
                    placeholder="John Smith"
                    required
                    className="text-sm py-2"
                  />
                  
                  <AccessibleInput
                    label="Job Title"
                    value={newPerson.title}
                    onChange={(value) => setNewPerson({...newPerson, title: value})}
                    validator={validateJobTitle}
                    placeholder="Software Engineer"
                    required
                    className="text-sm py-2"
                  />

                  <AccessibleInput
                    label="Email"
                    value={newPerson.email}
                    onChange={(value) => setNewPerson({...newPerson, email: value})}
                    validator={validateEmail}
                    placeholder="john@company.com"
                    type="email"
                    className="text-sm py-2"
                  />

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-700">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newPerson.departmentId}
                      onChange={(e) => setNewPerson({...newPerson, departmentId: e.target.value})}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      onClick={addPerson}
                      disabled={!newPerson.name.trim() || !newPerson.title.trim() || !newPerson.departmentId}
                      className="w-full bg-green-600 text-white px-3 py-2 text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Add Person
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Combined Lists */}
            {(departments.length > 0 || personnel.length > 0) && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Departments List */}
                {departments.length > 0 && (
                  <section className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center justify-between">
                      <span className="flex items-center">
                        <Building2 className="w-4 h-4 mr-2 text-blue-600" aria-hidden="true" />
                        Departments ({departments.length})
                      </span>
                    </h3>
                    <div 
                      className="space-y-2 max-h-64 overflow-y-auto"
                      role="list"
                      aria-label="Departments list"
                    >
                      {departments.map((dept) => (
                        <div 
                          key={dept.id} 
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          role="listitem"
                        >
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <div 
                              className="w-3 h-3 rounded-full flex-shrink-0"
                              style={{ backgroundColor: dept.color }}
                              aria-label={`Department color: ${dept.color}`}
                            />
                            <div className="min-w-0 flex-1">
                              <div className="font-medium text-gray-900 text-sm truncate">{dept.name}</div>
                              <div className="text-xs text-gray-500">Level {dept.level}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1 flex-shrink-0">
                            <button
                              onClick={() => setEditingDepartment(dept)}
                              aria-label={`Edit ${dept.name} department`}
                              className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <Edit2 className="w-3 h-3" aria-hidden="true" />
                            </button>
                            <button
                              onClick={() => deleteDepartment(dept.id)}
                              aria-label={`Delete ${dept.name} department`}
                              className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                              <Trash2 className="w-3 h-3" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Personnel List */}
                {personnel.length > 0 && (
                  <section className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center justify-between">
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-green-600" aria-hidden="true" />
                        Personnel ({personnel.length})
                      </span>
                    </h3>
                    <div 
                      className="space-y-2 max-h-64 overflow-y-auto"
                      role="list"
                      aria-label="Personnel list"
                    >
                      {personnel.map((person) => {
                        const dept = departments.find(d => d.id === person.departmentId);
                        return (
                          <div 
                            key={person.id} 
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            role="listitem"
                          >
                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                              <div 
                                className="w-3 h-3 rounded-full flex-shrink-0"
                                style={{ backgroundColor: dept?.color || '#gray' }}
                                aria-label={`Department: ${dept?.name || 'Unknown'}`}
                              />
                              <div className="min-w-0 flex-1">
                                <div className="font-medium text-gray-900 text-sm truncate">{person.name}</div>
                                <div className="text-xs text-gray-500 truncate">{person.title} • {dept?.name}</div>
                                {person.email && (
                                  <div className="text-xs text-gray-400 truncate">{person.email}</div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-1 flex-shrink-0">
                              <button
                                onClick={() => setEditingPerson(person)}
                                aria-label={`Edit ${person.name}`}
                                className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <Edit2 className="w-3 h-3" aria-hidden="true" />
                              </button>
                              <button
                                onClick={() => deletePerson(person.id)}
                                aria-label={`Delete ${person.name}`}
                                className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                              >
                                <Trash2 className="w-3 h-3" aria-hidden="true" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Define Hierarchy</h3>
              <p className="text-gray-600 mb-6">
                Set up reporting relationships between departments. Child departments report to their parent departments.
              </p>
              
              {departments.length > 1 ? (
                <div className="space-y-4" role="list" aria-label="Department hierarchy settings">
                  {departments.map((dept) => (
                    <div key={dept.id} className="p-4 bg-gray-50 rounded-lg" role="listitem">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: dept.color }}
                            aria-label={`Department color: ${dept.color}`}
                          />
                          <span className="font-medium text-gray-900">{dept.name}</span>
                          <span className="text-sm text-gray-500">Level {dept.level}</span>
                        </div>
                      </div>
                      
                      <div className="ml-7">
                        <AccessibleSelect
                          label="Reports to:"
                          value={hierarchy.find(h => h.childId === dept.id)?.parentId || ''}
                          onChange={(parentId) => {
                            const newHierarchy = hierarchy.filter(h => h.childId !== dept.id);
                            if (parentId) {
                              newHierarchy.push({
                                id: `${parentId}-${dept.id}`,
                                parentId,
                                childId: dept.id
                              });
                            }
                            setHierarchy(newHierarchy);
                            announceToScreenReader(`${dept.name} reporting relationship updated`);
                          }}
                          options={[
                            { value: '', label: 'No parent (Top level)' },
                            ...departments
                              .filter(d => d.id !== dept.id && d.level < dept.level)
                              .map(parentDept => ({
                                value: parentDept.id,
                                label: `${parentDept.name} (Level ${parentDept.level})`
                              }))
                          ]}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" aria-hidden="true" />
                  <p>Add at least 2 departments to define hierarchy relationships.</p>
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Controls */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Organization Chart</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2" role="group" aria-label="Zoom controls">
                    <button
                      onClick={() => {
                        const newZoom = Math.max(50, zoomLevel - 25);
                        setZoomLevel(newZoom);
                        announceToScreenReader(`Zoomed out to ${newZoom} percent`);
                      }}
                      aria-label="Zoom out"
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <ZoomOut className="w-4 h-4" aria-hidden="true" />
                    </button>
                    <span className="text-sm font-medium text-gray-700" aria-live="polite">
                      {zoomLevel}%
                    </span>
                    <button
                      onClick={() => {
                        const newZoom = Math.min(200, zoomLevel + 25);
                        setZoomLevel(newZoom);
                        announceToScreenReader(`Zoomed in to ${newZoom} percent`);
                      }}
                      aria-label="Zoom in"
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <ZoomIn className="w-4 h-4" aria-hidden="true" />
                    </button>
                    <button
                      onClick={() => {
                        setZoomLevel(100);
                        announceToScreenReader('Zoom reset to 100 percent');
                      }}
                      aria-label="Reset zoom to 100%"
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <RotateCcw className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => {
                      setShowPersonnel(!showPersonnel);
                      announceToScreenReader(`Personnel ${!showPersonnel ? 'shown' : 'hidden'} in organization chart`);
                    }}
                    aria-pressed={showPersonnel}
                    aria-label={`${showPersonnel ? 'Hide' : 'Show'} personnel in chart`}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      showPersonnel 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {showPersonnel ? (
                      <Eye className="w-4 h-4" aria-hidden="true" />
                    ) : (
                      <EyeOff className="w-4 h-4" aria-hidden="true" />
                    )}
                    <span>Personnel</span>
                  </button>
                </div>
              </div>
              
              {departments.length > 0 ? (
                <div 
                  className="overflow-auto border border-gray-200 rounded-lg bg-gray-50 p-8"
                  style={{ 
                    transform: `scale(${zoomLevel / 100})`, 
                    transformOrigin: 'top left',
                    transition: isReducedMotion ? 'none' : 'transform 0.2s ease'
                  }}
                  role="img"
                  aria-label="Organization chart visualization"
                >
                  <AccessibleOrgChart 
                    departments={departments}
                    personnel={personnel}
                    hierarchy={hierarchy}
                    showPersonnel={showPersonnel}
                  />
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" aria-hidden="true" />
                  <p>No departments to display. Go back and add some departments first.</p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Skip Link for Keyboard Users */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-50"
      >
        Skip to main content
      </a>

      {/* Toast Notifications */}
      {toast && (
        <AccessibleToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          id={toast.id}
        />
      )}

      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organization Chart Builder</h1>
          <p className="text-gray-600">Create and visualize your organizational structure</p>
        </div>
        
        <div className="flex items-center space-x-3" role="toolbar" aria-label="Chart actions">
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            aria-label="Undo last action"
            title="Undo"
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            aria-label="Redo last action"
            title="Redo"
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            onClick={downloadTemplate}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            <span>Template</span>
          </button>
          <label className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2">
            <Upload className="w-4 h-4" aria-hidden="true" />
            <span>Import</span>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="sr-only"
              aria-label="Import organization chart data"
            />
          </label>
        </div>
      </header>

      {/* Progress Steps */}
      <AccessibleProgress 
        steps={steps} 
        currentStep={currentStep} 
        onStepClick={setCurrentStep}
      />

      {/* Main Content */}
      <main id="main-content" className="bg-white border border-gray-200 rounded-lg p-6">
        {renderStepContent()}
      </main>

      {/* Navigation */}
      <nav className="flex justify-between" aria-label="Step navigation">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Previous</span>
        </button>

        <button
          onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
          disabled={currentStep === steps.length - 1}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <span>Next</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </nav>

      {/* Edit Department Modal */}
      <AccessibleModal
        isOpen={!!editingDepartment}
        onClose={() => setEditingDepartment(null)}
        title="Edit Department"
      >
        {editingDepartment && (
          <div className="space-y-4">
            <AccessibleInput
              label="Department Name"
              value={editingDepartment.name}
              onChange={(value) => setEditingDepartment({...editingDepartment, name: value})}
              validator={validateDepartmentName}
              required
              autoComplete="organization"
            />
            
            <AccessibleSelect
              label="Level"
              value={editingDepartment.level}
              onChange={(value) => setEditingDepartment({...editingDepartment, level: parseInt(value)})}
              options={Array.from({length: orgLevels}, (_, i) => ({
                value: i + 1,
                label: `Level ${i + 1}`
              }))}
              required
            />

            <div className="space-y-2">
              <label htmlFor="edit-dept-color" className="block text-sm font-medium text-gray-700">
                Color
              </label>
              <input
                id="edit-dept-color"
                type="color"
                value={editingDepartment.color}
                onChange={(e) => setEditingDepartment({...editingDepartment, color: e.target.value})}
                aria-label="Department color"
                className="w-full h-12 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingDepartment(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={() => updateDepartment(editingDepartment.id, editingDepartment)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </AccessibleModal>

      {/* Edit Person Modal */}
      <AccessibleModal
        isOpen={!!editingPerson}
        onClose={() => setEditingPerson(null)}
        title="Edit Person"
      >
        {editingPerson && (
          <div className="space-y-4">
            <AccessibleInput
              label="Full Name"
              value={editingPerson.name}
              onChange={(value) => setEditingPerson({...editingPerson, name: value})}
              validator={validatePersonName}
              required
              autoComplete="name"
            />

            <AccessibleInput
              label="Job Title"
              value={editingPerson.title}
              onChange={(value) => setEditingPerson({...editingPerson, title: value})}
              validator={validateJobTitle}
              required
              autoComplete="organization-title"
            />

            <AccessibleInput
              label="Email"
              value={editingPerson.email}
              onChange={(value) => setEditingPerson({...editingPerson, email: value})}
              validator={validateEmail}
              type="email"
              autoComplete="email"
            />

            <AccessibleSelect
              label="Department"
              value={editingPerson.departmentId}
              onChange={(value) => setEditingPerson({...editingPerson, departmentId: value})}
              options={departments.map(dept => ({
                value: dept.id,
                label: dept.name
              }))}
              required
            />
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingPerson(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={() => updatePerson(editingPerson.id, editingPerson)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </AccessibleModal>
    </div>
  );
}

// Accessible Organization Chart Visualization
const AccessibleOrgChart = ({ departments, personnel, hierarchy, showPersonnel }) => {
  const getRootDepartments = () => {
    const childIds = hierarchy.map(h => h.childId);
    return departments.filter(dept => !childIds.includes(dept.id));
  };

  const getChildren = (parentId) => {
    const childIds = hierarchy.filter(h => h.parentId === parentId).map(h => h.childId);
    return departments.filter(dept => childIds.includes(dept.id));
  };

  const getDepartmentPersonnel = (deptId) => {
    return personnel.filter(person => person.departmentId === deptId);
  };

  const DepartmentNode = ({ department, level = 0 }) => {
    const children = getChildren(department.id);
    const deptPersonnel = getDepartmentPersonnel(department.id);
    const [isExpanded, setIsExpanded] = useState(true);

    const handleToggle = () => {
      setIsExpanded(!isExpanded);
      announceToScreenReader(`${department.name} ${!isExpanded ? 'expanded' : 'collapsed'}`);
    };

    return (
      <div className="flex flex-col items-center" role="treeitem" aria-expanded={children.length > 0 ? isExpanded : undefined}>
        <div className="relative">
          {level > 0 && (
            <div className="absolute top-0 left-1/2 w-0.5 h-8 bg-gray-300 -translate-x-1/2 -translate-y-8" aria-hidden="true"></div>
          )}
          
          <div 
            className="relative p-4 rounded-lg border-2 shadow-sm bg-white min-w-48 focus-within:ring-2 focus-within:ring-blue-500"
            style={{ borderColor: department.color }}
            tabIndex={0}
            role="button"
            aria-label={`Department: ${department.name}, Level ${department.level}${deptPersonnel.length > 0 ? `, ${deptPersonnel.length} people` : ''}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: department.color }}
                aria-label={`Color indicator for ${department.name}`}
              />
              <span className="text-xs text-gray-500">Level {department.level}</span>
            </div>
            
            <div className="font-bold text-gray-800 text-center mb-1">{department.name}</div>
            
            {showPersonnel && deptPersonnel.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200" role="list" aria-label={`Personnel in ${department.name}`}>
                {deptPersonnel.map((person) => (
                  <div key={person.id} className="text-xs text-gray-600 mb-1" role="listitem">
                    <div className="font-medium">{person.name}</div>
                    <div className="text-gray-500">{person.title}</div>
                  </div>
                ))}
              </div>
            )}
            
            {children.length > 0 && (
              <button
                onClick={handleToggle}
                aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${department.name} subdepartments`}
                className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 rounded-full p-1 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {isExpanded ? (
                  <ChevronDown className="w-3 h-3" aria-hidden="true" />
                ) : (
                  <ChevronRight className="w-3 h-3" aria-hidden="true" />
                )}
              </button>
            )}
          </div>
        </div>
        
        {children.length > 0 && isExpanded && (
          <div className="flex mt-8 relative" role="group" aria-label={`Subdepartments of ${department.name}`}>
            {children.length > 1 && (
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-300 -translate-y-8" aria-hidden="true"></div>
            )}
            <div className="flex gap-8">
              {children.map((child) => (
                <DepartmentNode key={child.id} department={child} level={level + 1} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const rootDepartments = getRootDepartments();

  if (rootDepartments.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" aria-hidden="true" />
        <p>No organizational structure to display.</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-8" role="tree" aria-label="Organization chart">
      <div className="flex gap-12">
        {rootDepartments.map((dept) => (
          <DepartmentNode key={dept.id} department={dept} />
        ))}
      </div>
    </div>
  );
};