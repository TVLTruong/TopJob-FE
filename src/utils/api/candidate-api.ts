const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Log the API URL for debugging (only in development)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('Candidate API_BASE_URL:', API_BASE_URL);
}

// ============= TYPES & INTERFACES =============

export interface CandidateEducation {
  school: string;
  degree: string;
  major: string;
  startDate: string; // ISO date string
  endDate?: string; // ISO date string, optional if currentlyStudying
  currentlyStudying: boolean;
  additionalDetails?: string;
}

export interface CandidateWorkExperience {
  jobTitle: string;
  company: string;
  startDate: string; // ISO date string
  endDate?: string; // ISO date string, optional if currentlyWorking
  currentlyWorking: boolean;
  description?: string;
}

export interface CandidateCV {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: string;
  isDefault: boolean;
}

export interface CandidateProfile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string; // ISO date string
  gender?: string; // 'male' | 'female' | 'other'
  addressCity?: string; // Tỉnh/Thành phố
  addressDistrict?: string; // Quận/Huyện
  addressStreet?: string; // Địa chỉ đường/số nhà
  addressCountry?: string;
  avatarUrl?: string;
  title?: string;
  bio?: string;
  personalUrl?: string;
  experienceYears?: number;
  experienceLevel?: string;
  educationLevel?: string;
  education: CandidateEducation[];
  workExperience: CandidateWorkExperience[];
  cvs: CandidateCV[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateCandidateProfileDto {
  fullName?: string;
  phoneNumber?: string;
  dateOfBirth?: string; // ISO date string (YYYY-MM-DD)
  gender?: string; // 'male' | 'female' | 'other'
  addressCity?: string; // Tỉnh/Thành phố
  addressDistrict?: string; // Quận/Huyện
  addressStreet?: string; // Địa chỉ đường/số nhà
  addressCountry?: string;
  avatarUrl?: string; // URL ảnh đại diện
  title?: string;
  bio?: string;
  personalUrl?: string; // URL website cá nhân
  experienceYears?: number;
  experienceLevel?: string;
  educationLevel?: string;
  education?: CandidateEducation[];
  workExperience?: CandidateWorkExperience[];
}

export interface UploadCvDto {
  fileName: string;
  fileUrl: string;
  fileSize: number;
}

export interface ApplyJobDto {
  cvId?: string; // Optional, uses default CV if not provided
  coverLetter?: string;
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  cvId: string;
  coverLetter?: string;
  status: string;
  appliedAt: string;
  job?: unknown; // Job details if included
}

export interface Job {
  id: string;
  title: string;
  // Add other job fields as needed
}

// ============= HELPER FUNCTION =============

async function handleResponse<T>(response: Response): Promise<T> {
  // Log response for debugging
  console.log('API Response:', {
    url: response.url,
    status: response.status,
    statusText: response.statusText,
    ok: response.ok
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: `HTTP ${response.status}: ${response.statusText}`
    }));
    console.error('API Error:', error);
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// ============= CANDIDATE API SERVICE =============

export const CandidateApi = {
  // ============= PROFILE ENDPOINTS =============
  
  /**
   * Lấy thông tin hồ sơ ứng viên của tôi
   * GET /candidates/me
   */
  getMyProfile: async (token: string): Promise<CandidateProfile> => {
    try {
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      const url = `${API_BASE_URL}/candidates/me?_t=${timestamp}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
      });
      
      return handleResponse<CandidateProfile>(response);
    } catch (error) {
      console.error('Failed to fetch profile:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        API_BASE_URL,
      });
      throw error;
    }
  },

  /**
   * Cập nhật hồ sơ ứng viên
   * PUT /candidates/me
   */
  updateMyProfile: async (
    token: string,
    data: UpdateCandidateProfileDto
  ): Promise<CandidateProfile> => {
    const response = await fetch(`${API_BASE_URL}/candidates/me`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    return handleResponse<CandidateProfile>(response);
  },

  // ============= AVATAR ENDPOINTS =============
  
  /**
   * Upload ảnh đại diện
   * Sử dụng endpoint upload chung, sau đó cập nhật vào profile
   */
  uploadAvatar: async (
    token: string,
    file: File
  ): Promise<{ avatarUrl: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    // Step 1: Upload file to storage
    const uploadResponse = await fetch(`${API_BASE_URL}/upload/candidate-avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    
    const uploadResult = await handleResponse<{ url: string; originalName: string; size: number; mimeType: string }>(uploadResponse);

    // Step 2: Update profile with new avatar URL
    await CandidateApi.updateMyProfile(token, {
      avatarUrl: uploadResult.url,
    });

    return {
      avatarUrl: uploadResult.url,
    };
  },

  // ============= CV ENDPOINTS =============
  
  /**
   * Thêm CV mới
   * POST /candidates/me/cvs
   */
  uploadCv: async (
    token: string,
    data: UploadCvDto
  ): Promise<CandidateProfile> => {
    const response = await fetch(`${API_BASE_URL}/candidates/me/cvs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    return handleResponse<CandidateProfile>(response);
  },

  /**
   * Lấy danh sách CV
   * GET /candidates/me/cvs
   */
  getMyCvs: async (token: string): Promise<CandidateCV[]> => {
    const response = await fetch(`${API_BASE_URL}/candidates/me/cvs`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return handleResponse<CandidateCV[]>(response);
  },

  /**
   * Đặt CV mặc định
   * PATCH /candidates/me/cvs/:cvId/default
   */
  setDefaultCv: async (
    token: string,
    cvId: string
  ): Promise<{ message: string }> => {
    const response = await fetch(
      `${API_BASE_URL}/candidates/me/cvs/${cvId}/default`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    
    return handleResponse<{ message: string }>(response);
  },

  /**
   * Xóa CV
   * DELETE /candidates/me/cvs/:cvId
   */
  deleteCv: async (
    token: string,
    cvId: string
  ): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/candidates/me/cvs/${cvId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return handleResponse<{ message: string }>(response);
  },

  /**
   * Tải xuống CV
   * GET /candidates/me/cvs/:cvId/download
   */
  downloadCv: async (
    token: string,
    cvId: string,
    fileName: string = 'CV.pdf'
  ): Promise<void> => {
    const response = await fetch(
      `${API_BASE_URL}/candidates/me/cvs/${cvId}/download`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Không thể tải xuống CV');
    }

    // Tạo blob từ response
    const blob = await response.blob();
    
    // Tạo URL và trigger download
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },

  // ============= SAVED JOBS ENDPOINTS =============
  
  /**
   * Lấy danh sách công việc đã lưu
   * GET /candidates/me/saved-jobs
   */
  getSavedJobs: async (token: string): Promise<Job[]> => {
    const response = await fetch(`${API_BASE_URL}/candidates/me/saved-jobs`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return handleResponse<Job[]>(response);
  },

  /**
   * Lưu/bỏ lưu công việc
   * POST /candidates/me/saved-jobs/:jobId
   */
  toggleSavedJob: async (
    token: string,
    jobId: string
  ): Promise<{ message: string; saved: boolean }> => {
    const response = await fetch(
      `${API_BASE_URL}/candidates/me/saved-jobs/${jobId}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    
    return handleResponse<{ message: string; saved: boolean }>(response);
  },

  // ============= APPLICATION ENDPOINTS =============
  
  /**
   * Ứng tuyển công việc
   * POST /candidates/jobs/:jobId/apply
   */
  applyJob: async (
    token: string,
    jobId: string,
    data: ApplyJobDto
  ): Promise<{ message: string; application: Application }> => {
    const response = await fetch(
      `${API_BASE_URL}/candidates/jobs/${jobId}/apply`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );
    
    return handleResponse<{ message: string; application: Application }>(response);
  },

  /**
   * Lấy danh sách đơn ứng tuyển
   * GET /candidates/me/applications
   */
  getApplications: async (token: string): Promise<Application[]> => {
    const response = await fetch(
      `${API_BASE_URL}/candidates/me/applications`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    
    return handleResponse<Application[]>(response);
  },

  // ============= PUBLIC ENDPOINTS (For Employer/Admin) =============
  
  /**
   * Lấy thông tin hồ sơ ứng viên theo ID (dành cho Employer/Admin)
   * GET /candidates/:id
   */
  getCandidateById: async (
    token: string,
    candidateId: string
  ): Promise<CandidateProfile> => {
    const response = await fetch(`${API_BASE_URL}/candidates/${candidateId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return handleResponse<CandidateProfile>(response);
  },
};

// Export API_BASE_URL để sử dụng ở nơi khác nếu cần
export { API_BASE_URL };
