import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, MessageSquare, User, Calendar, FileText, Eye, ThumbsUp, ThumbsDown, FileCheck, ClipboardCheck, X, Users, DollarSign, TrendingUp, Info, Briefcase, MapPin } from 'lucide-react';
import { ApprovalHistory } from '../../types';

interface Review {
  id: string;
  demand_plan_id: string;
  position_title: string;
  created_by: string;
  total_positions: number;
  previous_stage: 'Draft' | 'Intake';
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

interface ApprovalsListProps {
  onViewReview?: (reviewId: string) => void;
  reviewId?: string | null;
  onNavigate?: (tab: string) => void;
}

export function ApprovalsList({ onViewReview, reviewId, onNavigate }: ApprovalsListProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkComment, setBulkComment] = useState('');
  const [showBulkActions, setShowBulkActions] = useState(false);

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
      talent_pool: 'Moderate - 2,500+ candidates',
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
      talent_pool: 'Limited - 800+ candidates',
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
      talent_pool: 'High - 5,000+ candidates',
      compensation_range: '$110K - $150K'
    },
    {
      id: '4',
      demand_plan_id: '4',
      position_title: 'DevOps Engineer',
      created_by: 'lisa.wong@company.com',
      total_positions: 4,
      previous_stage: 'Intake',
      comments: 'Cloud infrastructure team expansion',
      created_at: '2024-01-10T13:30:00Z',
      department: 'Infrastructure',
      location: 'Austin, TX',
      experience_range: '5-9 years',
      mandatory_skills: ['AWS', 'Terraform', 'Kubernetes', 'CI/CD'],
      optional_skills: ['GCP', 'Ansible', 'Monitoring'],
      job_description: 'Looking for DevOps engineers to manage our cloud infrastructure...',
      complexity: 'Medium',
      talent_pool: 'Moderate - 1,800+ candidates',
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
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Low':
        return { bg: 'bg-green-100', text: 'text-green-800', indicator: 'bg-green-500' };
      case 'Medium':
        return { bg: 'bg-amber-100', text: 'text-amber-800', indicator: 'bg-amber-500' };
      case 'High':
        return { bg: 'bg-red-100', text: 'text-red-800', indicator: 'bg-red-500' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', indicator: 'bg-gray-500' };
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === mockReviews.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(mockReviews.map(r => r.id));
    }
  };

  const handleBulkApprove = () => {
    if (selectedIds.length === 0) {
      alert('Please select at least one requisition');
      return;
    }
    console.log('Bulk approving:', selectedIds);
    alert(`${selectedIds.length} requisition(s) approved successfully!`);
    setSelectedIds([]);
    setShowBulkActions(false);
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
  };

  const handleViewReviewClick = (review: Review) => {
    if (onViewReview) {
      onViewReview(review.id);
    }
  };

  const handleApprove = (id: string) => {
    console.log('Approving:', id);
    alert('Requisition approved successfully!');
  };

  const handleReject = (id: string) => {
    const comment = prompt('Provide rejection comments:');
    if (comment) {
      console.log('Rejecting:', id, 'Comments:', comment);
      alert('Requisition rejected with comments.');
    }
  };

  const draftReviews = mockReviews.filter(r => r.previous_stage === 'Draft');
  const finalReviews = mockReviews.filter(r => r.previous_stage === 'Intake');

  const selectedReview = reviewId ? mockReviews.find(r => r.id === reviewId) : null;

  if (reviewId && selectedReview) {
    return (
      <div className="space-y-6">
        {/* Review Detail Page */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Review Details</h2>
          </div>

          <div className="flex">
            {/* Left Side - Requisition Details (70%) */}
            <div className="w-[70%] p-6 border-r border-gray-200 space-y-6">
              {/* Requisition Details Header */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Requisition Details</h3>
              </div>

              {/* Position Summary */}
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

                {/* Skills */}
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

                {/* Job Description */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-700 mb-2">Job Description</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{selectedReview.job_description}</p>
                </div>

                {/* Comments */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <MessageSquare className="w-4 h-4 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Submitter Comments</p>
                      <p className="text-sm text-gray-700 mt-1">{selectedReview.comments}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Hiring Insights (30%) */}
            <div className="w-[30%] p-6 bg-gray-50 space-y-6">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-gray-700" />
                  <h3 className="text-lg font-semibold text-gray-900">Hiring Insights</h3>
                </div>

                {/* Complexity Ticker */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-700 mb-3">Complexity Level</p>
                  <div className="flex flex-col space-y-2">
                    {['Low', 'Medium', 'High'].map((level) => {
                      const isActive = selectedReview.complexity === level;
                      const colors = getComplexityColor(level);
                      return (
                        <div
                          key={level}
                          className={`px-3 py-2 rounded-lg border-2 text-center transition-all ${
                            isActive
                              ? `${colors.bg} ${colors.text} border-current`
                              : 'bg-white text-gray-400 border-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${isActive ? colors.indicator : 'bg-gray-300'}`} />
                            <span className="text-sm font-medium">{level}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Talent Pool */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-3">
                    <Users className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 mb-1">Talent Pool Availability</p>
                      <p className="text-sm text-gray-700">{selectedReview.talent_pool}</p>
                    </div>
                  </div>
                </div>

                {/* Compensation Range */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-3">
                    <DollarSign className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 mb-1">Compensation Range</p>
                      <p className="text-sm text-gray-700">{selectedReview.compensation_range}</p>
                    </div>
                  </div>
                </div>

                {/* Information Source */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 mb-1">Information Source</p>
                      <p className="text-xs text-gray-600">
                        Market data aggregated from industry reports, salary surveys, and job board analytics.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end space-x-3">
            <button
              onClick={() => handleApprove(selectedReview.id)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <CheckCircle className="w-4 h-4 inline mr-2" />
              Approve
            </button>
            <button
              onClick={() => handleReject(selectedReview.id)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              <XCircle className="w-4 h-4 inline mr-2" />
              Reject
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 flex flex-col">
      {/* Header with Sub-navigation */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
        <p className="text-gray-600">Review and manage requisitions sent for approval</p>

        {/* Sub-navigation tabs */}
        {onNavigate && (
          <div className="flex space-x-1 mt-4 border-b border-gray-200">
            <button
              className="px-4 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600"
            >
              Reviews
            </button>
            <button
              onClick={() => onNavigate('ansr-review')}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:border-b-2 hover:border-gray-300"
            >
              ANSR Review
            </button>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Draft Reviews</p>
              <p className="text-2xl font-bold text-purple-600">
                {draftReviews.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileCheck className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Final Reviews</p>
              <p className="text-2xl font-bold text-blue-600">
                {finalReviews.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ClipboardCheck className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        {/* Bulk Actions Bar */}
        {selectedIds.length > 0 && (
          <div className="bg-blue-50 border-b border-blue-200 px-6 py-3 flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedIds.length} selected
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleBulkApprove}
                className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                Approve Selected
              </button>
              <button
                onClick={() => setShowBulkActions(!showBulkActions)}
                className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Reject Selected
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Bulk Reject Comment Box */}
        {showBulkActions && selectedIds.length > 0 && (
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
            <button
              onClick={handleBulkReject}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Submit Rejection
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === mockReviews.length}
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
                  Previous Stage
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockReviews.map((review) => (
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
                    <div className="flex items-center space-x-2">
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
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApprove(review.id);
                        }}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Approve"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReject(review.id);
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Reject"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {mockReviews.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No reviews pending
            </h3>
            <p className="text-gray-600">
              All caught up! No requisitions awaiting review at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}