import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, CreditCard as Edit, Trash2, Users, Calendar, DollarSign, MapPin, Clock, CheckCircle, XCircle, AlertCircle, Upload, Send, X, FileCheck, Inbox, ClipboardCheck, Rocket, FileText, Briefcase } from 'lucide-react';
import { DemandPlan } from '../../types';

interface DemandPlansListProps {
  onNavigate: (tab: string) => void;
}

export function DemandPlansList({ onNavigate }: DemandPlansListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [selectedPlans, setSelectedPlans] = useState<string[]>([]);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPlanForView, setSelectedPlanForView] = useState<DemandPlan | null>(null);
  const [approvalData, setApprovalData] = useState({
    approver: '',
    message: ''
  });

  // Mock data for demonstration
  const mockDemandPlans: DemandPlan[] = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      description: 'Scaling our engineering team to support new product initiatives',
      status: 'approved',
      approval_level: 3,
      created_by: 'john.doe@company.com',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-20T14:30:00Z',
      total_positions: 12,
      requisitions: [],
      approval_history: [],
      stage: 'Live',
      department: 'Engineering',
      location: 'San Francisco, CA',
      experience_range: '5-8 years',
      mandatory_skills: ['React', 'TypeScript', 'CSS', 'REST APIs'],
      optional_skills: ['GraphQL', 'Next.js', 'Tailwind'],
      job_description: 'We are seeking a Senior Frontend Developer to join our growing team...'
    },
    {
      id: '2',
      title: 'Mobile Developer',
      description: 'Building a dedicated mobile development team for iOS and Android',
      status: 'pending_approval',
      approval_level: 2,
      created_by: 'sarah.smith@company.com',
      created_at: '2024-01-18T09:15:00Z',
      updated_at: '2024-01-18T09:15:00Z',
      total_positions: 6,
      requisitions: [],
      approval_history: [],
      stage: 'Final Review',
      department: 'Mobile',
      location: 'Remote',
      experience_range: '3-5 years',
      mandatory_skills: ['Swift', 'Kotlin', 'React Native'],
      optional_skills: ['Flutter', 'CI/CD'],
      job_description: 'Join our mobile team to build amazing mobile experiences...'
    },
    {
      id: '3',
      title: 'Data Scientist',
      description: 'Establishing a data science team to drive analytics and ML initiatives',
      status: 'draft',
      approval_level: 1,
      created_by: 'mike.johnson@company.com',
      created_at: '2024-01-20T16:45:00Z',
      updated_at: '2024-01-20T16:45:00Z',
      total_positions: 8,
      requisitions: [],
      approval_history: [],
      stage: 'Draft',
      department: 'Data Analytics',
      location: 'New York, NY',
      experience_range: '4-7 years',
      mandatory_skills: ['Python', 'Machine Learning', 'SQL'],
      optional_skills: ['TensorFlow', 'PyTorch', 'AWS'],
      job_description: 'We need experienced data scientists to build predictive models...'
    },
    {
      id: '4',
      title: 'DevOps Engineer',
      description: 'Building infrastructure and DevOps capabilities',
      status: 'rejected',
      approval_level: 2,
      created_by: 'lisa.wong@company.com',
      created_at: '2024-01-10T13:30:00Z',
      updated_at: '2024-01-12T11:20:00Z',
      total_positions: 4,
      requisitions: [],
      approval_history: [],
      stage: 'ANSR Review',
      department: 'Infrastructure',
      location: 'Austin, TX',
      experience_range: '5-9 years',
      mandatory_skills: ['AWS', 'Terraform', 'Kubernetes', 'CI/CD'],
      optional_skills: ['GCP', 'Ansible', 'Monitoring'],
      job_description: 'Looking for DevOps engineers to manage our cloud infrastructure...'
    }
  ];

  // Mock approvers data
  const mockApprovers = [
    { id: '1', name: 'Sarah Johnson', role: 'Department Head', email: 'sarah.johnson@company.com' },
    { id: '2', name: 'Michael Chen', role: 'Regional Manager', email: 'michael.chen@company.com' },
    { id: '3', name: 'Lisa Wong', role: 'VP Engineering', email: 'lisa.wong@company.com' },
    { id: '4', name: 'David Kim', role: 'Director HR', email: 'david.kim@company.com' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'pending_approval':
        return <Clock className="w-5 h-5 text-amber-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return 'px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full';
      case 'rejected':
        return 'px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full';
      case 'pending_approval':
        return 'px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-full';
      default:
        return 'px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full';
    }
  };

  const filteredPlans = mockDemandPlans.filter(plan => {
    const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || plan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPlans(filteredPlans.filter(plan => plan.status === 'draft').map(plan => plan.id));
    } else {
      setSelectedPlans([]);
    }
  };

  const handleSelectPlan = (planId: string, checked: boolean) => {
    if (checked) {
      setSelectedPlans(prev => [...prev, planId]);
    } else {
      setSelectedPlans(prev => prev.filter(id => id !== planId));
    }
  };

  const handleSendForApproval = () => {
    setShowApprovalModal(true);
  };

  const handleSubmitApproval = () => {
    console.log('Sending for approval:', {
      plans: selectedPlans,
      approver: approvalData.approver,
      message: approvalData.message
    });
    alert(`${selectedPlans.length} requisition(s) sent for approval!`);
    setShowApprovalModal(false);
    setSelectedPlans([]);
    setApprovalData({ approver: '', message: '' });
  };

  const handleViewPlan = (plan: DemandPlan) => {
    setSelectedPlanForView(plan);
    setShowViewModal(true);
  };

  const handleEdit = (plan: DemandPlan) => {
    console.log('Editing plan:', plan);
    alert('Edit functionality will be implemented');
  };

  const getStageColor = (stage: string) => {
    switch(stage) {
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Draft Review': return 'bg-slate-100 text-slate-800';
      case 'ANSR Review': return 'bg-purple-100 text-purple-800';
      case 'Intake': return 'bg-blue-100 text-blue-800';
      case 'Final Review': return 'bg-amber-100 text-amber-800';
      case 'Live': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const selectablePlans = filteredPlans.filter(plan => plan.status === 'draft');
  const allSelectableSelected = selectablePlans.length > 0 && selectablePlans.every(plan => selectedPlans.includes(plan.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Requisitions</h1>
          <p className="text-gray-600">Manage and track your positions</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>Bulk Upload</span>
          </button>
          <button 
            onClick={() => onNavigate('create-manual')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Requisition</span>
          </button>
        </div>
      </div>

      {/* Stats Cards - All in one line */}
      <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-600 text-xs font-medium whitespace-nowrap">Total</p>
              <p className="text-xl font-bold text-gray-900">{mockDemandPlans.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-600 text-xs font-medium whitespace-nowrap">Draft</p>
              <p className="text-xl font-bold text-gray-600">
                {mockDemandPlans.filter(p => p.status === 'draft').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 text-slate-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-600 text-xs font-medium whitespace-nowrap">Draft Review</p>
              <p className="text-xl font-bold text-slate-600">
                {mockDemandPlans.filter(p => p.status === 'draft').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileCheck className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-600 text-xs font-medium whitespace-nowrap">ANSR Review</p>
              <p className="text-xl font-bold text-purple-600">
                {mockDemandPlans.filter(p => p.status === 'draft').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Inbox className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-600 text-xs font-medium whitespace-nowrap">Intake</p>
              <p className="text-xl font-bold text-blue-600">
                {mockDemandPlans.filter(p => p.status === 'pending_approval').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <ClipboardCheck className="w-4 h-4 text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-600 text-xs font-medium whitespace-nowrap">Final Review</p>
              <p className="text-xl font-bold text-amber-600">
                {mockDemandPlans.filter(p => p.status === 'approved').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Rocket className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-600 text-xs font-medium whitespace-nowrap">Live</p>
              <p className="text-xl font-bold text-green-600">
                {mockDemandPlans.filter(p => p.status === 'rejected').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
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
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="pending_approval">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="created_at">Created Date</option>
              <option value="title">Title</option>
              <option value="status">Status</option>
              <option value="total_positions">Positions</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedPlans.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-900">
                {selectedPlans.length} requisition{selectedPlans.length > 1 ? 's' : ''} selected
              </span>
              <button
                onClick={() => setSelectedPlans([])}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Clear selection
              </button>
            </div>
            <button
              onClick={handleSendForApproval}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Send for Approval</span>
            </button>
          </div>
        </div>
      )}

      {/* Plans List */}
      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-200">
        {filteredPlans.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No requisitions found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first requisition'
              }
            </p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Create First Requisition
            </button>
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                  <input
                    type="checkbox"
                    checked={allSelectableSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled={selectablePlans.length === 0}
                  />
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requisition Name
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created By
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created On
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stage
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPlans.map((plan) => (
                <tr key={plan.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedPlans.includes(plan.id)}
                      onChange={(e) => handleSelectPlan(plan.id, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      disabled={plan.status !== 'draft'}
                    />
                  </td>
                  <td className="px-6 py-4 w-1/4">
                    <div
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                      onClick={() => handleViewPlan(plan)}
                    >
                      {plan.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{plan.created_by.split('@')[0]}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(plan.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStageColor(plan.stage || 'Draft')}`}>
                      {plan.stage || 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(plan.status)}>
                      {plan.status === 'pending_approval' ? 'Pending' :
                       plan.status === 'rejected' ? 'Rejected' :
                       plan.status === 'approved' ? 'Approved' :
                       plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewPlan(plan)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(plan)}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {/* Approval Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Send for Approval</h3>
              <button
                onClick={() => setShowApprovalModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Sending {selectedPlans.length} requisition{selectedPlans.length > 1 ? 's' : ''} for approval:
                </p>
                <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
                  {filteredPlans
                    .filter(plan => selectedPlans.includes(plan.id))
                    .map(plan => (
                      <div key={plan.id} className="text-sm text-gray-700 py-1">
                        • {plan.title}
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Approver
                </label>
                <select
                  value={approvalData.approver}
                  onChange={(e) => setApprovalData(prev => ({ ...prev, approver: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Choose an approver...</option>
                  {mockApprovers.map(approver => (
                    <option key={approver.id} value={approver.id}>
                      {approver.name} - {approver.role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message (Optional)
                </label>
                <textarea
                  value={approvalData.message}
                  onChange={(e) => setApprovalData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Add a message for the approver..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowApprovalModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitApproval}
                disabled={!approvalData.approver}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send for Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedPlanForView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Requisition Details</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">{selectedPlanForView.title}</h4>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Department</p>
                    <div className="flex items-center text-sm text-gray-900">
                      <Briefcase className="w-4 h-4 mr-2 text-gray-500" />
                      {selectedPlanForView.department || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Location</p>
                    <div className="flex items-center text-sm text-gray-900">
                      <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                      {selectedPlanForView.location || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Positions</p>
                    <div className="flex items-center text-sm text-gray-900">
                      <Users className="w-4 h-4 mr-2 text-gray-500" />
                      {selectedPlanForView.total_positions}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Experience Range</p>
                    <p className="text-sm text-gray-900">{selectedPlanForView.experience_range || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Created By</p>
                    <p className="text-sm text-gray-900">{selectedPlanForView.created_by}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Created On</p>
                    <p className="text-sm text-gray-900">{new Date(selectedPlanForView.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Stage</p>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStageColor(selectedPlanForView.stage || 'Draft')}`}>
                      {selectedPlanForView.stage || 'Draft'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Status</p>
                    <span className={getStatusBadge(selectedPlanForView.status)}>
                      {selectedPlanForView.status === 'pending_approval' ? 'Pending' :
                       selectedPlanForView.status === 'rejected' ? 'Rejected' :
                       selectedPlanForView.status === 'approved' ? 'Approved' :
                       selectedPlanForView.status.charAt(0).toUpperCase() + selectedPlanForView.status.slice(1)}
                    </span>
                  </div>
                </div>

                {selectedPlanForView.mandatory_skills && selectedPlanForView.mandatory_skills.length > 0 && (
                  <div className="mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-2">Required Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedPlanForView.mandatory_skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedPlanForView.optional_skills && selectedPlanForView.optional_skills.length > 0 && (
                  <div className="mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-2">Nice-to-Have Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedPlanForView.optional_skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedPlanForView.job_description && (
                  <div className="mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-2">Job Description</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{selectedPlanForView.job_description}</p>
                  </div>
                )}

                {selectedPlanForView.description && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">Description</p>
                    <p className="text-sm text-gray-600">{selectedPlanForView.description}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}