'use client';
import React, { useState } from 'react';
import { X, User, Mail, Phone, Calendar, MapPin, Link as LinkIcon, Briefcase, GraduationCap, FileText, Download, ExternalLink, CheckCircle2 } from 'lucide-react';

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

interface CandidateDetailData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: string;
  gender?: string;
  province?: string;
  district?: string;
  address?: string;
  personalLink?: string;
  about?: string;
  title?: string;
  education: Array<{
    school: string;
    degree: string;
    major: string;
    fromMonth: string;
    fromYear: string;
    toMonth: string;
    toYear: string;
    currentlyStudying: boolean;
    additionalDetails: string;
  }>;
  workExperience: Array<{
    jobTitle: string;
    company: string;
    fromMonth: string;
    fromYear: string;
    toMonth: string;
    toYear: string;
    currentlyWorking: boolean;
    description: string;
  }>;
  cvs: Array<{
    id: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    uploadedAt: string;
    isDefault: boolean;
  }>;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

interface AccountDetailModalProps {
  account: Account;
  candidateDetail?: CandidateDetailData;
  accountType: 'employer' | 'candidate';
  onClose: () => void;
}

export default function AccountDetailModal({ account, candidateDetail, accountType, onClose }: AccountDetailModalProps) {
  const [selectedCvUrl, setSelectedCvUrl] = useState<string | null>(null);

  const statusConfig = {
    active: { label: 'Hoạt động', color: 'bg-green-100 text-green-600 border-green-300' },
    locked: { label: 'Đã khóa', color: 'bg-red-100 text-red-600 border-red-300' },
  };

  const InfoField = ({ label, value, icon }: { label: string; value?: string; icon?: React.ReactNode }) => {
    return (
      <div className="flex items-start gap-2">
        {icon && <div className="text-gray-400 mt-0.5 shrink-0">{icon}</div>}
        <p className="text-sm text-gray-600 flex-1">
          <span className="font-medium text-gray-700">{label}:</span>{' '}
          <span className="text-gray-900">{value || 'Chưa cập nhật'}</span>
        </p>
      </div>
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

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getMonthName = (month: string) => {
    const months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
                    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
    return months[parseInt(month) - 1] || month;
  };

  const handleViewCV = (cvUrl: string) => {
    setSelectedCvUrl(cvUrl);
  };

  // Show simple modal for employer or when no candidate detail
  if (accountType === 'employer' || !candidateDetail) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
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
                  <InfoField label="Email" value={account.email} icon={<Mail className="w-4 h-4" />} />
                  {account.phone && <InfoField label="Số điện thoại" value={account.phone} icon={<Phone className="w-4 h-4" />} />}
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

            {/* Activity Statistics */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Thống kê hoạt động</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Ngày tạo tài khoản</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{account.createdAt}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Thời gian sử dụng</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {calculateDaysSince(account.createdAt)} ngày
                  </p>
                </div>
                {account.lastLogin && (
                  <>
                    <div>
                      <p className="text-xs text-gray-500">Đăng nhập lần cuối</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">{account.lastLogin}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Hoạt động gần đây</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {formatLastLogin(account.lastLogin)}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Note */}
            {accountType === 'employer' && (
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <h4 className="text-sm font-semibold text-amber-900 mb-2">Lưu ý</h4>
                <p className="text-sm text-amber-800">
                  Đây là tài khoản Nhà tuyển dụng. Để xem chi tiết hồ sơ công ty, vui lòng truy cập trang "Duyệt hồ sơ NTD".
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

  // Full candidate detail modal
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Chi tiết ứng viên</h2>
            <p className="text-sm text-gray-500 mt-1">Xem đầy đủ thông tin hồ sơ ứng viên</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Candidate Header */}
            <div className="flex items-start gap-4 pb-6 border-b border-gray-200">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                {candidateDetail.avatar ? (
                  <img src={candidateDetail.avatar} alt={candidateDetail.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-white">
                    {candidateDetail.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{candidateDetail.name}</h3>
                {candidateDetail.title && (
                  <p className="text-lg text-blue-600 font-medium mb-3">{candidateDetail.title}</p>
                )}
                <div className="flex flex-wrap gap-2 mb-2">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                      statusConfig[candidateDetail.isActive ? 'active' : 'locked'].color
                    }`}
                  >
                    {statusConfig[candidateDetail.isActive ? 'active' : 'locked'].label}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border bg-blue-50 text-blue-700 border-blue-200">
                    ID: {candidateDetail.id}
                  </span>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-5">
              <h4 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Thông tin cơ bản
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField label="Email" value={candidateDetail.email} icon={<Mail className="w-4 h-4" />} />
                <InfoField label="Số điện thoại" value={candidateDetail.phone} icon={<Phone className="w-4 h-4" />} />
                <InfoField label="Ngày sinh" value={candidateDetail.dateOfBirth ? formatDate(candidateDetail.dateOfBirth) : undefined} icon={<Calendar className="w-4 h-4" />} />
                <InfoField label="Giới tính" value={candidateDetail.gender} icon={<User className="w-4 h-4" />} />
                <InfoField 
                  label="Địa chỉ" 
                  value={[candidateDetail.address, candidateDetail.district, candidateDetail.province].filter(Boolean).join(', ')} 
                  icon={<MapPin className="w-4 h-4" />} 
                />
                {candidateDetail.personalLink && (
                  <InfoField label="Website" value={candidateDetail.personalLink} icon={<LinkIcon className="w-4 h-4" />} />
                )}
              </div>
            </div>

            {/* About Section */}
            {candidateDetail.about && (
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h4 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Giới thiệu bản thân
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{candidateDetail.about}</p>
              </div>
            )}

            {/* Education Section */}
            {candidateDetail.education && candidateDetail.education.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h4 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  Học vấn ({candidateDetail.education.length})
                </h4>
                <div className="space-y-4">
                  {candidateDetail.education.map((edu, index) => (
                    <div key={index} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-gray-900 text-sm">{edu.school}</h5>
                          <p className="text-sm text-gray-700 mt-1">
                            {edu.degree} - {edu.major}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500 shrink-0">
                          {getMonthName(edu.fromMonth)} {edu.fromYear} -{' '}
                          {edu.currentlyStudying ? 'Hiện tại' : `${getMonthName(edu.toMonth)} ${edu.toYear}`}
                        </span>
                      </div>
                      {edu.additionalDetails && (
                        <p className="text-sm text-gray-600 mt-2">{edu.additionalDetails}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Work Experience Section */}
            {candidateDetail.workExperience && candidateDetail.workExperience.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h4 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  Kinh nghiệm làm việc ({candidateDetail.workExperience.length})
                </h4>
                <div className="space-y-4">
                  {candidateDetail.workExperience.map((work, index) => (
                    <div key={index} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-gray-900 text-sm">{work.jobTitle}</h5>
                          <p className="text-sm text-blue-600 mt-1">{work.company}</p>
                        </div>
                        <span className="text-xs text-gray-500 shrink-0">
                          {getMonthName(work.fromMonth)} {work.fromYear} -{' '}
                          {work.currentlyWorking ? 'Hiện tại' : `${getMonthName(work.toMonth)} ${work.toYear}`}
                        </span>
                      </div>
                      {work.description && (
                        <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap">{work.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CVs Section */}
            {candidateDetail.cvs && candidateDetail.cvs.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h4 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  CV đã tải lên ({candidateDetail.cvs.length})
                </h4>
                <div className="space-y-3">
                  {candidateDetail.cvs.map((cv) => (
                    <div key={cv.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm text-gray-900 truncate">{cv.fileName}</p>
                          {cv.isDefault && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700 shrink-0">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Mặc định
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-xs text-gray-500">{formatFileSize(cv.fileSize)}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(cv.uploadedAt).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleViewCV(cv.fileUrl)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Xem CV"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <a
                          href={cv.fileUrl}
                          download={cv.fileName}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                          title="Tải xuống"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Activity Information */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-5">
              <h4 className="text-base font-bold text-gray-900 mb-4">Thông tin hoạt động</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Ngày tạo tài khoản</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{candidateDetail.createdAt}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Thời gian sử dụng</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {calculateDaysSince(candidateDetail.createdAt)} ngày
                  </p>
                </div>
                {candidateDetail.lastLogin && (
                  <>
                    <div>
                      <p className="text-xs text-gray-500">Đăng nhập lần cuối</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">{candidateDetail.lastLogin}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Hoạt động gần đây</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {formatLastLogin(candidateDetail.lastLogin)}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-200 p-6 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
          >
            Đóng
          </button>
        </div>
      </div>

      {/* CV Viewer Modal */}
      {selectedCvUrl && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60] p-4"
          onClick={() => setSelectedCvUrl(null)}
        >
          <div 
            className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-bold text-gray-900">Xem CV</h3>
              <button
                onClick={() => setSelectedCvUrl(null)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <iframe
                src={selectedCvUrl}
                className="w-full h-full"
                title="CV Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
