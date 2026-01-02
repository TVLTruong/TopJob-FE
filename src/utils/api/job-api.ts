// Job API helpers and transformers
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// ==================== TYPES ====================

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginationResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// Helper to get auth headers
const getAuthHeaders = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
    }
  }
  return {
    'Content-Type': 'application/json',
  };
};

// ==================== ENUMS MAPPING ====================

export const EmploymentTypeMap = {
  'Full-Time': 'full_time',
  'Part-Time': 'part_time',
  'Freelance': 'freelance',
  'Internship': 'internship',
  'Contract': 'contract',
} as const;

export const EmploymentTypeReverseMap = {
  'full_time': 'Full-Time',
  'part_time': 'Part-Time',
  'freelance': 'Freelance',
  'internship': 'Internship',
  'contract': 'Contract',
} as const;

export const WorkModeMap = {
  'Onsite': 'onsite',
  'Remote': 'remote',
  'Hybrid': 'hybrid',
} as const;

export const WorkModeReverseMap = {
  'onsite': 'Onsite',
  'remote': 'Remote',
  'hybrid': 'Hybrid',
} as const;

export const ExperienceLevelMap = {
  'Intern': 'intern',
  'Fresher': 'fresher',
  'Junior': 'junior',
  'Middle': 'middle',
  'Senior': 'senior',
  'Lead': 'lead',
  'Manager': 'manager',
} as const;

export const ExperienceLevelReverseMap = {
  'intern': 'Intern',
  'fresher': 'Fresher',
  'junior': 'Junior',
  'middle': 'Middle',
  'senior': 'Senior',
  'lead': 'Lead',
  'manager': 'Manager',
} as const;

// ==================== TYPES ====================

export interface CreateJobPayload {
  categoryId: string;
  locationId: string;
  title: string;
  description?: string;
  requirements?: string[];
  responsibilities?: string[];
  niceToHave?: string[];
  benefits?: string[];
  salaryMin?: number | null;
  salaryMax?: number | null;
  isNegotiable?: boolean;
  isSalaryVisible?: boolean;
  salaryCurrency?: string;
  employmentType: 'full_time' | 'part_time' | 'freelance' | 'internship' | 'contract';
  workMode: 'onsite' | 'remote' | 'hybrid';
  experienceLevel?: 'intern' | 'fresher' | 'junior' | 'middle' | 'senior' | 'lead' | 'manager';
  experienceYearsMin?: number;
  quantity?: number;
  expiredAt?: string; // ISO date
  isHot?: boolean;
  isUrgent?: boolean;
}

export interface JobFromAPI {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  requirements: string[] | null;
  responsibilities: string[] | null;
  niceToHave: string[] | null;
  benefits: string[] | null;
  salaryMin: number | null;
  salaryMax: number | null;
  isNegotiable: boolean;
  isSalaryVisible: boolean;
  salaryCurrency: string;
  employmentType: 'full_time' | 'part_time' | 'freelance' | 'internship' | 'contract';
  workMode: 'onsite' | 'remote' | 'hybrid';
  experienceLevel: 'intern' | 'fresher' | 'junior' | 'middle' | 'senior' | 'lead' | 'manager' | null;
  experienceYearsMin: number | null;
  quantity: number;
  expiredAt: Date | null;
  publishedAt: Date | null;
  applyCount: number;
  viewCount: number;
  saveCount: number;
  isHot: boolean;
  isUrgent: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  employer?: {
    id: string;
    companyName: string;
    logoUrl: string | null;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  location?: {
    id: string;
    address: string;
    city: string;
  };
}

// ==================== API FUNCTIONS ====================

/**
 * Create a new job posting
 */
export const createJob = async (payload: CreateJobPayload) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/employer/jobs`,
      payload,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
};

/**
 * Update an existing job
 */
export const updateJob = async (jobId: string, payload: Partial<CreateJobPayload>) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/employer/jobs/${jobId}`,
      payload,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating job:', error);
    throw error;
  }
};

/**
 * Get job detail
 */
export const getJobDetail = async (jobId: string): Promise<{ data: JobFromAPI }> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/jobs/${jobId}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching job detail:', error);
    throw error;
  }
};

/**
 * Get jobs for employer
 */
export const getEmployerJobs = async (
  page: number = 1, 
  limit: number = 10
): Promise<PaginationResponse<JobFromAPI>> => {
  try {
    const response = await axios.get<PaginationResponse<JobFromAPI>>(
      `${API_BASE_URL}/employer/jobs?page=${page}&limit=${limit}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching employer jobs:', error);
    throw error;
  }
};

/**
 * Get employer job detail by ID
 */
export const getEmployerJobDetail = async (jobId: string): Promise<JobFromAPI> => {
  try {
    const response = await axios.get<JobFromAPI>(
      `${API_BASE_URL}/employer/jobs/${jobId}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching employer job detail:', error);
    throw error;
  }
};

/**
 * Hide a job (change status to HIDDEN)
 */
export const hideJob = async (jobId: string) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/employer/jobs/${jobId}/hide`,
      {},
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error hiding job:', error);
    throw error;
  }
};

/**
 * Delete a job (soft delete - change status to REMOVED_BY_ADMIN)
 */
export const deleteJob = async (jobId: string) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/employer/jobs/${jobId}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting job:', error);
    throw error;
  }
};

/**
 * Unhide a job (change status back to ACTIVE)
 */
export const unhideJob = async (jobId: string) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/employer/jobs/${jobId}/unhide`,
      {},
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error unhiding job:', error);
    throw error;
  }
};

/**
 * Close a job (change status to CLOSED)
 */
export const closeJob = async (jobId: string) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/employer/jobs/${jobId}/close`,
      {},
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error closing job:', error);
    throw error;
  }
};
