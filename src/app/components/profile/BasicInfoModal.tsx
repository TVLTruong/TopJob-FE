"use client";

import { CloseIcon } from "./Icons";
import { useState, useEffect } from "react";
import locationData from "@/app/assets/danh-sach-3321-xa-phuong.json";

interface LocationItem {
  "Tên": string;
  "Cấp": string;
  "Tỉnh / Thành Phố": string;
}

interface BasicInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  province: string;
  district: string;
  address: string;
  personalLink: string;
}

interface BasicInfoModalProps {
  isOpen: boolean;
  basicInfo: BasicInfo;
  onClose: () => void;
  onSave: () => void;
  onChange: (info: BasicInfo) => void;
}

export default function BasicInfoModal({ 
  isOpen, 
  basicInfo, 
  onClose, 
  onSave, 
  onChange 
}: BasicInfoModalProps) {
  const [provinces, setProvinces] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);

  // Load provinces once on mount
  useEffect(() => {
    const data = locationData as LocationItem[];
    const provinceSet = new Set<string>();
    data.forEach((item) => {
      if (item["Tỉnh / Thành Phố"]) {
        provinceSet.add(item["Tỉnh / Thành Phố"]);
      }
    });
    setProvinces(Array.from(provinceSet).sort());
  }, []);

  // Load districts when province changes
  useEffect(() => {
    if (!basicInfo.province) {
      setDistricts([]);
      return;
    }

    const data = locationData as LocationItem[];
    const list = data
      .filter((item) => item["Tỉnh / Thành Phố"] === basicInfo.province)
      .map((item) => item["Tên"])
      .sort();

    setDistricts(list);
  }, [basicInfo.province]);

  // Handle province change
  const handleProvinceChange = (newProvince: string) => {
    onChange({ 
      ...basicInfo, 
      province: newProvince, 
      district: "" // Reset district when province changes
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Thông tin cá nhân</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Họ và tên
            </label>
            <input
              type="text"
              value={basicInfo.name}
              onChange={(e) => onChange({ ...basicInfo, name: e.target.value })}
              placeholder="Họ và tên"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chức danh
            </label>
            <input
              type="text"
              value={basicInfo.title}
              onChange={(e) => onChange({ ...basicInfo, title: e.target.value })}
              placeholder="Chức danh của bạn"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Email and Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={basicInfo.email}
                onChange={(e) => onChange({ ...basicInfo, email: e.target.value })}
                placeholder="Email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại
              </label>
              <input
                type="tel"
                value={basicInfo.phone}
                onChange={(e) => onChange({ ...basicInfo, phone: e.target.value })}
                placeholder="Số điện thoại"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Date of Birth and Gender */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày sinh <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={basicInfo.dateOfBirth}
                onChange={(e) => onChange({ ...basicInfo, dateOfBirth: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giới tính <span className="text-red-500">*</span>
              </label>
              <select
                value={basicInfo.gender}
                onChange={(e) => onChange({ ...basicInfo, gender: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              >
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
          </div>

          {/* Address - Province and District */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tỉnh/Thành phố
              </label>
              <select
                value={basicInfo.province}
                onChange={(e) => handleProvinceChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%23666' d='M8 11L3 6h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  color: basicInfo.province === "" ? '#9CA3AF' : '#111827'
                }}
              >
                <option value="">Chọn tỉnh/thành phố</option>
                {provinces.map((prov) => (
                  <option key={prov} value={prov}>
                    {prov}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phường/Xã
              </label>
              <select
                value={basicInfo.district}
                onChange={(e) => onChange({ ...basicInfo, district: e.target.value })}
                disabled={!basicInfo.province}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%23666' d='M8 11L3 6h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  color: basicInfo.district === "" ? '#9CA3AF' : '#111827'
                }}
              >
                <option value="">Chọn phường/xã</option>
                {districts.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Detailed Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ chi tiết
            </label>
            <input
              type="text"
              value={basicInfo.address}
              onChange={(e) => onChange({ ...basicInfo, address: e.target.value })}
              placeholder="Số nhà, tên đường..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Personal Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Liên kết cá nhân
            </label>
            <input
              type="url"
              value={basicInfo.personalLink}
              onChange={(e) => onChange({ ...basicInfo, personalLink: e.target.value })}
              placeholder="https://..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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