import axios from 'axios';
// import { EmployerApprovalType } from '../../components/types/employer-approval';
export enum EmployerApprovalType {
  ALL = 'ALL',
  NEW = 'NEW',
  EDIT = 'EDIT',
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;// || 'http://localhost:3001/api';

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

// ==================== DASHBOARD APIs ====================

// Get dashboard statistics
export const getDashboardStats = async () => {
  try {
    console.log('API_BASE_URL:', API_BASE_URL);
    console.log('Full URL:', `${API_BASE_URL}/admin/dashboard/stats`);
    console.log('Headers:', getAuthHeaders());
    
    const response = await axios.get(
      `${API_BASE_URL}/admin/dashboard/stats`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
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
  status: 'pending_new_approval' | 'pending_edit_approval';
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
  approvalType: EmployerApprovalType = EmployerApprovalType.ALL,
  page: number = 1,
  limit: number = 10
) => {
  try {
    const params = new URLSearchParams();

    if (approvalType) {
      params.append('approvalType', approvalType);
    }

    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const response = await axios.get(
      `${API_BASE_URL}/admin/employer-approval?${params.toString()}`,
      {
        headers: getAuthHeaders(),
      },
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

// ==================== ACCOUNT MANAGEMENT APIs ====================

// Get list of employer accounts
export const getEmployerAccounts = async (
  searchQuery?: string,
  page: number = 1,
  limit: number = 10
) => {
  try {
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const response = await axios.get(
      `${API_BASE_URL}/admin/employers?${params.toString()}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching employer accounts:', error);
    throw error;
  }
};

// Get employer detail
export const getEmployerDetail = async (employerId: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/admin/employers/${employerId}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching employer detail:', error);
    throw error;
  }
};

// Get list of candidate accounts
export const getCandidateAccounts = async (
  searchQuery?: string,
  page: number = 1,
  limit: number = 10
) => {
  try {
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const response = await axios.get(
      `${API_BASE_URL}/admin/candidates?${params.toString()}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching candidate accounts:', error);
    throw error;
  }
};

// Get candidate detail
export const getCandidateDetail = async (candidateId: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/admin/candidates/${candidateId}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching candidate detail:', error);
    throw error;
  }
};

// Ban employer account
export const banEmployer = async (employerId: string, reason: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/admin/employers/${employerId}/ban`,
      { reason },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error banning employer:', error);
    throw error;
  }
};

// Unban employer account
export const unbanEmployer = async (employerId: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/admin/employers/${employerId}/unban`,
      {},
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error unbanning employer:', error);
    throw error;
  }
};

// Delete employer account
export const deleteEmployer = async (employerId: string) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/admin/employers/${employerId}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting employer:', error);
    throw error;
  }
};

// Ban candidate account
export const banCandidate = async (candidateId: string, reason: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/admin/candidates/${candidateId}/ban`,
      { reason },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error banning candidate:', error);
    throw error;
  }
};

// Unban candidate account
export const unbanCandidate = async (candidateId: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/admin/candidates/${candidateId}/unban`,
      {},
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error unbanning candidate:', error);
    throw error;
  }
};

// Update candidate information
export const updateCandidate = async (
  candidateId: string,
  data: { fullName?: string; phoneNumber?: string; avatarUrl?: string }
) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/admin/candidates/${candidateId}`,
      data,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating candidate:', error);
    throw error;
  }
};

// Delete candidate account
export const deleteCandidate = async (candidateId: string) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/admin/candidates/${candidateId}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting candidate:', error);
    throw error;
  }
};
