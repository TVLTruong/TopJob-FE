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

export interface JobCategory {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
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
  categoryIds: string[];
  primaryCategoryId?: string;
  technologyIds?: string[];
  primaryTechnologyId?: string;
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

export type UpdateJobPayload = Partial<CreateJobPayload>;

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
  jobCategories?: Array<{
    categoryId: string;
    isPrimary: boolean;
    category: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
  jobTechnologies?: Array<{
    technologyId: string;
    isPrimary: boolean;
    technology: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
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
 * Get job detail (public - for candidates)
 * Note: Backend expects job ID, not slug
 */
export const getJobDetail = async (jobId: string): Promise<JobFromAPI> => {
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
 * Get job detail for candidates (public endpoint with job ID)
 */
export const getCandidateJobDetail = async (jobId: string): Promise<JobFromAPI> => {
  try {
    // Try public endpoint first
    const response = await axios.get(
      `${API_BASE_URL}/jobs/${jobId}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error: any) {
    console.error('Error fetching candidate job detail:', error);
    // If 404, it might mean the endpoint expects different format
    if (error.response?.status === 404) {
      console.warn('Job not found with ID, backend might expect slug or different route');
    }
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
 * Get active jobs by company/employer ID (Public)
 * Returns max 4 jobs sorted by earliest deadline
 * Used for company profile page
 */
export const getCompanyActiveJobs = async (employerId: string): Promise<JobFromAPI[]> => {
  try {
    const response = await axios.get<JobFromAPI[]>(
      `${API_BASE_URL}/jobs/employer/${employerId}/active`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching company active jobs:', error);
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
 * Delete a job (soft delete by employer)
 * Backend will handle status change to REMOVED_BY_EMPLOYER
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

/**
 * Get applications for a specific job
 * GET /employer/jobs/:jobId/applications
 */
export interface ApplicationFromAPI {
  id: string;
  candidateId: string;
  jobId: string;
  cvId: string | null;
  status: 'NEW' | 'REVIEWING' | 'SHORTLISTED' | 'INTERVIEWING' | 'OFFERED' | 'HIRED' | 'REJECTED';
  statusUpdatedAt: string | null;
  appliedAt: string;
  createdAt: string;
  updatedAt: string;
  candidate?: {
    id: string;
    userId: string;
    fullName: string;
    email: string;
    phone: string;
    avatarUrl: string | null;
  };
  cv?: {
    id: string;
    title: string;
    fileUrl: string;
  };
  job?: {
    id: string;
    title: string;
    slug: string;
  };
}

export const getJobApplications = async (
  jobId: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginationResponse<ApplicationFromAPI>> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/employer/jobs/${jobId}/applications`,
      {
        params: { page, limit },
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching job applications:', error);
    throw error;
  }
};
// ==================== PUBLIC JOB APIs (For Candidates) ====================

/**
 * Get public jobs with filters (for candidate job search)
 * GET /jobs?keyword=...&location=...&isHot=true
 */
export interface PublicJobsFilters {
  keyword?: string;
  location?: string;
  jobType?: 'full_time' | 'part_time' | 'freelance' | 'internship' | 'contract';
  experienceLevel?: 'intern' | 'fresher' | 'junior' | 'middle' | 'senior' | 'lead' | 'manager';
  categoryId?: string;
  salaryMin?: number;
  salaryMax?: number;
  isHot?: boolean;
  sort?: 'newest' | 'relevant';
  page?: number;
  limit?: number;
}

export const getPublicJobs = async (filters?: PublicJobsFilters): Promise<PaginationResponse<JobFromAPI>> => {
  try {
    const params = new URLSearchParams();
    
    if (filters?.keyword) params.append('keyword', filters.keyword);
    if (filters?.location) params.append('location', filters.location);
    if (filters?.jobType) params.append('jobType', filters.jobType);
    if (filters?.experienceLevel) params.append('experienceLevel', filters.experienceLevel);
    if (filters?.categoryId) params.append('categoryId', filters.categoryId);
    if (filters?.salaryMin !== undefined) params.append('salaryMin', filters.salaryMin.toString());
    if (filters?.salaryMax !== undefined) params.append('salaryMax', filters.salaryMax.toString());
    if (filters?.isHot !== undefined) params.append('isHot', filters.isHot.toString());
    if (filters?.sort) params.append('sort', filters.sort);
    
    params.append('page', (filters?.page ?? 1).toString());
    params.append('limit', (filters?.limit ?? 10).toString());

    const response = await axios.get<PaginationResponse<JobFromAPI>>(
      `${API_BASE_URL}/jobs?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching public jobs:', error);
    throw error;
  }
};

// ==================== CATEGORIES APIs ====================

export const getRandomJobCategories = async (): Promise<JobCategory[]> => {
  try {
    const response = await axios.get<JobCategory[]>(
      `${API_BASE_URL}/categories/job/random`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching random job categories:', error);
    return [];
  }
};

export const getAllJobCategories = async (): Promise<JobCategory[]> => {
  try {
    const response = await axios.get<JobCategory[]>(
      `${API_BASE_URL}/categories/job`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching job categories:', error);
    return [];
  }
};

/**
 * Get hot jobs (isHot = true) for homepage
 * Convenience function that calls getPublicJobs with isHot filter
 */
export const getHotJobs = async (limit: number = 8): Promise<PaginationResponse<JobFromAPI>> => {
  return getPublicJobs({ isHot: true, limit, page: 1, sort: 'newest' });
};