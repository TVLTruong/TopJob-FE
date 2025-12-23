import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface EmployerApprovalPayload {
  status: 'ACTIVE' | 'REJECTED' | 'PENDING_PROFILE_COMPLETION';
  reason?: string;
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
      `${API_BASE_URL}/admin/employer-approval?${params.toString()}`
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
      `${API_BASE_URL}/admin/employer-approval/${employerId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching employer profile:', error);
    throw error;
  }
};

// Approve employer profile
export const approveEmployer = async (employerId: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/admin/employer-approval/${employerId}/approve`,
      {
        status: 'ACTIVE'
      }
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
  reason: string,
  registrationType?: 'new' | 'edit'
) => {
  try {
    const payload: any = {
      reason
    };

    // Different status based on registration type
    if (registrationType === 'new') {
      payload.status = 'PENDING_PROFILE_COMPLETION'; // Change back to pending completion for new profiles
    } else if (registrationType === 'edit') {
      payload.status = 'APPROVED'; // Keep as approved, just reject pending edits
    } else {
      payload.status = 'REJECTED';
    }

    const response = await axios.post(
      `${API_BASE_URL}/admin/employer-approval/${employerId}/reject`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error('Error rejecting employer:', error);
    throw error;
  }
};

// Approve employer profile changes/edits
export const approveEmployerEdits = async (employerId: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/admin/employer-approval/${employerId}/approve-edits`,
      {
        status: 'APPROVED'
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error approving employer edits:', error);
    throw error;
  }
};

// Search employers
export const searchEmployers = async (
  query: string,
  status?: string,
  page: number = 1,
  limit: number = 10
) => {
  try {
    const params = new URLSearchParams();
    params.append('q', query);
    if (status) params.append('status', status);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const response = await axios.get(
      `${API_BASE_URL}/admin/employer-approval/search?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error('Error searching employers:', error);
    throw error;
  }
};
