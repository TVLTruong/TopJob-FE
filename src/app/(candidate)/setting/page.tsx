"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getCurrentUser,
  requestPasswordChangeOtp,
  changePasswordWithOtp,
  requestEmailChangeOtp,
  updateEmail,
  requestAccountDeletionOtp,
  deleteAccount,
  UserInfo,
} from "@/utils/api/user-api";
import { useRouter } from "next/navigation";
import OtpModal from "@/app/components/common/OtpModal";

// Icons
const CheckCircleIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AlertCircleIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout, isLoading: authLoading } = useAuth();
  
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentEmail, setCurrentEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  
  // Email change states
  const [emailOtpCode, setEmailOtpCode] = useState("");
  const [changingEmail, setChangingEmail] = useState(false);
  
  // Account deletion states
  const [deleteOtpCode, setDeleteOtpCode] = useState("");
  const [deleteReason, setDeleteReason] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);
  
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // OTP Modals
  const [showEmailOtpModal, setShowEmailOtpModal] = useState(false);
  const [showPasswordOtpModal, setShowPasswordOtpModal] = useState(false);
  const [showDeleteOtpModal, setShowDeleteOtpModal] = useState(false);

  // Load user info
  useEffect(() => {
    // Wait for AuthContext to finish loading
    if (authLoading) {
      return;
    }
    
    const loadUserInfo = async () => {
      try {
        const data = await getCurrentUser();
        setUserInfo(data);
        // Read from JWT token first, fallback to API response
        setCurrentEmail(user?.email || data.email);
        setEmailVerified(data.isVerified);
      } catch (error: any) {
        console.error('Error loading user info:', error);
        showToast(error?.message || 'Không thể tải thông tin người dùng');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      loadUserInfo();
    } else {
      // Only redirect if auth is loaded and user is still null
      setLoading(false);
      router.push('/login');
    }
  }, [user, router, authLoading]);

  const showToast = (message: string, type: 'error' | 'success' = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleRequestEmailOtp = async () => {
    if (!newEmail.trim()) {
      showToast("Vui lòng nhập email mới");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      showToast("Email không hợp lệ");
      return;
    }

    if (newEmail === currentEmail) {
      showToast("Email mới phải khác email hiện tại");
      return;
    }

    try {
      setChangingEmail(true);
      console.log('Requesting email OTP...'); // Debug log
      const response = await requestEmailChangeOtp();
      console.log('Email OTP response:', response); // Debug log
      setShowEmailOtpModal(true);
      showToast("Mã OTP đã được gửi đến email hiện tại của bạn", "success");
    } catch (error: any) {
      console.error('Error requesting email OTP:', error);
      showToast(error?.message || 'Không thể gửi mã OTP');
    } finally {
      setChangingEmail(false);
    }
  };

  const handleVerifyEmailOtp = async (code: string): Promise<boolean> => {
    if (!code) {
      showToast("Vui lòng nhập mã OTP");
      return false;
    }

    try {
      setChangingEmail(true);
      await updateEmail({
        newEmail: newEmail,
        otpCode: code,
      });
      
      showToast("Email đã được cập nhật! Vui lòng kiểm tra email mới để xác thực", "success");
      setNewEmail("");
      setShowEmailOtpModal(false);
      
      // Logout sau khi đổi email
      setTimeout(() => {
        logout();
      }, 2000);
      
      return true;
    } catch (error: any) {
      console.error('Error updating email:', error);
      showToast(error?.message || 'Không thể cập nhật email');
      return false;
    } finally {
      setChangingEmail(false);
    }
  };

  const handleResendEmailOtp = async (): Promise<boolean> => {
    try {
      await requestEmailChangeOtp();
      showToast("Mã OTP mới đã được gửi", "success");
      return true;
    } catch (error: any) {
      console.error('Error resending email OTP:', error);
      showToast(error?.message || 'Không thể gửi lại mã OTP');
      return false;
    }
  };

  const handleRequestOtp = async () => {
    if (!oldPassword.trim()) {
      showToast("Vui lòng nhập mật khẩu cũ");
      return;
    }
    
    if (!newPassword.trim()) {
      showToast("Vui lòng nhập mật khẩu mới");
      return;
    }
    
    if (newPassword.length < 8) {
      showToast("Mật khẩu mới phải có ít nhất 8 ký tự");
      return;
    }
    
    if (!confirmPassword.trim()) {
      showToast("Vui lòng xác nhận mật khẩu mới");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      showToast("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      setChangingPassword(true);
      const response = await requestPasswordChangeOtp();
      setShowPasswordOtpModal(true);
      showToast("Mã OTP đã được gửi đến email của bạn", "success");
    } catch (error: any) {
      console.error('Error requesting OTP:', error);
      showToast(error?.message || 'Không thể gửi mã OTP');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleVerifyPasswordOtp = async (code: string): Promise<boolean> => {
    if (!code) {
      showToast("Vui lòng nhập mã OTP");
      return false;
    }

    try {
      setChangingPassword(true);
      await changePasswordWithOtp({
        currentPassword: oldPassword,
        newPassword: newPassword,
        otpCode: code,
      });
      
      showToast("Đổi mật khẩu thành công!", "success");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordOtpModal(false);
      
      // Logout sau khi đổi mật khẩu
      setTimeout(() => {
        logout();
      }, 2000);
      
      return true;
    } catch (error: any) {
      console.error('Error changing password:', error);
      showToast(error?.message || 'Không thể đổi mật khẩu');
      return false;
    } finally {
      setChangingPassword(false);
    }
  };

  const handleResendPasswordOtp = async (): Promise<boolean> => {
    try {
      await requestPasswordChangeOtp();
      showToast("Mã OTP mới đã được gửi", "success");
      return true;
    } catch (error: any) {
      console.error('Error resending password OTP:', error);
      showToast(error?.message || 'Không thể gửi lại mã OTP');
      return false;
    }
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const handleRequestDeleteOtp = async () => {
    try {
      setDeletingAccount(true);
      const response = await requestAccountDeletionOtp();
      setShowDeleteOtpModal(true);
      setShowDeleteModal(false);
      showToast("Mã OTP đã được gửi đến email của bạn", "success");
    } catch (error: any) {
      console.error('Error requesting deletion OTP:', error);
      showToast(error?.message || 'Không thể gửi mã OTP');
    } finally {
      setDeletingAccount(false);
    }
  };

  const handleVerifyDeleteOtp = async (code: string): Promise<boolean> => {
    if (!code) {
      showToast("Vui lòng nhập mã OTP");
      return false;
    }

    try {
      setDeletingAccount(true);
      await deleteAccount({
        otpCode: code,
        reason: deleteReason,
      });
      
      showToast("Tài khoản đã được xóa thành công", "success");
      setShowDeleteOtpModal(false);
      
      // Logout sau khi xóa tài khoản
      setTimeout(() => {
        logout();
      }, 2000);
      
      return true;
    } catch (error: any) {
      console.error('Error deleting account:', error);
      showToast(error?.message || 'Không thể xóa tài khoản');
      return false;
    } finally {
      setDeletingAccount(false);
    }
  };

  const handleResendDeleteOtp = async (): Promise<boolean> => {
    try {
      await requestAccountDeletionOtp();
      showToast("Mã OTP mới đã được gửi", "success");
      return true;
    } catch (error: any) {
      console.error('Error resending delete OTP:', error);
      showToast(error?.message || 'Không thể gửi lại mã OTP');
      return false;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-[9999] animate-slide-in">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg min-w-[300px] ${
            toast.type === 'error' 
              ? 'bg-red-50 border border-red-200 text-red-800' 
              : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
          }`}>
            <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
              toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'
            }`}>
              {toast.type === 'error' ? (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <p className="text-sm font-medium">{toast.message}</p>
            <button onClick={() => setToast(null)} className="ml-2 text-gray-400 hover:text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Cài đặt tài khoản</h1>

        {/* Email Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Cập nhật Email</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Cập nhật địa chỉ email của bạn để đảm bảo an toàn
                </p>
                
                {/* Current Email */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-gray-700 font-medium">{currentEmail}</span>
                  {emailVerified && (
                    <span className="flex items-center gap-1 text-emerald-600 text-sm">
                      <CheckCircleIcon />
                      Địa chỉ email đã được xác minh
                    </span>
                  )}
                  {!emailVerified && (
                    <span className="flex items-center gap-1 text-amber-600 text-sm">
                      <AlertCircleIcon />
                      Chờ xác minh email
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* New Email Input */}
            <div className="mt-6">
              <p className="text-sm text-gray-500 mb-3">
                Nhập email mới mà bạn muốn sử dụng cho tài khoản này
              </p>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Nhập email mới..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleRequestEmailOtp}
                  disabled={changingEmail}
                  className={`px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium ${
                    changingEmail ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {changingEmail ? 'Đang gửi...' : 'Gửi mã OTP'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Password Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Mật khẩu mới</h2>
                <p className="text-sm text-gray-600">
                  Quản lý mật khẩu của bạn để đảm bảo an toàn
                </p>
              </div>
            </div>

            {/* Old Password */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu cũ
              </label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Nhập mật khẩu cũ của bạn"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Tối thiểu 8 ký tự</p>
            </div>

            {/* New Password */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu mới
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới của bạn"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Tối thiểu 8 ký tự</p>
            </div>

            {/* Confirm Password */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Xác nhận mật khẩu mới
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Nhập lại mật khẩu để xác nhận</p>
            </div>

            {/* OTP Input */}
            {/* Removed - OTP Modal will handle this */}

            <div className="flex gap-3">
              <button
                onClick={handleRequestOtp}
                disabled={changingPassword}
                className={`px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium ${
                  changingPassword ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {changingPassword ? 'Đang gửi...' : 'Gửi mã OTP'}
              </button>
            </div>
          </div>
        </div>

        {/* Delete Account Section */}
        <div className="bg-white rounded-xl shadow-sm border border-red-200 mb-6">
          <div className="p-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-red-600 mb-2">Xóa tài khoản</h2>
                <p className="text-sm text-gray-600">
                  Xóa vĩnh viễn tài khoản của bạn và tất cả dữ liệu liên quan
                </p>
              </div>
              <button
                onClick={handleDeleteAccount}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-sm"
              >
                <AlertCircleIcon />
                <span>Xóa tài khoản</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircleIcon />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Xóa tài khoản</h2>
              </div>
              
              <p className="text-gray-600 mb-4">
                Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác và tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn.
              </p>

              {/* Reason Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lý do xóa tài khoản (tùy chọn)
                </label>
                <textarea
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  placeholder="Vui lòng cho chúng tôi biết lý do..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteReason('');
                  }}
                  disabled={deletingAccount}
                  className="flex-1 px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleRequestDeleteOtp}
                  disabled={deletingAccount}
                  className="flex-1 px-4 py-3 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deletingAccount ? 'Đang gửi...' : 'Gửi mã OTP'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email OTP Modal */}
      <OtpModal
        open={showEmailOtpModal}
        title="Xác thực thay đổi email"
        message={`Mã OTP đã được gửi đến email hiện tại của bạn (${currentEmail}). Vui lòng kiểm tra hộp thư của bạn.`}
        onClose={() => setShowEmailOtpModal(false)}
        onVerify={handleVerifyEmailOtp}
        onResend={handleResendEmailOtp}
        resendLabel="Gửi lại mã"
        submitLabel="Xác nhận"
      />

      {/* Password OTP Modal */}
      <OtpModal
        open={showPasswordOtpModal}
        title="Xác thực đổi mật khẩu"
        message="Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư của bạn."
        onClose={() => setShowPasswordOtpModal(false)}
        onVerify={handleVerifyPasswordOtp}
        onResend={handleResendPasswordOtp}
        resendLabel="Gửi lại mã"
        submitLabel="Xác nhận"
      />

      {/* Delete Account OTP Modal */}
      <OtpModal
        open={showDeleteOtpModal}
        title="Xác thực xóa tài khoản"
        message="Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư của bạn."
        onClose={() => setShowDeleteOtpModal(false)}
        onVerify={handleVerifyDeleteOtp}
        onResend={handleResendDeleteOtp}
        resendLabel="Gửi lại mã"
        submitLabel="Xác nhận xóa"
      />
    </div>
  );
}