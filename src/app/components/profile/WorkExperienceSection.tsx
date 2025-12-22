"use client";

import type { WorkExperience } from "../../(candidate)/profile/types";
import { EditIcon, EditTextIcon, TrashIcon } from "./Icons";

interface Props {
  workExperience: WorkExperience[];
  openWorkModal: (index?: number | null) => void;
  deleteWork: (index: number) => void;
}

export default function WorkExperienceSection({ workExperience, openWorkModal, deleteWork }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Kinh nghiệm làm việc</h2>
          <p className="text-gray-400 text-sm">Làm nổi bật thông tin chi tiết về lịch sử công việc của bạn</p>
        </div>
        <button
          onClick={() => openWorkModal()}
          className="flex items-center gap-2 px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors flex-shrink-0 ml-4"
        >
          <EditTextIcon />
          <span>Chỉnh sửa</span>
        </button>
      </div>

      {workExperience.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-gray-300">
          <svg className="w-24 h-24 mb-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
          </svg>
          <p className="text-sm">Chưa có thông tin kinh nghiệm làm việc</p>
        </div>
      ) : (
        <div className="space-y-4">
          {workExperience.map((work, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-emerald-300 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{work.jobTitle}</h3>
                  <p className="text-gray-600">{work.company}</p>
                  <p className="text-sm text-gray-500 mt-1">{work.fromMonth}/{work.fromYear} - {work.currentlyWorking ? "Hiện tại" : `${work.toMonth}/${work.toYear}`}</p>
                  {work.description && (
                    <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap">{work.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openWorkModal(index)}
                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="Chỉnh sửa"
                  >
                    <EditIcon />
                  </button>
                  <button
                    onClick={() => deleteWork(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Xóa"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
