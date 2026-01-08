'use client';
import React from 'react';
import { X, Sparkles } from 'lucide-react';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export default function ComingSoonModal({ isOpen, onClose, title = 'Tính năng sắp ra mắt', message = 'Trang này chưa được triển khai. Vui lòng quay lại sau hoặc khám phá các trang hiện có.' }: ComingSoonModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Đóng">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">Đóng</button>
        </div>
      </div>
    </div>
  );
}
