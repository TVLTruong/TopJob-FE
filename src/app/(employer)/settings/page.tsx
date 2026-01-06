'use client'

import React, { useState, useEffect } from 'react'
import { Lock, Phone, Briefcase, Save, Eye, EyeOff, Mail } from 'lucide-react'
import OtpModal from '@/app/components/common/OtpModal'
import Toast from '@/app/components/profile/Toast'
import { 
  getCurrentUser, 
  requestUpdateInfoOtp, 
  updateUserInfo, 
  requestPasswordChangeOtp, 
  changePasswordWithOtp,
  type UserInfo 
} from '@/utils/api/user-api'
import { getMyEmployerProfile } from '@/utils/api/employer-api'

type TabType = 'account' | 'password'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('account')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null)
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [pendingAction, setPendingAction] = useState<'account' | 'password' | null>(null)
  const [otpCode, setOtpCode] = useState('')
  const [loading, setLoading] = useState(true)

  // Toast helper
  const showToast = (message: string, type: 'error' | 'success' = 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  // Form states
  const [accountInfo, setAccountInfo] = useState({
    fullName: '',
    email: '',
    workTitle: '',
    contactPhone: ''
  })

  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Validation error states
  const [accountErrors, setAccountErrors] = useState<Record<string, string>>({});
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        const user = await getCurrentUser()
        const employerProfile = await getMyEmployerProfile()
        
        setAccountInfo({
          fullName: employerProfile.fullName || '',
          email: user.email || '',
          workTitle: employerProfile.workTitle || '',
          contactPhone: employerProfile.contactPhone || ''
        })
      } catch (err) {
        console.error('Error fetching user data:', err)
        showToast('Không thể tải thông tin tài khoản', 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  // Helpers
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePhone = (phone: string) => {
    // simple: only digits, 9-11 characters (adjust if needed)
    const re = /^[0-9]{9,11}$/;
    return re.test(String(phone));
  };

  const handleAccountInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccountInfo({
      ...accountInfo,
      [name]: value
    });
    // clear field error when user types
    setAccountErrors(prev => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordInfo({
      ...passwordInfo,
      [name]: value
    });
    setPasswordErrors(prev => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  const handleSaveAccountClick = async () => {
    const errs: Record<string,string> = {};
    if (!accountInfo.fullName.trim()) errs.fullName = 'Vui lòng nhập tên';
    if (!accountInfo.workTitle.trim()) errs.workTitle = 'Vui lòng nhập chức vụ';
    if (!accountInfo.contactPhone.trim()) errs.contactPhone = 'Vui lòng nhập số điện thoại';
    else if (!validatePhone(accountInfo.contactPhone)) errs.contactPhone = 'Số điện thoại không hợp lệ (chỉ chữ số, 9-11 số)';

    setAccountErrors(errs);
    if (Object.keys(errs).length === 0) {
      try {
        // Request OTP
        await requestUpdateInfoOtp()
        setPendingAction('account');
        setShowOtpModal(true);
        showToast('Mã OTP đã được gửi đến email của bạn', 'success')
      } catch (err: any) {
        showToast(err.response?.data?.message || 'Không thể gửi mã OTP', 'error')
      }
    }
  }

  const handleChangePasswordClick = async () => {
    const errs: Record<string,string> = {};
    if (!passwordInfo.currentPassword) errs.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
    if (!passwordInfo.newPassword) errs.newPassword = 'Vui lòng nhập mật khẩu mới';
    else if (passwordInfo.newPassword.length < 8) errs.newPassword = 'Mật khẩu phải có ít nhất 8 ký tự';
    if (!passwordInfo.confirmPassword) errs.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
    if (passwordInfo.newPassword && passwordInfo.confirmPassword && passwordInfo.newPassword !== passwordInfo.confirmPassword) {
      errs.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    setPasswordErrors(errs);
    if (Object.keys(errs).length === 0) {
      try {
        // Request OTP
        await requestPasswordChangeOtp()
        setPendingAction('password');
        setShowOtpModal(true);
        showToast('Mã OTP đã được gửi đến email của bạn', 'success')
      } catch (err: any) {
        showToast(err.response?.data?.message || 'Không thể gửi mã OTP', 'error')
      }
    }
  }

  const verifyOtp = async (code: string) => {
    try {
      if (pendingAction === 'account') {
        // Update account info
        await updateUserInfo({
          fullName: accountInfo.fullName,
          workTitle: accountInfo.workTitle,
          contactPhone: accountInfo.contactPhone,
          otpCode: code
        })
        showToast('Cập nhật thông tin tài khoản thành công!', 'success')
        setPendingAction(null)
        return true
      } else if (pendingAction === 'password') {
        // Change password
        await changePasswordWithOtp({
          currentPassword: passwordInfo.currentPassword,
          newPassword: passwordInfo.newPassword,
          otpCode: code
        })
        setPasswordInfo({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
        showToast('Đổi mật khẩu thành công!', 'success')
        setPendingAction(null)
        return true
      }
      return false
    } catch (err: any) {
      const message = err.response?.data?.message || 'Mã OTP không hợp lệ'
      showToast(message, 'error')
      return false
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-6xl mx-auto px-8 pb-8">
        {/* Container for Title and Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-[3px]">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Cài đặt</h1>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab('account')}
                className={`pb-4 px-1 text-sm font-medium transition border-b-2 ${
                  activeTab === 'account'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Thông tin tài khoản
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`pb-4 px-1 text-sm font-medium transition border-b-2 ${
                  activeTab === 'password'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Đổi mật khẩu
              </button>
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        )}

        {/* Tab Content */}
        {!loading && activeTab === 'account' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Thông tin tài khoản</h2>
              <p className="text-sm text-gray-600 mt-1">Cập nhật thông tin cá nhân của bạn</p>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên tài khoản
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={accountInfo.fullName}
                  onChange={handleAccountInfoChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${accountErrors.fullName ? 'border-red-500 focus:ring-red-200' : 'border-gray-300'}`}
                  placeholder="Nhập tên của bạn"
                />
                <p
                  className={`text-red-500 text-xs mt-1 transition-all`}
                  style={{ minHeight: '20px' }}
                >
                  {accountErrors.fullName || ''}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email công việc
                </label>
                <input
                  type="email"
                  name="email"
                  value={accountInfo.email}
                  disabled
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  placeholder="Nhập email công việc"
                />
                <p className="text-xs text-gray-500 mt-1">Email không thể thay đổi</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Chức vụ
                </label>
                <input
                  type="text"
                  name="workTitle"
                  value={accountInfo.workTitle}
                  onChange={handleAccountInfoChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${accountErrors.workTitle ? 'border-red-500 focus:ring-red-200' : 'border-gray-300'}`}
                  placeholder="Nhập chức vụ của bạn"
                />
                <p
                  className={`text-red-500 text-xs mt-1 transition-all`}
                  style={{ minHeight: '20px' }}
                >
                  {accountErrors.workTitle || ''}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={accountInfo.contactPhone}
                  onChange={handleAccountInfoChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${accountErrors.contactPhone ? 'border-red-500 focus:ring-red-200' : 'border-gray-300'}`}
                  placeholder="Nhập số điện thoại"
                />
                <p
                  className={`text-red-500 text-xs mt-1 transition-all`}
                  style={{ minHeight: '20px' }}
                >
                  {accountErrors.contactPhone || ''}
                </p>
              </div>

              <button
                onClick={handleSaveAccountClick}
                className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
              >
                <Save className="w-4 h-4" />
                Lưu thay đổi
              </button>
            </div>
          </div>
        )}

        {!loading && activeTab === 'password' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-green-600" />
                Đổi mật khẩu
              </h2>
              <p className="text-sm text-gray-600 mt-1">Cập nhật mật khẩu để bảo mật tài khoản</p>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu hiện tại
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    value={passwordInfo.currentPassword}
                    onChange={handlePasswordChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-12 ${passwordErrors.currentPassword ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p
                  className={`text-red-500 text-xs mt-1 transition-all`}
                  style={{ minHeight: '20px' }}
                >
                  {passwordErrors.currentPassword || ''}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={passwordInfo.newPassword}
                    onChange={handlePasswordChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-12 ${passwordErrors.newPassword ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p
                  className={`text-red-500 text-xs mt-1 transition-all`}
                  style={{ minHeight: '20px' }}
                >
                  {passwordErrors.newPassword || ''}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Xác nhận mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordInfo.confirmPassword}
                    onChange={handlePasswordChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-12 ${passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Nhập lại mật khẩu mới"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p
                  className={`text-red-500 text-xs mt-1 transition-all`}
                  style={{ minHeight: '20px' }}
                >
                  {passwordErrors.confirmPassword || ''}
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  <strong>Lưu ý:</strong> Mật khẩu phải có ít nhất 8 ký tự và bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt để đảm bảo an toàn.
                </p>
              </div>

              <button
                onClick={handleChangePasswordClick}
                className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
              >
                <Lock className="w-4 h-4" />
                Đổi mật khẩu
              </button>
            </div>
          </div>
        )}
      </div>

      {/* OTP Modal */}
      <OtpModal
        open={showOtpModal}
        title="Xác thực thay đổi"
        message={
          pendingAction === 'account'
            ? 'Nhập mã OTP để xác nhận lưu thay đổi thông tin tài khoản.'
            : 'Nhập mã OTP để xác nhận đổi mật khẩu.'
        }
        onClose={() => {
          setShowOtpModal(false)
          setPendingAction(null)
        }}
        onVerify={async (code) => {
          const ok = await verifyOtp(code)
          if (ok) setShowOtpModal(false)
          return ok
        }}
      />
    </div>
  )
}