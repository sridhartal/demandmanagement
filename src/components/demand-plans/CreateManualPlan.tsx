import React, { useState } from 'react';
import { Plus, Trash2, Save, ArrowLeft, ArrowRight, Upload, Wand2, Edit } from 'lucide-react';

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
}

interface CreateManualPlanProps {
  onBack: () => void;
  onBulkUpload: () => void;
}

const POSITION_TITLES = [
  'Software Engineer',
  'Senior Software Engineer',
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer'
];

const POSITION_CATEGORIES = [
  'Software Engineer',
  'Senior Software Engineer',
  'Tech Lead',
  'Engineering Manager',
  'Product Manager'
];

const DEFAULT_SKILLS = {
  'Software Engineer': ['JavaScript', 'React', 'Node.js', 'SQL', 'Git'],
  'Senior Software Engineer': ['JavaScript', 'React', 'Node.js', 'System Design', 'Leadership'],
  'Full Stack Developer': ['JavaScript', 'React', 'Node.js', 'MongoDB', 'REST APIs'],
  'Frontend Developer': ['JavaScript', 'React', 'CSS', 'HTML', 'TypeScript'],
  'Backend Developer': ['Node.js', 'SQL', 'REST APIs', 'MongoDB', 'Express']
};

const JOB_DESCRIPTION_TEMPLATES = {
  'Software Engineer': {
    '0-2': 'We are looking for a Junior Software Engineer to join our dynamic team. You will work on developing and maintaining web applications using modern technologies. This role is perfect for recent graduates or developers with 0-2 years of experience who are eager to learn and grow in a collaborative environment.',
    '2-5': 'We are seeking a Software Engineer with 2-5 years of experience to develop scalable web applications. You will collaborate with cross-functional teams to design, develop, and deploy high-quality software solutions using modern frameworks and best practices.',
    '5+': 'We are looking for an experienced Software Engineer with 5+ years of experience to lead technical initiatives and mentor junior developers. You will architect and implement complex software solutions while ensuring code quality and system reliability.'
  },
  'Senior Software Engineer': {
    '0-2': 'We are seeking a Senior Software Engineer to join our team. You will lead technical projects, mentor junior developers, and contribute to architectural decisions. This role requires strong technical skills and leadership capabilities.',
    '2-5': 'We are looking for a Senior Software Engineer with 2-5 years of experience to drive technical excellence and innovation. You will design and implement complex systems, lead code reviews, and collaborate with product teams to deliver exceptional user experiences.',
    '5+': 'We are seeking a highly experienced Senior Software Engineer with 5+ years of experience to lead our engineering initiatives. You will architect scalable systems, mentor team members, and drive technical strategy across multiple projects.'
  },
  'Full Stack Developer': {
    '0-2': 'We are looking for a Full Stack Developer to work on both frontend and backend development. You will build responsive user interfaces and robust server-side applications using modern web technologies.',
    '2-5': 'We are seeking a Full Stack Developer with 2-5 years of experience to develop end-to-end web applications. You will work with React, Node.js, and databases to create seamless user experiences and scalable backend systems.',
    '5+': 'We are looking for an experienced Full Stack Developer with 5+ years of experience to lead full-stack development initiatives. You will architect complete web solutions and guide technical decisions across the entire technology stack.'
  },
  'Frontend Developer': {
    '0-2': 'We are seeking a Frontend Developer to create engaging user interfaces using React, HTML, CSS, and JavaScript. You will collaborate with designers and backend developers to deliver exceptional user experiences.',
    '2-5': 'We are looking for a Frontend Developer with 2-5 years of experience to build modern, responsive web applications. You will work with React, TypeScript, and modern CSS frameworks to create pixel-perfect user interfaces.',
    '5+': 'We are seeking an experienced Frontend Developer with 5+ years of experience to lead frontend architecture and development. You will establish best practices, optimize performance, and mentor junior developers.'
  },
  'Backend Developer': {
    '0-2': 'We are looking for a Backend Developer to build robust server-side applications and APIs. You will work with databases, cloud services, and modern backend frameworks to create scalable systems.',
    '2-5': 'We are seeking a Backend Developer with 2-5 years of experience to design and implement scalable backend systems. You will work with Node.js, databases, and cloud platforms to build high-performance applications.',
    '5+': 'We are looking for an experienced Backend Developer with 5+ years of experience to architect and lead backend development initiatives. You will design distributed systems and ensure scalability and reliability.'
  }
};

const DEFAULT_TEMPLATES = [
  {
    title: 'Software Engineer - Entry Level',
    content: 'We are looking for a Junior Software Engineer to join our dynamic team. You will work on developing and maintaining web applications using modern technologies. This role is perfect for recent graduates or developers with 0-2 years of experience who are eager to learn and grow in a collaborative environment.'
  },
  {
    title: 'Software Engineer - Mid Level',
    content: 'We are seeking a Software Engineer with 2-5 years of experience to develop scalable web applications. You will collaborate with cross-functional teams to design, develop, and deploy high-quality software solutions using modern frameworks and best practices.'
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
  const [currentRequisition, setCurrentRequisition] = useState<Requisition>({
    id: '1',
    position_title: '',
    position_category: '',
    location: '',
    number_of_positions: 1,
    min_experience: 0,
    max_experience: 0,
    min_salary: 0,
    mid_salary: 0,
    max_salary: 0,
    mandatory_skills: [''],
    optional_skills: [''],
    job_description: ''
  });

  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  // Set default template when on job description step and description is empty
  React.useEffect(() => {
    if (currentStep === 2 && !currentRequisition.job_description && DEFAULT_TEMPLATES.length > 0) {
      updateRequisition('job_description', DEFAULT_TEMPLATES[0].content);
      setSelectedTemplate(DEFAULT_TEMPLATES[0].content);
    }
  }, [currentStep, currentRequisition.job_description]);

  const steps = [
    'Basic Details',
    'Skills',
    'Job Description',
    'Review & Create'
  ];

  const updateRequisition = (field: string, value: any) => {
    setCurrentRequisition(prev => ({ ...prev, [field]: value }));
  };

  const handlePositionTitleChange = (title: string) => {
    updateRequisition('position_title', title);
    
    // Auto-populate skills based on position title
    if (DEFAULT_SKILLS[title as keyof typeof DEFAULT_SKILLS]) {
      const defaultSkills = DEFAULT_SKILLS[title as keyof typeof DEFAULT_SKILLS];
      updateRequisition('mandatory_skills', [...defaultSkills]);
      updateRequisition('optional_skills', ['']);
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

  const getJobDescriptionTemplate = () => {
    const title = currentRequisition.position_title;
    const experience = currentRequisition.max_experience;
    
    if (!title || !JOB_DESCRIPTION_TEMPLATES[title as keyof typeof JOB_DESCRIPTION_TEMPLATES]) {
      return '';
    }
    
    const templates = JOB_DESCRIPTION_TEMPLATES[title as keyof typeof JOB_DESCRIPTION_TEMPLATES];
    
    if (experience <= 2) return templates['0-2'];
    if (experience <= 5) return templates['2-5'];
    return templates['5+'];
  };

  const handleUseTemplate = (template: string) => {
    setSelectedTemplate(template);
    updateRequisition('job_description', template);
  };

  const handleAIModify = () => {
    const prompt = `Modify this job description for a ${currentRequisition.position_title} with ${currentRequisition.min_experience}-${currentRequisition.max_experience} years of experience`;
    // Simulate AI modification
    const modifiedDescription = currentRequisition.job_description + '\n\n[AI Enhanced] This role offers excellent growth opportunities and the chance to work with cutting-edge technologies in a collaborative environment.';
    updateRequisition('job_description', modifiedDescription);
    alert('Job description enhanced with AI!');
  };

  const handleSubmit = () => {
    console.log('Creating requisition...', currentRequisition);
    alert('Requisition created successfully!');
    onBack();
  };

  const renderBasicDetails = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Position Title * (Job/Role Title)
          </label>
          <select
            value={currentRequisition.position_title}
            onChange={(e) => handlePositionTitleChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select position title</option>
            {POSITION_TITLES.map(title => (
              <option key={title} value={title}>{title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Position Category * (Role Category)
          </label>
          <select
            value={currentRequisition.position_category}
            onChange={(e) => updateRequisition('position_category', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select category</option>
            {POSITION_CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location *
          </label>
          <input
            type="text"
            value={currentRequisition.location}
            onChange={(e) => updateRequisition('location', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., New York, NY"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Positions *
          </label>
          <input
            type="number"
            min="1"
            value={currentRequisition.number_of_positions}
            onChange={(e) => updateRequisition('number_of_positions', parseInt(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Min Experience (Years)
          </label>
          <input
            type="number"
            min="0"
            max="50"
            value={currentRequisition.min_experience}
            onChange={(e) => updateRequisition('min_experience', parseInt(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Experience (Years)
          </label>
          <input
            type="number"
            min="0"
            max="50"
            value={currentRequisition.max_experience}
            onChange={(e) => updateRequisition('max_experience', parseInt(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Budget Section */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Budget Details
        </label>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Min
            </label>
            <input
              type="number"
              min="0"
              value={currentRequisition.min_salary}
              onChange={(e) => updateRequisition('min_salary', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="60,000"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Mid
            </label>
            <input
              type="number"
              min="0"
              value={currentRequisition.mid_salary}
              onChange={(e) => updateRequisition('mid_salary', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="80,000"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Max
            </label>
            <input
              type="number"
              min="0"
              value={currentRequisition.max_salary}
              onChange={(e) => updateRequisition('max_salary', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="100,000"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-6">
      {/* Mandatory Skills */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Mandatory Skills * (Max 7)
        </label>
       
        {/* Skills Pills Display */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 mb-3">
            {currentRequisition.mandatory_skills.filter(skill => skill.trim()).map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                {skill}
                <button
                  onClick={() => {
                    const skillIndex = currentRequisition.mandatory_skills.indexOf(skill);
                    removeSkill('mandatory_skills', skillIndex);
                  }}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          
          {/* Search Input for Adding Skills */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search and add mandatory skills..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value.trim() && currentRequisition.mandatory_skills.length < 7) {
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
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
              Press Enter to add
            </div>
          </div>
        </div>
      </div>

      {/* Optional Skills */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Optional Skills
        </label>
       
        {/* Skills Pills Display */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 mb-3">
            {currentRequisition.optional_skills.filter(skill => skill.trim()).map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700"
              >
                {skill}
                <button
                  onClick={() => {
                    const skillIndex = currentRequisition.optional_skills.indexOf(skill);
                    removeSkill('optional_skills', skillIndex);
                  }}
                  className="ml-2 text-gray-600 hover:text-gray-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          
          {/* Search Input for Adding Skills */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search and add optional skills..."
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
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
              Press Enter to add
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderJobDescription = () => {
    return (
     <div className="h-[500px] flex flex-col lg:flex-row gap-4">
       {/* Left Side - Editor */}
       <div className="flex flex-col lg:w-1/2">
         <div className="flex items-center justify-between mb-4">
           <h3 className="text-lg font-semibold text-gray-900">Job Description Editor</h3>
           <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
             <Upload className="w-4 h-4" />
             <span>Upload Template</span>
           </button>
         </div>
         
         <div className="flex-1">
           <textarea
             value={currentRequisition.job_description}
             onChange={(e) => updateRequisition('job_description', e.target.value)}
             className="w-full h-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
             placeholder="Write or paste your job description here..."
           />
         </div>
       </div>

       {/* Right Side - Templates and AI */}
       <div className="flex flex-col lg:w-1/2">
         <h3 className="text-lg font-semibold text-gray-900 mb-4">Templates & AI Enhancement</h3>
         
         {/* Templates Section */}
         <div className="bg-gray-50 rounded-lg p-4 mb-4">
           <h4 className="font-medium text-gray-900 mb-3">Recommended Templates</h4>
           <div className="flex flex-wrap gap-2">
             {DEFAULT_TEMPLATES.map((template, index) => (
               <button
                 key={index}
                 onClick={() => handleUseTemplate(template.content)}
                 className={`px-3 py-2 rounded-full text-xs font-medium border transition-colors ${
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
               placeholder="Describe modifications: e.g., make it more technical, add remote work benefits..."
             />
             <button
               onClick={handleAIModify}
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
  };

  const renderReview = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Requisition Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-700">Position Title</p>
            <p className="text-gray-900">{currentRequisition.position_title}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Category</p>
            <p className="text-gray-900">{currentRequisition.position_category}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Location</p>
            <p className="text-gray-900">{currentRequisition.location}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Number of Positions</p>
            <p className="text-gray-900">{currentRequisition.number_of_positions}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Experience Range</p>
            <p className="text-gray-900">{currentRequisition.min_experience}-{currentRequisition.max_experience} years</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Salary Range</p>
            <p className="text-gray-900">
              {currentRequisition.min_salary.toLocaleString()} - {currentRequisition.max_salary.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium text-gray-700 mb-2">Mandatory Skills</p>
          <div className="flex flex-wrap gap-2">
            {currentRequisition.mandatory_skills.filter(skill => skill.trim()).map((skill, index) => (
              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Optional Skills</p>
          <div className="flex flex-wrap gap-2">
            {currentRequisition.optional_skills.filter(skill => skill.trim()).map((skill, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium text-gray-700 mb-2">Job Description</p>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-gray-900 text-sm whitespace-pre-wrap">{currentRequisition.job_description}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header with Bulk Upload CTA */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Requisition</h1>
            <p className="text-gray-600">Step-by-step wizard to create a new requisition</p>
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
      <div className="flex items-center justify-center space-x-2 md:space-x-4 overflow-x-auto pb-2">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center flex-shrink-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              index <= currentStep
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}>
              {index + 1}
            </div>
            <span className={`ml-1 md:ml-2 font-medium text-sm md:text-base ${
              index <= currentStep ? 'text-gray-900' : 'text-gray-500'
            }`}>
              {step}
            </span>
            {index < steps.length - 1 && (
              <div className={`w-6 md:w-12 h-px mx-2 md:mx-4 ${
                index < currentStep ? 'bg-blue-600' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        {currentStep === 0 && renderBasicDetails()}
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
            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
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
            <span>Create Requisition</span>
          </button>
        )}
      </div>
    </div>
  );
}