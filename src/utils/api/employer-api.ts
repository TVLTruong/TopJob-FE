// src/utils/api/employer-api.ts

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

/**
 * Get current employer's profile
 */
export const getMyEmployerProfile = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/employers/me`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch employer profile');
    }
    throw error;
  }
};

/**
 * Update current employer's profile
 */
export const updateMyEmployerProfile = async (data: any) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/employers/me`,
      data,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to update employer profile');
    }
    throw error;
  }
};

/**
 * Get employer locations
 */
export const getEmployerLocations = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/employers/me/locations`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch locations');
    }
    throw error;
  }
};

/**
 * Add employer location
 */
export const addEmployerLocation = async (location: any) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/employers/me/locations`,
      location,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to add location');
    }
    throw error;
  }
};

/**
 * Update employer location
 */
export const updateEmployerLocation = async (locationId: string, location: any) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/employers/me/locations/${locationId}`,
      location,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to update location');
    }
    throw error;
  }
};

/**
 * Delete employer location
 */
export const deleteEmployerLocation = async (locationId: string) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/employers/me/locations/${locationId}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to delete location');
    }
    throw error;
  }
};

/**
 * Get all applications for employer's jobs
 * GET /employers/applications
 */
export const getAllApplications = async (
  page: number = 1,
  limit: number = 10,
  status?: string,
  search?: string
) => {
  try {
    const params: any = { page, limit };
    if (status && status !== 'all') params.status = status;
    if (search) params.search = search;

    const response = await axios.get(
      `${API_BASE_URL}/employers/applications`,
      { 
        headers: getAuthHeaders(),
        params 
      }
    );
    console.log('getAllApplications response:', response.data);
    return response.data;
  } catch (error) {
    console.error('getAllApplications error:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch applications'
      );
    }
    throw error;
  }
};

/**
 * Get application detail
 * GET /employers/applications/:applicationId
 */
export const getApplicationDetail = async (applicationId: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/employers/applications/${applicationId}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch application detail'
      );
    }
    throw error;
  }
};

/**
 * Update application status (shortlist or reject)
 * PATCH /employers/applications/:id/:action
 */
export const updateApplicationStatus = async (
  applicationId: string,
  action: 'shortlist' | 'reject' | 'hire'
) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/employers/applications/${applicationId}/${action}`,
      {},
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 'Failed to update application status'
      );
    }
    throw error;
  }
};

/**
 * Get public employer profile (for candidates to view)
 * GET /employers/:employerId
 * No auth required for public viewing
 */
export const getPublicEmployerProfile = async (employerId: string) => {
  try {
    // Optional auth - send token if available, but don't require it
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const headers: any = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const url = `${API_BASE_URL}/employers/${employerId}`;
    console.log('Calling API:', url); // Debug log
    
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.response?.status, error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to fetch employer profile');
    }
    throw error;
  }
};
// ==================== PUBLIC COMPANY APIs (For Candidates) ====================

/**
 * Get featured companies (top by job count)
 * GET /companies/featured
 */
export interface FeaturedCompany {
  id: string;
  companyName: string;
  logoUrl: string | null;
  categories?: string[];
  locations: string[];
  jobCount: number;
}

export const getFeaturedCompanies = async (): Promise<FeaturedCompany[]> => {
  try {
    const response = await axios.get<FeaturedCompany[]>(
      `${API_BASE_URL}/companies/featured`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching featured companies:', error);
    throw error;
  }
};

/**
 * Search filters for public companies
 */
export interface PublicCompaniesFilters {
  keyword?: string;
  city?: string;
  industry?: string;
  category?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

/**
 * Pagination response for companies
 */
export interface CompaniesPaginationResponse {
  data: FeaturedCompany[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Get all public companies with filters and pagination
 * GET /companies
 */
export const getPublicCompanies = async (
  filters: PublicCompaniesFilters = {}
): Promise<CompaniesPaginationResponse> => {
  try {
    const params = new URLSearchParams();
    
    if (filters.keyword) params.append('keyword', filters.keyword);
    if (filters.city) params.append('city', filters.city);
    if (filters.industry) params.append('industry', filters.industry);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await axios.get<CompaniesPaginationResponse>(
      `${API_BASE_URL}/companies?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching public companies:', error);
    throw error;
  }
};