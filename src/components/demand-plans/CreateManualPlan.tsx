import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, ArrowLeft, ArrowRight, Upload, Wand2, CreditCard as Edit, ChevronDown, ChevronRight, AlertCircle, CheckCircle, Info, Users, Calendar, DollarSign } from 'lucide-react';

interface Requisition {
  id: string;
  position_title: string;
  position_category: string;
  location: string;
  number_of_positions: number;
  min_experience: number;
  max_experience: number;
  min_salary: number;
  mid_salary: number;
  max_salary: number;
  mandatory_skills: string[];
  optional_skills: string[];
  job_description: string;
  employment_type: string;
  remote_option: string;
  department: string;
  reporting_manager: string;
  urgency: string;
}

interface CreateManualPlanProps {
  onBack: () => void;
  onBulkUpload: () => void;
}

// Smart defaults and suggestions
const POSITION_SUGGESTIONS = {
  'Software Engineer': {
    category: 'Software Engineer',
    experience: { min: 0, max: 3 },
    salary: { min: 70000, mid: 85000, max: 100000 },
    skills: ['JavaScript', 'React', 'Node.js', 'SQL', 'Git'],
    department: 'Engineering'
  },
  'Senior Software Engineer': {
    category: 'Senior Software Engineer',
    experience: { min: 3, max: 7 },
    salary: { min: 100000, mid: 120000, max: 140000 },
    skills: ['JavaScript', 'React', 'Node.js', 'System Design', 'Leadership'],
    department: 'Engineering'
  },
  'Full Stack Developer': {
    category: 'Software Engineer',
    experience: { min: 2, max: 5 },
    salary: { min: 80000, mid: 95000, max: 115000 },
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'REST APIs'],
    department: 'Engineering'
  },
  'Frontend Developer': {
    category: 'Software Engineer',
    experience: { min: 1, max: 4 },
    salary: { min: 75000, mid: 90000, max: 110000 },
    skills: ['JavaScript', 'React', 'CSS', 'HTML', 'TypeScript'],
    department: 'Engineering'
  },
  'Backend Developer': {
    category: 'Software Engineer',
    experience: { min: 2, max: 6 },
    salary: { min: 85000, mid: 100000, max: 120000 },
    skills: ['Node.js', 'SQL', 'REST APIs', 'MongoDB', 'Express'],
    department: 'Engineering'
  }
};

const POSITION_CATEGORIES = [
  'Software Engineer',
  'Senior Software Engineer',
  'Tech Lead',
  'Engineering Manager',
  'Product Manager',
  'UI/UX Designer',
  'DevOps Engineer',
  'Data Scientist',
  'QA Engineer'
];

const COMMON_LOCATIONS = [
  'New York, NY',
  'San Francisco, CA',
  'Seattle, WA',
  'Austin, TX',
  'Boston, MA',
  'Chicago, IL',
  'Remote',
  'Hybrid'
];

const DEFAULT_JOB_DESCRIPTION = `Job Brief
We are looking for a passionate Software Engineer to design, develop and install software solutions.

Software Engineer responsibilities include gathering user requirements, defining system functionality and writing code in various languages, like Java, Ruby on Rails or .NET programming languages (e.g. C++ or JScript.NET.) Our ideal candidates are familiar with the software development life cycle (SDLC) from preliminary system analysis to tests and deployment.

Ultimately, the role of the Software Engineer is to build high-quality, innovative and fully performing software that complies with coding standards and technical design.

Responsibilities
Execute full software development life cycle (SDLC)
Develop flowcharts, layouts and documentation to identify requirements and solutions
Write well-designed, testable code
Produce specifications and determine operational feasibility
Integrate software components into a fully functional software system
Develop software verification plans and quality assurance procedures
Document and maintain software functionality
Troubleshoot, debug and upgrade existing systems
Deploy programs and evaluate user feedback
Comply with project plans and industry standards
Ensure software is updated with latest features

Requirements and skills
Proven work experience as a Software Engineer or Software Developer
Experience designing interactive applications
Ability to develop software in Java, Ruby on Rails, C++ or other programming languages
Excellent knowledge of relational databases, SQL and ORM technologies (JPA2, Hibernate)
Experience developing web applications using at least one popular web framework (JSF, Wicket, GWT, Spring MVC)
Experience with test-driven development
Proficiency in software engineering tools
Ability to document requirements and specifications
BSc degree in Computer Science, Engineering or relevant field`;

export function CreateManualPlan({ onBack, onBulkUpload }: CreateManualPlanProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [newSkill, setNewSkill] = useState('');
  const [newOptionalSkill, setNewOptionalSkill] = useState('');
  
  const [currentRequisition, setCurrentRequisition] = useState<Requisition>({
    id: '1',
    position_title: '',
    position_category: '',
    location: '',
    number_of_positions: 1,
    min_experience: 0,
    max_experience: 3,
    min_salary: 70000,
    mid_salary: 85000,
    max_salary: 100000,
    mandatory_skills: [],
    optional_skills: [],
    job_description: DEFAULT_JOB_DESCRIPTION,
    employment_type: 'Full-time',
    remote_option: 'Office',
    department: '',
    reporting_manager: '',
    urgency: 'Normal'
  });

  // Auto-fill suggestions when position title changes
  useEffect(() => {
    const suggestion = POSITION_SUGGESTIONS[currentRequisition.position_title as keyof typeof POSITION_SUGGESTIONS];
    if (suggestion) {
      setCurrentRequisition(prev => ({
        ...prev,
        position_category: suggestion.category,
        min_experience: suggestion.experience.min,
        max_experience: suggestion.experience.max,
        min_salary: suggestion.salary.min,
        mid_salary: suggestion.salary.mid,
        max_salary: suggestion.salary.max,
        mandatory_skills: suggestion.skills,
        department: suggestion.department
      }));
    }
  }, [currentRequisition.position_title]);

  const handleInputChange = (field: keyof Requisition, value: any) => {
    setCurrentRequisition(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const addSkill = (type: 'mandatory' | 'optional') => {
    const skill = type === 'mandatory' ? newSkill : newOptionalSkill;
    if (skill.trim()) {
      const skillsField = type === 'mandatory' ? 'mandatory_skills' : 'optional_skills';
      const currentSkills = currentRequisition[skillsField];
      
      if (!currentSkills.includes(skill.trim())) {
        handleInputChange(skillsField, [...currentSkills, skill.trim()]);
      }
      
      if (type === 'mandatory') {
        setNewSkill('');
      } else {
        setNewOptionalSkill('');
      }
    }
  };

  const removeSkill = (type: 'mandatory' | 'optional', index: number) => {
    const skillsField = type === 'mandatory' ? 'mandatory_skills' : 'optional_skills';
    const currentSkills = currentRequisition[skillsField];
    handleInputChange(skillsField, currentSkills.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!currentRequisition.position_title.trim()) {
      errors.position_title = 'Position title is required';
    }
    if (!currentRequisition.position_category) {
      errors.position_category = 'Position category is required';
    }
    if (!currentRequisition.location.trim()) {
      errors.location = 'Location is required';
    }
    if (currentRequisition.number_of_positions < 1) {
      errors.number_of_positions = 'Number of positions must be at least 1';
    }
    if (currentRequisition.min_salary >= currentRequisition.max_salary) {
      errors.salary = 'Minimum salary must be less than maximum salary';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      console.log('Saving requisition...', currentRequisition);
      alert('Requisition saved successfully!');
      onBack();
    }
  };

  const calculateHiringComplexity = () => {
    const totalSkills = currentRequisition.mandatory_skills.length;
    const experienceRange = currentRequisition.max_experience - currentRequisition.min_experience;
    
    let complexity = 'Low';
    let percentage = 30;
    let color = 'green';
    
    if (totalSkills > 5 || experienceRange > 5 || currentRequisition.min_salary > 120000) {
      complexity = 'High';
      percentage = 80;
      color = 'red';
    } else if (totalSkills > 3 || experienceRange > 3 || currentRequisition.min_salary > 90000) {
      complexity = 'Medium';
      percentage = 55;
      color = 'amber';
    }
    
    return { complexity, percentage, color };
  };

  const { complexity, percentage, color } = calculateHiringComplexity();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Go back to dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Requisition</h1>
            <p className="text-gray-600">Fill in the details for your position requisition</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={onBulkUpload}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Bulk Upload</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Requisition</span>
          </button>
        </div>
      </div>

      {/* Main Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Basic Information */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">1</div>
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position Title *
                </label>
                <input
                  type="text"
                  value={currentRequisition.position_title}
                  onChange={(e) => handleInputChange('position_title', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    validationErrors.position_title ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Senior Software Engineer"
                  list="position-suggestions"
                />
                <datalist id="position-suggestions">
                  {Object.keys(POSITION_SUGGESTIONS).map(title => (
                    <option key={title} value={title} />
                  ))}
                </datalist>
                {validationErrors.position_title && (
                  <p className="text-red-600 text-sm mt-1">{validationErrors.position_title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position Category *
                </label>
                <select
                  value={currentRequisition.position_category}
                  onChange={(e) => handleInputChange('position_category', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    validationErrors.position_category ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select category...</option>
                  {POSITION_CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {validationErrors.position_category && (
                  <p className="text-red-600 text-sm mt-1">{validationErrors.position_category}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={currentRequisition.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    validationErrors.location ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., New York, NY or Remote"
                  list="location-suggestions"
                />
                <datalist id="location-suggestions">
                  {COMMON_LOCATIONS.map(location => (
                    <option key={location} value={location} />
                  ))}
                </datalist>
                {validationErrors.location && (
                  <p className="text-red-600 text-sm mt-1">{validationErrors.location}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Positions
                </label>
                <input
                  type="number"
                  min="1"
                  value={currentRequisition.number_of_positions}
                  onChange={(e) => handleInputChange('number_of_positions', parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  value={currentRequisition.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Engineering, Product, Design"
                />
              </div>
            </div>
          </div>

          {/* Hiring Complexity */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hiring Complexity</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Complexity Level</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  color === 'green' ? 'bg-green-100 text-green-800' :
                  color === 'amber' ? 'bg-amber-100 text-amber-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {complexity}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    color === 'green' ? 'bg-green-500' :
                    color === 'amber' ? 'bg-amber-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500">
                Based on skills required, experience level, and salary range
              </p>
            </div>
          </div>
        </div>

        {/* Middle Column - Experience & Compensation */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-medium text-green-600">2</div>
              <h3 className="text-lg font-semibold text-gray-900">Experience & Compensation</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Range (years)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Minimum</label>
                    <input
                      type="number"
                      min="0"
                      value={currentRequisition.min_experience}
                      onChange={(e) => handleInputChange('min_experience', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Maximum</label>
                    <input
                      type="number"
                      min="0"
                      value={currentRequisition.max_experience}
                      onChange={(e) => handleInputChange('max_experience', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salary Range (USD)
                </label>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Minimum</label>
                      <input
                        type="number"
                        value={currentRequisition.min_salary}
                        onChange={(e) => handleInputChange('min_salary', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Maximum</label>
                      <input
                        type="number"
                        value={currentRequisition.max_salary}
                        onChange={(e) => handleInputChange('max_salary', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Target (Mid-point)</label>
                    <input
                      type="number"
                      value={currentRequisition.mid_salary}
                      onChange={(e) => handleInputChange('mid_salary', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                {validationErrors.salary && (
                  <p className="text-red-600 text-sm mt-1">{validationErrors.salary}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employment Type
                </label>
                <select
                  value={currentRequisition.employment_type}
                  onChange={(e) => handleInputChange('employment_type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Temporary">Temporary</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remote Option
                </label>
                <select
                  value={currentRequisition.remote_option}
                  onChange={(e) => handleInputChange('remote_option', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Office">Office Only</option>
                  <option value="Remote">Remote Only</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Urgency Level
                </label>
                <select
                  value={currentRequisition.urgency}
                  onChange={(e) => handleInputChange('urgency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Low">Low</option>
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Skills & Description */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs font-medium text-purple-600">3</div>
              <h3 className="text-lg font-semibold text-gray-900">Skills & Requirements</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Skills
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {currentRequisition.mandatory_skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill('mandatory', index)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill('mandatory'))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add required skill..."
                  />
                  <button
                    onClick={() => addSkill('mandatory')}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nice-to-Have Skills
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {currentRequisition.optional_skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill('optional', index)}
                        className="ml-1 text-gray-600 hover:text-gray-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newOptionalSkill}
                    onChange={(e) => setNewOptionalSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill('optional'))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add optional skill..."
                  />
                  <button
                    onClick={() => addSkill('optional')}
                    className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center text-xs font-medium text-amber-600">4</div>
              <h3 className="text-lg font-semibold text-gray-900">Job Description</h3>
            </div>
            
            <div>
              <textarea
                value={currentRequisition.job_description}
                onChange={(e) => handleInputChange('job_description', e.target.value)}
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Enter detailed job description..."
              />
              <p className="text-xs text-gray-500 mt-1">
                {currentRequisition.job_description.length} characters
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}