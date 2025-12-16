'use client';
import React, { useState } from 'react';
import { Edit, X } from 'lucide-react';
import ConfirmModal from './ConfirmModal';
import { useAuth } from '@/contexts/AuthContext';

type ContactLink = {
  url: string;
  logoUrl: string;
};

type ContactData = {
  x: ContactLink;
  facebook: ContactLink;
  linkedin: ContactLink;
  email: ContactLink;
};

type ContactProps = {
  canEdit?: boolean;
  onSave?: (data: ContactData) => void;
};

export default function Contact({ canEdit = false, onSave }: ContactProps) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [contactData, setContactData] = useState<ContactData>({
    x: { url: 'https://twitter.com/vngcorporation', logoUrl: '' },
    facebook: { url: 'https://facebook.com/VNGCorporation', logoUrl: '' },
    linkedin: { url: 'https://linkedin.com/company/vng', logoUrl: '' },
    email: { url: '', logoUrl: '' },
  });
  const [editingData, setEditingData] = useState<ContactData>(contactData);

  const handleSave = () => {
    setContactData(editingData);
    setShowConfirm(false);
    setShowSuccess(true);
    onSave?.(editingData);
  };

  const handleCancel = () => {
    setEditingData(contactData);
    setIsEditing(false);
  };

  const updateLink = (key: keyof ContactData, field: 'url' | 'logoUrl', value: string) => {
    setEditingData({
      ...editingData,
      [key]: {
        ...editingData[key],
        [field]: value,
      },
    });
  };

  const getDisplayName = (key: keyof ContactData) => {
    const names: Record<keyof ContactData, string> = {
      x: 'X (Twitter)',
      facebook: 'Facebook',
      linkedin: 'LinkedIn',
      email: 'Email',
    };
    return names[key];
  };

  const getIcon = (key: keyof ContactData) => {
    if (key === 'x') return '𝕏';
    if (key === 'facebook') return 'f';
    if (key === 'linkedin') return 'in';
    if (key === 'email') return '✉';
    return '';
  };

  const formatUrl = (url: string) => {
    if (!url) return '';
    try {
      const urlObj = new URL(url);
      return urlObj.hostname + urlObj.pathname;
    } catch {
      return url;
    }
  };

  const visibleLinks = Object.entries(contactData).filter(
    ([_, link]) => link.url && link.url.trim().length > 0
  ) as Array<[keyof ContactData, ContactLink]>;
  
  const isRecruiter = user?.role === 'EMPLOYER';
  const canShowEdit = isRecruiter && canEdit;

  return (
    <>
      <div className="bg-white rounded-xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Liên hệ</h2>
          {canShowEdit  && (
            <button
              onClick={() => {
                setEditingData(contactData);
                setIsEditing(true);
              }}
              className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 inline-flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Chỉnh sửa
            </button>
          )}
        </div>
        {visibleLinks.length > 0 ? (
          <div className="space-y-3">
            {visibleLinks.map(([key, link]) => (
              <a
                key={key}
                href={key === 'email' ? `mailto:${link.url}` : link.url}
                className="flex items-center gap-3 text-gray-700 hover:text-teal-600 transition"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  {link.logoUrl ? (
                    <img src={link.logoUrl} alt={getDisplayName(key)} className="w-8 h-8 object-contain" />
                  ) : (
                    <span className="text-blue-600 font-bold">{getIcon(key)}</span>
                  )}
                </div>
                <span className="text-sm truncate">{formatUrl(link.url)}</span>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-sm">Chưa có thông tin liên hệ.</div>
        )}
      </div>

      {/* Edit Popup */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b bg-white flex-shrink-0">
              <h3 className="text-lg font-semibold">Chỉnh sửa liên hệ</h3>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Đóng"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6">
              <p className="text-xs text-gray-500 mb-4">
                Chỉ chỉnh sửa link. Giao diện giống hiển thị bên ngoài, các trường trống sẽ không được hiển thị.
              </p>

              <div className="space-y-3">
                {(['x', 'facebook', 'linkedin', 'email'] as Array<keyof ContactData>).map((key) => (
                  <div key={key} className="flex items-center gap-3 text-gray-700">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold">{getIcon(key)}</span>
                    </div>
                    <div className="flex-1">
                      <input
                        type={key === 'email' ? 'email' : 'url'}
                        value={editingData[key].url}
                        onChange={(e) => updateLink(key, 'url', e.target.value)}
                        placeholder={key === 'email' ? 'example@company.com' : 'https://...'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                        style={{ overflowX: 'auto', minWidth: 0 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 flex-shrink-0">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition text-sm"
              >
                Hủy
              </button>
              <button
                onClick={() => setShowConfirm(true)}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-sm"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        open={isEditing && showConfirm}
        title="Xác nhận lưu thay đổi"
        message="Bạn có muốn lưu các thay đổi liên hệ này không?"
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleSave}
      />

      {isEditing && showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-lg w-full max-w-md overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-teal-700">Lưu thành công</h3>
            </div>
            <div className="p-6 text-sm text-gray-600">Thay đổi liên hệ đã được lưu.</div>
            <div className="p-6 border-t flex justify-end">
              <button
                onClick={() => {
                  setShowSuccess(false);
                  setIsEditing(false);
                }}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
