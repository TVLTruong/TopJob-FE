"use client";

import { CloseIcon } from "./Icons";

interface Education {
  school: string;
  degree: string;
  major: string;
  fromMonth: string;
  fromYear: string;
  toMonth: string;
  toYear: string;
  currentlyStudying: boolean;
  additionalDetails: string;
}

interface EducationModalProps {
  isOpen: boolean;
  education: Education;
  onClose: () => void;
  onSave: () => void;
  onChange: (education: Education) => void;
}

export default function EducationModal({ 
  isOpen, 
  education, 
  onClose, 
  onSave, 
  onChange 
}: EducationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Học vấn</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* School */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trường học <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={education.school}
              onChange={(e) => onChange({ ...education, school: e.target.value })}
              placeholder="Trường học"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Degree and Major */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bằng cấp <span className="text-red-500">*</span>
              </label>
              <select
                value={education.degree}
                onChange={(e) => onChange({ ...education, degree: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Bằng cấp</option>
                <option value="Trung học">Trung học</option>
                <option value="Trung cấp">Trung cấp</option>
                <option value="Cao đẳng">Cao đẳng</option>
                <option value="Đại học">Đại học</option>
                <option value="Thạc sĩ">Thạc sĩ</option>
                <option value="Tiến sĩ">Tiến sĩ</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chuyên ngành <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={education.major}
                onChange={(e) => onChange({ ...education, major: e.target.value })}
                placeholder="Chuyên ngành"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Currently Studying Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="currentlyStudying"
              checked={education.currentlyStudying}
              onChange={(e) => onChange({ ...education, currentlyStudying: e.target.checked })}
              className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
            />
            <label htmlFor="currentlyStudying" className="text-sm text-gray-700">
              Tôi đang học tại đây
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
                  value={education.fromMonth}
                  onChange={(e) => onChange({ ...education, fromMonth: e.target.value })}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Tháng</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
                <select
                  value={education.fromYear}
                  onChange={(e) => onChange({ ...education, fromYear: e.target.value })}
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
                  value={education.toMonth}
                  onChange={(e) => onChange({ ...education, toMonth: e.target.value })}
                  disabled={education.currentlyStudying}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-100"
                >
                  <option value="">Tháng</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
                <select
                  value={education.toYear}
                  onChange={(e) => onChange({ ...education, toYear: e.target.value })}
                  disabled={education.currentlyStudying}
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

          {/* Additional Details */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chi tiết bổ sung
            </label>
            <textarea
              value={education.additionalDetails}
              onChange={(e) => onChange({ ...education, additionalDetails: e.target.value })}
              placeholder="Chi tiết bổ sung"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              rows={4}
            />
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