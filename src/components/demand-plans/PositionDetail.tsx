import React from 'react';
import { ArrowLeft, Send, Briefcase, MapPin, Users, Calendar } from 'lucide-react';
import { DemandPlan } from '../../types';

interface PositionDetailProps {
  position: DemandPlan;
  onBack: () => void;
}

export function PositionDetail({ position, onBack }: PositionDetailProps) {
  const handleSendToReview = () => {
    console.log('Sending to review:', position.id);
    alert('Requisition sent for review successfully!');
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Position Details</h1>
            <p className="text-gray-600">View requisition information</p>
          </div>
        </div>
        {position.status === 'draft' && (
          <button
            onClick={handleSendToReview}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Send className="w-5 h-5" />
            <span>Send to Review</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Requisition Details</h2>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h4 className="text-2xl font-bold text-gray-900 mb-6">{position.title}</h4>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-sm text-gray-500 mb-2">Department</p>
                <div className="flex items-center text-sm text-gray-900">
                  <Briefcase className="w-5 h-5 mr-2 text-gray-500" />
                  <span className="font-medium">{position.department || 'N/A'}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Location</p>
                <div className="flex items-center text-sm text-gray-900">
                  <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                  <span className="font-medium">{position.location || 'N/A'}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Total Positions</p>
                <div className="flex items-center text-sm text-gray-900">
                  <Users className="w-5 h-5 mr-2 text-gray-500" />
                  <span className="font-medium">{position.total_positions}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Experience Range</p>
                <p className="text-sm text-gray-900 font-medium">{position.experience_range || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Created By</p>
                <p className="text-sm text-gray-900 font-medium">{position.created_by}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Created On</p>
                <div className="flex items-center text-sm text-gray-900">
                  <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                  <span className="font-medium">{new Date(position.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Stage</p>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStageColor(position.stage || 'Draft')}`}>
                  {position.stage || 'Draft'}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Status</p>
                <span className={getStatusBadge(position.status)}>
                  {position.status === 'pending_approval' ? 'Pending' :
                   position.status === 'rejected' ? 'Rejected' :
                   position.status === 'approved' ? 'Approved' :
                   position.status.charAt(0).toUpperCase() + position.status.slice(1)}
                </span>
              </div>
            </div>

            {position.mandatory_skills && position.mandatory_skills.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-3">Required Skills</p>
                <div className="flex flex-wrap gap-2">
                  {position.mandatory_skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-lg"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {position.optional_skills && position.optional_skills.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-3">Nice-to-Have Skills</p>
                <div className="flex flex-wrap gap-2">
                  {position.optional_skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {position.job_description && (
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-3">Job Description</p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {position.job_description}
                  </p>
                </div>
              </div>
            )}

            {position.description && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-900 mb-2">Additional Information</p>
                <p className="text-sm text-gray-700 leading-relaxed">{position.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
