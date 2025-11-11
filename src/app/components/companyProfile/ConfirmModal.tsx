"use client";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title = "Xác nhận",
  message = "",
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  useEffect(() => {
    if (open) {
      // Lấy width của scrollbar để bù vào padding-right
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      // Lưu scroll position hiện tại
      const scrollY = window.scrollY;

      // Thêm padding-right để tránh layout shift
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      // Khóa scroll nhưng giữ nguyên position
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      return () => {
        // Restore scroll khi đóng modal
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.paddingRight = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [open]);

  if (!open) return null;

  // Use React Portal to render modal outside the current DOM hierarchy
  const modalContent = (
    <div className="fixed inset-0 z-[999999]" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Modal container */}
      <div 
        className="fixed inset-0 flex items-center justify-center p-4"
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
      >
        {/* Modal content */}
        <div 
          className="relative bg-white rounded-lg shadow-2xl w-full max-w-md mx-auto animate-in fade-in zoom-in duration-200"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Close button (X) */}
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
            aria-label="Đóng"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6">
            <h2 id="modal-title" className="text-lg font-semibold mb-2 pr-8">{title}</h2>
            {message && <p className="text-gray-600 mb-6">{message}</p>}
            <div className="flex justify-end gap-3">
              <button
                onClick={onCancel}
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render modal using React Portal directly to document.body
  return typeof document !== 'undefined' 
    ? createPortal(modalContent, document.body)
    : null;
}