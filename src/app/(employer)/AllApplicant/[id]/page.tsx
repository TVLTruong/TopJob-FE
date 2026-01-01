'use client';
import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';
import StatusChangeModal from '@/app/components/common/StatusChangeModal';

// Mock data - replace with actual API call
const applicantData = {
  id: 1,
  name: 'Jerome Bell',
  avatar: '👨',
  position: 'Product Designer',
  jobApplied: 'Product Development',
  department: 'Marketing • Full-Time',
  appliedDate: '2 ngày trước',
  status: 'pending' as 'pending' | 'approved' | 'passed' | 'rejected',
  personalInfo: {
    fullName: 'Jerome Bell',
    gender: 'Nam',
    dateOfBirth: '23/03/1999',
    age: 26,
    languages: 'English, French, Bahasa',
    address: '4517 Washington Ave.\nManchester, Kentucky, 39495',
  },
  contact: {
    email: 'jeromeBell45@email.com',
    phone: '+44 1245 572 135',
  },
  aboutMe: "I'm a product designer + filmmaker currently working remotely at Twitter from beautiful Manchester, United Kingdom. I'm passionate about designing digital products that have a positive impact on the world.\n\nFor 10 years, I've specialised in interface, experience & interaction design as well as working in user research and product strategy for product agencies, big tech companies & start-ups.",
  currentJob: 'Product Designer',
  experience: '4 Years',
  highestQualification: 'Bachelors in Engineering',
  skills: ['Project Management', 'Copywriting', 'English'],
  cvUrl: null, // Set to PDF URL if CV is uploaded, e.g., '/path/to/cv.pdf' or null if not uploaded
  cv: {
    positions: [
      {
        title: 'Senior UI/UX Product Designer',
        company: 'Enterprise name',
        period: 'Aug 2020 - Present • 2 years, 5 mos',
        description: 'Created digital design systems for small + larger projects. Work prototype, design and deliver the UI and UX experience with a lean design process. User research, design brief and handle.',
      },
      {
        title: 'UI/UX Product Designer',
        company: 'Enterprise name',
        period: 'Aug 2018 - Jul 2020 • 2 years, 1 mo',
        description: 'Lead the UI/UX for the accountability of the design system, collaborated with product and development teams on core projects to improve product interfaces and experiences.',
      },
      {
        title: 'UI Designer',
        company: 'Enterprise name',
        period: 'Aug 2016 - Jul 2018 • 2 years',
        description: 'Designed mobile UI applications for Orange R&D department, BNP Paribas, Société générale, Crédit.',
      },
    ],
    education: [
      {
        degree: 'Bachelor European in Graphic Design',
        school: 'School name',
        period: '2008 - 2012, Belgium',
      },
      {
        degree: 'BTS Communication Visuelle option Multimédia',
        school: 'School name',
        period: '2006 - 2008',
      },
    ],
  },
};

const statusConfig = {
  pending: { label: 'Chờ duyệt', color: 'bg-orange-500', progress: 33 },
  approved: { label: 'Đã duyệt', color: 'bg-blue-500', progress: 66 },
  passed: { label: 'Đã đậu', color: 'bg-green-500', progress: 100 },
  rejected: { label: 'Từ chối', color: 'bg-red-500', progress: 100 },
};

export default function ApplicantDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [activeTab, setActiveTab] = useState<'profile' | 'cv'>('profile');
  const [currentStatus, setCurrentStatus] = useState(applicantData.status);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const handleStatusChange = (newStatus: 'pending' | 'approved' | 'passed' | 'rejected') => {
    setCurrentStatus(newStatus);
  };

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
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-5xl mx-auto mb-4">
                  {applicantData.avatar}
                </div>
                <h2 className="text-xl font-bold mb-1">{applicantData.name}</h2>
                <p className="text-gray-600 text-sm mb-4">{applicantData.position}</p>
              </div>

              <div className="space-y-3 mb-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Công việc ứng tuyển</p>
                  <p className="font-medium">{applicantData.jobApplied}</p>
                  <p className="text-sm text-gray-600">{applicantData.department}</p>
                </div>
                <p className="text-sm text-gray-500">{applicantData.appliedDate}</p>
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
                    <p className="text-sm text-gray-900 break-all">{applicantData.contact.email}</p>
                  </div>
                </div>
                <div className="border-t border-gray-200"></div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Số điện thoại</p>
                    <p className="text-sm text-gray-900">{applicantData.contact.phone}</p>
                  </div>
                </div>
                <div className="border-t border-gray-200"></div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Địa chỉ</p>
                    <p className="text-sm text-gray-900 whitespace-pre-line">{applicantData.personalInfo.address}</p>
                  </div>
                </div>
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
                        <p className="font-medium">{applicantData.personalInfo.fullName}</p>
                      </div>
                      <div>
                        <h4 className="text-sm text-gray-500 mb-1">Giới tính</h4>
                        <p className="font-medium">{applicantData.personalInfo.gender}</p>
                      </div>
                      <div>
                        <h4 className="text-sm text-gray-500 mb-1">Ngày sinh</h4>
                        <p className="font-medium">{applicantData.personalInfo.dateOfBirth} ({applicantData.personalInfo.age} tuổi)</p>
                      </div>
                      <div>
                        <h4 className="text-sm text-gray-500 mb-1">Ngôn ngữ</h4>
                        <p className="font-medium">{applicantData.personalInfo.languages}</p>
                      </div>
                      <div className="col-span-2">
                        <h4 className="text-sm text-gray-500 mb-1">Địa chỉ</h4>
                        <p className="font-medium whitespace-pre-line">{applicantData.personalInfo.address}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200"></div>

                  {/* Professional Info */}
                  <div>
                    <h3 className="font-semibold text-lg mb-4">Thông tin nghề nghiệp</h3>
                    
                    {/* About Me */}
                    <div className="mb-6">
                      <h4 className="text-sm text-gray-500 mb-2">Giới thiệu bản thân</h4>
                      <p className="text-gray-700 whitespace-pre-line">{applicantData.aboutMe}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="text-sm text-gray-500 mb-1">Công việc hiện tại</h4>
                        <p className="font-medium">{applicantData.currentJob}</p>
                      </div>
                      <div>
                        <h4 className="text-sm text-gray-500 mb-1">Kinh nghiệm</h4>
                        <p className="font-medium">{applicantData.experience}</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-sm text-gray-500 mb-1">Trình độ học vấn cao nhất</h4>
                      <p className="font-medium">{applicantData.highestQualification}</p>
                    </div>

                    {/* Skills */}
                    <div>
                      <h4 className="text-sm text-gray-500 mb-2">Kỹ năng</h4>
                      <div className="flex flex-wrap gap-2">
                        {applicantData.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'cv' && (
                <div>
                  {applicantData.cvUrl ? (
                    <div className="w-full h-[800px] border border-gray-200 rounded-lg overflow-hidden">
                      <iframe
                        src={applicantData.cvUrl}
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
          applicantName={applicantData.name}
          currentStatus={currentStatus}
          onClose={() => setShowStatusModal(false)}
          onConfirm={handleStatusChange}
        />
      )}
    </div>
  );
}
