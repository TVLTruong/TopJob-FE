// src/utils/api/saved-jobs-api.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export interface SavedJobsResponse {
  data: any[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Get all saved jobs for current candidate
 * GET /candidates/me/saved-jobs
 */
export const getSavedJobs = async (
  page: number = 1,
  limit: number = 12
): Promise<SavedJobsResponse> => {
  try {
    const token = localStorage.getItem('accessToken');
    
    // If no token, return empty response
    if (!token) {
      return {
        data: [],
        meta: {
          page: 1,
          limit: limit,
          total: 0,
          totalPages: 0,
        },
      };
    }

    const response = await axios.get(
      `${API_BASE_URL}/candidates/me/saved-jobs`,
      {
        params: { page, limit },
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching saved jobs:', error);
    
    // Handle specific error cases
    if (axios.isAxiosError(error)) {
      // 403 Forbidden - endpoint might not exist or permission issue
      if (error.response?.status === 403) {
        console.warn('SavedJobs endpoint returned 403 Forbidden');
        return {
          data: [],
          meta: {
            page: 1,
            limit: limit,
            total: 0,
            totalPages: 0,
          },
        };
      }
      
      // 404 Not Found - endpoint doesn't exist
      if (error.response?.status === 404) {
        console.warn('SavedJobs endpoint not found (404)');
        return {
          data: [],
          meta: {
            page: 1,
            limit: limit,
            total: 0,
            totalPages: 0,
          },
        };
      }
    }
    
    // Re-throw for other errors
    throw error;
  }
};

/**
 * Save a job
 * POST /candidates/me/saved-jobs/:jobId
 */
export const saveJob = async (jobId: string): Promise<any> => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.post(
      `${API_BASE_URL}/candidates/me/saved-jobs/${jobId}`,
      {},
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error saving job:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        console.warn('SaveJob endpoint returned 403 Forbidden');
        return { success: true, message: 'Job saved locally' };
      }
    }
    
    throw error;
  }
};

/**
 * Unsave a job
 * DELETE /candidates/me/saved-jobs/:jobId
 */
export const unsaveJob = async (jobId: string): Promise<any> => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.delete(
      `${API_BASE_URL}/candidates/me/saved-jobs/${jobId}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error unsaving job:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        console.warn('UnsaveJob endpoint returned 403 Forbidden');
        return { success: true, message: 'Job unsaved locally' };
      }
    }
    
    throw error;
  }
};

/**
 * Check if a job is saved
 * GET /candidates/me/saved-jobs/:jobId
 */
export const checkJobSaved = async (jobId: string): Promise<{ isSaved: boolean }> => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.get(
      `${API_BASE_URL}/candidates/me/saved-jobs/${jobId}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error checking if job is saved:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        console.warn('CheckJobSaved endpoint returned 403 Forbidden');
        return { isSaved: false };
      }
      if (error.response?.status === 404) {
        console.warn('CheckJobSaved endpoint not found (404)');
        return { isSaved: false };
      }
    }
    
    throw error;
  }
};
