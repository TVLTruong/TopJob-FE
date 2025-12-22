'use client';
import React from 'react';
import { X, CheckCircle } from 'lucide-react';

interface ApproveModalProps {
  onClose: () => void;
  onConfirm: () => void;
  employerName: string;
}

export default function ApproveModal({ onClose, onConfirm, employerName }: ApproveModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Xác nhận duyệt</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Bạn có chắc chắn muốn duyệt hồ sơ của <span className="font-semibold">{employerName}</span>?
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Nhà tuyển dụng sẽ nhận được email thông báo về quyết định này.
          </p>
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
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium text-white transition"
          >
            Duyệt
          </button>
        </div>
      </div>
    </div>
  );
}
