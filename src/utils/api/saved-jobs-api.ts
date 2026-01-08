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
 * GET /candidates/saved-jobs
 */
export const getSavedJobs = async (
  page: number = 1,
  limit: number = 12
): Promise<SavedJobsResponse> => {
  try {
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
    // Re-throw to let caller handle
    throw error;
  }
};

/**
 * Save a job
 * POST /candidates/saved-jobs/:jobId
 */
export const saveJob = async (jobId: string): Promise<any> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/candidates/me/saved-jobs/${jobId}`,
      {},
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error saving job:', error);
    throw error;
  }
};

/**
 * Unsave a job
 * DELETE /candidates/saved-jobs/:jobId
 */
export const unsaveJob = async (jobId: string): Promise<any> => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/candidates/me/saved-jobs/${jobId}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error unsaving job:', error);
    throw error;
  }
};

/**
 * Check if a job is saved
 * GET /candidates/saved-jobs/:jobId/check
 */
export const checkJobSaved = async (jobId: string): Promise<any> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/candidates/me/saved-jobs/${jobId}/check`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error checking saved job:', error);
    throw error;
  }
};
