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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Chi tiết tin tuyển dụng</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Job Header */}
          <div className="pb-6 border-b border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{job.jobTitle}</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Công ty</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{job.companyName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Mức lương</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{job.salary}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Cấp độ</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{job.level}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Ngày đăng</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{job.createdDate}</p>
              </div>
            </div>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                statusConfig[job.status].color
              }`}
            >
              {statusConfig[job.status].label}
            </span>
          </div>

          {/* Job Description */}
          {job.description && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Mô tả công việc</h4>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-700 leading-relaxed">{job.description}</p>
              </div>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Yêu cầu</h4>
              <div className="space-y-2">
                {job.requirements.map((req, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm text-gray-700">{req}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Loại hình công việc</h4>
              <p className="text-sm text-gray-600">Full-time</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Địa điểm làm việc</h4>
              <p className="text-sm text-gray-600">TP.HCM</p>
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
