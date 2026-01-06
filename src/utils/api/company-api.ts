// Company API helpers
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

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

export interface CompanyCategory {
  id: string;
  name: string;
  slug: string;
  type: string;
}

export interface EmployerCategory {
  id: string;
  category: CompanyCategory;
}

export interface CompanyLocation {
  id: string;
  address: string;
  province: string;
  district?: string;
  isHeadquarters: boolean;
}

export interface CompanyFromAPI {
  id: string;
  companyName: string;
  logoUrl?: string;
  coverImageUrl?: string;
  description?: string;
  websiteUrl?: string;
  locations?: CompanyLocation[];
  employerCategories?: EmployerCategory[];
  jobCount?: number;
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

// ==================== API FUNCTIONS ====================

export interface PublicCompaniesParams {
  keyword?: string;
  city?: string;
  industry?: string;
  page?: number;
  limit?: number;
}

/**
 * Get all public companies (for candidates/guests)
 * Supports filtering, searching, and pagination
 */
export const getPublicCompanies = async (params: PublicCompaniesParams = {}): Promise<PaginationResponse<CompanyFromAPI>> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.keyword) queryParams.append('keyword', params.keyword);
    if (params.city) queryParams.append('city', params.city);
    if (params.industry) queryParams.append('industry', params.industry);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    
    const response = await axios.get<PaginationResponse<CompanyFromAPI>>(
      `${API_BASE_URL}/companies?${queryParams.toString()}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching public companies:', error);
    throw error;
  }
};

/**
 * Get featured companies (top 6 companies with most jobs)
 */
export const getFeaturedCompanies = async (limit: number = 6): Promise<PaginationResponse<CompanyFromAPI>> => {
  try {
    // Fetch top companies sorted by job count
    const response = await getPublicCompanies({
      limit: limit,
      page: 1
    });
    return response;
  } catch (error) {
    console.error('Error fetching featured companies:', error);
    throw error;
  }
};

/**
 * Get company detail by ID
 */
export const getCompanyDetail = async (companyId: string): Promise<CompanyFromAPI> => {
  try {
    const response = await axios.get<CompanyFromAPI>(
      `${API_BASE_URL}/companies/${companyId}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching company detail:', error);
    throw error;
  }
};
