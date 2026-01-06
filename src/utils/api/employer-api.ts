// src/utils/api/employer-api.ts

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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
 * Get public employer profile by ID (for candidates to view)
 */
export const getPublicEmployerProfile = async (employerId: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/employers/${employerId}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch employer profile');
    }
    throw error;
  }
};
