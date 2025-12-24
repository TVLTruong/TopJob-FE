import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

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

// ==================== INTERFACES ====================

export interface EmployerApprovalPayload {
  status?: 'ACTIVE' | 'REJECTED' | 'PENDING_PROFILE_COMPLETION';
  reason?: string;
  notes?: string;
}

export interface EmployerProfile {
  id: string;
  userId: string;
  companyName: string;
  companyLogo: string;
  email: string;
  phone: string;
  status: 'PENDING_APPROVAL' | 'PENDING_EDIT_APPROVAL' | 'ACTIVE' | 'REJECTED';
  createdDate: string;
  taxCode?: string;
  description?: string;
}

export interface JobPostingApprovalPayload {
  notes?: string;
  reason?: string;
}

export interface JobPostingApprovalPayload {
  notes?: string;
  reason?: string;
}

// ==================== EMPLOYER APPROVAL APIs ====================

// Get list of employers pending approval
export const getEmployersForApproval = async (
  status?: string,
  page: number = 1,
  limit: number = 10
) => {
  try {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const response = await axios.get(
      `${API_BASE_URL}/admin/employer-approval?${params.toString()}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching employers for approval:', error);
    throw error;
  }
};

// Get single employer profile details
export const getEmployerProfile = async (employerId: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/admin/employer-approval/${employerId}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching employer profile:', error);
    throw error;
  }
};

// Approve employer profile
export const approveEmployer = async (employerId: string, note?: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/admin/employer-approval/${employerId}/approve`,
      { note },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error approving employer:', error);
    throw error;
  }
};

// Reject employer profile
export const rejectEmployer = async (
  employerId: string,
  reason: string
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/admin/employer-approval/${employerId}/reject`,
      { reason },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error rejecting employer:', error);
    throw error;
  }
};

// ==================== JOB APPROVAL APIs ====================

// Get list of jobs pending approval
export const getJobsForApproval = async (
  search?: string,
  categoryId?: string,
  employerId?: string,
  page: number = 1,
  limit: number = 10
) => {
  try {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (categoryId) params.append('categoryId', categoryId);
    if (employerId) params.append('employerId', employerId);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const response = await axios.get(
      `${API_BASE_URL}/admin/job-approval?${params.toString()}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs for approval:', error);
    throw error;
  }
};

// Get single job details
export const getJobDetail = async (jobId: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/admin/job-approval/${jobId}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching job detail:', error);
    throw error;
  }
};

// Approve job posting
export const approveJob = async (jobId: string, note?: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/admin/job-approval/${jobId}/approve`,
      { note },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error approving job:', error);
    throw error;
  }
};

// Reject job posting
export const rejectJob = async (jobId: string, reason: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/admin/job-approval/${jobId}/reject`,
      { reason },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error rejecting job:', error);
    throw error;
  }
};
