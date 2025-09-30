import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, ArrowLeft, ArrowRight, Upload, Wand2, CreditCard as Edit, ChevronDown, ChevronRight, AlertCircle, CheckCircle, Info } from 'lucide-react';

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

const DEFAULT_JOB_DESCRIPTION = `Job brief
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

const JOB_DESCRIPTION_TEMPLATES = [
  {
    title: 'Software Engineer - Entry Level',
    content: DEFAULT_JOB_DESCRIPTION
  },
  {
    title: 'Senior Software Engineer',
    content: 'We are looking for an experienced Senior Software Engineer with 5+ years of experience to lead technical initiatives and mentor junior developers. You will architect and implement complex software solutions while ensuring code quality and system reliability.'
  },
  {
    title: 'Full Stack Developer',
    content: 'We are seeking a Full Stack Developer to work on both frontend and backend development. You will build responsive user interfaces and robust server-side applications using modern web technologies like React, Node.js, and databases.'
  }
];

export function CreateManualPlan({ onBack, onBulkUpload }: CreateManualPlanProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
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

  // Auto-populate fields when position title changes
  useEffect(() => {
    if (currentRequisition.position_title && POSITION_SUGGESTIONS[currentRequisition.position_title as keyof typeof POSITION_SUGGESTIONS]) {
      const suggestion = POSITION_SUGGESTIONS[currentRequisition.position_title as keyof typeof POSITION_SUGGESTIONS];
      
      setCurrentRequisition(prev => ({
        ...prev,
        position_category: suggestion.category,
        min_experience: suggestion.experience.min,
        max_experience: suggestion.experience.max,
        min_salary: suggestion.salary.min,
        mid_salary: suggestion.salary.mid,
        max_salary: suggestion.salary.max,
        mandatory_skills: [...suggestion.skills],
        department: suggestion.department
      }));
    }
  }, [currentRequisition.position_title]);

  const steps = [
    'Essential Details',
    'Skills & Requirements',
    'Job Description',
    'Review & Create'
  ];

  const updateRequisition = (field: string, value: any) => {
    setCurrentRequisition(prev => ({ ...prev, [field]: value }));
    // Clear validation error when field is updated
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const errors: {[key: string]: string} = {};

    if (step === 0) {
      if (!currentRequisition.position_title.trim()) {
        errors.position_title = 'Position title is required';
      }
      if (!currentRequisition.location.trim()) {
        errors.location = 'Location is required';
      }
      if (currentRequisition.number_of_positions < 1) {
        errors.number_of_positions = 'At least 1 position is required';
      }
    }

    if (step === 1) {
      if (currentRequisition.mandatory_skills.filter(s => s.trim()).length === 0) {
        errors.mandatory_skills = 'At least one mandatory skill is required';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(Math.min(steps.length - 1, currentStep + 1));
    }
  };

  const addSkill = (skillType: 'mandatory_skills' | 'optional_skills') => {
    setCurrentRequisition(prev => ({
      ...prev,
      [skillType]: [...prev[skillType], '']
    }));
  };

  const updateSkill = (skillType: 'mandatory_skills' | 'optional_skills', index: number, value: string) => {
    setCurrentRequisition(prev => ({
      ...prev,
      [skillType]: prev[skillType].map((skill, i) => i === index ? value : skill)
    }));
  };

  const removeSkill = (skillType: 'mandatory_skills' | 'optional_skills', index: number) => {
    setCurrentRequisition(prev => ({
      ...prev,
      [skillType]: prev[skillType].filter((_, i) => i !== index)
    }));
  };

  const handleUseTemplate = (template: string) => {
    updateRequisition('job_description', template);
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      console.log('Creating requisition...', currentRequisition);
      alert('Requisition created successfully!');
      onBack();
    }
  };

  const renderEssentialDetails = () => (
    <div className="space-y-6">
      {/* Core Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Smart Defaults Enabled</h4>
            <p className="text-sm text-blue-700 mt-1">
              We'll automatically suggest salary ranges, skills, and other details based on your position title.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Position Title *
          </label>
          <select
            value={currentRequisition.position_title}
            onChange={(e) => updateRequisition('position_title', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              validationErrors.position_title ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select position title</option>
            {Object.keys(POSITION_SUGGESTIONS).map(title => (
              <option key={title} value={title}>{title}</option>
            ))}
          </select>
          {validationErrors.position_title && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {validationErrors.position_title}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location *
          </label>
          <div className="relative">
            <input
              type="text"
              list="locations"
              value={currentRequisition.location}
              onChange={(e) => updateRequisition('location', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                validationErrors.location ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Start typing or select..."
            />
            <datalist id="locations">
              {COMMON_LOCATIONS.map(location => (
                <option key={location} value={location} />
              ))}
            </datalist>
          </div>
          {validationErrors.location && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {validationErrors.location}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Positions *
          </label>
          <input
            type="number"
            min="1"
            max="50"
            value={currentRequisition.number_of_positions}
            onChange={(e) => updateRequisition('number_of_positions', parseInt(e.target.value) || 1)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              validationErrors.number_of_positions ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {validationErrors.number_of_positions && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {validationErrors.number_of_positions}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Family
          </label>
          <select
            value={currentRequisition.position_category}
            onChange={(e) => updateRequisition('position_category', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Auto-selected</option>
            {POSITION_CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">Auto-filled based on position title</p>
        </div>
      </div>

      {/* Experience & Salary - Grouped */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Experience & Compensation</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Experience Range (Years)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Minimum</label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={currentRequisition.min_experience}
                  onChange={(e) => updateRequisition('min_experience', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Maximum</label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={currentRequisition.max_experience}
                  onChange={(e) => updateRequisition('max_experience', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Budget Details
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Min</label>
                <div className="flex">
                  <select className="px-2 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50">
                    <option value="USD">$</option>
                    <option value="INR">₹</option>
                    <option value="GBP">£</option>
                  </select>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={currentRequisition.min_salary}
                    onChange={(e) => updateRequisition('min_salary', parseInt(e.target.value) || 0)}
                    className="flex-1 px-2 py-2 border-l-0 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Max</label>
                <div className="flex">
                  <select className="px-2 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50">
                    <option value="USD">$</option>
                    <option value="INR">₹</option>
                    <option value="GBP">£</option>
                  </select>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={currentRequisition.max_salary}
                    onChange={(e) => updateRequisition('max_salary', parseInt(e.target.value) || 0)}
                    className="flex-1 px-2 py-2 border-l-0 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">Budget range auto-suggested based on position and experience</p>
          </div>
        </div>
      </div>

      {/* Progressive Disclosure - Advanced Options */}
      <div className="border border-gray-200 rounded-lg">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
        >
          <span className="font-medium text-gray-900">Additional Options</span>
          {showAdvanced ? (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-500" />
          )}
        </button>
        
        {showAdvanced && (
          <div className="border-t border-gray-200 p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employment Type
                </label>
                <select
                  value={currentRequisition.employment_type}
                  onChange={(e) => updateRequisition('employment_type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Work Location
                </label>
                <select
                  value={currentRequisition.remote_option}
                  onChange={(e) => updateRequisition('remote_option', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Office">Office Only</option>
                  <option value="Remote">Fully Remote</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Urgency
                </label>
                <select
                  value={currentRequisition.urgency}
                  onChange={(e) => updateRequisition('urgency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Low">Low</option>
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  value={currentRequisition.department}
                  onChange={(e) => updateRequisition('department', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Auto-filled based on position"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reporting Manager
                </label>
                <input
                  type="text"
                  value={currentRequisition.reporting_manager}
                  onChange={(e) => updateRequisition('reporting_manager', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Optional"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-6">
      {/* Mandatory Skills */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Required Skills *
        </label>
        
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 mb-3 min-h-[2.5rem] p-3 border border-gray-300 rounded-lg bg-gray-50">
            {currentRequisition.mandatory_skills.filter(skill => skill.trim()).length > 0 ? (
              currentRequisition.mandatory_skills.filter(skill => skill.trim()).map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => {
                      const skillIndex = currentRequisition.mandatory_skills.indexOf(skill);
                      removeSkill('mandatory_skills', skillIndex);
                    }}
                    className="ml-2 text-blue-600 hover:text-blue-800 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))
            ) : (
              <span className="text-gray-500 text-sm">Auto-suggested skills will appear here</span>
            )}
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Type a skill and press Enter to add..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value.trim() && currentRequisition.mandatory_skills.length < 10) {
                  const newSkill = e.currentTarget.value.trim();
                  if (!currentRequisition.mandatory_skills.includes(newSkill)) {
                    setCurrentRequisition(prev => ({
                      ...prev,
                      mandatory_skills: [...prev.mandatory_skills.filter(s => s.trim()), newSkill]
                    }));
                    e.currentTarget.value = '';
                  }
                }
              }}
            />
          </div>
          {validationErrors.mandatory_skills && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {validationErrors.mandatory_skills}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {currentRequisition.mandatory_skills.filter(s => s.trim()).length}/10 skills added
          </p>
        </div>
      </div>

      {/* Optional Skills */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Nice-to-Have Skills
          <span className="text-gray-500 font-normal ml-1">(Optional)</span>
        </label>
        
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 mb-3 min-h-[2.5rem] p-3 border border-gray-300 rounded-lg bg-gray-50">
            {currentRequisition.optional_skills.filter(skill => skill.trim()).length > 0 ? (
              currentRequisition.optional_skills.filter(skill => skill.trim()).map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 border border-gray-200"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => {
                      const skillIndex = currentRequisition.optional_skills.indexOf(skill);
                      removeSkill('optional_skills', skillIndex);
                    }}
                    className="ml-2 text-gray-600 hover:text-gray-800 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))
            ) : (
              <span className="text-gray-500 text-sm">Add optional skills that would be beneficial</span>
            )}
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Type an optional skill and press Enter..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                  const newSkill = e.currentTarget.value.trim();
                  if (!currentRequisition.optional_skills.includes(newSkill)) {
                    setCurrentRequisition(prev => ({
                      ...prev,
                      optional_skills: [...prev.optional_skills.filter(s => s.trim()), newSkill]
                    }));
                    e.currentTarget.value = '';
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Skills Suggestions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Popular Skills for {currentRequisition.position_title || 'This Position'}</h4>
        <div className="flex flex-wrap gap-2">
          {['TypeScript', 'AWS', 'Docker', 'Kubernetes', 'GraphQL', 'MongoDB', 'Redis', 'Microservices'].map(skill => (
            <button
              key={skill}
              type="button"
              onClick={() => {
                if (!currentRequisition.optional_skills.includes(skill)) {
                  setCurrentRequisition(prev => ({
                    ...prev,
                    optional_skills: [...prev.optional_skills.filter(s => s.trim()), skill]
                  }));
                }
              }}
              className="px-3 py-1 text-sm bg-white border border-blue-300 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
            >
              + {skill}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderJobDescription = () => (
    <div className="h-[500px] flex flex-col lg:flex-row gap-4">
      {/* Left Side - Editor */}
      <div className="flex flex-col lg:w-1/2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Job Description</h3>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600">Template loaded</span>
          </div>
        </div>
        
        <div className="flex-1">
          <textarea
            value={currentRequisition.job_description}
            onChange={(e) => updateRequisition('job_description', e.target.value)}
            className="w-full h-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="Job description will be auto-populated..."
          />
        </div>
      </div>

      {/* Right Side - Templates and AI */}
      <div className="flex flex-col lg:w-1/2">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Templates</h3>
        
        {/* Templates Section */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex flex-wrap gap-2">
            {JOB_DESCRIPTION_TEMPLATES.map((template, index) => (
              <button
                key={index}
                onClick={() => handleUseTemplate(template.content)}
                className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  currentRequisition.job_description === template.content
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300'
                }`}
              >
                {template.title}
              </button>
            ))}
          </div>
        </div>

        {/* AI Enhancement Section */}
        <div className="flex-1 bg-purple-50 border border-purple-200 rounded-lg p-4 flex flex-col">
          <h4 className="font-medium text-purple-900 mb-3 flex items-center">
            <Wand2 className="w-4 h-4 text-purple-600 mr-2" />
            AI Enhancement
          </h4>
          <div className="flex-1 flex flex-col">
            <textarea
              className="flex-1 w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm resize-none mb-3"
              placeholder="Describe modifications: e.g., 'make it more technical', 'add remote work benefits', 'emphasize growth opportunities'..."
            />
            <button
              type="button"
              onClick={() => {
                const modifiedDescription = currentRequisition.job_description + '\n\n[AI Enhanced] This role offers excellent growth opportunities and the chance to work with cutting-edge technologies in a collaborative environment.';
                updateRequisition('job_description', modifiedDescription);
                alert('Job description enhanced with AI!');
              }}
              className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm w-full justify-center"
            >
              <Wand2 className="w-4 h-4" />
              <span>Enhance with AI</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <div>
            <h4 className="font-medium text-green-900">Ready to Create</h4>
            <p className="text-sm text-green-700">Review your requisition details below and create when ready.</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Requisition Summary</h3>
        
        {/* Essential Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-sm font-medium text-gray-700">Position</p>
            <p className="text-gray-900 font-semibold">{currentRequisition.position_title}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Location</p>
            <p className="text-gray-900">{currentRequisition.location}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Positions Needed</p>
            <p className="text-gray-900 font-semibold">{currentRequisition.number_of_positions}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Experience</p>
            <p className="text-gray-900">{currentRequisition.min_experience}-{currentRequisition.max_experience} years</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Budget Range</p>
            <p className="text-gray-900">
              {currentRequisition.min_salary.toLocaleString()} - {currentRequisition.max_salary.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Employment Type</p>
            <p className="text-gray-900">{currentRequisition.employment_type} • {currentRequisition.remote_option}</p>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-2">Required Skills</p>
          <div className="flex flex-wrap gap-2">
            {currentRequisition.mandatory_skills.filter(skill => skill.trim()).map((skill, index) => (
              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full border border-blue-200">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {currentRequisition.optional_skills.filter(skill => skill.trim()).length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-2">Nice-to-Have Skills</p>
            <div className="flex flex-wrap gap-2">
              {currentRequisition.optional_skills.filter(skill => skill.trim()).map((skill, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full border border-gray-200">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Job Description Preview */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Job Description</p>
          <div className="bg-white p-4 rounded-lg border border-gray-200 max-h-40 overflow-y-auto">
            <p className="text-gray-900 text-sm whitespace-pre-wrap">{currentRequisition.job_description}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Requisition</h1>
            <p className="text-gray-600">Smart form with auto-suggestions and validation</p>
          </div>
        </div>
        
        <button
          onClick={onBulkUpload}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Upload className="w-4 h-4" />
          <span>Bulk Upload Instead</span>
        </button>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-1 sm:space-x-4 overflow-x-auto pb-2">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center flex-shrink-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              index <= currentStep
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}>
              {index < currentStep ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                index + 1
              )}
            </div>
            <span className={`ml-1 sm:ml-2 font-medium text-xs sm:text-sm ${
              index <= currentStep ? 'text-gray-900' : 'text-gray-500'
            }`}>
              {step}
            </span>
            {index < steps.length - 1 && (
              <div className={`w-4 sm:w-8 h-px mx-1 sm:mx-4 transition-colors ${
                index < currentStep ? 'bg-blue-600' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
        {currentStep === 0 && renderEssentialDetails()}
        {currentStep === 1 && renderSkills()}
        {currentStep === 2 && renderJobDescription()}
        {currentStep === 3 && renderReview()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        {currentStep < steps.length - 1 ? (
          <button
            onClick={handleNext}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Create Requisition</span>
          </button>
        )}
      </div>
    </div>
  );
}