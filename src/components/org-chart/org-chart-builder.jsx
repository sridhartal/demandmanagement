import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Plus, Trash2, Edit2, Save, Download, Users, Building2 } from 'lucide-react';

const OrgChartBuilder = () => {
  const [orgData, setOrgData] = useState({
    name: 'CEO',
    title: 'Chief Executive Officer',
    department: 'Executive',
    level: 1,
    children: []
  });
  
  const [selectedNode, setSelectedNode] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNode, setNewNode] = useState({
    name: '',
    title: '',
    department: '',
    level: 2
  });
  
  const [departments] = useState([
    'Executive',
    'Engineering',
    'Product',
    'Sales',
    'Marketing',
    'HR',
    'Finance',
    'Operations',
    'Legal',
    'Customer Success'
  ]);
  
  const [collapsed, setCollapsed] = useState({});

  // Function to add a new node
  const addNode = (parentNode, newChild) => {
    const updatedData = JSON.parse(JSON.stringify(orgData));
    
    const findAndAdd = (node) => {
      if (node === parentNode) {
        if (!node.children) node.children = [];
        node.children.push({
          ...newChild,
          level: node.level + 1,
          children: []
        });
        return true;
      }
      if (node.children) {
        for (let child of node.children) {
          if (findAndAdd(child)) return true;
        }
      }
      return false;
    };
    
    findAndAdd(updatedData);
    setOrgData(updatedData);
    setShowAddForm(false);
    setNewNode({ name: '', title: '', department: '', level: 2 });
  };
  
  // Function to delete a node
  const deleteNode = (nodeToDelete) => {
    const updatedData = JSON.parse(JSON.stringify(orgData));
    
    const findAndDelete = (node) => {
      if (node.children) {
        node.children = node.children.filter(child => child !== nodeToDelete);
        node.children.forEach(findAndDelete);
      }
    };
    
    if (nodeToDelete === orgData) {
      alert("Cannot delete root node!");
      return;
    }
    
    findAndDelete(updatedData);
    setOrgData(updatedData);
    setSelectedNode(null);
  };
  
  // Function to update a node
  const updateNode = (nodeToUpdate, updates) => {
    const updatedData = JSON.parse(JSON.stringify(orgData));
    
    const findAndUpdate = (node) => {
      if (node === nodeToUpdate) {
        Object.assign(node, updates);
        return true;
      }
      if (node.children) {
        for (let child of node.children) {
          if (findAndUpdate(child)) return true;
        }
      }
      return false;
    };
    
    findAndUpdate(updatedData);
    setOrgData(updatedData);
    setIsEditing(false);
  };
  
  // Function to export org chart data
  const exportData = () => {
    const dataStr = JSON.stringify(orgData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'org-chart.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  // Function to import org chart data
  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          setOrgData(importedData);
        } catch (error) {
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  };
  
  // Toggle collapse state
  const toggleCollapse = (nodeId) => {
    setCollapsed(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };
  
  // Get unique ID for node
  const getNodeId = (node) => {
    return `${node.name}-${node.title}-${node.level}`;
  };
  
  // OrgNode Component
  const OrgNode = ({ node, isRoot = false }) => {
    const nodeId = getNodeId(node);
    const isCollapsed = collapsed[nodeId];
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedNode === node;
    
    const departmentColors = {
      'Executive': 'bg-purple-100 border-purple-300',
      'Engineering': 'bg-blue-100 border-blue-300',
      'Product': 'bg-green-100 border-green-300',
      'Sales': 'bg-orange-100 border-orange-300',
      'Marketing': 'bg-pink-100 border-pink-300',
      'HR': 'bg-yellow-100 border-yellow-300',
      'Finance': 'bg-indigo-100 border-indigo-300',
      'Operations': 'bg-gray-100 border-gray-300',
      'Legal': 'bg-red-100 border-red-300',
      'Customer Success': 'bg-teal-100 border-teal-300'
    };
    
    const nodeColor = departmentColors[node.department] || 'bg-white border-gray-300';
    
    return (
      <div className="flex flex-col items-center">
        <div className="relative">
          {!isRoot && (
            <div className="absolute top-0 left-1/2 w-0.5 h-8 bg-gray-300 -translate-x-1/2 -translate-y-8"></div>
          )}
          
          <div 
            className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${nodeColor} ${
              isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'shadow hover:shadow-md'
            }`}
            onClick={() => setSelectedNode(node)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-500">Level {node.level}</span>
              <span className="text-xs px-2 py-1 bg-white rounded">{node.department}</span>
            </div>
            
            <div className="font-bold text-gray-800">{node.name}</div>
            <div className="text-sm text-gray-600">{node.title}</div>
            
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCollapse(nodeId);
                }}
                className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 rounded-full p-1 hover:bg-gray-50"
              >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
              </button>
            )}
          </div>
        </div>
        
        {hasChildren && !isCollapsed && (
          <div className="flex mt-8 relative">
            {node.children.length > 1 && (
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-300 -translate-y-8"></div>
            )}
            <div className="flex gap-8">
              {node.children.map((child, index) => (
                <OrgNode key={index} node={child} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Building2 className="text-blue-600" size={32} />
              <h1 className="text-3xl font-bold text-gray-800">Organization Chart Builder</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={exportData}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <Download size={18} />
                Export
              </button>
              <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer">
                <Save size={18} />
                Import
                <input type="file" accept=".json" onChange={importData} className="hidden" />
              </label>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="bg-blue-50 p-3 rounded">
              <div className="font-semibold text-blue-800">Total Positions</div>
              <div className="text-2xl font-bold text-blue-600">
                {JSON.stringify(orgData).match(/"name":/g)?.length || 1}
              </div>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <div className="font-semibold text-green-800">Departments</div>
              <div className="text-2xl font-bold text-green-600">
                {new Set(JSON.stringify(orgData).match(/"department":"([^"]+)"/g)?.map(d => d.split(':')[1]) || []).size}
              </div>
            </div>
            <div className="bg-purple-50 p-3 rounded">
              <div className="font-semibold text-purple-800">Max Level</div>
              <div className="text-2xl font-bold text-purple-600">
                {Math.max(...(JSON.stringify(orgData).match(/"level":(\d+)/g)?.map(l => parseInt(l.split(':')[1])) || [1]))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Control Panel */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Control Panel</h2>
            {selectedNode && (
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  <Plus size={18} />
                  Add Child
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
                >
                  <Edit2 size={18} />
                  Edit
                </button>
                <button
                  onClick={() => deleteNode(selectedNode)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  <Trash2 size={18} />
                  Delete
                </button>
              </div>
            )}
          </div>
          
          {selectedNode && (
            <div className="bg-gray-50 p-4 rounded">
              <div className="font-semibold mb-2">Selected Node:</div>
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Name:</span> {selectedNode.name}
                </div>
                <div>
                  <span className="text-gray-600">Title:</span> {selectedNode.title}
                </div>
                <div>
                  <span className="text-gray-600">Department:</span> {selectedNode.department}
                </div>
                <div>
                  <span className="text-gray-600">Level:</span> {selectedNode.level}
                </div>
              </div>
            </div>
          )}
          
          {/* Add Node Form */}
          {showAddForm && selectedNode && (
            <div className="mt-4 p-4 bg-blue-50 rounded">
              <h3 className="font-semibold mb-3">Add New Position under {selectedNode.name}</h3>
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Name"
                  value={newNode.name}
                  onChange={(e) => setNewNode({...newNode, name: e.target.value})}
                  className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Title"
                  value={newNode.title}
                  onChange={(e) => setNewNode({...newNode, title: e.target.value})}
                  className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={newNode.department}
                  onChange={(e) => setNewNode({...newNode, department: e.target.value})}
                  className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => addNode(selectedNode, newNode)}
                  disabled={!newNode.name || !newNode.title || !newNode.department}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 transition"
                >
                  Add Position
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewNode({ name: '', title: '', department: '', level: 2 });
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          
          {/* Edit Node Form */}
          {isEditing && selectedNode && (
            <div className="mt-4 p-4 bg-yellow-50 rounded">
              <h3 className="font-semibold mb-3">Edit Position</h3>
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Name"
                  defaultValue={selectedNode.name}
                  id="edit-name"
                  className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <input
                  type="text"
                  placeholder="Title"
                  defaultValue={selectedNode.title}
                  id="edit-title"
                  className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <select
                  defaultValue={selectedNode.department}
                  id="edit-department"
                  className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => {
                    updateNode(selectedNode, {
                      name: document.getElementById('edit-name').value,
                      title: document.getElementById('edit-title').value,
                      department: document.getElementById('edit-department').value
                    });
                  }}
                  className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Org Chart Visualization */}
        <div className="bg-white rounded-lg shadow-md p-6 overflow-x-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <Users className="text-blue-600" />
            Organization Structure
          </h2>
          <div className="flex justify-center py-8 min-w-max">
            <OrgNode node={orgData} isRoot={true} />
          </div>
        </div>
        
        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h3 className="font-semibold text-gray-800 mb-3">How to Use:</h3>
          <ol className="space-y-2 text-gray-600">
            <li>1. Click on any position box to select it</li>
            <li>2. Use "Add Child" to add subordinate positions</li>
            <li>3. Use "Edit" to modify position details</li>
            <li>4. Use "Delete" to remove a position (and its subordinates)</li>
            <li>5. Click the expand/collapse button on nodes to show/hide children</li>
            <li>6. Export your org chart as JSON for later use</li>
            <li>7. Import a previously saved org chart using the Import button</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default OrgChartBuilder;