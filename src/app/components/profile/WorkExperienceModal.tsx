"use client";

import { CloseIcon } from "./Icons";

interface WorkExperience {
  jobTitle: string;
  company: string;
  fromMonth: string;
  fromYear: string;
  toMonth: string;
  toYear: string;
  currentlyWorking: boolean;
  description: string;
}

interface WorkExperienceModalProps {
  isOpen: boolean;
  workExperience: WorkExperience;
  onClose: () => void;
  onSave: () => void;
  onChange: (workExperience: WorkExperience) => void;
}

export default function WorkExperienceModal({ 
  isOpen, 
  workExperience, 
  onClose, 
  onSave, 
  onChange 
}: WorkExperienceModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Kinh nghiệm làm việc</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* Job Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chức danh <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={workExperience.jobTitle}
              onChange={(e) => onChange({ ...workExperience, jobTitle: e.target.value })}
              placeholder="Chức danh"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Công ty <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={workExperience.company}
              onChange={(e) => onChange({ ...workExperience, company: e.target.value })}
              placeholder="Công ty"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Currently Working Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="currentlyWorking"
              checked={workExperience.currentlyWorking}
              onChange={(e) => onChange({ ...workExperience, currentlyWorking: e.target.checked })}
              className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
            />
            <label htmlFor="currentlyWorking" className="text-sm text-gray-700">
              Tôi đang làm việc tại đây
            </label>
          </div>

          {/* From and To Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Từ <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={workExperience.fromMonth}
                  onChange={(e) => onChange({ ...workExperience, fromMonth: e.target.value })}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Tháng</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
                <select
                  value={workExperience.fromYear}
                  onChange={(e) => onChange({ ...workExperience, fromYear: e.target.value })}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Năm</option>
                  {Array.from({ length: 50 }, (_, i) => (
                    <option key={2025 - i} value={2025 - i}>{2025 - i}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Đến <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={workExperience.toMonth}
                  onChange={(e) => onChange({ ...workExperience, toMonth: e.target.value })}
                  disabled={workExperience.currentlyWorking}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-100"
                >
                  <option value="">Tháng</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
                <select
                  value={workExperience.toYear}
                  onChange={(e) => onChange({ ...workExperience, toYear: e.target.value })}
                  disabled={workExperience.currentlyWorking}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-100"
                >
                  <option value="">Năm</option>
                  {Array.from({ length: 50 }, (_, i) => (
                    <option key={2025 - i} value={2025 - i}>{2025 - i}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <div className="mb-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                  💡
                </div>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Gợi ý:</span> Mô tả ngắn gọn về ngành nghề của công ty, sau đó chi tiết về trách nhiệm và thành tích của bạn. Đối với dự án, hãy viết vào trường &quot;Dự án&quot; bên dưới.
                </p>
              </div>
            </div>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-300 px-3 py-2 flex gap-2">
                <button className="p-1 hover:bg-gray-200 rounded" title="Bold">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
                  </svg>
                </button>
                <button className="p-1 hover:bg-gray-200 rounded" title="Italic">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 4h4M10 20h4M14 4L10 20" />
                  </svg>
                </button>
                <button className="p-1 hover:bg-gray-200 rounded" title="Underline">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v8a5 5 0 0010 0V4M5 20h14" />
                  </svg>
                </button>
                <button className="p-1 hover:bg-gray-200 rounded" title="List">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
              <textarea
                value={workExperience.description}
                onChange={(e) => onChange({ ...workExperience, description: e.target.value })}
                className="w-full px-4 py-3 focus:outline-none resize-none"
                rows={8}
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onSave}
            className="px-6 py-2 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}