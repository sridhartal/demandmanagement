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

  // Calculate hiring complexity based on skills
  const calculateHiringComplexity = () => {
    const totalSkills = currentRequisition.mandatory_skills.filter(s => s.trim()).length;
    
    if (totalSkills <= 2) {
      return {
        level: 'Low',
        percentage: 30,
        color: 'green',
        badge: 'L',
        talentPool: 'Large'
      }
    }
  }
}