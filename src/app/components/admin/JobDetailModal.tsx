'use client';
import React from 'react';
import { X } from 'lucide-react';

interface JobPosting {
  id: number;
  jobTitle: string;
  companyName: string;
  salary: string;
  level: string;
  status: 'pending' | 'approved' | 'rejected';
  createdDate: string;
  description?: string;
  requirements?: string[];
  responsibilities?: string[];
  plusPoints?: string[];
  benefits?: string[];
  employmentType?: string;
  workMode?: string;
  location?: string;
  locationAddress?: string;
  quantity?: number;
  applicantsCount?: number;
  expiredAt?: string;
  publishedAt?: string;
  experienceYearsMin?: number;
  categories?: string[];
  technologies?: string[];
  viewCount?: number;
  saveCount?: number;
  isHot?: boolean;
  isUrgent?: boolean;
}

interface JobDetailModalProps {
  job: JobPosting;
  onClose: () => void;
}

export default function JobDetailModal({ job, onClose }: JobDetailModalProps) {
  const statusConfig = {
    pending: { label: 'Chờ duyệt', color: 'bg-orange-100 text-orange-600 border-orange-300' },
    approved: { label: 'Đã duyệt', color: 'bg-green-100 text-green-600 border-green-300' },
    rejected: { label: 'Từ chối', color: 'bg-red-100 text-red-600 border-red-300' },
  };

  const progress = job.quantity && job.applicantsCount 
    ? (job.applicantsCount / job.quantity) * 100 
    : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-900">Chi tiết tin tuyển dụng</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - Left Side */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job Header */}
              <div className="pb-6 border-b border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">{job.jobTitle}</h3>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                      statusConfig[job.status].color
                    }`}
                  >
                    {statusConfig[job.status].label}
                  </span>
                </div>
                <p className="text-gray-600 font-medium">{job.companyName}</p>
              </div>

              {/* Job Description */}
              {job.description && (
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">Mô tả công việc</h4>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-700 leading-relaxed">{job.description}</p>
                  </div>
                </div>
              )}

              {/* Responsibilities */}
              {job.responsibilities && job.responsibilities.length > 0 && (
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">Trách nhiệm</h4>
                  <div className="space-y-2">
                    {job.responsibilities.map((resp, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <span className="text-teal-600 mt-0.5 flex-shrink-0">✓</span>
                        <span className="text-sm text-gray-700">{resp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Requirements */}
              {job.requirements && job.requirements.length > 0 && (
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">Yêu cầu</h4>
                  <div className="space-y-2">
                    {job.requirements.map((req, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <span className="text-teal-600 mt-0.5 flex-shrink-0">✓</span>
                        <span className="text-sm text-gray-700">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Plus Points */}
              {job.plusPoints && job.plusPoints.length > 0 && (
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">Điểm cộng nếu có</h4>
                  <div className="space-y-2">
                    {job.plusPoints.map((point, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <span className="text-teal-600 mt-0.5 flex-shrink-0">✓</span>
                        <span className="text-sm text-gray-700">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Benefits */}
              {job.benefits && job.benefits.length > 0 && (
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">Quyền lợi</h4>
                  <div className="space-y-2">
                    {job.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <span className="text-teal-600 mt-0.5 flex-shrink-0">✓</span>
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Right Side */}
            <div className="space-y-6">
              {/* Job Info Card */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Thông tin công việc</h4>
                
                {/* Progress Bar
                {job.quantity && job.applicantsCount !== undefined && (
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">{job.applicantsCount} ứng viên</span>
                      <span className="text-gray-900 font-medium">/ {job.quantity} chỉ tiêu</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all" 
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )} */}
                
                <div className="space-y-4">
                  {job.expiredAt && (
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600 text-sm">Hạn chót</span>
                      <span className="text-gray-900 text-sm font-medium">{job.expiredAt}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-start">
                    <span className="text-gray-600 text-sm">Ngày đăng</span>
                    <span className="text-gray-900 text-sm font-medium">{job.createdDate}</span>
                  </div>
                  {job.publishedAt && (
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600 text-sm">Ngày duyệt</span>
                      <span className="text-gray-900 text-sm font-medium">{job.publishedAt}</span>
                    </div>
                  )}
                  {job.employmentType && (
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600 text-sm">Loại công việc</span>
                      <span className="text-gray-900 text-sm font-medium">{job.employmentType}</span>
                    </div>
                  )}
                  {job.workMode && (
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600 text-sm">Hình thức làm việc</span>
                      <span className="text-gray-900 text-sm font-medium">{job.workMode}</span>
                    </div>
                  )}
                  {job.location && (
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600 text-sm">Địa điểm</span>
                      <span className="text-gray-900 text-sm font-medium text-right">{job.location}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-start">
                    <span className="text-gray-600 text-sm">Mức lương</span>
                    <span className="text-gray-900 text-sm font-medium">{job.salary}</span>
                  </div>
                  {job.experienceYearsMin !== undefined && (
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600 text-sm">Kinh nghiệm tối thiểu</span>
                      <span className="text-gray-900 text-sm font-medium">
                        {job.experienceYearsMin === 0 ? "Không yêu cầu" : `${job.experienceYearsMin} năm`}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-start">
                    <span className="text-gray-600 text-sm">Cấp độ</span>
                    <span className="text-gray-900 text-sm font-medium">{job.level}</span>
                  </div>
                </div>
              </div>

              {/* Categories Card */}
              {job.categories && job.categories.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Danh mục</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.categories.map((category, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Technologies Card */}
              {job.technologies && job.technologies.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Công nghệ</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.technologies.map((technology, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium"
                      >
                        {technology}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
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
