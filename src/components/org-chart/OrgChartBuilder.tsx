import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Plus, Trash2, CreditCard as Edit, Save, Download, Upload, Users, Building, ChevronDown, ChevronRight, Move, Eye, Settings, Layers, Network, ArrowRight, Check, X, FileSpreadsheet, AlertCircle, Info, Undo, Redo, ZoomIn, ZoomOut, RotateCcw, FileText, Image, Maximize2 } from 'lucide-react';

interface Person {
  id: string;
  name: string;
  title: string;
  email?: string;
  phone?: string;
}

interface Department {
  id: string;
  name: string;
  color: string;
  description: string;
  personnel: Person[];
  level: number;
  parentId?: string;
  children: string[];
}

interface OrgChartData {
  levels: number;
  departments: Department[];
  layout: 'vertical' | 'horizontal';
  showPersonnel: boolean;
}

interface ValidationError {
  field: string;
  message: string;
  departmentId?: string;
  personId?: string;
}

interface HistoryState {
  data: OrgChartData;
  timestamp: number;
  action: string;
}

export function OrgChartBuilder() {
  const [currentStep, setCurrentStep] = useState(1);
  const [orgData, setOrgData] = useState<OrgChartData>({
    levels: 3,
    departments: [],
    layout: 'vertical',
    showPersonnel: true
  });
  
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [draggedDepartment, setDraggedDepartment] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<any[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  // History management for undo/redo
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Chart visualization settings
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showFullscreen, setShowFullscreen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  const steps = [
    { id: 1, title: 'Setup Levels', description: 'Define organizational structure' },
    { id: 2, title: 'Manage Departments', description: 'Add departments and personnel' },
    { id: 3, title: 'Build Hierarchy', description: 'Define reporting relationships' },
    { id: 4, title: 'Visualize Chart', description: 'View and export your org chart' }
  ];

  const departmentColors = [
    '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', 
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
  ];

  // Save state to history
  const saveToHistory = useCallback((action: string) => {
    const newState: HistoryState = {
      data: JSON.parse(JSON.stringify(orgData)),
      timestamp: Date.now(),
      action
    };
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    
    // Limit history to 50 items
    if (newHistory.length > 50) {
      newHistory.shift();
    }
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [orgData, history, historyIndex]);

  // Undo functionality
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const previousState = history[historyIndex - 1];
      setOrgData(previousState.data);
      setHistoryIndex(historyIndex - 1);
    }
  }, [history, historyIndex]);

  // Redo functionality
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setOrgData(nextState.data);
      setHistoryIndex(historyIndex + 1);
    }
  }, [history, historyIndex]);

  // Validation functions
  const validateData = useCallback((): ValidationError[] => {
    const errors: ValidationError[] = [];
    
    if (orgData.levels < 1 || orgData.levels > 10) {
      errors.push({ field: 'levels', message: 'Number of levels must be between 1 and 10' });
    }
    
    if (orgData.departments.length === 0) {
      errors.push({ field: 'departments', message: 'At least one department is required' });
    }
    
    orgData.departments.forEach(dept => {
      if (!dept.name.trim()) {
        errors.push({ 
          field: 'departmentName', 
          message: 'Department name is required',
          departmentId: dept.id 
        });
      }
      
      if (dept.level < 1 || dept.level > orgData.levels) {
        errors.push({ 
          field: 'departmentLevel', 
          message: `Department level must be between 1 and ${orgData.levels}`,
          departmentId: dept.id 
        });
      }
      
      dept.personnel.forEach(person => {
        if (!person.name.trim()) {
          errors.push({ 
            field: 'personName', 
            message: 'Person name is required',
            departmentId: dept.id,
            personId: person.id 
          });
        }
      });
    });
    
    return errors;
  }, [orgData]);

  // Update validation errors when data changes
  useEffect(() => {
    const errors = validateData();
    setValidationErrors(errors);
  }, [validateData]);

  // Department management functions
  const addDepartment = useCallback(() => {
    const newDept: Department = {
      id: Date.now().toString(),
      name: `Department ${orgData.departments.length + 1}`,
      color: departmentColors[orgData.departments.length % departmentColors.length],
      description: '',
      personnel: [],
      level: 1,
      children: []
    };
    
    setOrgData(prev => ({
      ...prev,
      departments: [...prev.departments, newDept]
    }));
    
    saveToHistory('Add Department');
  }, [orgData.departments.length, saveToHistory]);

  const updateDepartment = useCallback((deptId: string, updates: Partial<Department>) => {
    setOrgData(prev => ({
      ...prev,
      departments: prev.departments.map(dept => 
        dept.id === deptId ? { ...dept, ...updates } : dept
      )
    }));
    
    saveToHistory('Update Department');
  }, [saveToHistory]);

  const deleteDepartment = useCallback((deptId: string) => {
    setOrgData(prev => ({
      ...prev,
      departments: prev.departments.filter(dept => dept.id !== deptId)
        .map(dept => ({
          ...dept,
          parentId: dept.parentId === deptId ? undefined : dept.parentId,
          children: dept.children.filter(childId => childId !== deptId)
        }))
    }));
    
    saveToHistory('Delete Department');
  }, [saveToHistory]);

  // Personnel management functions
  const addPerson = useCallback((deptId: string) => {
    const newPerson: Person = {
      id: Date.now().toString(),
      name: '',
      title: ''
    };
    
    updateDepartment(deptId, {
      personnel: [...(orgData.departments.find(d => d.id === deptId)?.personnel || []), newPerson]
    });
  }, [orgData.departments, updateDepartment]);

  const updatePerson = useCallback((deptId: string, personId: string, updates: Partial<Person>) => {
    const department = orgData.departments.find(d => d.id === deptId);
    if (department) {
      const updatedPersonnel = department.personnel.map(person =>
        person.id === personId ? { ...person, ...updates } : person
      );
      updateDepartment(deptId, { personnel: updatedPersonnel });
    }
  }, [orgData.departments, updateDepartment]);

  const deletePerson = useCallback((deptId: string, personId: string) => {
    const department = orgData.departments.find(d => d.id === deptId);
    if (department) {
      const updatedPersonnel = department.personnel.filter(person => person.id !== personId);
      updateDepartment(deptId, { personnel: updatedPersonnel });
    }
  }, [orgData.departments, updateDepartment]);

  // Hierarchy management
  const setParentDepartment = useCallback((childId: string, parentId?: string) => {
    setOrgData(prev => {
      const departments = prev.departments.map(dept => {
        // Remove child from previous parent
        if (dept.children.includes(childId)) {
          return {
            ...dept,
            children: dept.children.filter(id => id !== childId)
          };
        }
        return dept;
      }).map(dept => {
        // Update child's parent and add to new parent's children
        if (dept.id === childId) {
          return { ...dept, parentId };
        }
        if (dept.id === parentId) {
          return {
            ...dept,
            children: [...dept.children, childId]
          };
        }
        return dept;
      });
      
      return { ...prev, departments };
    });
    
    saveToHistory('Update Hierarchy');
  }, [saveToHistory]);

  // Excel template generation
  const downloadTemplate = useCallback(() => {
    const headers = ['Level', 'Department', 'Person Name', 'Person Title', 'Person Email', 'Parent Department'];
    const sampleData = [
      ['1', 'Executive', 'John Doe', 'CEO', 'john.doe@company.com', ''],
      ['2', 'Engineering', 'Jane Smith', 'VP Engineering', 'jane.smith@company.com', 'Executive'],
      ['3', 'Frontend Team', 'Bob Johnson', 'Frontend Lead', 'bob.johnson@company.com', 'Engineering'],
      ['3', 'Backend Team', 'Alice Brown', 'Backend Lead', 'alice.brown@company.com', 'Engineering']
    ];
    
    const csvContent = [headers, ...sampleData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'org-chart-template.csv';
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  // Excel file upload and processing
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
        
        const data = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.replace(/"/g, '').trim());
          return headers.reduce((obj, header, index) => {
            obj[header] = values[index] || '';
            return obj;
          }, {} as any);
        });
        
        setUploadPreview(data);
        setShowUploadModal(true);
      } catch (error) {
        alert('Error reading file. Please check the format.');
      } finally {
        setIsUploading(false);
      }
    };
    
    reader.readAsText(file);
  }, []);

  // Process uploaded data
  const processUploadedData = useCallback(() => {
    const departmentMap = new Map<string, Department>();
    const maxLevel = Math.max(...uploadPreview.map(row => parseInt(row.Level) || 1));
    
    // Create departments
    uploadPreview.forEach(row => {
      const deptName = row.Department;
      const level = parseInt(row.Level) || 1;
      
      if (!departmentMap.has(deptName)) {
        const dept: Department = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: deptName,
          color: departmentColors[departmentMap.size % departmentColors.length],
          description: '',
          personnel: [],
          level,
          children: []
        };
        departmentMap.set(deptName, dept);
      }
      
      // Add person to department
      if (row['Person Name']) {
        const person: Person = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: row['Person Name'],
          title: row['Person Title'] || '',
          email: row['Person Email'] || ''
        };
        departmentMap.get(deptName)!.personnel.push(person);
      }
    });
    
    // Set parent relationships
    uploadPreview.forEach(row => {
      const deptName = row.Department;
      const parentName = row['Parent Department'];
      
      if (parentName && departmentMap.has(parentName) && departmentMap.has(deptName)) {
        const dept = departmentMap.get(deptName)!;
        const parent = departmentMap.get(parentName)!;
        
        dept.parentId = parent.id;
        if (!parent.children.includes(dept.id)) {
          parent.children.push(dept.id);
        }
      }
    });
    
    setOrgData({
      levels: maxLevel,
      departments: Array.from(departmentMap.values()),
      layout: 'vertical',
      showPersonnel: true
    });
    
    setShowUploadModal(false);
    setUploadPreview([]);
    setCurrentStep(4);
    saveToHistory('Import Data');
  }, [uploadPreview, saveToHistory]);

  // Export functions
  const exportToPDF = useCallback(() => {
    // Implementation would use a library like jsPDF
    alert('PDF export functionality would be implemented here');
  }, []);

  const exportToPNG = useCallback(() => {
    // Implementation would use html2canvas
    alert('PNG export functionality would be implemented here');
  }, []);

  const exportToExcel = useCallback(() => {
    const data = orgData.departments.flatMap(dept => 
      dept.personnel.length > 0 
        ? dept.personnel.map(person => ({
            Level: dept.level,
            Department: dept.name,
            'Person Name': person.name,
            'Person Title': person.title,
            'Person Email': person.email || '',
            'Parent Department': orgData.departments.find(d => d.id === dept.parentId)?.name || ''
          }))
        : [{
            Level: dept.level,
            Department: dept.name,
            'Person Name': '',
            'Person Title': '',
            'Person Email': '',
            'Parent Department': orgData.departments.find(d => d.id === dept.parentId)?.name || ''
          }]
    );
    
    const headers = Object.keys(data[0] || {});
    const csvContent = [headers, ...data.map(row => headers.map(h => row[h as keyof typeof row]))]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'org-chart-data.csv';
    link.click();
    URL.revokeObjectURL(url);
  }, [orgData]);

  // Render functions for each step
  const renderStepIndicator = () => (
    <div className="flex items-center justify-center space-x-4 mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
            currentStep >= step.id
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-200 text-slate-600'
          }`}>
            {currentStep > step.id ? (
              <Check className="w-5 h-5" />
            ) : (
              step.id
            )}
          </div>
          <div className="ml-3 text-left">
            <p className={`text-sm font-medium ${
              currentStep >= step.id ? 'text-slate-900' : 'text-slate-500'
            }`}>
              {step.title}
            </p>
            <p className="text-xs text-slate-500">{step.description}</p>
          </div>
          {index < steps.length - 1 && (
            <ArrowRight className="w-5 h-5 text-slate-400 mx-4" />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-8">
      <div className="card p-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
          <Layers className="w-6 h-6 mr-3 text-indigo-600" />
          Organization Setup
        </h3>
        
        <div className="space-y-6">
          <div>
            <label className="form-label">Number of Organizational Levels</label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="1"
                max="10"
                value={orgData.levels}
                onChange={(e) => setOrgData(prev => ({ ...prev, levels: parseInt(e.target.value) }))}
                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="w-16 text-center">
                <span className="text-2xl font-bold text-indigo-600">{orgData.levels}</span>
                <p className="text-xs text-slate-500">levels</p>
              </div>
            </div>
            <div className="mt-2 flex justify-between text-xs text-slate-500">
              <span>1 level</span>
              <span>10 levels</span>
            </div>
            {validationErrors.find(e => e.field === 'levels') && (
              <p className="form-error">
                <AlertCircle className="w-4 h-4" />
                {validationErrors.find(e => e.field === 'levels')?.message}
              </p>
            )}
          </div>

          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-indigo-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-indigo-900">Level Guidelines</h4>
                <ul className="text-sm text-indigo-700 mt-2 space-y-1">
                  <li>• Level 1: Executive/C-Suite</li>
                  <li>• Level 2: Vice Presidents/Directors</li>
                  <li>• Level 3: Department Heads/Managers</li>
                  <li>• Level 4+: Teams and Individual Contributors</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setCurrentStep(2)}
          className="btn btn-primary btn-lg"
        >
          <span>Next: Manage Departments</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8">
      <div className="card p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-slate-900 flex items-center">
            <Building className="w-6 h-6 mr-3 text-indigo-600" />
            Department & Personnel Management
          </h3>
          <div className="flex items-center space-x-4">
            <button
              onClick={downloadTemplate}
              className="btn btn-secondary btn-md"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Download Template
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn btn-success btn-md"
              disabled={isUploading}
            >
              <Upload className="w-4 h-4" />
              {isUploading ? 'Uploading...' : 'Upload Excel'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={addDepartment}
              className="btn btn-primary btn-md"
            >
              <Plus className="w-4 h-4" />
              Add Department
            </button>
          </div>
        </div>

        {validationErrors.find(e => e.field === 'departments') && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800 font-medium">
                {validationErrors.find(e => e.field === 'departments')?.message}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {orgData.departments.map((dept) => (
            <div key={dept.id} className="border border-slate-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: dept.color }}
                  ></div>
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={dept.name}
                      onChange={(e) => updateDepartment(dept.id, { name: e.target.value })}
                      className="form-input font-medium"
                      placeholder="Department name"
                    />
                    <div className="flex items-center space-x-4">
                      <div>
                        <label className="text-xs text-slate-600">Level</label>
                        <select
                          value={dept.level}
                          onChange={(e) => updateDepartment(dept.id, { level: parseInt(e.target.value) })}
                          className="form-select text-sm"
                        >
                          {Array.from({ length: orgData.levels }, (_, i) => (
                            <option key={i + 1} value={i + 1}>Level {i + 1}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-slate-600">Description</label>
                        <input
                          type="text"
                          value={dept.description}
                          onChange={(e) => updateDepartment(dept.id, { description: e.target.value })}
                          className="form-input text-sm"
                          placeholder="Optional description"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => deleteDepartment(dept.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Personnel Section */}
              <div className="border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-slate-900 flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Personnel ({dept.personnel.length})
                  </h4>
                  <button
                    onClick={() => addPerson(dept.id)}
                    className="btn btn-ghost btn-sm"
                  >
                    <Plus className="w-3 h-3" />
                    Add Person
                  </button>
                </div>

                <div className="space-y-3">
                  {dept.personnel.map((person) => (
                    <div key={person.id} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                      <div className="flex-1 grid grid-cols-3 gap-3">
                        <input
                          type="text"
                          value={person.name}
                          onChange={(e) => updatePerson(dept.id, person.id, { name: e.target.value })}
                          className="form-input text-sm"
                          placeholder="Full name"
                        />
                        <input
                          type="text"
                          value={person.title}
                          onChange={(e) => updatePerson(dept.id, person.id, { title: e.target.value })}
                          className="form-input text-sm"
                          placeholder="Job title"
                        />
                        <input
                          type="email"
                          value={person.email || ''}
                          onChange={(e) => updatePerson(dept.id, person.id, { email: e.target.value })}
                          className="form-input text-sm"
                          placeholder="Email (optional)"
                        />
                      </div>
                      <button
                        onClick={() => deletePerson(dept.id, person.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  
                  {dept.personnel.length === 0 && (
                    <div className="text-center py-4 text-slate-500 text-sm">
                      No personnel added yet. Click "Add Person" to get started.
                    </div>
                  )}
                </div>
              </div>

              {/* Validation Errors for this department */}
              {validationErrors.filter(e => e.departmentId === dept.id).map((error, index) => (
                <div key={index} className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {error.message}
                </div>
              ))}
            </div>
          ))}

          {orgData.departments.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <Building className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No departments yet</h3>
              <p className="mb-4">Get started by adding your first department or uploading an Excel file.</p>
              <div className="flex justify-center space-x-4">
                <button onClick={addDepartment} className="btn btn-primary btn-md">
                  <Plus className="w-4 h-4" />
                  Add Department
                </button>
                <button onClick={downloadTemplate} className="btn btn-secondary btn-md">
                  <FileSpreadsheet className="w-4 h-4" />
                  Download Template
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(1)}
          className="btn btn-secondary btn-lg"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          <span>Back</span>
        </button>
        
        <button
          onClick={() => setCurrentStep(3)}
          disabled={orgData.departments.length === 0}
          className="btn btn-primary btn-lg"
        >
          <span>Next: Build Hierarchy</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8">
      <div className="card p-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
          <Network className="w-6 h-6 mr-3 text-indigo-600" />
          Build Hierarchy
        </h3>
        
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">How to Build Hierarchy</h4>
              <ul className="text-sm text-blue-700 mt-2 space-y-1">
                <li>• Select a department and choose its parent from the dropdown</li>
                <li>• Departments at the same level are siblings</li>
                <li>• Parent departments should be at a higher level (lower number)</li>
                <li>• Leave parent empty for top-level departments</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {orgData.departments
            .sort((a, b) => a.level - b.level)
            .map((dept) => (
            <div key={dept.id} className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: dept.color }}
                  ></div>
                  <div>
                    <h4 className="font-medium text-slate-900">{dept.name}</h4>
                    <p className="text-sm text-slate-500">
                      Level {dept.level} • {dept.personnel.length} personnel
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div>
                    <label className="text-xs text-slate-600">Reports to:</label>
                    <select
                      value={dept.parentId || ''}
                      onChange={(e) => setParentDepartment(dept.id, e.target.value || undefined)}
                      className="form-select text-sm ml-2"
                    >
                      <option value="">No parent (top level)</option>
                      {orgData.departments
                        .filter(d => d.id !== dept.id && d.level < dept.level)
                        .map(parentDept => (
                          <option key={parentDept.id} value={parentDept.id}>
                            {parentDept.name} (Level {parentDept.level})
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
              
              {dept.children.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <p className="text-xs text-slate-600 mb-2">Direct reports:</p>
                  <div className="flex flex-wrap gap-2">
                    {dept.children.map(childId => {
                      const child = orgData.departments.find(d => d.id === childId);
                      return child ? (
                        <span
                          key={childId}
                          className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full"
                        >
                          {child.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(2)}
          className="btn btn-secondary btn-lg"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          <span>Back</span>
        </button>
        
        <button
          onClick={() => setCurrentStep(4)}
          className="btn btn-primary btn-lg"
        >
          <span>Next: Visualize Chart</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const renderOrgChart = () => {
    const getRootDepartments = () => 
      orgData.departments.filter(dept => !dept.parentId);
    
    const renderDepartmentNode = (dept: Department, level: number = 0): JSX.Element => {
      const children = orgData.departments.filter(d => d.parentId === dept.id);
      
      return (
        <div key={dept.id} className="flex flex-col items-center">
          <div
            className={`relative p-4 rounded-lg border-2 shadow-sm transition-all cursor-pointer ${
              selectedDepartment === dept.id 
                ? 'border-indigo-500 bg-indigo-50' 
                : 'border-slate-200 bg-white hover:shadow-md'
            }`}
            style={{ borderLeftColor: dept.color, borderLeftWidth: '4px' }}
            onClick={() => setSelectedDepartment(dept.id)}
          >
            <div className="text-center">
              <h4 className="font-semibold text-slate-900">{dept.name}</h4>
              <p className="text-xs text-slate-500 mt-1">Level {dept.level}</p>
              {orgData.showPersonnel && dept.personnel.length > 0 && (
                <div className="mt-2 space-y-1">
                  {dept.personnel.slice(0, 3).map(person => (
                    <div key={person.id} className="text-xs">
                      <div className="font-medium text-slate-700">{person.name}</div>
                      <div className="text-slate-500">{person.title}</div>
                    </div>
                  ))}
                  {dept.personnel.length > 3 && (
                    <div className="text-xs text-slate-500">
                      +{dept.personnel.length - 3} more
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {children.length > 0 && (
            <div className="mt-8 flex space-x-8">
              {children.map(child => renderDepartmentNode(child, level + 1))}
            </div>
          )}
        </div>
      );
    };
    
    const rootDepartments = getRootDepartments();
    
    return (
      <div 
        ref={chartRef}
        className="p-8 bg-slate-50 rounded-lg overflow-auto"
        style={{ 
          transform: `scale(${zoomLevel / 100})`,
          transformOrigin: 'top left',
          minHeight: '400px'
        }}
      >
        {rootDepartments.length > 0 ? (
          <div className={`flex ${orgData.layout === 'horizontal' ? 'flex-row' : 'flex-col'} items-start space-x-12`}>
            {rootDepartments.map(dept => renderDepartmentNode(dept))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">
            <Building className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <p>No departments to display</p>
          </div>
        )}
      </div>
    );
  };

  const renderStep4 = () => (
    <div className="space-y-8">
      <div className="card p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-slate-900 flex items-center">
            <Eye className="w-6 h-6 mr-3 text-indigo-600" />
            Organization Chart
          </h3>
          
          <div className="flex items-center space-x-4">
            {/* Chart Controls */}
            <div className="flex items-center space-x-2 border border-slate-200 rounded-lg p-1">
              <button
                onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
                className="p-1 hover:bg-slate-100 rounded"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-sm text-slate-600 px-2">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))}
                className="p-1 hover:bg-slate-100 rounded"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel(100)}
                className="p-1 hover:bg-slate-100 rounded"
                title="Reset Zoom"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
            
            {/* Layout Toggle */}
            <select
              value={orgData.layout}
              onChange={(e) => setOrgData(prev => ({ ...prev, layout: e.target.value as 'vertical' | 'horizontal' }))}
              className="form-select text-sm"
            >
              <option value="vertical">Vertical Layout</option>
              <option value="horizontal">Horizontal Layout</option>
            </select>
            
            {/* Show Personnel Toggle */}
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={orgData.showPersonnel}
                onChange={(e) => setOrgData(prev => ({ ...prev, showPersonnel: e.target.checked }))}
                className="rounded"
              />
              <span className="text-sm text-slate-700">Show Personnel</span>
            </label>
            
            {/* Export Options */}
            <div className="flex items-center space-x-2">
              <button onClick={exportToPDF} className="btn btn-secondary btn-sm">
                <FileText className="w-4 h-4" />
                PDF
              </button>
              <button onClick={exportToPNG} className="btn btn-secondary btn-sm">
                <Image className="w-4 h-4" />
                PNG
              </button>
              <button onClick={exportToExcel} className="btn btn-secondary btn-sm">
                <FileSpreadsheet className="w-4 h-4" />
                Excel
              </button>
            </div>
            
            <button
              onClick={() => setShowFullscreen(true)}
              className="btn btn-ghost btn-sm"
              title="Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Chart Statistics */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-indigo-600">{orgData.departments.length}</div>
            <div className="text-sm text-indigo-700">Departments</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {orgData.departments.reduce((sum, dept) => sum + dept.personnel.length, 0)}
            </div>
            <div className="text-sm text-green-700">Total Personnel</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{orgData.levels}</div>
            <div className="text-sm text-purple-700">Levels</div>
          </div>
          <div className="bg-amber-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-amber-600">
              {orgData.departments.filter(d => !d.parentId).length}
            </div>
            <div className="text-sm text-amber-700">Root Departments</div>
          </div>
        </div>
        
        {/* Organization Chart */}
        {renderOrgChart()}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(3)}
          className="btn btn-secondary btn-lg"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          <span>Back</span>
        </button>
        
        <button
          onClick={() => setCurrentStep(1)}
          className="btn btn-ghost btn-lg"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Start Over</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Organization Chart Builder</h1>
          <p className="text-slate-600">Create comprehensive organizational hierarchies with departments and personnel</p>
        </div>
        
        {/* Undo/Redo Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="btn btn-ghost btn-sm"
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="btn btn-ghost btn-sm"
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Step Content */}
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
      {currentStep === 4 && renderStep4()}

      {/* Upload Preview Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Preview Uploaded Data</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-slate-600">
                Found {uploadPreview.length} rows. Review the data below and click "Import" to proceed.
              </p>
            </div>
            
            <div className="overflow-x-auto mb-6">
              <table className="table">
                <thead>
                  <tr>
                    <th>Level</th>
                    <th>Department</th>
                    <th>Person Name</th>
                    <th>Person Title</th>
                    <th>Person Email</th>
                    <th>Parent Department</th>
                  </tr>
                </thead>
                <tbody>
                  {uploadPreview.slice(0, 10).map((row, index) => (
                    <tr key={index}>
                      <td>{row.Level}</td>
                      <td>{row.Department}</td>
                      <td>{row['Person Name']}</td>
                      <td>{row['Person Title']}</td>
                      <td>{row['Person Email']}</td>
                      <td>{row['Parent Department']}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {uploadPreview.length > 10 && (
                <p className="text-sm text-slate-500 mt-2 text-center">
                  ... and {uploadPreview.length - 10} more rows
                </p>
              )}
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowUploadModal(false)}
                className="btn btn-secondary btn-md"
              >
                Cancel
              </button>
              <button
                onClick={processUploadedData}
                className="btn btn-primary btn-md"
              >
                Import Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Chart Modal */}
      {showFullscreen && (
        <div className="fixed inset-0 bg-white z-50 overflow-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">Organization Chart - Fullscreen</h2>
              <button
                onClick={() => setShowFullscreen(false)}
                className="btn btn-ghost btn-md"
              >
                <X className="w-5 h-5" />
                Close
              </button>
            </div>
            {renderOrgChart()}
          </div>
        </div>
      )}
    </div>
  );
}