'use client';
import React, { useState } from 'react';
import JobDetailContent from '@/app/components/job/JobDetailContents';
import { ChevronDown, Power, Edit, Eye, EyeOff, Trash2 } from 'lucide-react';

export default function JobDetailPage() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const handleToggleHidden = () => {
    setIsHidden(!isHidden);
    setIsDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <button className="text-gray-700 hover:text-gray-900 text-2xl font-bold">
                ←
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Social Media Assistant</h1>
                <p className="text-gray-600 text-sm">
                  Fresher • Full-Time
                </p>
              </div>
            </div>
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <span className="text-sm">Tùy chọn khác</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                    <Power className="w-4 h-4" />
                    <span>Kết thúc</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    <span>Chỉnh sửa</span>
                  </button>
                  <button 
                    onClick={handleToggleHidden}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    {isHidden ? (
                      <>
                        <Eye className="w-4 h-4" />
                        <span>Hủy ẩn</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-4 h-4" />
                        <span>Ẩn</span>
                      </>
                    )}
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600">
                    <Trash2 className="w-4 h-4" />
                    <span>Xóa</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 border-b">
            <button className="pb-3 border-b-2 border-blue-600 text-blue-600 font-medium">
              Chi tiết công việc
            </button>
            <button className="pb-3 text-gray-600 hover:text-gray-900">
              Ứng viên
            </button>
          </div>
        </div>

        {/* Job Detail Content */}
        <JobDetailContent />
      </div>
    </div>
  );
}