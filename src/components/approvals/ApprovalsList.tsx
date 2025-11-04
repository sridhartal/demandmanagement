import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, MessageSquare, User, Calendar, FileText, Eye, ThumbsUp, ThumbsDown, FileCheck, ClipboardCheck, X, Users, DollarSign, TrendingUp, Info, Briefcase, MapPin, Send, ExternalLink, Plus, ArrowRight, Save, Download } from 'lucide-react';
import { ApprovalHistory } from '../../types';

interface Review {
  id: string;
  demand_plan_id: string;
  position_title: string;
  created_by: string;
  total_positions: number;
  previous_stage: 'Draft' | 'Intake' | 'Final';
  comments: string;
  created_at: string;
  department?: string;
  location?: string;
  experience_range?: string;
  mandatory_skills?: string[];
  optional_skills?: string[];
  job_description?: string;
  complexity?: 'Low' | 'Medium' | 'High';
  talent_pool?: string;
  compensation_range?: string;
}

interface Comment {
  id: string;
  user: string;
  text: string;
  timestamp: string;
  action?: 'approved' | 'rejected' | 'comment';
}

interface ApprovalsListProps {
  onViewReview?: (reviewId: string) => void;
  reviewId?: string | null;
  onNavigate?: (tab: string) => void;
  onEditRequisition?: (id: string) => void;
}

export function ApprovalsList({ onViewReview, reviewId, onNavigate, onEditRequisition }: ApprovalsListProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkComment, setBulkComment] = useState('');
  const [bulkApprovalComment, setBulkApprovalComment] = useState('');
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [bulkActionType, setBulkActionType] = useState<'approve' | 'reject' | null>(null);
  const [activeReviewTab, setActiveReviewTab] = useState<'draft' | 'ansr' | 'final'>('draft');
  const [newComment, setNewComment] = useState('');
  const [selectedJD, setSelectedJD] = useState('');
  const [editData, setEditData] = useState<Partial<Review>>({});

  // Mock JD Templates
  const mockJDTemplates = [
    { id: '1', name: 'Senior Software Engineer', description: 'Template for Senior SE position' },
    { id: '2', name: 'Frontend Software Engineer', description: 'Template for Frontend focused role' },
    { id: '3', name: 'Full Stack Software Engineer', description: 'Template for Full Stack role' },
    { id: '4', name: 'DevOps Engineer', description: 'Template for DevOps role' },
  ];

  // Mock comment history
  const mockCommentHistory: Comment[] = [
    {
      id: '1',
      user: 'John Doe',
      text: 'Please review the skill requirements and salary range',
      timestamp: '2024-01-18T09:15:00Z',
      action: 'comment'
    },
    {
      id: '2',
      user: 'Sarah Smith',
      text: 'Updated the salary range based on market analysis',
      timestamp: '2024-01-18T14:30:00Z',
      action: 'comment'
    },
    {
      id: '3',
      user: 'Mike Johnson',
      text: 'Looks good, approving for next stage',
      timestamp: '2024-01-19T10:00:00Z',
      action: 'approved'
    }
  ];

  // Mock review data with full details
  const mockReviews: Review[] = [
    {
      id: '1',
      demand_plan_id: '2',
      position_title: 'Senior Frontend Developer',
      created_by: 'sarah.smith@company.com',
      total_positions: 6,
      previous_stage: 'Draft',
      comments: 'Please review the skill requirements',
      created_at: '2024-01-18T09:15:00Z',
      department: 'Engineering',
      location: 'San Francisco, CA',
      experience_range: '5-8 years',
      mandatory_skills: ['React', 'TypeScript', 'CSS', 'REST APIs'],
      optional_skills: ['GraphQL', 'Next.js', 'Tailwind'],
      job_description: 'We are seeking a Senior Frontend Developer to join our growing team...',
      complexity: 'Medium',
      talent_pool: 'Moderate',
      compensation_range: '$120K - $160K'
    },
    {
      id: '2',
      demand_plan_id: '3',
      position_title: 'Data Scientist',
      created_by: 'mike.johnson@company.com',
      total_positions: 8,
      previous_stage: 'Intake',
      comments: 'Ready for final review',
      created_at: '2024-01-20T16:45:00Z',
      department: 'Data Analytics',
      location: 'Remote',
      experience_range: '3-6 years',
      mandatory_skills: ['Python', 'Machine Learning', 'SQL', 'Statistics'],
      optional_skills: ['TensorFlow', 'PyTorch', 'AWS'],
      job_description: 'Join our data science team to build predictive models...',
      complexity: 'High',
      talent_pool: 'Limited',
      compensation_range: '$130K - $180K'
    },
    {
      id: '3',
      demand_plan_id: '1',
      position_title: 'Backend Engineer',
      created_by: 'john.doe@company.com',
      total_positions: 12,
      previous_stage: 'Draft',
      comments: 'Urgent requirement for Q1 project',
      created_at: '2024-01-15T10:00:00Z',
      department: 'Engineering',
      location: 'New York, NY',
      experience_range: '4-7 years',
      mandatory_skills: ['Node.js', 'PostgreSQL', 'Docker', 'AWS'],
      optional_skills: ['Kubernetes', 'Redis', 'MongoDB'],
      job_description: 'We need experienced backend engineers to scale our platform...',
      complexity: 'Low',
      talent_pool: 'Large',
      compensation_range: '$110K - $150K'
    },
    {
      id: '4',
      demand_plan_id: '4',
      position_title: 'DevOps Engineer',
      created_by: 'lisa.wong@company.com',
      total_positions: 4,
      previous_stage: 'Final',
      comments: 'Cloud infrastructure team expansion',
      created_at: '2024-01-10T13:30:00Z',
      department: 'Infrastructure',
      location: 'Austin, TX',
      experience_range: '5-9 years',
      mandatory_skills: ['AWS', 'Terraform', 'Kubernetes', 'CI/CD'],
      optional_skills: ['GCP', 'Ansible', 'Monitoring'],
      job_description: 'Looking for DevOps engineers to manage our cloud infrastructure...',
      complexity: 'Medium',
      talent_pool: 'Moderate',
      compensation_range: '$125K - $170K'
    }
  ];

  const getStageBadge = (stage: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (stage) {
      case 'Draft':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case 'Intake':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'Final':
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getComplexityInfo = (complexity: string) => {
    switch (complexity) {
      case 'Low':
        return {
          badge: 'L',
          color: 'bg-green-100 text-green-700 border-green-300',
          barColor: 'bg-green-500',
          barWidth: '33%'
        };
      case 'Medium':
        return {
          badge: 'M',
          color: 'bg-amber-100 text-amber-700 border-amber-300',
          barColor: 'bg-amber-500',
          barWidth: '66%'
        };
      case 'High':
        return {
          badge: 'H',
          color: 'bg-red-100 text-red-700 border-red-300',
          barColor: 'bg-red-500',
          barWidth: '100%'
        };
      default:
        return {
          badge: '-',
          color: 'bg-gray-100 text-gray-700 border-gray-300',
          barColor: 'bg-gray-500',
          barWidth: '0%'
        };
    }
  };

  const getTalentPoolInfo = (talentPool: string) => {
    switch (talentPool) {
      case 'Large':
        return {
          title: 'Talent Pool Availability',
          value: 'Large',
          description: 'Abundant candidates with this skill combination available in the market'
        };
      case 'Moderate':
        return {
          title: 'Talent Pool Availability',
          value: 'Moderate',
          description: 'Good availability of candidates with this skill combination in the market'
        };
      case 'Limited':
        return {
          title: 'Talent Pool Availability',
          value: 'Limited',
          description: 'Limited candidates with this specialized skill combination available'
        };
      default:
        return {
          title: 'Talent Pool Availability',
          value: 'Unknown',
          description: 'No data available'
        };
    }
  };

  const getNoticePeriodInfo = (complexity: string) => {
    switch (complexity) {
      case 'Low':
        return {
          title: 'Expected Notice Period',
          value: '30-45 days',
          description: 'Average notice period for candidates with this profile based on seniority and market demand'
        };
      case 'Medium':
        return {
          title: 'Expected Notice Period',
          value: '30-45 days',
          description: 'Average notice period for candidates with this profile based on seniority and market demand'
        };
      case 'High':
        return {
          title: 'Expected Notice Period',
          value: '30-45 days',
          description: 'Average notice period for candidates with this profile based on seniority and market demand'
        };
      default:
        return {
          title: 'Expected Notice Period',
          value: 'Unknown',
          description: ''
        };
    }
  };

  const getCompensationInfo = (complexity: string) => {
    switch (complexity) {
      case 'Low':
        return {
          title: 'Compensation Outlook',
          value: 'Market standard',
          description: 'Standard market rates apply; minimal salary negotiation expected'
        };
      case 'Medium':
        return {
          title: 'Compensation Outlook',
          value: 'Market standard',
          description: 'Standard market rates apply; minimal salary negotiation expected'
        };
      case 'High':
        return {
          title: 'Compensation Outlook',
          value: 'Market standard',
          description: 'Standard market rates apply; minimal salary negotiation expected'
        };
      default:
        return {
          title: 'Compensation Outlook',
          value: 'Unknown',
          description: ''
        };
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const filteredReviews = getFilteredReviews();
    if (selectedIds.length === filteredReviews.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredReviews.map(r => r.id));
    }
  };

  const handleBulkApprove = () => {
    if (selectedIds.length === 0) {
      alert('Please select at least one requisition');
      return;
    }
    if (activeReviewTab === 'draft' || activeReviewTab === 'final') {
      if (!bulkApprovalComment.trim()) {
        alert('Please provide a comment');
        return;
      }
    }
    console.log('Bulk approving:', selectedIds, 'Comment:', bulkApprovalComment);
    alert(`${selectedIds.length} requisition(s) approved successfully!`);
    setSelectedIds([]);
    setBulkApprovalComment('');
    setShowBulkActions(false);
    setBulkActionType(null);
  };

  const handleBulkReject = () => {
    if (selectedIds.length === 0) {
      alert('Please select at least one requisition');
      return;
    }
    if (!bulkComment.trim()) {
      alert('Please provide rejection comments');
      return;
    }
    console.log('Bulk rejecting:', selectedIds, 'Comments:', bulkComment);
    alert(`${selectedIds.length} requisition(s) rejected with comments.`);
    setSelectedIds([]);
    setBulkComment('');
    setShowBulkActions(false);
    setBulkActionType(null);
  };

  const handleBulkDownload = () => {
    if (selectedIds.length === 0) {
      alert('Please select at least one requisition');
      return;
    }
    console.log('Bulk downloading:', selectedIds);
    alert(`Downloading ${selectedIds.length} requisition(s)...`);
    setSelectedIds([]);
  };

  const handleViewReviewClick = (review: Review) => {
    if (onViewReview) {
      onViewReview(review.id);
    }
  };

  const handleApprove = (id: string) => {
    if (activeReviewTab === 'draft' || activeReviewTab === 'final') {
      if (!newComment.trim()) {
        alert('Please provide a comment');
        return;
      }
    }
    console.log('Approving:', id, 'Comment:', newComment);
    alert('Requisition approved successfully!');
    setNewComment('');
  };

  const handleReject = (id: string) => {
    if (activeReviewTab === 'draft' || activeReviewTab === 'final') {
      if (!newComment.trim()) {
        alert('Please provide rejection comments');
        return;
      }
    }
    console.log('Rejecting:', id, 'Comments:', newComment);
    alert('Requisition rejected with comments.');
    setNewComment('');
  };

  const handleMoveToIntake = () => {
    console.log('Moving to intake:', editData);
    alert('Requisition moved to intake successfully!');
  };

  const handleUpdateField = (field: keyof Review, value: any) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = () => {
    console.log('Saving changes:', editData);
    alert('Changes saved successfully!');
  };

  const getFilteredReviews = () => {
    if (activeReviewTab === 'draft') {
      return mockReviews.filter(r => r.previous_stage === 'Draft');
    } else if (activeReviewTab === 'ansr') {
      return mockReviews.filter(r => r.previous_stage === 'Intake');
    } else {
      return mockReviews.filter(r => r.previous_stage === 'Final');
    }
  };

  const draftReviews = mockReviews.filter(r => r.previous_stage === 'Draft');
  const ansrReviews = mockReviews.filter(r => r.previous_stage === 'Intake');
  const finalReviews = mockReviews.filter(r => r.previous_stage === 'Final');

  const selectedReview = reviewId ? mockReviews.find(r => r.id === reviewId) : null;

  if (reviewId && selectedReview) {
    // Initialize edit data when opening ANSR review
    if (activeReviewTab === 'ansr' && Object.keys(editData).length === 0) {
      setEditData(selectedReview);
    }

    const complexityInfo = getComplexityInfo(selectedReview.complexity || 'Low');
    const talentPoolInfo = getTalentPoolInfo(selectedReview.talent_pool || 'Unknown');
    const noticePeriodInfo = getNoticePeriodInfo(selectedReview.complexity || 'Low');
    const compensationInfo = getCompensationInfo(selectedReview.complexity || 'Low');

    // ANSR Review Edit Mode
    if (activeReviewTab === 'ansr') {
      return (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Edit Requisition</h2>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleSaveChanges}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Save className="w-4 h-4 inline mr-2" />
                  Save Changes
                </button>
                <button
                  onClick={handleMoveToIntake}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Move to Intake
                  <ArrowRight className="w-4 h-4 inline ml-2" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position Title
                  </label>
                  <input
                    type="text"
                    value={editData.position_title || ''}
                    onChange={(e) => handleUpdateField('position_title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    value={editData.department || ''}
                    onChange={(e) => handleUpdateField('department', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editData.location || ''}
                    onChange={(e) => handleUpdateField('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Positions
                  </label>
                  <input
                    type="number"
                    value={editData.total_positions || 0}
                    onChange={(e) => handleUpdateField('total_positions', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Range
                  </label>
                  <input
                    type="text"
                    value={editData.experience_range || ''}
                    onChange={(e) => handleUpdateField('experience_range', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={editData.mandatory_skills?.join(', ') || ''}
                  onChange={(e) => handleUpdateField('mandatory_skills', e.target.value.split(',').map(s => s.trim()))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nice-to-Have Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={editData.optional_skills?.join(', ') || ''}
                  onChange={(e) => handleUpdateField('optional_skills', e.target.value.split(',').map(s => s.trim()))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description
                </label>
                <textarea
                  value={editData.job_description || ''}
                  onChange={(e) => handleUpdateField('job_description', e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Review Details</h2>
          </div>

          <div className="flex">
            <div className={`${activeReviewTab === 'draft' ? 'w-[70%] border-r' : 'w-full'} p-6 border-gray-200 space-y-6`}>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Requisition Details</h3>
              </div>

              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">{selectedReview.position_title}</h4>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Department</p>
                    <div className="flex items-center text-sm text-gray-900">
                      <Briefcase className="w-4 h-4 mr-2 text-gray-500" />
                      {selectedReview.department}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Location</p>
                    <div className="flex items-center text-sm text-gray-900">
                      <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                      {selectedReview.location}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Positions</p>
                    <div className="flex items-center text-sm text-gray-900">
                      <Users className="w-4 h-4 mr-2 text-gray-500" />
                      {selectedReview.total_positions}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Experience Range</p>
                    <p className="text-sm text-gray-900">{selectedReview.experience_range}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-700 mb-2">Required Skills</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedReview.mandatory_skills?.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {selectedReview.optional_skills && selectedReview.optional_skills.length > 0 && (
                    <>
                      <p className="text-sm font-medium text-gray-700 mb-2">Nice-to-Have Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedReview.optional_skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {(activeReviewTab === 'draft' || activeReviewTab === 'final') && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Select Job Description Template
                    </label>
                    <select
                      value={selectedJD}
                      onChange={(e) => setSelectedJD(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
                    >
                      <option value="">Select a template...</option>
                      {mockJDTemplates.map((template) => (
                        <option key={template.id} value={template.id}>
                          {template.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => onNavigate && onNavigate('jd-creator')}
                      className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create New Job Description</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {(activeReviewTab === 'draft' || activeReviewTab === 'final') && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Comments History</h3>

                  <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto mb-4 space-y-3">
                    {mockCommentHistory.map((comment) => (
                      <div key={comment.id} className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{comment.user}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(comment.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          {comment.action === 'approved' && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                              Approved
                            </span>
                          )}
                          {comment.action === 'rejected' && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                              Rejected
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700">{comment.text}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Add Comment
                    </label>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Enter your comments here..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      rows={3}
                    />
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => handleReject(selectedReview.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                      >
                        <XCircle className="w-4 h-4 inline mr-2" />
                        Reject
                      </button>
                      <button
                        onClick={() => handleApprove(selectedReview.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        <CheckCircle className="w-4 h-4 inline mr-2" />
                        Approve
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {(activeReviewTab === 'draft' || activeReviewTab === 'final') && (
              <div className="w-[30%] p-6 bg-gray-50 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Hiring Complexity</h3>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">Low</span>
                    <span className="text-sm text-gray-600">Medium</span>
                    <span className="text-sm text-gray-600">High</span>
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold border-2 ${complexityInfo.color}`}>
                    {complexityInfo.badge}
                  </div>
                </div>

                <div className="relative h-2 bg-gray-200 rounded-full mb-6">
                  <div
                    className={`absolute left-0 top-0 h-full ${complexityInfo.barColor} rounded-full transition-all`}
                    style={{ width: complexityInfo.barWidth }}
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-xs text-blue-600 mb-2">
                    Analysis based on {selectedReview.mandatory_skills?.length || 0} selected skills and current market data
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-start space-x-2 mb-2">
                      <Users className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm font-medium text-gray-900">{talentPoolInfo.title}</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-2">{talentPoolInfo.value}</p>
                    <p className="text-sm text-gray-600">{talentPoolInfo.description}</p>
                  </div>

                  <div className="border-l-4 border-amber-500 pl-4">
                    <div className="flex items-start space-x-2 mb-2">
                      <Clock className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm font-medium text-gray-900">{noticePeriodInfo.title}</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-2">{noticePeriodInfo.value}</p>
                    <p className="text-sm text-gray-600">{noticePeriodInfo.description}</p>
                  </div>

                  <div className="border-l-4 border-green-500 pl-4">
                    <div className="flex items-start space-x-2 mb-2">
                      <DollarSign className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm font-medium text-gray-900">{compensationInfo.title}</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-2">{compensationInfo.value}</p>
                    <p className="text-sm text-gray-600">{compensationInfo.description}</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-xs text-gray-500 flex items-center mb-2">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Last updated: Market data as of Sept 2025
                  </p>
                  <p className="text-xs font-medium text-gray-700 mb-1">Data Sources:</p>
                  <div className="flex flex-wrap gap-1">
                    <span className="px-2 py-1 bg-white border border-gray-200 text-xs text-gray-600 rounded">
                      Industry Reports
                    </span>
                    <span className="px-2 py-1 bg-white border border-gray-200 text-xs text-gray-600 rounded">
                      Salary Surveys
                    </span>
                    <span className="px-2 py-1 bg-white border border-gray-200 text-xs text-gray-600 rounded">
                      Job Boards
                    </span>
                  </div>
                </div>
              </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const filteredReviews = getFilteredReviews();

  return (
    <div className="space-y-6 flex flex-col">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
        <p className="text-gray-600">Review and manage requisitions sent for approval</p>

        <div className="flex space-x-1 mt-4 border-b border-gray-200">
          <button
            onClick={() => setActiveReviewTab('draft')}
            className={`px-4 py-2 text-sm font-medium ${
              activeReviewTab === 'draft'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900 hover:border-b-2 hover:border-gray-300'
            }`}
          >
            Draft Reviews ({draftReviews.length})
          </button>
          <button
            onClick={() => setActiveReviewTab('ansr')}
            className={`px-4 py-2 text-sm font-medium ${
              activeReviewTab === 'ansr'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900 hover:border-b-2 hover:border-gray-300'
            }`}
          >
            ANSR Reviews ({ansrReviews.length})
          </button>
          <button
            onClick={() => setActiveReviewTab('final')}
            className={`px-4 py-2 text-sm font-medium ${
              activeReviewTab === 'final'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900 hover:border-b-2 hover:border-gray-300'
            }`}
          >
            Final Reviews ({finalReviews.length})
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        {selectedIds.length > 0 && (
          <div className="bg-blue-50 border-b border-blue-200 px-6 py-3 flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedIds.length} selected
            </span>
            <div className="flex items-center space-x-2">
              {activeReviewTab === 'ansr' ? (
                <button
                  onClick={handleBulkDownload}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Selected</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setShowBulkActions(true);
                      setBulkActionType('approve');
                    }}
                    className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    Approve Selected
                  </button>
                  <button
                    onClick={() => {
                      setShowBulkActions(true);
                      setBulkActionType('reject');
                    }}
                    className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    Reject Selected
                  </button>
                </>
              )}
              <button
                onClick={() => {
                  setSelectedIds([]);
                  setShowBulkActions(false);
                  setBulkActionType(null);
                }}
                className="px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {showBulkActions && selectedIds.length > 0 && bulkActionType === 'reject' && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rejection Comments (Required)
            </label>
            <textarea
              value={bulkComment}
              onChange={(e) => setBulkComment(e.target.value)}
              placeholder="Provide reasons for rejection..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              rows={2}
            />
            <div className="flex items-center space-x-2 mt-2">
              <button
                onClick={handleBulkReject}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Submit Rejection
              </button>
              <button
                onClick={() => {
                  setShowBulkActions(false);
                  setBulkActionType(null);
                  setBulkComment('');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {showBulkActions && selectedIds.length > 0 && bulkActionType === 'approve' && (
          <div className="bg-green-50 border-b border-green-200 px-6 py-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Approval Comments (Required)
            </label>
            <textarea
              value={bulkApprovalComment}
              onChange={(e) => setBulkApprovalComment(e.target.value)}
              placeholder="Provide approval comments..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
              rows={2}
            />
            <div className="flex items-center space-x-2 mt-2">
              <button
                onClick={handleBulkApprove}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                Submit Approval
              </button>
              <button
                onClick={() => {
                  setShowBulkActions(false);
                  setBulkActionType(null);
                  setBulkApprovalComment('');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredReviews.length && filteredReviews.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position Title
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created By
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Positions
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stage
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReviews.map((review) => (
                <tr
                  key={review.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleViewReviewClick(review)}
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(review.id)}
                      onChange={() => toggleSelect(review.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 flex items-center">
                      {review.position_title}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{review.created_by.split('@')[0]}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{review.total_positions}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={getStageBadge(review.previous_stage)}>
                      {review.previous_stage}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewReviewClick(review);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredReviews.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No reviews pending
            </h3>
            <p className="text-gray-600">
              All caught up! No requisitions awaiting review in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
