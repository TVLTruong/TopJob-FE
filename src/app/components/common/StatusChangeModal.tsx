'use client';
import React from 'react';

// Application status config - khớp với backend enum
const statusConfig = {
  new: { label: 'Hồ sơ mới', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
  viewed: { label: 'Đã xem', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  shortlisted: { label: 'Ứng viên tiềm năng', color: 'bg-green-100 text-green-700 border-green-300' },
  rejected: { label: 'Đã từ chối', color: 'bg-red-100 text-red-700 border-red-300' },
  hired: { label: 'Đã tuyển', color: 'bg-purple-100 text-purple-700 border-purple-300' },
  withdrawn: { label: 'Ứng viên đã rút', color: 'bg-gray-100 text-gray-700 border-gray-300' },
};

type ApplicationStatus = 'new' | 'viewed' | 'shortlisted' | 'rejected' | 'hired' | 'withdrawn';

interface StatusChangeModalProps {
  applicantName: string;
  currentStatus: ApplicationStatus;
  onClose: () => void;
  onConfirm: (newStatus: ApplicationStatus) => void;
}

export default function StatusChangeModal({
  applicantName,
  currentStatus,
  onClose,
  onConfirm,
}: StatusChangeModalProps) {
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [selectedStatus, setSelectedStatus] = React.useState<ApplicationStatus | null>(null);

  const getAvailableStatuses = (status: ApplicationStatus) => {
    // Backend logic: Chỉ cho phép thay đổi từ NEW hoặc VIEWED
    switch (status) {
      case 'new':
      case 'viewed':
        return [
          { value: 'shortlisted' as ApplicationStatus, label: 'Ứng viên tiềm năng' },
          { value: 'rejected' as ApplicationStatus, label: 'Từ chối' }
        ];
      case 'shortlisted':
        // Từ shortlisted có thể tuyển dụng hoặc từ chối (sau phỏng vấn)
        return [
          { value: 'hired' as ApplicationStatus, label: 'Đã tuyển' },
          { value: 'rejected' as ApplicationStatus, label: 'Từ chối' }
        ];
      case 'rejected':
      case 'hired':
      case 'withdrawn':
        return []; // Không thể thay đổi nữa
      default:
        return [];
    }
  };

  const availableStatuses = getAvailableStatuses(currentStatus);

  const handleSelectStatus = (newStatus: ApplicationStatus) => {
    setSelectedStatus(newStatus);
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    if (selectedStatus) {
      onConfirm(selectedStatus);
      setShowConfirmation(false);
      setSelectedStatus(null);
      onClose();
    }
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
    setSelectedStatus(null);
  };

  if (availableStatuses.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="flex items-center gap-3 mb-4 text-orange-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-lg font-semibold">Thông báo</h3>
          </div>
          <p className="text-gray-600 mb-6">
            Không thể thay đổi trạng thái <span className={`font-semibold ${statusConfig[currentStatus].color.split(' ')[1]}`}>&quot;{statusConfig[currentStatus].label}&quot;</span>
          </p>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {!showConfirmation ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Chọn trạng thái mới</h3>
            <p className="text-sm text-gray-600 mb-4">
              Trạng thái hiện tại: <span className={`font-medium ${statusConfig[currentStatus].color.split(' ')[1]}`}>{statusConfig[currentStatus].label}</span>
            </p>
            <div className="space-y-2 mb-6">
              {availableStatuses.map((status) => (
                <button
                  key={status.value}
                  onClick={() => handleSelectStatus(status.value)}
                  className={`w-full px-4 py-3 text-left border rounded-lg hover:opacity-80 transition-all font-medium ${statusConfig[status.value].color}`}
                >
                  {status.label}
                </button>
              ))}
            </div>
            <button
              onClick={onClose}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
          </div>
        </div>
      ) : (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            {/* Extra warning for reject action */}
            {selectedStatus === 'rejected' && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="text-sm text-red-800">
                  <p className="font-medium mb-1">Cảnh báo</p>
                  <p>Hành động này không thể hoàn tác. Ứng viên sẽ không thể tiếp tục quy trình tuyển dụng cho vị trí này.</p>
                </div>
              </div>
            )}
            
            <h3 className="text-lg font-semibold mb-4">Xác nhận thay đổi trạng thái</h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn thay đổi trạng thái của <strong>{applicantName}</strong> từ{' '}
              <strong className={statusConfig[currentStatus].color.split(' ')[1]}>{statusConfig[currentStatus].label}</strong> sang{' '}
              <strong className={selectedStatus ? statusConfig[selectedStatus].color.split(' ')[1] : ''}>{selectedStatus && statusConfig[selectedStatus].label}</strong>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCancelConfirmation}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirm}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors text-white ${
                  selectedStatus === 'rejected'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
