// src/utils/api/user-api.ts

import { axiosClient } from './axios-client';

export interface UserInfo {
  id: string;
  email: string;
  role: 'candidate' | 'employer' | 'admin';
  status: string;
  isVerified: boolean;
  profileId?: string;
  fullName?: string;
  hasCompleteProfile?: boolean;
}

export interface UpdateUserInfoData {
  fullName?: string;
  workTitle?: string;
  contactEmail?: string;
  contactPhone?: string;
  otpCode: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  otpCode: string;
}

/**
 * Get current user information
 * GET /api/users/me
 */
export const getCurrentUser = async (): Promise<UserInfo> => {
  const response = await axiosClient.get('/users/me');
  return response.data;
};

/**
 * Request OTP for updating account information
 * POST /api/users/me/request-update-otp
 */
export const requestUpdateInfoOtp = async (): Promise<{ message: string; expiresAt: string }> => {
  const response = await axiosClient.post('/users/me/request-update-otp');
  return response.data;
};

/**
 * Update account information with OTP
 * PUT /api/users/me/info
 */
export const updateUserInfo = async (data: UpdateUserInfoData): Promise<{ message: string }> => {
  const response = await axiosClient.put('/users/me/update-info', data);
  return response.data;
};

/**
 * Request OTP for password change
 * POST /api/users/me/request-password-otp
 */
export const requestPasswordChangeOtp = async (): Promise<{ message: string; expiresAt: string }> => {
  const response = await axiosClient.post('/users/me/request-password-otp');
  return response.data;
};

/**
 * Change password with OTP
 * PUT /api/users/me/password-with-otp
 */
export const changePasswordWithOtp = async (data: ChangePasswordData): Promise<{ message: string }> => {
  const response = await axiosClient.put('/users/me/password-with-otp', data);
  return response.data;
};
