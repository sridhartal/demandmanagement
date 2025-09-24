import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  Download, 
  Upload, 
  Users, 
  Building, 
  ChevronDown, 
  ChevronRight,
  Move,
  Eye,
  Settings,
  Layers,
  Network,
  ArrowRight,
  Check,
  X
} from 'lucide-react';
import { OrgNode, Department } from '../../types';

interface HierarchyLevel {
  level: number;
  name: string;
  departments: string[];
}

export function OrgChartBuilder() {
  const [currentStep, setCurrentStep] = useState(1);
  const [levels, setLevels] = useState(3);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [hierarchyLevels, setHierarchyLevels] = useState<HierarchyLevel[]>([]);
  const [orgNodes, setOrgNodes] = useState<OrgNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const steps = [
    { id: 1, title: 'Setup Levels & Departments', description: 'Define organizational levels and departments' },
    { id: 2, title: 'Create Hierarchy', description: 'Link departments in hierarchical structure' },
    { id: 3, title: 'Visualize Chart', description: 'View and customize your org chart' }
  ];

  // Initialize hierarchy levels when levels change
  useEffect(() => {
    const newHierarchyLevels = Array.from({ length: levels }, (_, index) => ({
      level: index + 1,
      name: index === 0 ? 'Executive' : index === 1 ? 'Management' : index === 2 ? 'Department Head' : `Level ${index + 1}`,
      departments: []
    }));
    setHierarchyLevels(newHierarchyLevels);
  }, [levels]);

  const addDepartment = () => {
    const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#84CC16', '#F97316'];
    const newDept: Department = {
      id: Date.now().toString(),
      name: `Department ${departments.length + 1}`,
      color: colors[departments.length % colors.length],
      description: 'Department description'
    };
    setDepartments(prev => [...prev, newDept]);
  };

  const updateDepartment = (deptId: string, updates: Partial<Department>) => {
    setDepartments(prev => prev.map(dept => 
      dept.id === deptId ? { ...dept, ...updates } : dept
    ));
  };

  const deleteDepartment = (deptId: string) => {
    setDepartments(prev => prev.filter(dept => dept.id !== deptId));
    // Remove from hierarchy levels
    setHierarchyLevels(prev => prev.map(level => ({
      ...level,
      departments: level.departments.filter(id => id !== deptId)
    })));
  };

  const assignDepartmentToLevel = (deptId: string, levelIndex: number) => {
    setHierarchyLevels(prev => prev.map((level, index) => {
      if (index === levelIndex) {
        return {
          ...level,
          departments: level.departments.includes(deptId) 
            ? level.departments.filter(id => id !== deptId)
            : [...level.departments, deptId]
        };
      } else {
        return {
          ...level,
          departments: level.departments.filter(id => id !== deptId)
        };
      }
    }));
  };

  const generateOrgChart = () => {
    const nodes: OrgNode[] = [];
    let nodeId = 1;
    
    hierarchyLevels.forEach((level, levelIndex) => {
      level.departments.forEach((deptId, deptIndex) => {
        const dept = departments.find(d => d.id === deptId);
        if (dept) {
          const node: OrgNode = {
            id: nodeId.toString(),
            title: `${dept.name} Head`,
            name: `Manager ${nodeId}`,
            department: dept.name,
            level: level.level,
            parentId: levelIndex > 0 ? '1' : null, // Simple parent assignment for demo
            children: [],
            x: 200 + (deptIndex * 200),
            y: 100 + (levelIndex * 150),
            color: dept.color
          };
          nodes.push(node);
          nodeId++;
        }
      });
    });

    setOrgNodes(nodes);
    setCurrentStep(3);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center space-x-4 mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
            currentStep >= step.id
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-600'
          }`}>
            {currentStep > step.id ? (
              <Check className="w-5 h-5" />
            ) : (
              step.id
            )}
          </div>
          <div className="ml-3 text-left">
            <p className={`text-sm font-medium ${
              currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
            }`}>
              {step.title}
            </p>
            <p className="text-xs text-gray-500">{step.description}</p>
          </div>
          {index < steps.length - 1 && (
            <ArrowRight className="w-5 h-5 text-gray-400 mx-4" />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Layers className="w-6 h-6 mr-3" />
          Organization Setup
        </h3>
        
        {/* Number of Levels */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Number of Organizational Levels
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="2"
              max="8"
              value={levels}
              onChange={(e) => setLevels(parseInt(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="w-16 text-center">
              <span className="text-2xl font-bold text-blue-600">{levels}</span>
              <p className="text-xs text-gray-500">levels</p>
            </div>
          </div>
          <div className="mt-2 flex justify-between text-xs text-gray-500">
            <span>2 levels</span>
            <span>8 levels</span>
          </div>
        </div>

        {/* Level Preview */}
        <div className="mb-8">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Level Structure Preview</h4>
          <div className="space-y-3">
            {hierarchyLevels.map((level, index) => (
              <div key={level.level} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">{level.level}</span>
                </div>
                <input
                  type="text"
                  value={level.name}
                  onChange={(e) => {
                    const newLevels = [...hierarchyLevels];
                    newLevels[index].name = e.target.value;
                    setHierarchyLevels(newLevels);
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={`Level ${level.level} name`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Departments */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-900 flex items-center">
              <Building className="w-5 h-5 mr-2" />
              Departments
            </h4>
            <button
              onClick={addDepartment}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Department</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {departments.map((dept) => (
              <div key={dept.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: dept.color }}
                  ></div>
                  <input
                    type="text"
                    value={dept.name}
                    onChange={(e) => updateDepartment(dept.id, { name: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={() => deleteDepartment(dept.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  value={dept.description}
                  onChange={(e) => updateDepartment(dept.id, { description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  rows={2}
                  placeholder="Department description"
                />
              </div>
            ))}
          </div>
          
          {departments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Building className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No departments added yet. Click "Add Department" to get started.</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setCurrentStep(2)}
          disabled={departments.length === 0}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Next: Create Hierarchy</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Network className="w-6 h-6 mr-3" />
          Create Hierarchy
        </h3>
        
        <p className="text-gray-600 mb-6">
          Assign departments to organizational levels. Departments can only be assigned to one level.
        </p>

        <div className="space-y-6">
          {hierarchyLevels.map((level, levelIndex) => (
            <div key={level.level} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">{level.level}</span>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900">{level.name}</h4>
                  <p className="text-sm text-gray-500">
                    {level.departments.length} department{level.departments.length !== 1 ? 's' : ''} assigned
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {departments.map((dept) => {
                  const isAssigned = level.departments.includes(dept.id);
                  const isAssignedElsewhere = hierarchyLevels.some((l, i) => 
                    i !== levelIndex && l.departments.includes(dept.id)
                  );
                  
                  return (
                    <button
                      key={dept.id}
                      onClick={() => assignDepartmentToLevel(dept.id, levelIndex)}
                      disabled={isAssignedElsewhere && !isAssigned}
                      className={`p-3 rounded-lg border-2 transition-all text-left ${
                        isAssigned
                          ? 'border-blue-500 bg-blue-50 text-blue-900'
                          : isAssignedElsewhere
                          ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: dept.color }}
                        ></div>
                        <span className="font-medium text-sm">{dept.name}</span>
                        {isAssigned && <Check className="w-4 h-4 text-blue-600" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(1)}
          className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          <span>Back</span>
        </button>
        
        <button
          onClick={generateOrgChart}
          disabled={hierarchyLevels.every(level => level.departments.length === 0)}
          className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Generate Org Chart</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <Eye className="w-6 h-6 mr-3" />
            Organization Chart
          </h3>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              {orgNodes.length} positions • {departments.length} departments • {levels} levels
            </div>
            <button
              onClick={() => {
                const data = { levels, departments, hierarchyLevels, orgNodes };
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'org-chart.json';
                link.click();
                URL.revokeObjectURL(url);
              }}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
        
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <svg
            width="100%"
            height="600"
            viewBox="0 0 1000 600"
            className="bg-gray-50"
          >
            {/* Grid */}
            <defs>
              <pattern
                id="grid"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 20 0 L 0 0 0 20"
                  fill="none"
                  stroke="#F3F4F6"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Connections */}
            {orgNodes.map(node => {
              if (!node.parentId) return null;
              const parent = orgNodes.find(n => n.id === node.parentId);
              if (!parent) return null;

              return (
                <line
                  key={`${parent.id}-${node.id}`}
                  x1={parent.x + 75}
                  y1={parent.y + 40}
                  x2={node.x + 75}
                  y2={node.y}
                  stroke="#D1D5DB"
                  strokeWidth="2"
                />
              );
            })}
            
            {/* Nodes */}
            {orgNodes.map(node => (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                className="cursor-pointer"
                onClick={() => setSelectedNode(node.id)}
              >
                <rect
                  width="150"
                  height="80"
                  rx="8"
                  fill={node.color}
                  stroke={selectedNode === node.id ? '#F59E0B' : 'transparent'}
                  strokeWidth={selectedNode === node.id ? '3' : '0'}
                  className="drop-shadow-md"
                />
                <text
                  x="75"
                  y="25"
                  textAnchor="middle"
                  className="fill-white text-sm font-semibold"
                >
                  {node.title}
                </text>
                <text
                  x="75"
                  y="45"
                  textAnchor="middle"
                  className="fill-white text-xs"
                >
                  {node.name}
                </text>
                <text
                  x="75"
                  y="65"
                  textAnchor="middle"
                  className="fill-white text-xs opacity-80"
                >
                  {node.department}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(2)}
          className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          <span>Back to Hierarchy</span>
        </button>
        
        <button
          onClick={() => {
            setCurrentStep(1);
            setOrgNodes([]);
          }}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Edit className="w-4 h-4" />
          <span>Start Over</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Organization Chart Builder</h1>
        <p className="text-gray-600">Create your organizational hierarchy in 3 simple steps</p>
      </div>

      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Step Content */}
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
    </div>
  );
}