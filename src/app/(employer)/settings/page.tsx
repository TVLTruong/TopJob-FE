'use client'

import React, { useState } from 'react'
import { Lock, Phone, Briefcase, Save, Eye, EyeOff, Mail } from 'lucide-react'
import ConfirmModal from '@/app/components/companyProfile/ConfirmModal'

type TabType = 'account' | 'password'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('account')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [pendingAction, setPendingAction] = useState<'account' | 'password' | null>(null)

  // Form states
  const [accountInfo, setAccountInfo] = useState({
    fullName: 'Nguyễn Quang Huy',
    email: 'huynqd@company.com',
    position: 'Quản lý Nhân sự',
    phone: '0901234567'
  })

  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleAccountInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountInfo({
      ...accountInfo,
      [e.target.name]: e.target.value
    })
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordInfo({
      ...passwordInfo,
      [e.target.name]: e.target.value
    })
  }

  const handleSaveAccountClick = () => {
    setPendingAction('account')
    setShowConfirmModal(true)
  }

  const handleChangePasswordClick = () => {
    if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
      alert('Mật khẩu mới và xác nhận mật khẩu không khớp!')
      return
    }

    if (passwordInfo.newPassword.length < 6) {
      alert('Mật khẩu phải có ít nhất 6 ký tự!')
      return
    }

    if (!passwordInfo.currentPassword) {
      alert('Vui lòng nhập mật khẩu hiện tại!')
      return
    }

    setPendingAction('password')
    setShowConfirmModal(true)
  }

  const handleConfirm = () => {
    setShowConfirmModal(false)
    
    if (pendingAction === 'account') {
      // Xử lý lưu thông tin tài khoản
      setSuccessMessage('Cập nhật thông tin tài khoản thành công!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } else if (pendingAction === 'password') {
      // Xử lý đổi mật khẩu
      setSuccessMessage('Đổi mật khẩu thành công!')
      setPasswordInfo({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setTimeout(() => setSuccessMessage(''), 3000)
    }
    
    setPendingAction(null)
  }

  const handleCancel = () => {
    setShowConfirmModal(false)
    setPendingAction(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {successMessage}
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('account')}
              className={`pb-4 px-1 text-sm font-medium transition border-b-2 ${
                activeTab === 'account'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Thông tin tài khoản
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`pb-4 px-1 text-sm font-medium transition border-b-2 ${
                activeTab === 'password'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Đổi mật khẩu
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'account' && (
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
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập tên của bạn"
                />
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
                  onChange={handleAccountInfoChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập email công việc"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Chức vụ
                </label>
                <input
                  type="text"
                  name="position"
                  value={accountInfo.position}
                  onChange={handleAccountInfoChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập chức vụ của bạn"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={accountInfo.phone}
                  onChange={handleAccountInfoChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <button
                onClick={handleSaveAccountClick}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                <Save className="w-4 h-4" />
                Lưu thay đổi
              </button>
            </div>
          </div>
        )}

        {activeTab === 'password' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-600" />
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
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
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
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
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
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
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
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Lưu ý:</strong> Mật khẩu phải có ít nhất 6 ký tự và nên bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt để đảm bảo an toàn.
                </p>
              </div>

              <button
                onClick={handleChangePasswordClick}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                <Lock className="w-4 h-4" />
                Đổi mật khẩu
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        open={showConfirmModal}
        title="Xác nhận thay đổi"
        message={
          pendingAction === 'account'
            ? 'Bạn có chắc chắn muốn lưu thay đổi thông tin tài khoản?'
            : 'Bạn có chắc chắn muốn đổi mật khẩu? Sau khi đổi, bạn sẽ cần đăng nhập lại.'
        }
        confirmText="Xác nhận"
        cancelText="Hủy"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  )
}