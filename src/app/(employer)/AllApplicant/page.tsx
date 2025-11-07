import React from 'react';
import ApplicantsTab from '@/app/components/job/Applicant';

export default function ApplicantsPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Quản lý ứng viên
          </h1>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button className="border-b-2 border-blue-600 py-3 px-1 text-sm font-medium text-blue-600">
              Tất cả ứng viên
            </button>
            <button className="border-b-2 border-transparent py-3 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 transition">
              Chờ duyệt
            </button>
            <button className="border-b-2 border-transparent py-3 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 transition">
              Đã duyệt
            </button>
            <button className="border-b-2 border-transparent py-3 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 transition">
              Đã đậu
            </button>
            <button className="border-b-2 border-transparent py-3 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 transition">
              Từ chối
            </button>
          </nav>
        </div>
      </div>

      {/* Applicants Table Component */}
      <ApplicantsTab />
    </div>
  );
}