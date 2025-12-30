const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Log the API URL for debugging (only in development)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('API_BASE_URL:', API_BASE_URL);
}

// OTP Purpose enum (phải khớp với backend)
export enum OtpPurpose {
  EMAIL_VERIFICATION = 'email_verification', // UCREG03: Xác thực email đăng ký
  PASSWORD_RESET = 'password_reset', // UCAUTH03: Đặt lại mật khẩu
  EMAIL_CHANGE = 'email_change', // Xác thực khi đổi email
}

// Helper function để xử lý response
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'An error occurred'
    }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// API Service
export const AuthApi = {
  // ============= AUTH ENDPOINTS =============
  
  /**
   * Đăng nhập
   */
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    return handleResponse<{ access_token: string }>(response);
  },

  /**
   * Đăng ký tài khoản ứng viên
   */
  registerCandidate: async (data: {
    fullName: string;
    email: string;
    password: string;
  }) => {
    try {
      console.log('Registering candidate to:', `${API_BASE_URL}/auth/register/candidate`);
      console.log('Data:', { ...data, password: '***' }); // Hide password in logs
      
      const response = await fetch(`${API_BASE_URL}/auth/register/candidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  },

  /**
   * Đăng ký tài khoản nhà tuyển dụng
   */
  registerEmployer: async (data: {
    fullName: string;
    email: string;
    password: string;
    workTitle: string;
    contactPhone: string;
    companyName: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/auth/register/employer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    return handleResponse(response);
  },

  /**
   * Xác thực OTP
   */
  verifyOtp: async (email: string, otpCode: string, purpose?: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otpCode, purpose }),
    });
    
    return handleResponse<{
      verified: boolean;
      message: string;
      userId: string;
      email: string;
      access_token?: string;
      refresh_token?: string;
    }>(response);
  },

  /**
   * Gửi lại OTP
   */
  resendOtp: async (email: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    
    return handleResponse(response);
  },

  /**
   * Xác thực Email sau đăng ký (alias cho verifyOtp)
   */
  verifyEmail: async (email: string, code: string) => {
    return AuthApi.verifyOtp(email, code, OtpPurpose.EMAIL_VERIFICATION);
  },

  /**
   * Gửi lại email verification (alias cho resendOtp)
   */
  resendVerificationEmail: async (email: string) => {
    return AuthApi.resendOtp(email);
  },

  // ============= AUTHENTICATED REQUESTS =============
  
  /**
   * Lấy thông tin profile của user
   */
  getProfile: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return handleResponse(response);
  },

  /**
   * Cập nhật profile
   */
  updateProfile: async (token: string, data: Record<string, unknown>) => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    return handleResponse(response);
  },

  // ============= JOBS ENDPOINTS =============
  
  /**
   * Lấy danh sách công việc
   */
  getJobs: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    location?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.location) queryParams.append('location', params.location);

    const response = await fetch(
      `${API_BASE_URL}/jobs?${queryParams.toString()}`
    );
    
    return handleResponse(response);
  },

  /**
   * Lấy chi tiết công việc
   */
  getJobById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`);
    return handleResponse(response);
  },

  /**
   * Ứng tuyển công việc
   */
  applyJob: async (token: string, jobId: string, cvId: string) => {
    const response = await fetch(`${API_BASE_URL}/applications`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ jobId, cvId }),
    });
    
    return handleResponse(response);
  },

  // ============= COMPANIES ENDPOINTS =============
  
  /**
   * Lấy danh sách công ty
   */
  getCompanies: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);

    const response = await fetch(
      `${API_BASE_URL}/companies?${queryParams.toString()}`
    );
    
    return handleResponse(response);
  },

  /**
   * Lấy chi tiết công ty
   */
  getCompanyById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/companies/${id}`);
    return handleResponse(response);
  },

  // ============= EMPLOYER ENDPOINTS =============
  
  /**
   * Upload company logo
   * POST /upload/company-logo
   */
  uploadCompanyLogo: async (token: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload/company-logo`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    
    return handleResponse<{ url: string; originalName: string; size: number; mimeType: string }>(response);
  },

  /**
   * Hoàn thiện hồ sơ công ty (employer)
   * POST /employer/profile/submit
   */
  completeEmployerProfile: async (token: string, data: {
    companyName: string;
    website: string;
    description: string;
    benefits: string[];
    foundedDate: string;
    employerCategory: string[];
    technologies?: string[];
    contactEmail?: string;
    contactPhone?: string;
    facebookUrl?: string;
    linkedlnUrl?: string;
    xUrl?: string;
    logoUrl: string;
    locations: Array<{
      province: string;
      district: string;
      detailedAddress: string;
      isHeadquarters: boolean;
    }>;
  }) => {
    const response = await fetch(`${API_BASE_URL}/employer/profile/submit`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    return handleResponse(response);
  },
};

// Export API_BASE_URL để sử dụng ở nơi khác nếu cần
export { API_BASE_URL };