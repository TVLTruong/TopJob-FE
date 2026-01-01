'use client';
import React from 'react';

const statusConfig = {
  pending: { label: 'Chờ duyệt', color: 'bg-orange-100 text-orange-600 border-orange-300' },
  approved: { label: 'Đã duyệt', color: 'bg-green-100 text-green-600 border-green-300' },
  passed: { label: 'Đã đậu', color: 'bg-blue-100 text-blue-600 border-blue-300' },
  rejected: { label: 'Từ chối', color: 'bg-red-100 text-red-600 border-red-300' },
};

type Status = 'pending' | 'approved' | 'passed' | 'rejected';

interface StatusChangeModalProps {
  applicantName: string;
  currentStatus: Status;
  onClose: () => void;
  onConfirm: (newStatus: Status) => void;
}

export default function StatusChangeModal({
  applicantName,
  currentStatus,
  onClose,
  onConfirm,
}: StatusChangeModalProps) {
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [selectedStatus, setSelectedStatus] = React.useState<Status | null>(null);

  const getAvailableStatuses = (status: Status) => {
    switch (status) {
      case 'pending':
        return [{ value: 'approved' as Status, label: 'Đã duyệt' }];
      case 'approved':
        return [
          { value: 'passed' as Status, label: 'Đã đậu' },
          { value: 'rejected' as Status, label: 'Từ chối' }
        ];
      case 'passed':
      case 'rejected':
        return [];
      default:
        return [];
    }
  };

  const availableStatuses = getAvailableStatuses(currentStatus);

  const handleSelectStatus = (newStatus: Status) => {
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
            Không thể thay đổi trạng thái &quot;{statusConfig[currentStatus].label}&quot;
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
              Trạng thái hiện tại: <span className="font-medium">{statusConfig[currentStatus].label}</span>
            </p>
            <div className="space-y-2 mb-6">
              {availableStatuses.map((status) => (
                <button
                  key={status.value}
                  onClick={() => handleSelectStatus(status.value)}
                  className="w-full px-4 py-3 text-left border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-blue-500 transition-colors font-medium"
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
            <h3 className="text-lg font-semibold mb-4">Xác nhận thay đổi trạng thái</h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn thay đổi trạng thái của <strong>{applicantName}</strong> từ{' '}
              <strong>{statusConfig[currentStatus].label}</strong> sang{' '}
              <strong>{selectedStatus && statusConfig[selectedStatus].label}</strong>?
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
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
