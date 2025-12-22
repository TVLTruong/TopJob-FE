'use client';
import React, { useState } from 'react';
import { X } from 'lucide-react';

interface RejectModalProps {
  onClose: () => void;
  onConfirm: (reason: string) => void;
  employerName: string;
}

const rejectReasons = [
  'Logo không rõ nét',
  'Thông tin công ty không xác thực',
  'Mã số thuế không hợp lệ',
  'Thông tin liên hệ không chính xác',
  'Giới thiệu công ty không phù hợp',
  'Khác'
];

export default function RejectModal({ onClose, onConfirm, employerName }: RejectModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [customReason, setCustomReason] = useState<string>('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleConfirm = () => {
    const reason = selectedReason === 'Khác' ? customReason : selectedReason;
    if (reason.trim()) {
      setShowConfirmation(true);
    }
  };

  const handleFinalConfirm = () => {
    const reason = selectedReason === 'Khác' ? customReason : selectedReason;
    onConfirm(reason);
  };

  const isConfirmDisabled = !selectedReason || (selectedReason === 'Khác' && !customReason.trim());

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {!showConfirmation ? (
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Từ chối hồ sơ</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-4">
              Bạn đang từ chối hồ sơ của <span className="font-semibold">{employerName}</span>
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Lý do từ chối:
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {rejectReasons.map((reason) => (
                  <label
                    key={reason}
                    className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition"
                  >
                    <input
                      type="radio"
                      name="reject-reason"
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 cursor-pointer"
                    />
                    <span className="ml-3 text-sm text-gray-700">{reason}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Custom Reason Input */}
            {selectedReason === 'Khác' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nhập lý do khác:
                </label>
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Nhập chi tiết lý do từ chối..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              Hủy
            </button>
            <button
              onClick={handleConfirm}
              disabled={isConfirmDisabled}
              className={`flex-1 px-4 py-3 rounded-lg font-medium text-white transition ${
                isConfirmDisabled
                  ? 'bg-red-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              Tiếp theo
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
          {/* Confirmation Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Xác nhận từ chối</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Confirmation Body */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-3">
              Bạn có chắc chắn muốn từ chối hồ sơ của <span className="font-semibold">{employerName}</span>?
            </p>
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-xs font-medium text-red-600 mb-1">Lý do:</p>
              <p className="text-sm text-red-700">
                {selectedReason === 'Khác' ? customReason : selectedReason}
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Nhà tuyển dụng sẽ nhận được email thông báo về quyết định này.
            </p>
          </div>

          {/* Confirmation Footer */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowConfirmation(false)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              Quay lại
            </button>
            <button
              onClick={handleFinalConfirm}
              className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium text-white transition"
            >
              Xác nhận từ chối
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
