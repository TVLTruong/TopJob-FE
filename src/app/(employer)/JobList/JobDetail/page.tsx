'use client';
import React, { useState } from 'react';
import JobDetailContent, { JobDetailData } from '@/app/components/job/JobDetailContents';
import ApplicantsTab from '@/app/components/job/Applicant';
import JobFormModal from '@/app/components/job/JobFormModal';
import { ChevronDown, Power, Edit, Eye, EyeOff, Trash2, X, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function JobDetailPage() {
  const { user } = useAuth();
  const isRecruiter = user?.role === 'employer';
  const isCandidate = user?.role === 'candidate';
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'end' | 'hide' | 'delete' | 'apply' | 'unapply' | null>(null);
  const [activeTab, setActiveTab] = useState<'detail' | 'applicants'>('detail');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const router = useRouter();

  // Helpers
  const formatDateDisplay = (d: Date) => {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  // Job state (could be fetched from API)
  const [job, setJob] = useState<JobDetailData>({
    title: 'Social Media Assistant',
    position: 'Fresher',
    jobType: 'Full-Time',
    applicantsCount: 4,
    targetCount: 11,
    deadline: '28/05/2025',
    postedDate: formatDateDisplay(new Date()),
    salaryDisplay: '10.000 USD/tháng',
    experienceDisplay: '1 năm',
    categories: ['Marketing', 'Design'],
    description: 'Mô tả công việc ...',
    responsibilities: ['Tham gia cộng đồng', 'Tạo nội dung', 'Hỗ trợ chiến lược'],
    requirements: ['Năng động', 'Sáng tạo'],
    plusPoints: ['Tiếng Anh tốt']
  });

  const handleToggleHidden = () => {
    setConfirmAction('hide');
    setShowConfirmModal(true);
    setIsDropdownOpen(false);
  };

  const handleEnd = () => {
    setConfirmAction('end');
    setShowConfirmModal(true);
    setIsDropdownOpen(false);
  };

  const handleDelete = () => {
    setConfirmAction('delete');
    setShowConfirmModal(true);
    setIsDropdownOpen(false);
  };

  const handleApply = () => {
    if (hasApplied) {
      setConfirmAction('unapply');
    } else {
      setConfirmAction('apply');
    }
    setShowConfirmModal(true);
  };

  const handleSaveJob = () => {
    setIsSaved(!isSaved);
    console.log(isSaved ? 'Đã bỏ lưu công việc' : 'Đã lưu công việc');
  };

  const confirmHandler = () => {
    if (confirmAction === 'hide') {
      setIsHidden(!isHidden);
    } else if (confirmAction === 'end') {
      console.log('Kết thúc công việc');
    } else if (confirmAction === 'delete') {
      console.log('Xóa công việc');
    } else if (confirmAction === 'apply') {
      setHasApplied(true);
      console.log('Đã ứng tuyển');
    } else if (confirmAction === 'unapply') {
      setHasApplied(false);
      console.log('Đã hủy ứng tuyển');
    }
    setShowConfirmModal(false);
    setConfirmAction(null);
  };

  const cancelHandler = () => {
    setShowConfirmModal(false);
    setConfirmAction(null);
  };

  const getModalContent = () => {
    switch (confirmAction) {
      case 'end':
        return {
          title: 'Xác nhận kết thúc',
          message: 'Bạn có chắc chắn muốn kết thúc công việc này không?',
          confirmText: 'Kết thúc',
          confirmClass: 'bg-blue-600 hover:bg-blue-700'
        };
      case 'hide':
        return {
          title: isHidden ? 'Xác nhận hủy ẩn' : 'Xác nhận ẩn',
          message: isHidden 
            ? 'Bạn có chắc chắn muốn hiển thị lại công việc này không?' 
            : 'Bạn có chắc chắn muốn ẩn công việc này không?',
          confirmText: isHidden ? 'Hủy ẩn' : 'Ẩn',
          confirmClass: 'bg-orange-600 hover:bg-orange-700'
        };
      case 'delete':
        return {
          title: 'Xác nhận xóa',
          message: 'Bạn có chắc chắn muốn xóa công việc này không? Hành động này không thể hoàn tác.',
          confirmText: 'Xóa',
          confirmClass: 'bg-red-600 hover:bg-red-700'
        };
      case 'apply':
        return {
          title: 'Xác nhận ứng tuyển',
          message: 'Bạn có chắc chắn muốn ứng tuyển vào vị trí này không?',
          confirmText: 'Ứng tuyển',
          confirmClass: 'bg-emerald-600 hover:bg-emerald-700'
        };
      case 'unapply':
        return {
          title: 'Xác nhận hủy ứng tuyển',
          message: 'Bạn có chắc chắn muốn hủy ứng tuyển vào vị trí này không?',
          confirmText: 'Hủy ứng tuyển',
          confirmClass: 'bg-red-600 hover:bg-red-700'
        };
      default:
        return {
          title: '',
          message: '',
          confirmText: '',
          confirmClass: ''
        };
    }
  };

  const modalContent = getModalContent();

  const handleSaveJobData = (updatedJob: JobDetailData) => {
    setJob(updatedJob);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div>
        {/* Header */}
        <div className="bg-white rounded-xl p-6 mb-3 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.back()} 
                className="text-gray-700 hover:text-gray-900 text-2xl font-bold rounded-full hover:bg-gray-100 hover:shadow-md"
              >
                ←
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                <p className="text-gray-600 text-sm">
                  {job.position} • {job.jobType} • {job.experienceDisplay}
                </p>
              </div>
            </div>
            
            {/* Actions based on role */}
            {isCandidate ? (
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleApply}
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                    hasApplied 
                      ? 'bg-gray-400 text-white cursor-pointer hover:bg-gray-500' 
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  <span className="text-sm">
                    {hasApplied ? 'Đã ứng tuyển' : 'Ứng tuyển'}
                  </span>
                </button>
                
                {/* Nút Lưu công việc (trái tim) */}
                <button
                  onClick={handleSaveJob}
                  className={`aspect-square h-10 flex items-center justify-center border rounded-lg transition-colors ${
                    isSaved
                      ? "border-red-500 bg-red-100 text-red-600 hover:bg-red-200"
                      : "border-gray-300 text-gray-600 hover:bg-emerald-50 hover:border-emerald-500"
                  }`}
                  aria-label={isSaved ? "Bỏ lưu công việc" : "Lưu công việc"}
                >
                  <Heart size={20} fill={isSaved ? "currentColor" : "none"} />
                </button>
              </div>
            ) : isRecruiter ? (
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <span className="text-sm">Tùy chọn khác</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <button 
                      onClick={handleEnd}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Power className="w-4 h-4" />
                      <span>Kết thúc</span>
                    </button>
                    <button 
                      onClick={() => {
                        setIsEditOpen(true);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Chỉnh sửa</span>
                    </button>
                    <button 
                      onClick={handleToggleHidden}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                      {isHidden ? (
                        <>
                          <Eye className="w-4 h-4" />
                          <span>Hủy ẩn</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-4 h-4" />
                          <span>Ẩn</span>
                        </>
                      )}
                    </button>
                    <button 
                      onClick={handleDelete}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Xóa</span>
                    </button>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Tabs */}
          {isRecruiter && (
          <div className="flex gap-6 border-b">
            <button 
              onClick={() => setActiveTab('detail')}
              className={`pb-3 font-medium ${
                activeTab === 'detail' 
                  ? 'border-b-2 border-blue-600 text-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Chi tiết công việc
            </button>
            <button 
              onClick={() => setActiveTab('applicants')}
              className={`pb-3 font-medium ${
                activeTab === 'applicants' 
                  ? 'border-b-2 border-blue-600 text-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Ứng viên
            </button>
          </div>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === 'detail' ? (
          <JobDetailContent job={job} />
        ) : isRecruiter ? (
          <ApplicantsTab />
        ) : null}

        {/* Job Form Modal */}
        <JobFormModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onSave={handleSaveJobData}
          initialData={job}
          mode="edit"
        />

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">{modalContent.title}</h3>
                <button 
                  onClick={cancelHandler}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-600 mb-6">{modalContent.message}</p>
              <div className="flex gap-3 justify-end">
                <button 
                  onClick={cancelHandler}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Hủy
                </button>
                <button 
                  onClick={confirmHandler}
                  className={`px-4 py-2 rounded-lg text-white font-medium ${modalContent.confirmClass}`}
                >
                  {modalContent.confirmText}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}