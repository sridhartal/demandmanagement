import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, MessageSquare, User, Calendar, FileText, Eye } from 'lucide-react';
import { ApprovalHistory } from '../../types';

export function ApprovalsList() {
  const [activeTab, setActiveTab] = useState('pending');

  // Mock approval data
  const mockApprovals = [
    {
      id: '1',
      demand_plan_id: '2',
      demand_plan_title: 'Mobile Development Team',
      approver_id: 'manager1',
      approver_name: 'Sarah Johnson',
      level: 2,
      status: 'pending' as const,
      comments: '',
      created_at: '2024-01-18T09:15:00Z',
      total_positions: 6,
      created_by: 'sarah.smith@company.com'
    },
    {
      id: '2',
      demand_plan_id: '3',
      demand_plan_title: 'Data Science Initiative',
      approver_id: 'manager2',
      approver_name: 'Michael Chen',
      level: 1,
      status: 'pending' as const,
      comments: '',
      created_at: '2024-01-20T16:45:00Z',
      total_positions: 8,
      created_by: 'mike.johnson@company.com'
    },
    {
      id: '3',
      demand_plan_id: '1',
      demand_plan_title: 'Q1 2024 Engineering Expansion',
      approver_id: 'director1',
      approver_name: 'Lisa Wong',
      level: 3,
      status: 'approved' as const,
      comments: 'Approved with budget adjustments. Please ensure salary ranges align with market rates.',
      created_at: '2024-01-15T10:00:00Z',
      total_positions: 12,
      created_by: 'john.doe@company.com'
    },
    {
      id: '4',
      demand_plan_id: '4',
      demand_plan_title: 'DevOps Infrastructure Team',
      approver_id: 'manager3',
      approver_name: 'David Kim',
      level: 2,
      status: 'rejected' as const,
      comments: 'Budget constraints for Q1. Please resubmit with reduced scope or defer to Q2.',
      created_at: '2024-01-10T13:30:00Z',
      total_positions: 4,
      created_by: 'lisa.wong@company.com'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-amber-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'approved':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-amber-100 text-amber-800`;
    }
  };

  const getLevelBadge = (level: number) => {
    const levels = {
      1: { label: 'Department Head', color: 'bg-blue-100 text-blue-800' },
      2: { label: 'Regional Manager', color: 'bg-purple-100 text-purple-800' },
      3: { label: 'VP/Director', color: 'bg-indigo-100 text-indigo-800' }
    };
    
    const levelInfo = levels[level as keyof typeof levels] || { label: `Level ${level}`, color: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${levelInfo.color}`}>
        {levelInfo.label}
      </span>
    );
  };

  const filteredApprovals = mockApprovals.filter(approval => {
    if (activeTab === 'pending') return approval.status === 'pending';
    if (activeTab === 'approved') return approval.status === 'approved';
    if (activeTab === 'rejected') return approval.status === 'rejected';
    return true;
  });

  const handleApprove = (approvalId: string) => {
    console.log('Approving:', approvalId);
    alert('Demand plan approved successfully!');
  };

  const handleReject = (approvalId: string) => {
    const comments = prompt('Please provide rejection comments:');
    if (comments) {
      console.log('Rejecting:', approvalId, 'Comments:', comments);
      alert('Demand plan rejected with comments.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Approvals</h1>
        <p className="text-gray-600">Review and manage demand plan approvals</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pending Approvals</p>
              <p className="text-2xl font-bold text-amber-600">
                {mockApprovals.filter(a => a.status === 'pending').length}
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
              <p className="text-gray-600 text-sm font-medium">Approved This Month</p>
              <p className="text-2xl font-bold text-green-600">
                {mockApprovals.filter(a => a.status === 'approved').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Rejected This Month</p>
              <p className="text-2xl font-bold text-red-600">
                {mockApprovals.filter(a => a.status === 'rejected').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Avg. Approval Time</p>
              <p className="text-2xl font-bold text-blue-600">2.3</p>
              <p className="text-xs text-gray-500">days</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'pending', label: 'Pending', count: mockApprovals.filter(a => a.status === 'pending').length },
              { id: 'approved', label: 'Approved', count: mockApprovals.filter(a => a.status === 'approved').length },
              { id: 'rejected', label: 'Rejected', count: mockApprovals.filter(a => a.status === 'rejected').length },
              { id: 'all', label: 'All', count: mockApprovals.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        {/* Approvals List */}
        <div className="divide-y divide-gray-200">
          {filteredApprovals.map((approval) => (
            <div key={approval.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getStatusIcon(approval.status)}
                    <h3 className="text-lg font-semibold text-gray-900">
                      {approval.demand_plan_title}
                    </h3>
                    <span className={getStatusBadge(approval.status)}>
                      {approval.status.charAt(0).toUpperCase() + approval.status.slice(1)}
                    </span>
                    {getLevelBadge(approval.level)}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-gray-500">Submitted By</p>
                      <p className="font-medium text-gray-900">{approval.created_by.split('@')[0]}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Approver</p>
                      <p className="font-medium text-gray-900">{approval.approver_name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Total Positions</p>
                      <p className="font-medium text-gray-900">{approval.total_positions}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Submitted Date</p>
                      <p className="font-medium text-gray-900">
                        {new Date(approval.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {approval.comments && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="flex items-start space-x-2">
                        <MessageSquare className="w-4 h-4 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Comments</p>
                          <p className="text-sm text-gray-700 mt-1">{approval.comments}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-6">
                  <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  
                  {approval.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(approval.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(approval.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredApprovals.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {activeTab === 'all' ? '' : activeTab} approvals found
            </h3>
            <p className="text-gray-600">
              {activeTab === 'pending' 
                ? 'All caught up! No pending approvals at the moment.'
                : `No ${activeTab} approvals to display.`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}