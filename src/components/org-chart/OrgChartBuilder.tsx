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
  Network
} from 'lucide-react';
import { OrgNode, Department } from '../../types';

export function OrgChartBuilder() {
  const [levels, setLevels] = useState(3);
  const [departments, setDepartments] = useState<Department[]>([
    { id: '1', name: 'Engineering', color: '#3B82F6', description: 'Software development and technical operations' },
    { id: '2', name: 'Product', color: '#10B981', description: 'Product management and strategy' },
    { id: '3', name: 'Design', color: '#8B5CF6', description: 'UI/UX and visual design' },
    { id: '4', name: 'Marketing', color: '#F59E0B', description: 'Marketing and growth' }
  ]);
  
  const [orgNodes, setOrgNodes] = useState<OrgNode[]>([
    {
      id: '1',
      title: 'CEO',
      name: 'John Smith',
      department: 'Executive',
      level: 1,
      parentId: null,
      children: ['2', '3'],
      x: 400,
      y: 50,
      color: '#1F2937'
    },
    {
      id: '2',
      title: 'VP Engineering',
      name: 'Sarah Johnson',
      department: 'Engineering',
      level: 2,
      parentId: '1',
      children: ['4', '5'],
      x: 200,
      y: 200,
      color: '#3B82F6'
    },
    {
      id: '3',
      title: 'VP Product',
      name: 'Mike Chen',
      department: 'Product',
      level: 2,
      parentId: '1',
      children: ['6'],
      x: 600,
      y: 200,
      color: '#10B981'
    },
    {
      id: '4',
      title: 'Engineering Manager',
      name: 'Lisa Wong',
      department: 'Engineering',
      level: 3,
      parentId: '2',
      children: [],
      x: 100,
      y: 350,
      color: '#3B82F6'
    },
    {
      id: '5',
      title: 'Senior Engineer',
      name: 'David Kim',
      department: 'Engineering',
      level: 3,
      parentId: '2',
      children: [],
      x: 300,
      y: 350,
      color: '#3B82F6'
    },
    {
      id: '6',
      title: 'Product Manager',
      name: 'Emma Davis',
      department: 'Product',
      level: 3,
      parentId: '3',
      children: [],
      x: 600,
      y: 350,
      color: '#10B981'
    }
  ]);

  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [viewMode, setViewMode] = useState<'builder' | 'preview'>('builder');
  
  const svgRef = useRef<SVGSVGElement>(null);

  const addNode = () => {
    const newNode: OrgNode = {
      id: Date.now().toString(),
      title: 'New Position',
      name: 'Employee Name',
      department: departments[0]?.name || 'General',
      level: 1,
      parentId: null,
      children: [],
      x: 400,
      y: 100,
      color: departments[0]?.color || '#6B7280'
    };
    
    setOrgNodes(prev => [...prev, newNode]);
    setSelectedNode(newNode.id);
    setIsEditing(true);
  };

  const updateNode = (nodeId: string, updates: Partial<OrgNode>) => {
    setOrgNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, ...updates } : node
    ));
  };

  const deleteNode = (nodeId: string) => {
    setOrgNodes(prev => {
      // Remove the node and update parent-child relationships
      const nodeToDelete = prev.find(n => n.id === nodeId);
      if (!nodeToDelete) return prev;

      // Remove from parent's children
      const updatedNodes = prev.map(node => ({
        ...node,
        children: node.children.filter(childId => childId !== nodeId)
      }));

      // Remove the node itself
      return updatedNodes.filter(node => node.id !== nodeId);
    });
    
    if (selectedNode === nodeId) {
      setSelectedNode(null);
    }
  };

  const connectNodes = (parentId: string, childId: string) => {
    setOrgNodes(prev => prev.map(node => {
      if (node.id === parentId) {
        return {
          ...node,
          children: [...node.children.filter(id => id !== childId), childId]
        };
      }
      if (node.id === childId) {
        return {
          ...node,
          parentId: parentId
        };
      }
      return node;
    }));
  };

  const addDepartment = () => {
    const newDept: Department = {
      id: Date.now().toString(),
      name: 'New Department',
      color: '#6B7280',
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
  };

  const handleNodeDrag = (nodeId: string, x: number, y: number) => {
    updateNode(nodeId, { x, y });
  };

  const exportOrgChart = () => {
    const data = {
      levels,
      departments,
      orgNodes,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'org-chart.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const renderConnections = () => {
    return orgNodes.map(node => {
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
          markerEnd="url(#arrowhead)"
        />
      );
    });
  };

  const renderNode = (node: OrgNode) => {
    const isSelected = selectedNode === node.id;
    
    return (
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
          stroke={isSelected ? '#F59E0B' : 'transparent'}
          strokeWidth={isSelected ? '3' : '0'}
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
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organization Chart Builder</h1>
          <p className="text-gray-600">Create and visualize your organizational hierarchy</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('builder')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'builder' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Settings className="w-4 h-4 mr-2 inline" />
              Builder
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'preview' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Eye className="w-4 h-4 mr-2 inline" />
              Preview
            </button>
          </div>
          
          <button
            onClick={exportOrgChart}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Controls */}
        <div className="lg:col-span-1 space-y-6">
          {/* Hierarchy Settings */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Layers className="w-5 h-5 mr-2" />
              Hierarchy Settings
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Levels
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={levels}
                  onChange={(e) => setLevels(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <button
                onClick={addNode}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Position</span>
              </button>
            </div>
          </div>

          {/* Departments */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Building className="w-5 h-5 mr-2" />
                Departments
              </h3>
              <button
                onClick={addDepartment}
                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-3">
              {departments.map((dept) => (
                <div key={dept.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: dept.color }}
                  ></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{dept.name}</p>
                    <p className="text-xs text-gray-500">{dept.description}</p>
                  </div>
                  <button
                    onClick={() => deleteDepartment(dept.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Node Details */}
          {selectedNode && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Edit className="w-5 h-5 mr-2" />
                Edit Position
              </h3>
              
              {(() => {
                const node = orgNodes.find(n => n.id === selectedNode);
                if (!node) return null;
                
                return (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Position Title
                      </label>
                      <input
                        type="text"
                        value={node.title}
                        onChange={(e) => updateNode(selectedNode, { title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Employee Name
                      </label>
                      <input
                        type="text"
                        value={node.name}
                        onChange={(e) => updateNode(selectedNode, { name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department
                      </label>
                      <select
                        value={node.department}
                        onChange={(e) => {
                          const dept = departments.find(d => d.name === e.target.value);
                          updateNode(selectedNode, { 
                            department: e.target.value,
                            color: dept?.color || '#6B7280'
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {departments.map(dept => (
                          <option key={dept.id} value={dept.name}>{dept.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Level
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={levels}
                        value={node.level}
                        onChange={(e) => updateNode(selectedNode, { level: parseInt(e.target.value) || 1 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reports To
                      </label>
                      <select
                        value={node.parentId || ''}
                        onChange={(e) => {
                          const newParentId = e.target.value || null;
                          updateNode(selectedNode, { parentId: newParentId });
                          if (newParentId) {
                            connectNodes(newParentId, selectedNode);
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">No parent (Top level)</option>
                        {orgNodes
                          .filter(n => n.id !== selectedNode && n.level < node.level)
                          .map(n => (
                            <option key={n.id} value={n.id}>
                              {n.title} - {n.name}
                            </option>
                          ))}
                      </select>
                    </div>
                    
                    <button
                      onClick={() => deleteNode(selectedNode)}
                      className="w-full flex items-center justify-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Position</span>
                    </button>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* Main Chart Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Network className="w-5 h-5 mr-2" />
                Organization Chart
              </h3>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{orgNodes.length} positions</span>
                <span>•</span>
                <span>{departments.length} departments</span>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <svg
                ref={svgRef}
                width="100%"
                height="600"
                viewBox="0 0 800 600"
                className="bg-gray-50"
              >
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 10 3.5, 0 7"
                      fill="#D1D5DB"
                    />
                  </marker>
                </defs>
                
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
                {renderConnections()}
                
                {/* Nodes */}
                {orgNodes.map(renderNode)}
              </svg>
            </div>
            
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <span>Click nodes to select and edit</span>
                <span>•</span>
                <span>Drag to reposition</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span>Levels: {levels}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Positions</p>
              <p className="text-2xl font-bold text-gray-900">{orgNodes.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Departments</p>
              <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Building className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Hierarchy Levels</p>
              <p className="text-2xl font-bold text-gray-900">{levels}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Layers className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Direct Reports</p>
              <p className="text-2xl font-bold text-gray-900">
                {orgNodes.reduce((sum, node) => sum + node.children.length, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Network className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}