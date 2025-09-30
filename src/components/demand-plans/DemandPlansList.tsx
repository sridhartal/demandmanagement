import React, { useState } from 'react';
import { FileText, Clock, CheckCircle, XCircle, Eye, CreditCard as Edit, Trash2, Plus, Search, Filter, Download, Upload, Bot, AlertCircle, Users, TrendingUp } from 'lucide-react';
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
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'filled':
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <FileText className="w-4 h-4 text-slate-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'badge badge-success';
      case 'filled':
        return 'badge badge-info';
      case 'cancelled':
        return 'badge badge-error';
      default:
        return 'badge badge-neutral';
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
    <div className="space-y-8 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Requisitions Dashboard</h1>
          <p className="text-slate-600 mt-1">Manage and track all open positions and requisitions</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => onNavigate('bulk-upload')}
            className="btn btn-secondary btn-md"
          >
            <Upload className="w-4 h-4" />
            Bulk Upload
          </button>
          <button 
            onClick={() => onNavigate('create-manual')}
            className="btn btn-primary btn-md"
          >
            <Plus className="w-4 h-4" />
            Create New Requisition
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Total Positions</p>
              <p className="text-2xl font-semibold text-slate-900 mt-1">12</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">In Draft</p>
              <p className="text-2xl font-semibold text-slate-900 mt-1">3</p>
            </div>
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
              <Edit className="w-5 h-5 text-slate-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Pending Approval</p>
              <p className="text-2xl font-semibold text-amber-600 mt-1">4</p>
            </div>
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Changes Requested</p>
              <p className="text-2xl font-semibold text-red-600 mt-1">2</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Approved</p>
              <p className="text-2xl font-semibold text-emerald-600 mt-1">3</p>
            </div>
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search positions..."
              className="form-input pl-10"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-select"
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
              className="form-select"
            >
              <option value="created_at">Sort by Date</option>
              <option value="position_title">Sort by Position</option>
              <option value="status">Sort by Status</option>
              <option value="positions">Sort by Count</option>
            </select>
          </div>
        </div>
      </div>

      {/* Positions Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Position</th>
                <th>Category</th>
                <th>Location</th>
                <th>Count</th>
                <th>Experience</th>
                <th>Budget Range</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedRequisitions.map((req) => (
                <tr key={req.id} className="table-row-hover">
                  <td>
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(req.status)}
                      <div>
                        <div className="font-medium text-slate-900">{req.position_title}</div>
                        <div className="text-sm text-slate-500">
                          Created {new Date(req.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="text-slate-600">{req.position_category}</td>
                  <td className="text-slate-600">{req.location}</td>
                  <td>
                    <span className="font-semibold text-slate-900">{req.number_of_positions}</span>
                  </td>
                  <td className="text-slate-600">
                    {req.min_experience}-{req.max_experience} years
                  </td>
                  <td className="text-slate-600">
                    {req.min_salary.toLocaleString()} - {req.max_salary.toLocaleString()}
                  </td>
                  <td>
                    <span className={getStatusBadge(req.status)}>
                      {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center space-x-1">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all focus-ring">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all focus-ring">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all focus-ring">
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
        <div className="card p-12 text-center">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No positions found</h3>
          <p className="text-slate-600 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by creating your first position'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <button
              onClick={() => onNavigate('create-manual')}
              className="btn btn-primary btn-md"
            >
              <Plus className="w-4 h-4" />
              Create First Position
            </button>
          )}
        </div>
      )}

      {/* Summary Stats */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-slate-600" />
          Position Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-2xl font-semibold text-indigo-600">
              {mockRequisitions.filter(r => r.status === 'active').length}
            </p>
            <p className="text-sm text-slate-600 mt-1">Active Positions</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-blue-600">
              {mockRequisitions.filter(r => r.status === 'filled').length}
            </p>
            <p className="text-sm text-slate-600 mt-1">Filled Positions</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-red-600">
              {mockRequisitions.filter(r => r.status === 'cancelled').length}
            </p>
            <p className="text-sm text-slate-600 mt-1">Cancelled</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-emerald-600">
              {mockRequisitions.reduce((sum, r) => sum + r.number_of_positions, 0)}
            </p>
            <p className="text-sm text-slate-600 mt-1">Total Openings</p>
          </div>
        </div>
      </div>
    </div>
  );
}