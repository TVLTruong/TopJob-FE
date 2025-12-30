'use client';
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Edit } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ConfirmModal from './ConfirmModal';

type BenefitsProps = {
  benefitsText: string; // chuỗi từ DB, phân cách dòng bằng "\\n"
  canEddit?: boolean; // theo yêu cầu (giữ đúng tên prop)
  canEdit?: boolean;  // hỗ trợ thêm để an toàn
  onSave?: (newText: string) => void; // callback khi lưu
};

export default function Benefits({ benefitsText, canEddit, canEdit, onSave }: BenefitsProps) {
  const { user } = useAuth();
  const defaultSample = 'Chế độ bảo hiểm sức khỏe mở rộng\\nNghỉ phép linh hoạt 12 ngày\\nLương tháng 13 và thưởng hiệu suất\\nLàm việc hybrid, hỗ trợ thiết bị\\nTrợ cấp ăn trưa và gửi xe\\nTeam building hàng quý, du lịch năm\\nNgân sách học tập và khóa học online\\nKhám sức khỏe định kỳ\\nGói hỗ trợ sức khỏe tinh thần\\nPhụ cấp điện thoại và Internet';

  const initialText = benefitsText && benefitsText.trim().length > 0 ? benefitsText : defaultSample;

  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText);
  // Convert both literal \n and actual newlines for textarea editing
  const [editingText, setEditingText] = useState(
    initialText.replace(/\\n/g, '\n').replace(/\\\\n/g, '\n')
  );
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Sync editingText when text changes (e.g., after saving or props update)
  useEffect(() => {
    // Handle both literal \n (from JSON) and \\n (escaped)
    setEditingText(text.replace(/\\n/g, '\n').replace(/\\\\n/g, '\n'));
  }, [text]);

  const lines = useMemo(() => {
    // Split by both literal \n and \\n
    return (text || '')
      .split(/\\n|\\\\n/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }, [text]);

  const isRecruiter = user?.role === 'employer';
  const canShowEdit = isRecruiter && Boolean(canEddit || canEdit);

  return (
    <div className="bg-white rounded-xl p-8 mb-3 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Phúc lợi & Đãi ngộ</h2>
      </div>
      <p className="text-gray-600 text-sm mb-6">
        Công việc này đi kèm với nhiều phúc lợi và đãi ngộ hấp dẫn
      </p>
      {lines.length > 0 ? (
        <ul className="list-disc pl-6 space-y-1 text-gray-800">
          {lines.map((line, idx) => (
            <li key={idx}>{line}</li>
          ))}
        </ul>
      ) : (
        <div className="text-gray-500 text-sm">Chưa có phúc lợi nào.</div>
      )}

      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b bg-white flex-shrink-0">
              <h3 className="text-lg font-semibold">Chỉnh sửa phúc lợi</h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Đóng"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6">
              <p className="text-xs text-gray-500 mb-3">
                Mỗi dòng là một phúc lợi. Nhấn Enter để xuống dòng. Khi hiển thị sẽ tự động gạch đầu dòng.
              </p>
              <textarea
                ref={textareaRef}
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[200px] resize-none"
                placeholder={"Nhập mỗi phúc lợi trên một dòng"}
              />
              {/* Preview removed */}
            </div>

            <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 flex-shrink-0">
              <button
                onClick={() => setIsEditing(false)}
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
      <ConfirmModal
        open={isEditing && showConfirm}
        title="Xác nhận lưu thay đổi"
        message="Bạn có muốn lưu các thay đổi phúc lợi này không?"
        onCancel={() => setShowConfirm(false)}
        onConfirm={() => {
          const normalized = editingText
            .replace(/\r/g, '')
            .split('\n')
            .map((s) => s.trim())
            .filter((s) => s.length > 0)
            .join('\\n');
          setText(normalized);
          setShowConfirm(false);
          setShowSuccess(true);
          onSave?.(normalized);
        }}
      />
      {isEditing && showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-lg w-full max-w-md overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-teal-700">Lưu thành công</h3>
            </div>
            <div className="p-6 text-sm text-gray-600">Thay đổi của bạn đã được lưu thành công.</div>
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
    </div>
  );
}