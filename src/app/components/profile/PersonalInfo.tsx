"use client";

import type { Profile } from "../../(candidate)/profile/types";
import { CameraIcon, EditTextIcon, EmailIcon, PhoneIcon, CalendarIcon, GenderIcon, LocationIcon, LinkIcon } from "./Icons";

interface Props {
  avatar: string | null;
  // file input refs can be null initially
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleAvatarClick: () => void;
  handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  profile: Profile;
  openBasicInfoModal: () => void;
}

export default function PersonalInfo({ avatar, fileInputRef, handleAvatarClick, handleAvatarChange, profile, openBasicInfoModal }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div
              onClick={handleAvatarClick}
              className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold cursor-pointer hover:bg-blue-700 transition-colors overflow-hidden"
            >
              {avatar ? (
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                profile.name.charAt(0).toUpperCase()
              )}
            </div>
            <div
              onClick={handleAvatarClick}
              className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <CameraIcon />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">{profile.name}</h1>
            <p className="text-gray-400 italic">{profile.title || "Cập nhật chức danh của bạn"}</p>
          </div>
        </div>

        <button
          onClick={openBasicInfoModal}
          className="flex items-center gap-2 px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors flex-shrink-0 ml-4"
          title="Chỉnh sửa thông tin"
        >
          <EditTextIcon />
          <span>Chỉnh sửa</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-3">
          <EmailIcon />
          <span className={profile.email.includes("@") ? "text-gray-600" : "text-gray-400"}>
            {profile.email || "Chưa cập nhật email"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <PhoneIcon />
          <span className="text-gray-400">{profile.phone || "Chưa cập nhật số điện thoại"}</span>
        </div>

        <div className="flex items-center gap-3">
          <CalendarIcon />
          <span className="text-gray-400">{profile.dateOfBirth || "Chưa cập nhật ngày sinh"}</span>
        </div>

        <div className="flex items-center gap-3">
          <GenderIcon />
          <span className="text-gray-400">{profile.gender || "Chưa cập nhật giới tính"}</span>
        </div>

        <div className="flex items-center gap-3">
          <LocationIcon />
          <span className="text-gray-400">{[profile.province, profile.district, profile.address].filter(Boolean).join(", ") || "Chưa cập nhật địa chỉ"}</span>
        </div>

        <div className="flex items-center gap-3">
          <LinkIcon />
          <span className="text-gray-400">{profile.personalLink || "Chưa cập nhật liên kết"}</span>
        </div>
      </div>
    </div>
  );
}
