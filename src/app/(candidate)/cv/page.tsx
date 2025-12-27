"use client";

import { useState, useRef, DragEvent, ChangeEvent, useEffect } from "react";
import { CandidateApi } from "@/utils/api/candidate-api";
import type { CandidateCV } from "@/utils/api/candidate-api";
import Toast from "@/app/components/profile/Toast";

// Icons
const UploadIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const FileIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const StarIcon = ({ filled }: { filled?: boolean }) => (
  <svg 
    className={`w-5 h-5 ${filled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} 
    fill={filled ? "currentColor" : "none"} 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function CVManagementPage() {
  const [cvList, setCvList] = useState<CandidateCV[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  // Show toast helper
  const showToast = (message: string, type: 'error' | 'success' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Load CVs on mount
  useEffect(() => {
    loadCVs();
  }, []);

  const loadCVs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token) {
        showToast('Vui lòng đăng nhập để xem CV', 'error');
        return;
      }
      const cvs = await CandidateApi.getMyCvs(token);
      setCvList(cvs);
    } catch (error) {
      console.error('Error loading CVs:', error);
      showToast('Không thể tải danh sách CV', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList | File[] | null) => {
    if (!files || uploading) return;
    
    Array.from(files).forEach(async (file: File) => {
      // Chỉ chấp nhận PDF
      if (file.type !== 'application/pdf') {
        showToast('Chỉ chấp nhận file PDF', 'error');
        return;
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB
        showToast('File không được vượt quá 10MB', 'error');
        return;
      }

      try {
        setUploading(true);
        const token = localStorage.getItem('accessToken');
        if (!token) {
          showToast('Vui lòng đăng nhập để upload CV', 'error');
          return;
        }

        // Step 1: Upload file to storage
        const formData = new FormData();
        formData.append('file', file);

        const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/upload/candidate-cv`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Upload file thất bại');
        }

        const uploadData = await uploadResponse.json();
        
        // Step 2: Save CV metadata to profile
        await CandidateApi.uploadCv(token, {
          fileName: file.name.replace('.pdf', ''),
          fileUrl: uploadData.url,
          fileSize: file.size,
        });

        // Reload CVs
        await loadCVs();
        showToast('Upload CV thành công', 'success');
      } catch (error) {
        console.error('Error uploading CV:', error);
        showToast('Không thể upload CV', 'error');
      } finally {
        setUploading(false);
      }
    });
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleDownloadCV = async (cvId: string, fileName: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('Vui lòng đăng nhập để tải CV');
        return;
      }
      
      await CandidateApi.downloadCv(token, cvId, fileName);
      
    } catch (error) {
      console.error('Download failed:', error);
      alert('Không thể tải xuống CV');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa CV này?')) return;

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        showToast('Vui lòng đăng nhập để xóa CV', 'error');
        return;
      }

      await CandidateApi.deleteCv(token, id);
      await loadCVs();
      showToast('Xóa CV thành công', 'success');
    } catch (error) {
      console.error('Error deleting CV:', error);
      showToast('Không thể xóa CV', 'error');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        showToast('Vui lòng đăng nhập', 'error');
        return;
      }

      await CandidateApi.setDefaultCv(token, id);
      await loadCVs();
      showToast('Đặt CV mặc định thành công', 'success');
    } catch (error) {
      console.error('Error setting default CV:', error);
      showToast('Không thể đặt CV mặc định', 'error');
    }
  };

  const startEditing = (cv: CandidateCV) => {
    setEditingId(cv.id);
    setEditingName(cv.fileName);
  };

  const saveEdit = (id: string) => {
    // TODO: Implement update CV name API endpoint
    setCvList(prev => prev.map(cv => 
      cv.id === id ? { ...cv, fileName: editingName } : cv
    ));
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          <p className="mt-4 text-gray-600">Đang tải danh sách CV...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {uploading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <span className="text-gray-700">Đang upload CV...</span>
          </div>
        </div>
      )}
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý CV</h1>
          <p className="text-gray-600">Upload và quản lý các CV của bạn</p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Upload CV mới</h2>
          
          <div
            className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
              dragActive ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 hover:border-emerald-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf"
              onChange={handleChange}
              className="hidden"
              disabled={uploading}
            />
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <UploadIcon />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Kéo thả file vào đây hoặc
              </h3>
              
              <button
                onClick={onButtonClick}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium mb-4"
              >
                Chọn file từ máy tính
              </button>
              
              <p className="text-sm text-gray-500">
                Hỗ trợ: PDF (Tối đa 10MB)
              </p>
            </div>
          </div>
        </div>

        {/* CV List Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Danh sách CV ({cvList.length})
            </h2>
          </div>

          {cvList.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileIcon />
              </div>
              <p className="text-gray-500 text-lg mb-2">Chưa có CV nào</p>
              <p className="text-gray-400 text-sm">Upload CV đầu tiên của bạn</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cvList.map((cv) => (
                <div
                  key={cv.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-emerald-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-4">
                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      {editingId === cv.id ? (
                        <div className="flex items-center gap-2 mb-2">
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="flex-1 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            autoFocus
                          />
                          <button
                            onClick={() => saveEdit(cv.id)}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Lưu"
                          >
                            <CheckIcon />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Hủy"
                          >
                            <CloseIcon />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 break-words">
                            {cv.fileName}
                          </h3>
                          {cv.isDefault && (
                            <span className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full whitespace-nowrap">
                              <StarIcon filled />
                              Mặc định
                            </span>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {cv.uploadedAt && (
                          <span>Ngày tải lên: {new Date(cv.uploadedAt).toLocaleDateString('vi-VN')}</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!cv.isDefault && (
                        <button
                          onClick={() => handleSetDefault(cv.id)}
                          className="p-2 text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 rounded-lg transition-colors"
                          title="Đặt làm CV mặc định"
                        >
                          <StarIcon />
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDownloadCV(cv.id, cv.fileName)}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Tải xuống"
                      >
                        <DownloadIcon />
                      </button>
                      
                      <button
                        onClick={() => startEditing(cv)}
                        className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Đổi tên"
                      >
                        <EditIcon />
                      </button>
                      
                      <button
                        onClick={() => handleDelete(cv.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
      
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}