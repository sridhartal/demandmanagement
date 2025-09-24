import React, { useState } from 'react';
import { FileText, Clock, CheckCircle, XCircle, Eye, Edit, Trash2, Plus, Search, Filter, Download, Upload, Bot, AlertCircle, Users } from 'lucide-react';
import { DemandPlan } from '../../types';

interface DemandPlansListProps {
  onNavigate: (tab: string) => void;
}

export function DemandPlansList({ onNavigate }: DemandPlansListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');

  // Mock requisitions data
  const mockRequisitions = [
    {
      id: '1',
      position_title: 'Senior Software Engineer',
      position_category: 'Senior Software Engineer',
      location: 'New York, NY',
      number_of_positions: 3,
      status: 'active',
      created_at: '2024-01-15T10:00:00Z',
      min_experience: 5,
      max_experience: 8,
      min_salary: 120000,
      max_salary: 160000
    },
    {
      id: '2',
      position_title: 'Product Manager',
      position_category: 'Product Manager',
      location: 'San Francisco, CA',
      number_of_positions: 2,
      status: 'active',
      created_at: '2024-01-18T09:15:00Z',
      min_experience: 3,
      max_experience: 6,
      min_salary: 110000,
      max_salary: 150000
    },
    {
      id: '3',
      position_title: 'UI/UX Designer',
      position_category: 'UI/UX Designer',
      location: 'Austin, TX',
      number_of_positions: 1,
      status: 'filled',
      created_at: '2024-01-20T16:45:00Z',
      min_experience: 2,
      max_experience: 5,
      min_salary: 85000,
      max_salary: 120000
    },
    {
      id: '4',
      position_title: 'DevOps Engineer',
      position_category: 'DevOps Engineer',
      location: 'Seattle, WA',
      number_of_positions: 2,
      status: 'active',
      created_at: '2024-01-10T13:30:00Z',
      min_experience: 4,
      max_experience: 7,
      min_salary: 105000,
      max_salary: 140000
    },
    {
      id: '5',
      position_title: 'Data Scientist',
      position_category: 'Data Scientist',
      location: 'Boston, MA',
      number_of_positions: 1,
      status: 'cancelled',
      created_at: '2024-01-08T11:00:00Z',
      min_experience: 3,
      max_experience: 6,
      min_salary: 115000,
      max_salary: 155000
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'filled':
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'active':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'filled':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'cancelled':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const filteredRequisitions = mockRequisitions.filter(req => {
    const matchesSearch = req.position_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.position_category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedRequisitions = [...filteredRequisitions].sort((a, b) => {
    switch (sortBy) {
      case 'position_title':
        return a.position_title.localeCompare(b.position_title);
      case 'status':
        return a.status.localeCompare(b.status);
      case 'positions':
        return b.number_of_positions - a.number_of_positions;
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Manage and track all requisitions across your demand plans</p>
      </div>

      {/* CTAs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => onNavigate('create-manual')}
          className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 text-left group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <Plus className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Add New Requisition</h3>
              <p className="text-gray-600 text-sm">Create a new position manually</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('bulk-upload')}
          className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 text-left group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <Upload className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Bulk Upload</h3>
              <p className="text-gray-600 text-sm">Upload multiple requisitions at once</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('ai-create')}
          className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 text-left group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <Bot className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">AI Create</h3>
              <p className="text-gray-600 text-sm">Describe your needs in natural language</p>
            </div>
          </div>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Requisitions</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">In Draft</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Edit className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pending Approval</p>
              <p className="text-2xl font-bold text-amber-600">4</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Changes Requested</p>
              <p className="text-2xl font-bold text-red-600">2</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Approved</p>
              <p className="text-2xl font-bold text-green-600">3</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search requisitions..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="filled">Filled</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="created_at">Sort by Date</option>
              <option value="position_title">Sort by Position</option>
              <option value="status">Sort by Status</option>
              <option value="positions">Sort by Positions</option>
            </select>
            
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Requisitions Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">Position Title</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">Category</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">Location</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">Positions</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">Experience</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">Budget Range</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedRequisitions.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{req.position_title}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{req.position_category}</td>
                  <td className="px-6 py-4 text-gray-600">{req.location}</td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">{req.number_of_positions}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {req.min_experience}-{req.max_experience} years
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {req.min_salary.toLocaleString()} - {req.max_salary.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={getStatusBadge(req.status)}>
                      {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {sortedRequisitions.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No requisitions found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by adding your first requisition'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <button
              onClick={() => onNavigate('create-manual')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First Requisition
            </button>
          )}
        </div>
      )}

      {/* Summary Stats */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Demand Plan Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {mockRequisitions.filter(r => r.status === 'active').length}
            </p>
            <p className="text-sm text-gray-600">Active Requisitions</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {mockRequisitions.filter(r => r.status === 'filled').length}
            </p>
            <p className="text-sm text-gray-600">Filled Positions</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">
              {mockRequisitions.filter(r => r.status === 'cancelled').length}
            </p>
            <p className="text-sm text-gray-600">Cancelled</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {mockRequisitions.reduce((sum, r) => sum + r.number_of_positions, 0)}
            </p>
            <p className="text-sm text-gray-600">Total Positions</p>
          </div>
        </div>
      </div>
    </div>
  );
}