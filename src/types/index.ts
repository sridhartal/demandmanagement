export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'manager' | 'hr' | 'approver';
  department: string;
  created_at: string;
  updated_at: string;
}

export interface DemandPlan {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected';
  approval_level: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  total_positions: number;
  requisitions: Requisition[];
  approval_history: ApprovalHistory[];
}

export interface Requisition {
  id: string;
  demand_plan_id: string;
  position_title: string;
  position_category: string;
  location: string;
  job_description: string;
  number_of_positions: number;
  min_experience: number;
  max_experience: number;
  min_salary: number;
  mid_salary: number;
  max_salary: number;
  mandatory_skills: string[];
  optional_skills: string[];
  status: 'active' | 'filled' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface ApprovalHistory {
  id: string;
  demand_plan_id: string;
  approver_id: string;
  approver_name: string;
  level: number;
  status: 'pending' | 'approved' | 'rejected';
  comments: string;
  created_at: string;
}

export interface BulkUploadError {
  row: number;
  field: string;
  message: string;
}

export interface AIPromptRequest {
  prompt: string;
  company_context?: string;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  target_element?: string;
}

export const POSITION_CATEGORIES = [
  'Software Engineer',
  'Senior Software Engineer',
  'Tech Lead',
  'Engineering Manager',
  'Product Manager',
  'UI/UX Designer',
  'DevOps Engineer',
  'Data Scientist',
  'QA Engineer',
  'Business Analyst',
  'Architect',
  'Consultant'
];

export const APPROVAL_LEVELS = {
  1: 'Department Head',
  2: 'Regional Manager',
  3: 'VP/Director'
};