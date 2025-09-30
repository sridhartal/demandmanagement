import React, { useState, useCallback, useEffect } from 'react';
import { Building2, Users, Download, Upload, Plus, Trash2, CreditCard as Edit2, Save, Eye, EyeOff, ZoomIn, ZoomOut, RotateCcw, FileText, CheckCircle, AlertCircle, Loader2, ArrowRight, ArrowLeft, X, Info, ChevronDown, ChevronRight } from 'lucide-react';

// Validation utilities
const validateDepartmentName = (name) => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, message: 'Department name is required' };
  }
  if (name.trim().length < 2) {
    return { isValid: false, message: 'Department name must be at least 2 characters' };
  }
  if (name.trim().length > 50) {
    return { isValid: false, message: 'Department name must be less than 50 characters' };
  }
  if (!/^[a-zA-Z0-9\s&-]+$/.test(name.trim())) {
    return { isValid: false, message: 'Only letters, numbers, spaces, & and - are allowed' };
  }
  return { isValid: true, message: 'Looks good!' };
};

const validatePersonName = (name) => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, message: 'Name is required' };
  }
  if (name.trim().length < 2) {
    return { isValid: false, message: 'Name must be at least 2 characters' };
  }
  if (name.trim().length > 100) {
    return { isValid: false, message: 'Name must be less than 100 characters' };
  }
  if (!/^[a-zA-Z\s'-]+$/.test(name.trim())) {
    return { isValid: false, message: 'Only letters, spaces, apostrophes and hyphens are allowed' };
  }
  return { isValid: true, message: 'Looks good!' };
};

const validateJobTitle = (title) => {
  if (!title || title.trim().length === 0) {
    return { isValid: false, message: 'Job title is required' };
  }
  if (title.trim().length < 2) {
    return { isValid: false, message: 'Job title must be at least 2 characters' };
  }
  if (title.trim().length > 100) {
    return { isValid: false, message: 'Job title must be less than 100 characters' };
  }
  return { isValid: true, message: 'Looks good!' };
};

const validateEmail = (email) => {
  if (!email || email.trim().length === 0) {
    return { isValid: true, message: 'Email is optional' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }
  return { isValid: true, message: 'Valid email!' };
};

// Toast notification component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
      type === 'success' ? 'bg-green-500 text-white' : 
      type === 'error' ? 'bg-red-500 text-white' : 
      'bg-blue-500 text-white'
    }`}>
      <div className="flex items-center space-x-2">
        {type === 'success' && <CheckCircle className="w-5 h-5" />}
        {type === 'error' && <AlertCircle className="w-5 h-5" />}
        {type === 'info' && <Info className="w-5 h-5" />}
        <span>{message}</span>
        <button onClick={onClose} className="ml-2">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Validated input component
const ValidatedInput = ({ 
  label, 
  value, 
  onChange, 
  validator, 
  placeholder, 
  required = false,
  type = 'text',
  className = ''
}) => {
  const [touched, setTouched] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validation, setValidation] = useState({ isValid: true, message: '' });

  const validateInput = useCallback((inputValue) => {
    if (!validator) return { isValid: true, message: '' };
    return validator(inputValue);
  }, [validator]);

  useEffect(() => {
    if (touched && value !== undefined) {
      setIsValidating(true);
      const timer = setTimeout(() => {
        const result = validateInput(value);
        setValidation(result);
        setIsValidating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [value, touched, validateInput]);

  const handleBlur = () => {
    setTouched(true);
  };

  const getInputClassName = () => {
    let baseClass = `w-full px-4 py-3 border rounded-lg transition-all duration-200 ${className}`;
    
    if (!touched) {
      return `${baseClass} border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200`;
    }
    
    if (isValidating) {
      return `${baseClass} border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200`;
    }
    
    if (validation.isValid) {
      return `${baseClass} border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-green-50`;
    } else {
      return `${baseClass} border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50`;
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={getInputClassName()}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {isValidating && <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />}
          {!isValidating && touched && validation.isValid && <CheckCircle className="w-4 h-4 text-green-500" />}
          {!isValidating && touched && !validation.isValid && <AlertCircle className="w-4 h-4 text-red-500" />}
        </div>
      </div>
      {touched && validation.message && (
        <div className={`text-sm flex items-center space-x-1 ${
          validation.isValid ? 'text-green-600' : 'text-red-600'
        }`}>
          {validation.isValid ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span>{validation.message}</span>
        </div>
      )}
    </div>
  );
};

export function OrgChartBuilder() {
  const [currentStep, setCurrentStep] = useState(0);
  const [orgLevels, setOrgLevels] = useState(3);
  const [departments, setDepartments] = useState([]);
  const [personnel, setPersonnel] = useState([]);
  const [hierarchy, setHierarchy] = useState([]);
  const [showPersonnel, setShowPersonnel] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [layout, setLayout] = useState('vertical');
  const [toast, setToast] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

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

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
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
  };

  const deleteDepartment = (id) => {
    saveToHistory();
    setDepartments(departments.filter(dept => dept.id !== id));
    setPersonnel(personnel.filter(person => person.departmentId !== id));
    setHierarchy(hierarchy.filter(rel => rel.parentId !== id && rel.childId !== id));
    showToast('Department deleted successfully!', 'success');
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
  };

  const deletePerson = (id) => {
    saveToHistory();
    setPersonnel(personnel.filter(person => person.id !== id));
    showToast('Person deleted successfully!', 'success');
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
        
      } catch (error) {
        showToast('Error reading file. Please check the format.', 'error');
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
                <label className="block text-sm font-medium text-gray-700">
                  Number of Levels (1-10)
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={orgLevels}
                    onChange={(e) => setOrgLevels(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {orgLevels}
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Typical Structure:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
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
          <div className="space-y-6">
            {/* Add Department Form */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Department</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ValidatedInput
                  label="Department Name"
                  value={newDepartment.name}
                  onChange={(value) => setNewDepartment({...newDepartment, name: value})}
                  validator={validateDepartmentName}
                  placeholder="e.g., Engineering, Sales, Marketing"
                  required
                />
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Organizational Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newDepartment.level}
                    onChange={(e) => setNewDepartment({...newDepartment, level: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  >
                    {Array.from({length: orgLevels}, (_, i) => (
                      <option key={i + 1} value={i + 1}>Level {i + 1}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Color</label>
                  <input
                    type="color"
                    value={newDepartment.color}
                    onChange={(e) => setNewDepartment({...newDepartment, color: e.target.value})}
                    className="w-full h-12 border border-gray-300 rounded-lg cursor-pointer"
                  />
                </div>

                <ValidatedInput
                  label="Description"
                  value={newDepartment.description}
                  onChange={(value) => setNewDepartment({...newDepartment, description: value})}
                  placeholder="Brief description of the department"
                />
              </div>
              
              <button
                onClick={addDepartment}
                disabled={!newDepartment.name.trim()}
                className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add Department
              </button>
            </div>

            {/* Departments List */}
            {departments.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Departments ({departments.length})</h3>
                <div className="space-y-3">
                  {departments.map((dept) => (
                    <div key={dept.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: dept.color }}
                        />
                        <div>
                          <div className="font-medium text-gray-900">{dept.name}</div>
                          <div className="text-sm text-gray-500">Level {dept.level}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setEditingDepartment(dept)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteDepartment(dept.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add Personnel Form */}
            {departments.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Personnel</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ValidatedInput
                    label="Full Name"
                    value={newPerson.name}
                    onChange={(value) => setNewPerson({...newPerson, name: value})}
                    validator={validatePersonName}
                    placeholder="e.g., John Smith"
                    required
                  />

                  <ValidatedInput
                    label="Job Title"
                    value={newPerson.title}
                    onChange={(value) => setNewPerson({...newPerson, title: value})}
                    validator={validateJobTitle}
                    placeholder="e.g., Software Engineer"
                    required
                  />

                  <ValidatedInput
                    label="Email"
                    value={newPerson.email}
                    onChange={(value) => setNewPerson({...newPerson, email: value})}
                    validator={validateEmail}
                    placeholder="john@company.com"
                    type="email"
                  />

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newPerson.departmentId}
                      onChange={(e) => setNewPerson({...newPerson, departmentId: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <button
                  onClick={addPerson}
                  disabled={!newPerson.name.trim() || !newPerson.title.trim() || !newPerson.departmentId}
                  className="mt-4 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add Person
                </button>
              </div>
            )}

            {/* Personnel List */}
            {personnel.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personnel ({personnel.length})</h3>
                <div className="space-y-3">
                  {personnel.map((person) => {
                    const dept = departments.find(d => d.id === person.departmentId);
                    return (
                      <div key={person.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: dept?.color || '#gray' }}
                          />
                          <div>
                            <div className="font-medium text-gray-900">{person.name}</div>
                            <div className="text-sm text-gray-500">{person.title} • {dept?.name}</div>
                            {person.email && (
                              <div className="text-xs text-gray-400">{person.email}</div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setEditingPerson(person)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deletePerson(person.id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
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
                <div className="space-y-4">
                  {departments.map((dept) => (
                    <div key={dept.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: dept.color }}
                          />
                          <span className="font-medium text-gray-900">{dept.name}</span>
                          <span className="text-sm text-gray-500">Level {dept.level}</span>
                        </div>
                      </div>
                      
                      <div className="ml-7">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Reports to:
                        </label>
                        <select
                          value={hierarchy.find(h => h.childId === dept.id)?.parentId || ''}
                          onChange={(e) => {
                            const parentId = e.target.value;
                            const newHierarchy = hierarchy.filter(h => h.childId !== dept.id);
                            if (parentId) {
                              newHierarchy.push({
                                id: `${parentId}-${dept.id}`,
                                parentId,
                                childId: dept.id
                              });
                            }
                            setHierarchy(newHierarchy);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        >
                          <option value="">No parent (Top level)</option>
                          {departments
                            .filter(d => d.id !== dept.id && d.level < dept.level)
                            .map((parentDept) => (
                              <option key={parentDept.id} value={parentDept.id}>
                                {parentDept.name} (Level {parentDept.level})
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
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
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setZoomLevel(Math.max(50, zoomLevel - 25))}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-medium text-gray-700">{zoomLevel}%</span>
                    <button
                      onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setZoomLevel(100)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => setShowPersonnel(!showPersonnel)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      showPersonnel 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {showPersonnel ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    <span>Personnel</span>
                  </button>
                </div>
              </div>
              
              {departments.length > 0 ? (
                <div 
                  className="overflow-auto border border-gray-200 rounded-lg bg-gray-50 p-8"
                  style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}
                >
                  <OrgChart 
                    departments={departments}
                    personnel={personnel}
                    hierarchy={hierarchy}
                    showPersonnel={showPersonnel}
                    layout={layout}
                  />
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
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
      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organization Chart Builder</h1>
          <p className="text-gray-600">Create and visualize your organizational structure</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Undo"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Redo"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={downloadTemplate}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Template</span>
          </button>
          <label className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Import</span>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${
                  index <= currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {index < currentStep ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                <div className="ml-3">
                  <div className={`font-medium ${
                    index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-sm text-gray-500">{step.description}</div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-px mx-8 transition-colors ${
                  index < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <button
          onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
          disabled={currentStep === steps.length - 1}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Next</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Edit Department Modal */}
      {editingDepartment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Department</h3>
            <div className="space-y-4">
              <ValidatedInput
                label="Department Name"
                value={editingDepartment.name}
                onChange={(value) => setEditingDepartment({...editingDepartment, name: value})}
                validator={validateDepartmentName}
                required
              />
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Level</label>
                <select
                  value={editingDepartment.level}
                  onChange={(e) => setEditingDepartment({...editingDepartment, level: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  {Array.from({length: orgLevels}, (_, i) => (
                    <option key={i + 1} value={i + 1}>Level {i + 1}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Color</label>
                <input
                  type="color"
                  value={editingDepartment.color}
                  onChange={(e) => setEditingDepartment({...editingDepartment, color: e.target.value})}
                  className="w-full h-12 border border-gray-300 rounded-lg cursor-pointer"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingDepartment(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => updateDepartment(editingDepartment.id, editingDepartment)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Person Modal */}
      {editingPerson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Person</h3>
            <div className="space-y-4">
              <ValidatedInput
                label="Full Name"
                value={editingPerson.name}
                onChange={(value) => setEditingPerson({...editingPerson, name: value})}
                validator={validatePersonName}
                required
              />

              <ValidatedInput
                label="Job Title"
                value={editingPerson.title}
                onChange={(value) => setEditingPerson({...editingPerson, title: value})}
                validator={validateJobTitle}
                required
              />

              <ValidatedInput
                label="Email"
                value={editingPerson.email}
                onChange={(value) => setEditingPerson({...editingPerson, email: value})}
                validator={validateEmail}
                type="email"
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <select
                  value={editingPerson.departmentId}
                  onChange={(e) => setEditingPerson({...editingPerson, departmentId: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingPerson(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => updatePerson(editingPerson.id, editingPerson)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple OrgChart component for visualization
const OrgChart = ({ departments, personnel, hierarchy, showPersonnel }) => {
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

    return (
      <div className="flex flex-col items-center">
        <div className="relative">
          {level > 0 && (
            <div className="absolute top-0 left-1/2 w-0.5 h-8 bg-gray-300 -translate-x-1/2 -translate-y-8"></div>
          )}
          
          <div 
            className="relative p-4 rounded-lg border-2 shadow-sm bg-white min-w-48"
            style={{ borderColor: department.color }}
          >
            <div className="flex items-center justify-between mb-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: department.color }}
              />
              <span className="text-xs text-gray-500">Level {department.level}</span>
            </div>
            
            <div className="font-bold text-gray-800 text-center mb-1">{department.name}</div>
            
            {showPersonnel && deptPersonnel.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                {deptPersonnel.map((person) => (
                  <div key={person.id} className="text-sm text-center mb-1">
                    <div className="font-medium text-gray-700">{person.name}</div>
                    <div className="text-xs text-gray-500">{person.title}</div>
                  </div>
                ))}
              </div>
            )}
            
            {children.length > 0 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 rounded-full p-1 hover:bg-gray-50"
              >
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
            )}
          </div>
        </div>
        
        {children.length > 0 && isExpanded && (
          <div className="flex mt-8 relative">
            {children.length > 1 && (
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-300 -translate-y-8"></div>
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
        <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <p>No organizational structure to display.</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-8">
      <div className="flex gap-12">
        {rootDepartments.map((dept) => (
          <DepartmentNode key={dept.id} department={dept} />
        ))}
      </div>
    </div>
  );
};