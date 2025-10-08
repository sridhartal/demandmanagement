import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, MessageSquare, User, Calendar, FileText, Eye, ThumbsUp, ThumbsDown, FileCheck, ClipboardCheck } from 'lucide-react';
import { ApprovalHistory } from '../../types';

export function ApprovalsList() {
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});

  // Mock review data
  const mockReviews = [
    {
      id: '1',
      demand_plan_id: '2',
      position_title: 'Senior Frontend Developer',
      created_by: 'sarah.smith@company.com',
      total_positions: 6,
      previous_stage: 'Draft' as const,
      comments: 'Please review the skill requirements',
      created_at: '2024-01-18T09:15:00Z'
    },
    {
      id: '2',
      demand_plan_id: '3',
      position_title: 'Data Scientist',
      created_by: 'mike.johnson@company.com',
      total_positions: 8,
      previous_stage: 'Intake' as const,
      comments: 'Ready for final review',
      created_at: '2024-01-20T16:45:00Z'
    },
    {
      id: '3',
      demand_plan_id: '1',
      position_title: 'Backend Engineer',
      created_by: 'john.doe@company.com',
      total_positions: 12,
      previous_stage: 'Draft' as const,
      comments: 'Urgent requirement for Q1 project',
      created_at: '2024-01-15T10:00:00Z'
    },
    {
      id: '4',
      demand_plan_id: '4',
      position_title: 'DevOps Engineer',
      created_by: 'lisa.wong@company.com',
      total_positions: 4,
      previous_stage: 'Intake' as const,
      comments: 'Cloud infrastructure team expansion',
      created_at: '2024-01-10T13:30:00Z'
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

  const handleApprove = (reviewId: string) => {
    console.log('Approving:', reviewId);
    alert('Requisition approved successfully!');
  };

  const handleReject = (reviewId: string) => {
    const comment = commentText[reviewId];
    if (!comment || !comment.trim()) {
      alert('Please provide rejection comments');
      return;
    }
    console.log('Rejecting:', reviewId, 'Comments:', comment);
    alert('Requisition rejected with comments.');
    setCommentText(prev => ({ ...prev, [reviewId]: '' }));
  };

  const draftReviews = mockReviews.filter(r => r.previous_stage === 'Draft');
  const finalReviews = mockReviews.filter(r => r.previous_stage === 'Intake');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
        <p className="text-gray-600">Review and manage requisitions sent for approval</p>
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
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
                  Comments
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockReviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{review.position_title}</div>
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
                    <div className="max-w-xs">
                      <p className="text-sm text-gray-700 truncate" title={review.comments}>
                        {review.comments}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleApprove(review.id)}
                        className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        title="Approve"
                      >
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(review.id)}
                        className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                        title="Reject"
                      >
                        <ThumbsDown className="w-4 h-4 mr-1" />
                        Reject
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