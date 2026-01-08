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
 * GET /employers/:employerId/profile
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
    
    const response = await axios.get(
      `${API_BASE_URL}/employers/${employerId}/profile`,
      { headers }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch employer profile');
    }
    throw error;
  }
};
