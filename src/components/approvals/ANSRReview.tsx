import React, { useState } from 'react';
import { Eye, Edit, Save, X, MessageSquare, Users, MapPin, Briefcase, CheckCircle } from 'lucide-react';

interface Requisition {
  id: string;
  position_title: string;
  department: string;
  location: string;
  total_positions: number;
  experience_range: string;
  mandatory_skills: string[];
  optional_skills: string[];
  job_description: string;
  comments: string;
  reviewer_comments?: string;
  created_by: string;
  created_at: string;
  requisition_id?: string;
  position_ids?: string[];
}

interface ANSRReviewProps {
  onBack?: () => void;
}

export function ANSRReview({ onBack }: ANSRReviewProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showComments, setShowComments] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Requisition>>({});
  const [skillInput, setSkillInput] = useState('');
  const [optionalSkillInput, setOptionalSkillInput] = useState('');

  const mockRequisitions: Requisition[] = [
    {
      id: '1',
      position_title: 'Senior Frontend Developer',
      department: 'Engineering',
      location: 'San Francisco, CA',
      total_positions: 6,
      experience_range: '5-8 years',
      mandatory_skills: ['React', 'TypeScript', 'CSS'],
      optional_skills: ['GraphQL', 'Next.js'],
      job_description: 'We are seeking a Senior Frontend Developer...',
      comments: 'Please review the skill requirements',
      reviewer_comments: 'Consider adding more senior positions',
      created_by: 'sarah.smith@company.com',
      created_at: '2024-01-18T09:15:00Z'
    },
    {
      id: '2',
      position_title: 'Data Scientist',
      department: 'Data Analytics',
      location: 'Remote',
      total_positions: 8,
      experience_range: '3-6 years',
      mandatory_skills: ['Python', 'Machine Learning', 'SQL'],
      optional_skills: ['TensorFlow', 'AWS'],
      job_description: 'Join our data science team...',
      comments: 'Urgent requirement for Q1 project',
      reviewer_comments: 'Need to clarify budget allocation',
      created_by: 'mike.johnson@company.com',
      created_at: '2024-01-20T16:45:00Z'
    },
    {
      id: '3',
      position_title: 'Backend Engineer',
      department: 'Engineering',
      location: 'New York, NY',
      total_positions: 12,
      experience_range: '4-7 years',
      mandatory_skills: ['Node.js', 'PostgreSQL', 'Docker'],
      optional_skills: ['Kubernetes', 'Redis'],
      job_description: 'We need experienced backend engineers...',
      comments: 'High priority for new product launch',
      created_by: 'john.doe@company.com',
      created_at: '2024-01-15T10:00:00Z'
    }
  ];

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === mockRequisitions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(mockRequisitions.map(r => r.id));
    }
  };

  const handleEdit = (requisition: Requisition) => {
    setEditingId(requisition.id);
    const initData = {
      ...requisition,
      requisition_id: requisition.requisition_id || '',
      position_ids: requisition.position_ids || Array(requisition.total_positions).fill('')
    };
    setEditData(initData);
  };

  const handleSave = () => {
    console.log('Saving:', editData);
    alert('Requisition saved successfully!');
    setEditingId(null);
    setEditData({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleBulkEdit = () => {
    if (selectedIds.length === 0) {
      alert('Please select at least one requisition');
      return;
    }
    alert(`Editing ${selectedIds.length} requisition(s)`);
  };

  const handleUpdateField = (field: keyof Requisition, value: any) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = (skillType: 'mandatory_skills' | 'optional_skills', skillValue: string) => {
    const trimmedSkill = skillValue.trim();
    if (!trimmedSkill) return;

    const currentSkills = editData[skillType] || [];
    if (!currentSkills.includes(trimmedSkill)) {
      handleUpdateField(skillType, [...currentSkills, trimmedSkill]);
    }

    if (skillType === 'mandatory_skills') {
      setSkillInput('');
    } else {
      setOptionalSkillInput('');
    }
  };

  const removeSkill = (skillType: 'mandatory_skills' | 'optional_skills', index: number) => {
    const currentSkills = editData[skillType] || [];
    handleUpdateField(skillType, currentSkills.filter((_, i) => i !== index));
  };

  const handlePositionIdChange = (index: number, value: string) => {
    const positionIds = editData.position_ids || [];
    const newPositionIds = [...positionIds];
    newPositionIds[index] = value;
    handleUpdateField('position_ids', newPositionIds);
  };

  const initializePositionIds = (count: number) => {
    const currentIds = editData.position_ids || [];
    const newIds = Array(count).fill('').map((_, i) => currentIds[i] || '');
    handleUpdateField('position_ids', newIds);
  };

  if (editingId) {
    const requisition = mockRequisitions.find(r => r.id === editingId);
    if (!requisition) return null;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Requisition</h1>
            <p className="text-gray-600">Update requisition details</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4 inline mr-2" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4 inline mr-2" />
              Save Changes
            </button>
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requisition ID *
              </label>
              <input
                type="text"
                value={editData.requisition_id || ''}
                onChange={(e) => handleUpdateField('requisition_id', e.target.value)}
                placeholder="Enter requisition ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
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
                onChange={(e) => {
                  const count = parseInt(e.target.value) || 0;
                  handleUpdateField('total_positions', count);
                  initializePositionIds(count);
                }}
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
              Job Description
            </label>
            <textarea
              value={editData.job_description || ''}
              onChange={(e) => handleUpdateField('job_description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Position IDs */}
          {editData.total_positions && editData.total_positions > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Position IDs ({editData.total_positions} positions)
              </label>
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: editData.total_positions || 0 }).map((_, index) => (
                  <div key={index}>
                    <label className="block text-xs text-gray-600 mb-1">
                      Position {index + 1} ID
                    </label>
                    <input
                      type="text"
                      value={(editData.position_ids && editData.position_ids[index]) || ''}
                      onChange={(e) => handlePositionIdChange(index, e.target.value)}
                      placeholder={`Enter ID for position ${index + 1}`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mandatory Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Required Skills *
            </label>
            <div className="mb-3">
              <div className="flex flex-wrap gap-2 mb-3 min-h-[2.5rem] p-3 border border-gray-300 rounded-lg bg-gray-50">
                {editData.mandatory_skills && editData.mandatory_skills.length > 0 ? (
                  editData.mandatory_skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill('mandatory_skills', index)}
                        className="ml-2 text-blue-600 hover:text-blue-800 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">No skills added yet</span>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="Type a skill and press Enter to add..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill('mandatory_skills', skillInput);
                    }
                  }}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {editData.mandatory_skills?.length || 0} skills added
              </p>
            </div>
          </div>

          {/* Optional Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Nice-to-Have Skills
              <span className="text-gray-500 font-normal ml-1">(Optional)</span>
            </label>
            <div className="mb-3">
              <div className="flex flex-wrap gap-2 mb-3 min-h-[2.5rem] p-3 border border-gray-300 rounded-lg bg-gray-50">
                {editData.optional_skills && editData.optional_skills.length > 0 ? (
                  editData.optional_skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 border border-gray-200"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill('optional_skills', index)}
                        className="ml-2 text-gray-600 hover:text-gray-800 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">No optional skills added</span>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={optionalSkillInput}
                  onChange={(e) => setOptionalSkillInput(e.target.value)}
                  placeholder="Type a skill and press Enter to add..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill('optional_skills', optionalSkillInput);
                    }
                  }}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {editData.optional_skills?.length || 0} skills added
              </p>
            </div>
          </div>

          {/* Comments Section */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Comments</h3>

            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <MessageSquare className="w-4 h-4 text-amber-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Submitter Comments</p>
                    <p className="text-sm text-gray-700 mt-1">{requisition.comments}</p>
                  </div>
                </div>
              </div>

              {requisition.reviewer_comments && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <MessageSquare className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Reviewer Comments</p>
                      <p className="text-sm text-gray-700 mt-1">{requisition.reviewer_comments}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ANSR Review</h1>
          <p className="text-gray-600">Review and edit requisitions</p>
        </div>
        {selectedIds.length > 0 && (
          <button
            onClick={handleBulkEdit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit className="w-4 h-4 inline mr-2" />
            Edit Selected ({selectedIds.length})
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === mockRequisitions.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position Title
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Positions
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
              {mockRequisitions.map((requisition) => (
                <tr key={requisition.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(requisition.id)}
                      onChange={() => toggleSelect(requisition.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {requisition.position_title}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{requisition.department}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{requisition.location}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{requisition.total_positions}</div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setShowComments(showComments === requisition.id ? null : requisition.id)}
                      className="text-sm text-blue-600 hover:text-blue-800 truncate max-w-xs block"
                      title={requisition.comments}
                    >
                      <MessageSquare className="w-4 h-4 inline mr-1" />
                      {requisition.comments.substring(0, 30)}...
                    </button>
                    {showComments === requisition.id && (
                      <div className="absolute z-10 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">Submitter Comments</p>
                            <p className="text-sm text-gray-900">{requisition.comments}</p>
                          </div>
                          {requisition.reviewer_comments && (
                            <div>
                              <p className="text-xs font-medium text-gray-500 mb-1">Reviewer Comments</p>
                              <p className="text-sm text-gray-900">{requisition.reviewer_comments}</p>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => setShowComments(null)}
                          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleEdit(requisition)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
