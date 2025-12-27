'use client';
import React from 'react';
import { X, Plus, Minus } from 'lucide-react';
import Image from 'next/image';

interface EmployerProfile {
  id: number;
  companyName: string;
  companyLogo: string;
  email: string;
  phone: string;
  status: 'pending_new' | 'pending_edit' | 'approved' | 'rejected';
  createdDate: string;
  registrationType?: 'new' | 'edit';
  description?: string;
  address?: string;
  website?: string;
  foundingDate?: string;
  industries?: string[];
  technologies?: string[];
  benefits?: string[];
  contactEmail?: string;
  facebookUrl?: string;
  linkedlnUrl?: string;
  xUrl?: string;
  locations?: Array<{
    id?: string;
    province: string;
    district: string;
    detailedAddress: string;
    isHeadquarters: boolean;
  }>;
  oldData?: Partial<EmployerProfile>;
}

interface EmployerDetailModalProps {
  employer: EmployerProfile;
  onClose: () => void;
}

export default function EmployerDetailModal({ employer, onClose }: EmployerDetailModalProps) {
  const statusConfig = {
    pending_new: { label: 'Chờ duyệt (Mới)', color: 'bg-orange-100 text-orange-600 border-orange-300' },
    pending_edit: { label: 'Chờ duyệt (Sửa đổi)', color: 'bg-yellow-100 text-yellow-600 border-yellow-300' },
    approved: { label: 'Đã duyệt', color: 'bg-green-100 text-green-600 border-green-300' },
    rejected: { label: 'Từ chối', color: 'bg-red-100 text-red-600 border-red-300' },
  };

  const isEditType = employer.registrationType === 'edit';

  const InfoField = ({ label, value, oldValue }: { label: string; value?: string; oldValue?: string }) => {
    const hasChanged = isEditType && oldValue && oldValue !== value;

    if (isEditType && hasChanged) {
      return (
        <div className="space-y-2">
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <Minus className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500">{label} (Cũ)</p>
              <p className="text-sm text-red-700 line-through">{oldValue}</p>
            </div>
          </div>
          <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <Plus className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500">{label} (Mới)</p>
              <p className="text-sm text-green-700 font-medium">{value}</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <p className="text-sm text-gray-600">
        <span className="font-medium">{label}:</span> {value || 'Chưa cập nhật'}
      </p>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Chi tiết hồ sơ Nhà tuyển dụng</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Company Header */}
          <div className="flex items-start gap-4 pb-6 border-b border-gray-200">
            <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
              {employer.companyLogo ? (
                <Image
                  src={employer.companyLogo}
                  alt={employer.companyName}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400"></div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{employer.companyName}</h3>
              <div className="space-y-2">
                <InfoField label="Email" value={employer.email} oldValue={employer.oldData?.email} />
                <InfoField label="Số điện thoại" value={employer.phone} oldValue={employer.oldData?.phone} />
                {employer.website && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Website:</span>{' '}
                    <a 
                      href={employer.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {employer.website}
                    </a>
                  </p>
                )}
                {employer.foundingDate && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Ngày thành lập:</span>{' '}
                    {new Date(employer.foundingDate).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                )}
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Ngày đăng ký:</span> {employer.createdDate}
                </p>
              </div>
            </div>
            <div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                  statusConfig[employer.status].color
                }`}
              >
                {statusConfig[employer.status].label}
              </span>
            </div>
          </div>

          {/* Registration Type */}
          {employer.registrationType && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <span className="font-medium">Loại đăng ký:</span>{' '}
                {employer.registrationType === 'new' ? 'Hồ sơ mới' : 'Chỉnh sửa hồ sơ'}
              </p>
              {employer.registrationType === 'edit' && (
                <p className="text-xs text-blue-700 mt-2">
                  Lưu ý: Đây là hồ sơ chỉnh sửa. Xem các trường được thay đổi bên dưới.
                </p>
              )}
            </div>
          )}

          {/* Company Description */}
          {employer.description && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Giới thiệu công ty</h4>
              {isEditType && employer.oldData?.description && employer.oldData.description !== employer.description ? (
                <div className="space-y-2">
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-xs font-medium text-red-600 mb-2 flex items-center gap-2">
                      <Minus className="w-3 h-3" /> Phiên bản cũ
                    </p>
                    <p className="text-sm text-red-700 line-through">{employer.oldData.description}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-xs font-medium text-green-600 mb-2 flex items-center gap-2">
                      <Plus className="w-3 h-3" /> Phiên bản mới
                    </p>
                    <p className="text-sm text-green-700">{employer.description}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-700 leading-relaxed">{employer.description}</p>
              )}
            </div>
          )}

          {/* Industries */}
          {employer.industries && employer.industries.length > 0 && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Lĩnh vực</h4>
              <div className="flex flex-wrap gap-2">
                {employer.industries.map((industry, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
                  >
                    {industry}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Technologies */}
          {employer.technologies && employer.technologies.length > 0 && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Công nghệ</h4>
              <div className="flex flex-wrap gap-2">
                {employer.technologies.map((tech, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Locations */}
          {employer.locations && employer.locations.length > 0 && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Địa điểm văn phòng</h4>
              <div className="space-y-3">
                {employer.locations.map((location, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <svg className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-gray-600">
                          {location.detailedAddress}, {location.district}, {location.province}
                        </span>
                        {location.isHeadquarters && (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded">
                            Trụ sở chính
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Information */}
          <div className="space-y-4">
            {employer.benefits && employer.benefits.length > 0 && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Phúc lợi</h4>
                <ul className="space-y-2">
                  {employer.benefits.map((benefit, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Contact Information */}
            {(employer.contactEmail || employer.facebookUrl || employer.linkedlnUrl || employer.xUrl) && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Thông tin liên hệ</h4>
                <div className="space-y-2">
                  {employer.contactEmail && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Email:</span>{' '}
                      <a href={`mailto:${employer.contactEmail}`} className="text-blue-600 hover:underline">
                        {employer.contactEmail}
                      </a>
                    </p>
                  )}
                  {employer.facebookUrl && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Facebook:</span>{' '}
                      <a href={employer.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {employer.facebookUrl}
                      </a>
                    </p>
                  )}
                  {employer.linkedlnUrl && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">LinkedIn:</span>{' '}
                      <a href={employer.linkedlnUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {employer.linkedlnUrl}
                      </a>
                    </p>
                  )}
                  {employer.xUrl && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">X (Twitter):</span>{' '}
                      <a href={employer.xUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {employer.xUrl}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            )}
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
