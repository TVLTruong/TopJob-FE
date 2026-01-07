'use client';
import React from 'react';
import { X } from 'lucide-react';

interface Account {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

interface AccountDetailModalProps {
  account: Account;
  accountType: 'employer' | 'candidate';
  onClose: () => void;
}

export default function AccountDetailModal({ account, accountType, onClose }: AccountDetailModalProps) {
  const statusConfig = {
    active: { label: 'Hoạt động', color: 'bg-green-100 text-green-600 border-green-300' },
    locked: { label: 'Đã khóa', color: 'bg-red-100 text-red-600 border-red-300' },
  };

  const InfoField = ({ label, value }: { label: string; value?: string }) => {
    return (
      <p className="text-sm text-gray-600">
        <span className="font-medium">{label}:</span> {value || 'Chưa cập nhật'}
      </p>
    );
  };

  const calculateDaysSince = (dateString: string) => {
    const parts = dateString.split('/');
    const date = new Date(
      parseInt(parts[2]),
      parseInt(parts[1]) - 1,
      parseInt(parts[0])
    );
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatLastLogin = (dateString: string) => {
    const diffDays = calculateDaysSince(dateString);
    if (diffDays === 0) return 'Hôm nay';
    if (diffDays === 1) return '1 ngày trước';
    return `${diffDays} ngày trước`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Chi tiết tài khoản {accountType === 'employer' ? 'Nhà tuyển dụng' : 'Ứng viên'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Account Header */}
          <div className="flex items-start gap-4 pb-6 border-b border-gray-200">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
              {account.avatar ? (
                <img src={account.avatar} alt={account.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-white">
                  {account.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{account.name}</h3>
              <div className="space-y-2">
                <InfoField label="Email" value={account.email} />
                {account.phone && <InfoField label="Số điện thoại" value={account.phone} />}
                <InfoField label="Ngày đăng ký" value={account.createdAt} />
                {account.lastLogin && <InfoField label="Đăng nhập lần cuối" value={account.lastLogin} />}
              </div>
            </div>
            <div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                  statusConfig[account.isActive ? 'active' : 'locked'].color
                }`}
              >
                {statusConfig[account.isActive ? 'active' : 'locked'].label}
              </span>
            </div>
          </div>

          {/* Account Type */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900">
              <span className="font-medium">Loại tài khoản:</span>{' '}
              {accountType === 'employer' ? 'Nhà tuyển dụng' : 'Ứng viên'}
            </p>
          </div>

          {/* Account Information */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Thông tin tài khoản</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">ID tài khoản:</span>
                <span className="text-sm text-gray-900 font-mono">{account.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Loại:</span>
                <span className="text-sm text-gray-900">
                  {accountType === 'employer' ? 'Nhà tuyển dụng' : 'Ứng viên'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Trạng thái:</span>
                <span className={`text-sm font-medium ${account.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {account.isActive ? 'Đang hoạt động' : 'Đã bị khóa'}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Thông tin liên hệ</h4>
            <div className="space-y-3">
              <InfoField label="Email" value={account.email} />
              {account.phone ? (
                <InfoField label="Số điện thoại" value={account.phone} />
              ) : (
                <p className="text-sm text-gray-500 italic">Chưa cập nhật số điện thoại</p>
              )}
            </div>
          </div>

          {/* Activity Statistics */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Thống kê hoạt động</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Ngày tạo tài khoản:</span>
                <span className="text-sm font-medium text-gray-900">{account.createdAt}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Thời gian sử dụng:</span>
                <span className="text-sm font-medium text-gray-900">
                  {calculateDaysSince(account.createdAt)} ngày
                </span>
              </div>
              {account.lastLogin && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Đăng nhập lần cuối:</span>
                    <span className="text-sm font-medium text-gray-900">{account.lastLogin}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Hoạt động gần đây:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatLastLogin(account.lastLogin)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Additional Information */}
          {accountType === 'employer' && (
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h4 className="text-sm font-semibold text-amber-900 mb-2">Lưu ý</h4>
              <p className="text-sm text-amber-800">
                Đây là tài khoản Nhà tuyển dụng. Để xem chi tiết hồ sơ công ty, vui lòng truy cập trang "Duyệt hồ sơ NTD".
              </p>
            </div>
          )}

          {accountType === 'candidate' && (
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <h4 className="text-sm font-semibold text-emerald-900 mb-2">Lưu ý</h4>
              <p className="text-sm text-emerald-800">
                Đây là tài khoản Ứng viên. Thông tin chi tiết về hồ sơ xin việc của ứng viên có thể được xem trong hệ thống quản lý ứng viên.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
