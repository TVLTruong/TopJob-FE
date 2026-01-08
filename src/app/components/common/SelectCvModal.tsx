'use client';
import React, { useEffect, useState } from 'react';
import { X, FileText } from 'lucide-react';
import { CandidateApi, type CandidateCV } from '@/utils/api/candidate-api';

interface SelectCvModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
  onConfirm: (cvId: string) => void;
}

export default function SelectCvModal({ isOpen, onClose, token, onConfirm }: SelectCvModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cvs, setCvs] = useState<CandidateCV[]>([]);
  const [selectedCvId, setSelectedCvId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    let ignore = false;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const list = await CandidateApi.getMyCvs(token);
        if (ignore) return;
        setCvs(list);
        // Preselect default CV if any
        const defaultCv = list.find(cv => cv.isDefault);
        setSelectedCvId(defaultCv?.id || list[0]?.id || null);
      } catch (e: any) {
        if (ignore) return;
        setError(e?.message || 'Không thể tải danh sách CV');
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();
    return () => { ignore = true; };
  }, [isOpen, token]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!selectedCvId) return;
    onConfirm(selectedCvId);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full mx-4 shadow-2xl max-w-lg">
        <div className="p-6 border-b flex items-start justify-between">
          <h3 className="text-xl font-bold text-gray-900">Chọn CV để ứng tuyển</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Đóng">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {loading && (
            <div className="flex items-center gap-3 text-gray-600">
              <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-600"></div>
              Đang tải CV...
            </div>
          )}

          {error && (
            <p className="text-red-600 mb-4">{error}</p>
          )}

          {!loading && !error && cvs.length === 0 && (
            <div className="text-gray-700">
              <p className="mb-2">Bạn chưa có CV nào.</p>
              <p className="mb-4">Vui lòng thêm CV ở trang Hồ sơ để tiếp tục.</p>
              <a href="/cv" className="text-emerald-600 hover:underline">Đi tới trang CV</a>
            </div>
          )}

          {!loading && cvs.length > 0 && (
            <div className="space-y-3">
              {cvs.map(cv => (
                <label key={cv.id} className={`flex items-center gap-3 border rounded-lg p-3 cursor-pointer ${selectedCvId === cv.id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'}`}>
                  <input
                    type="radio"
                    name="selectedCv"
                    value={cv.id}
                    checked={selectedCvId === cv.id}
                    onChange={() => setSelectedCvId(cv.id)}
                    className="accent-emerald-600"
                  />
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {cv.fileName} {cv.isDefault && <span className="ml-2 text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700">Mặc định</span>}
                      </div>
                      <div className="text-sm text-gray-600">
                        Tải lên: {new Date(cv.uploadedAt).toLocaleDateString('vi-VN')} • Kích thước: {(cv.fileSize / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">Hủy</button>
          <button
            onClick={handleConfirm}
            disabled={!selectedCvId}
            className={`px-4 py-2 rounded-lg text-white font-medium ${selectedCvId ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-gray-300 cursor-not-allowed'}`}
          >
            Ứng tuyển bằng CV này
          </button>
        </div>
      </div>
    </div>
  );
}
