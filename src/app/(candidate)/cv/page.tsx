"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";

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

const EyeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function CVManagementPage() {
  type CV = {
    id: number;
    name: string;
    size: number;
    type: string;
    uploadDate: string;
    data: string | ArrayBuffer | null;
  };

  const [cvList, setCvList] = useState<CV[]>([]);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [previewCV, setPreviewCV] = useState<CV | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
    if (!files) return;
    Array.from(files).forEach((file: File) => {
      // Chỉ chấp nhận PDF, DOC, DOCX
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      
      if (!allowedTypes.includes(file.type)) {
        alert('Chỉ chấp nhận file PDF, DOC, DOCX');
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB
        alert('File không được vượt quá 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const newCV = {
          id: Date.now() + Math.random(),
          name: file.name,
          size: file.size,
          type: file.type,
          uploadDate: new Date().toLocaleDateString('vi-VN'),
          data: reader.result
        };
        setCvList(prev => [...prev, newCV]);
      };
      reader.readAsDataURL(file);
    });
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: string | number) => {
    const num: number = typeof bytes === 'string' ? Number(bytes) : bytes;
    if (isNaN(num)) return '0 B';
    if (num < 1024) return num + ' B';
    if (num < 1024 * 1024) return (num / 1024).toFixed(2) + ' KB';
    return (num / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const getFileExtension = (filename: string) => {
    const ext = filename.split('.').pop() || '';
    return ext.toUpperCase();
  };

  const handlePreview = (cv: CV | null) => {
    setPreviewCV(cv);
    setShowPreview(true);
  };

  const handleDownload = (cv: { id?: number; name: string; size?: number; type?: string; uploadDate?: string; data: string | ArrayBuffer | null; }) => {
    const link = document.createElement('a');
    link.href = cv.data as string;
    link.download = cv.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa CV này?')) {
      setCvList(prev => prev.filter(cv => cv.id !== id));
    }
  };

  const startEditing = (cv: { id: number; name: string; size?: number; type?: string; uploadDate?: string; data?: string | ArrayBuffer | null; }) => {
    setEditingId(cv.id);
    setEditingName(cv.name);
  };

  const saveEdit = (id: number) => {
    setCvList(prev => prev.map(cv => 
      cv.id === id ? { ...cv, name: editingName } : cv
    ));
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
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
              accept=".pdf,.doc,.docx"
              onChange={handleChange}
              className="hidden"
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
                Hỗ trợ: PDF, DOC, DOCX (Tối đa 5MB)
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
                    {/* File Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <span className="text-red-600 font-bold text-xs">
                          {getFileExtension(cv.name)}
                        </span>
                      </div>
                    </div>

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
                        <h3 className="font-semibold text-gray-900 mb-1 truncate">
                          {cv.name}
                        </h3>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{formatFileSize(cv.size)}</span>
                        <span>•</span>
                        <span>Ngày tải lên: {cv.uploadDate}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePreview(cv)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Xem trước"
                      >
                        <EyeIcon />
                      </button>
                      
                      <button
                        onClick={() => handleDownload(cv)}
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

        {/* Preview Modal */}
        {showPreview && previewCV && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col">
              {/* Modal Header */}
              <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{previewCV.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatFileSize(previewCV.size)} • {previewCV.uploadDate}
                  </p>
                </div>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-auto p-6">
                {previewCV.type === 'application/pdf' && typeof previewCV.data === 'string' ? (
                  <iframe
                    src={previewCV.data}
                    className="w-full h-full min-h-[600px] border border-gray-300 rounded-lg"
                    title="CV Preview"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <FileIcon />
                    </div>
                    <p className="text-gray-700 text-lg mb-2">
                      Không thể xem trước file {getFileExtension(previewCV.name)}
                    </p>
                    <p className="text-gray-500 text-sm mb-6">
                      Vui lòng tải xuống để xem nội dung
                    </p>
                    <button
                      onClick={() => handleDownload(previewCV)}
                      className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center gap-2"
                    >
                      <DownloadIcon />
                      Tải xuống file
                    </button>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
                <button
                  onClick={() => handleDownload(previewCV)}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                >
                  <DownloadIcon />
                  Tải xuống
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}