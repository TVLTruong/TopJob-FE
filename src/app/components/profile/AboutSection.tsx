"use client";

import type { Profile } from "../../(candidate)/profile/types";
import { EditTextIcon } from "./Icons";

interface Props {
  profile: Profile;
  editingAbout: boolean;
  // accept flexible section identifier (keeps compatibility with page.tsx's narrower literal type)
  toggleEdit: (section: string) => void;
  updateProfile: (field: string, value: string) => void;
  saveAbout: () => void;
}

export default function AboutSection({ profile, editingAbout, toggleEdit, updateProfile, saveAbout }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Giới thiệu bản thân</h2>
          <p className="text-gray-400 text-sm">Giới thiệu điểm mạnh và số năm kinh nghiệm của bạn</p>
        </div>
        <button
          onClick={() => toggleEdit("about")}
          className="flex items-center gap-2 px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors flex-shrink-0 ml-4"
        >
          <EditTextIcon />
          <span>Chỉnh sửa</span>
        </button>
      </div>

      {editingAbout ? (
        <textarea
          value={profile.about}
          onChange={(e) => updateProfile("about", e.target.value)}
          placeholder="Nhập thông tin giới thiệu về bản thân..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
          rows={6}
        />
      ) : !profile.about ? (
        <div className="flex flex-col items-center justify-center py-8 text-gray-300">
          <svg className="w-24 h-24 mb-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          <p className="text-sm">Chưa có thông tin giới thiệu</p>
        </div>
      ) : (
        <p className="text-gray-700 whitespace-pre-wrap">{profile.about}</p>
      )}

      {editingAbout && (
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={() => toggleEdit("about")}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={saveAbout}
            className="px-4 py-2 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Lưu
          </button>
        </div>
      )}
    </div>
  );
}
