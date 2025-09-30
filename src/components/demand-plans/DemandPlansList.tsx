import React, { useState } from 'react';
import { Plus, Search, Filter, MoreVertical, Eye, Edit, Trash2, Users, MapPin, DollarSign, Calendar, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { DemandPlan } from '../../types';

interface DemandPlansListProps {
  onNavigate: (tab: string) => void;
}

export function DemandPlansList({ onNavigate }: DemandPlansListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');

  // Mock data
  const mockPlans: DemandPlan[] = [
    {
      id: '1',
      title: 'Q1 2024 Engineering Expansion',
      description: 'Scaling our engineering team to support new product initiatives',
      status: 'approved',
      approval_level: 3,
      created_by: 'john.doe@company.com',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-18T14:30:00Z',
      total_positions: 12,
      requisitions: [],
      approval_history: []
    },
    {
      id: '2',
      title: 'Mobile Development Team',
      description: 'Building a dedicated mobile development team for iOS and Android',
      status: 'pending_approval',
      approval_level: 2,
      created_by: 'sarah.smith@company.com',
      created_at: '2024-01-18T09:15:00Z',
      updated_at: '2024-01-18T09:15:00Z',
      total_positions: 6,
      requisitions: [],
      approval_history: []
    },
    {
      id: '3',
      title: 'Data Science Initiative',
      description: 'Hiring data scientists and ML engineers for AI projects',
      status: 'draft',
      approval_level: 1,
      created_by: 'mike.johnson@company.com',
      created_at: '2024-01-20T16:45:00Z',
      updated_at: '2024-01-20T16:45:00Z',
      total_positions: 8,
      requisitions: [],
      approval_history: []
    },
    {
      id: '4',
      title: 'DevOps Infrastructure Team',
      description: 'Building infrastructure and DevOps capabilities',
      status: 'rejected',
      approval_level: 2,
      created_by: 'lisa.wong@company.com',
      created_at: '2024-01-10T13:30:00Z',
      updated_at: '2024-01-12T11:20:00Z',
      total_positions: 4,
      requisitions: [],
      approval_history: []
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending_approval':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'approved':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'pending_approval':
        return `${baseClasses} bg-amber-100 text-amber-800`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const filteredPlans = mockPlans.filter(plan => {
    const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || plan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Demand Plans</h1>
          <p className="text-gray-600">Manage hiring plans and requisitions</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('create-manual')}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            id="create-plan-btn"
          >
            <Plus className="w-4 h-4" />
            <span>Create Plan</span>
          </button>
          
          <button
            onClick={() => onNavigate('bulk-upload')}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            id="bulk-upload-btn"
          >
            <Plus className="w-4 h-4" />
            <span>Bulk Upload</span>
          </button>
          
          <button
            onClick={() => onNavigate('ai-create')}
            className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            id="ai-create-btn"
          >
            <Plus className="w-4 h-4" />
            <span>AI Create</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Plans</p>
              <p className="text-2xl font-bold text-gray-900">{mockPlans.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Positions</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockPlans.reduce((sum, plan) => sum + plan.total_positions, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pending Approval</p>
              <p className="text-2xl font-bold text-amber-600">
                {mockPlans.filter(p => p.status === 'pending_approval').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Approved</p>
              <p className="text-2xl font-bold text-green-600">
                {mockPlans.filter(p => p.status === 'approved').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="pending_approval">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="created_at">Created Date</option>
              <option value="title">Title</option>
              <option value="total_positions">Positions</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* Plans List */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="divide-y divide-gray-200">
          {filteredPlans.map((plan) => (
            <div key={plan.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getStatusIcon(plan.status)}
                    <h3 className="text-lg font-semibold text-gray-900">{plan.title}</h3>
                    <span className={getStatusBadge(plan.status)}>
                      {plan.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{plan.total_positions} positions</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        {new Date(plan.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        {plan.created_by.split('@')[0]}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Level {plan.approval_level}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-6">
                  <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredPlans.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No demand plans found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first demand plan'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <button
                onClick={() => onNavigate('create-manual')}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors mx-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Create Your First Plan</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}