"use client";

import type { Education } from "../../(candidate)/profile/types";
import { EditIcon, EditTextIcon, TrashIcon } from "./Icons";

interface Props {
  education: Education[];
  openEducationModal: (index?: number | null) => void;
  deleteEducation: (index: number) => void;
}

export default function EducationSection({ education, openEducationModal, deleteEducation }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Học vấn</h2>
          <p className="text-gray-400 text-sm">Chia sẻ lý lịch học vấn của bạn</p>
        </div>
        <button
          onClick={() => openEducationModal()}
          className="flex items-center gap-2 px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors flex-shrink-0 ml-4"
        >
          <EditTextIcon />
          <span>Chỉnh sửa</span>
        </button>
      </div>

      {education.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-gray-300">
          <svg className="w-24 h-24 mb-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
          </svg>
          <p className="text-sm">Chưa có thông tin học vấn</p>
        </div>
      ) : (
        <div className="space-y-4">
          {education.map((edu, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-emerald-300 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{edu.school}</h3>
                  <p className="text-gray-600">{edu.degree} - {edu.major}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {edu.fromMonth}/{edu.fromYear} - {edu.currentlyStudying ? "Hiện tại" : `${edu.toMonth}/${edu.toYear}`}
                  </p>
                  {edu.additionalDetails && (
                    <p className="text-sm text-gray-600 mt-2">{edu.additionalDetails}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEducationModal(index)}
                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="Chỉnh sửa"
                  >
                    <EditIcon />
                  </button>
                  <button
                    onClick={() => deleteEducation(index)}
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
