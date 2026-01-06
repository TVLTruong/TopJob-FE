'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';
import StatusChangeModal from '@/app/components/common/StatusChangeModal';
import { CandidateApi, type CandidateProfile } from '@/utils/api/candidate-api';

const statusConfig = {
  pending: { label: 'Chờ duyệt', color: 'bg-orange-500', progress: 33 },
  approved: { label: 'Đã duyệt', color: 'bg-blue-500', progress: 66 },
  passed: { label: 'Đã đậu', color: 'bg-green-500', progress: 100 },
  rejected: { label: 'Từ chối', color: 'bg-red-500', progress: 100 },
};

export default function ApplicantDetailPage() {
  const router = useRouter();
  const params = useParams();
  const candidateId = params.id as string;
  
  const [activeTab, setActiveTab] = useState<'profile' | 'cv'>('profile');
  const [currentStatus, setCurrentStatus] = useState<'pending' | 'approved' | 'passed' | 'rejected'>('pending');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [candidateData, setCandidateData] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch candidate data
  useEffect(() => {
    const fetchCandidateData = async () => {
      if (!candidateId) return;
      
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('accessToken');
        if (!token) {
          throw new Error('Bạn cần đăng nhập để xem thông tin này');
        }
        
        const data = await CandidateApi.getCandidateById(token, candidateId);
        setCandidateData(data);
      } catch (err) {
        console.error('Error fetching candidate data:', err);
        setError(err instanceof Error ? err.message : 'Không thể tải thông tin ứng viên');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidateData();
  }, [candidateId]);

  const handleStatusChange = (newStatus: 'pending' | 'approved' | 'passed' | 'rejected') => {
    setCurrentStatus(newStatus);
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string | undefined) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Get full address
  const getFullAddress = () => {
    if (!candidateData) return '';
    const parts = [
      candidateData.addressStreet,
      candidateData.addressDistrict,
      candidateData.addressCity,
      candidateData.addressCountry,
    ].filter(Boolean);
    return parts.join(', ');
  };

  // Get default CV
  const getDefaultCV = () => {
    if (!candidateData?.cvs || candidateData.cvs.length === 0) return null;
    return candidateData.cvs.find(cv => cv.isDefault) || candidateData.cvs[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin ứng viên...</p>
        </div>
      </div>
    );
  }

  if (error || !candidateData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Không thể tải thông tin</h2>
          <p className="text-gray-600 mb-4">{error || 'Không tìm thấy thông tin ứng viên'}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const age = calculateAge(candidateData.dateOfBirth);
  const defaultCV = getDefaultCV();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium text-xl">Chi tiết ứng viên</span>
            </button>
            <button
              onClick={() => setShowStatusModal(true)}
              className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Đổi trạng thái
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          {/* Left Sidebar */}
          <div className="space-y-4">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4 overflow-hidden">
                  {candidateData.avatarUrl ? (
                    <img 
                      src={candidateData.avatarUrl} 
                      alt={candidateData.fullName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"%3E%3Cpath d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"%3E%3C/path%3E%3Ccircle cx="12" cy="7" r="4"%3E%3C/circle%3E%3C/svg%3E';
                      }}
                    />
                  ) : (
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
                <h2 className="text-xl font-bold mb-1">{candidateData.fullName}</h2>
                <p className="text-gray-600 text-sm mb-4">{candidateData.title || 'Ứng viên'}</p>
              </div>

              {/* Status Progress Bar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">Trạng thái</p>
                  <span className="text-xs text-blue-600 font-medium">{statusConfig[currentStatus].label}</span>
                </div>
                <div className="relative">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${statusConfig[currentStatus].color} transition-all duration-500`}
                      style={{ width: `${statusConfig[currentStatus].progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold mb-4">Liên hệ</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-sm text-gray-900 break-all">{candidateData.email || 'Chưa cập nhật'}</p>
                  </div>
                </div>
                <div className="border-t border-gray-200"></div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Số điện thoại</p>
                    <p className="text-sm text-gray-900">{candidateData.phoneNumber || 'Chưa cập nhật'}</p>
                  </div>
                </div>
                {getFullAddress() && (
                  <>
                    <div className="border-t border-gray-200"></div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Địa chỉ</p>
                        <p className="text-sm text-gray-900 whitespace-pre-line">{getFullAddress()}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="bg-white rounded-lg shadow-sm">
            {/* Tabs Header */}
            <div className="border-b flex items-center justify-between px-6">
              <div className="flex gap-8">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`py-4 border-b-2 font-medium transition-colors ${
                    activeTab === 'profile'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Hồ sơ ứng viên
                </button>
                <button
                  onClick={() => setActiveTab('cv')}
                  className={`py-4 border-b-2 font-medium transition-colors ${
                    activeTab === 'cv'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  CV
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  {/* Personal Info */}
                  <div>
                    <h3 className="font-semibold text-lg mb-4">Thông tin cá nhân</h3>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                      <div>
                        <h4 className="text-sm text-gray-500 mb-1">Họ tên</h4>
                        <p className="font-medium">{candidateData.fullName}</p>
                      </div>
                      <div>
                        <h4 className="text-sm text-gray-500 mb-1">Giới tính</h4>
                        <p className="font-medium">
                          {candidateData.gender === 'male' ? 'Nam' : candidateData.gender === 'female' ? 'Nữ' : candidateData.gender === 'other' ? 'Khác' : 'Chưa cập nhật'}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm text-gray-500 mb-1">Ngày sinh</h4>
                        <p className="font-medium">
                          {candidateData.dateOfBirth ? `${formatDate(candidateData.dateOfBirth)}${age ? ` (${age} tuổi)` : ''}` : 'Chưa cập nhật'}
                        </p>
                      </div>
                      {candidateData.personalUrl && (
                        <div>
                          <h4 className="text-sm text-gray-500 mb-1">Website</h4>
                          <a 
                            href={candidateData.personalUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-medium text-blue-600 hover:underline"
                          >
                            {candidateData.personalUrl}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-gray-200"></div>

                  {/* Professional Info */}
                  <div>
                    <h3 className="font-semibold text-lg mb-4">Thông tin nghề nghiệp</h3>
                    
                    {/* About Me */}
                    {candidateData.bio && (
                      <div className="mb-6">
                        <h4 className="text-sm text-gray-500 mb-2">Giới thiệu bản thân</h4>
                        <p className="text-gray-700 whitespace-pre-line">{candidateData.bio}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-6 mb-6">
                      {candidateData.title && (
                        <div>
                          <h4 className="text-sm text-gray-500 mb-1">Vị trí</h4>
                          <p className="font-medium">{candidateData.title}</p>
                        </div>
                      )}
                      {candidateData.yearsOfExperience !== undefined && (
                        <div>
                          <h4 className="text-sm text-gray-500 mb-1">Kinh nghiệm</h4>
                          <p className="font-medium">{candidateData.yearsOfExperience} năm</p>
                        </div>
                      )}
                    </div>

                    {/* Skills */}
                    {candidateData.skills && candidateData.skills.length > 0 && (
                      <div>
                        <h4 className="text-sm text-gray-500 mb-2">Kỹ năng</h4>
                        <div className="flex flex-wrap gap-2">
                          {candidateData.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'cv' && (
                <div>
                  {defaultCV?.cvUrl ? (
                    <div className="w-full h-[800px] border border-gray-200 rounded-lg overflow-hidden">
                      <iframe
                        src={defaultCV.cvUrl}
                        className="w-full h-full"
                        title="CV của ứng viên"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20">
                      <svg className="w-20 h-20 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">Chưa có CV</h3>
                      <p className="text-gray-500">Ứng viên chưa tải lên CV</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Status Change Modal */}
      {showStatusModal && (
        <StatusChangeModal
          applicantName={candidateData.fullName}
          currentStatus={currentStatus}
          onClose={() => setShowStatusModal(false)}
          onConfirm={handleStatusChange}
        />
      )}
    </div>
  );
}
