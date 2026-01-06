'use client';
import React, { useState, useEffect, Suspense } from 'react';
import JobDetailContent, { JobDetailData } from '@/app/components/job/JobDetailContents';
import ApplicantsTab from '@/app/components/job/Applicant';
import JobFormModal from '@/app/components/job/JobFormModal';
import Toast from '@/app/components/profile/Toast';
import { ChevronDown, Power, Edit, Eye, EyeOff, Trash2, X, Heart } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { updateJob, getEmployerJobDetail, hideJob, unhideJob, deleteJob, closeJob, type JobFromAPI } from '@/utils/api/job-api';
import type { CreateJobPayload } from '@/utils/api/job-api';
import { jobCategoryApi } from '@/utils/api/categories-api';
import { technologyApi } from '@/utils/api/technology-api';

function JobDetailContent_Inner() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get('id');
  
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [job, setJob] = useState<JobDetailData | null>(null);
  
  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  // Show toast helper
  const showToast = (message: string, type: 'error' | 'success' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Helpers
  const formatDateDisplay = (d: Date) => {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  // Fetch job detail from API
  useEffect(() => {
    const fetchJobDetail = async () => {
      if (!jobId) {
        setError('Không tìm thấy ID công việc');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const apiJob: JobFromAPI = await getEmployerJobDetail(jobId);
        
        // Map JobFromAPI to JobDetailData
        const mappedJob: JobDetailData = {
          id: apiJob.id,
          title: apiJob.title,
          slug: apiJob.slug,
          employmentType: apiJob.employmentType,
          workMode: apiJob.workMode,
          status: apiJob.status,
          applicantsCount: apiJob.applyCount || 0,
          quantity: apiJob.quantity,
          expiredAt: apiJob.expiredAt ? formatDateDisplay(new Date(apiJob.expiredAt)) : 'N/A',
          postedDate: formatDateDisplay(new Date(apiJob.createdAt)),
          publishedAt: apiJob.publishedAt ? formatDateDisplay(new Date(apiJob.publishedAt)) : undefined,
          salaryMin: apiJob.salaryMin,
          salaryMax: apiJob.salaryMax,
          isNegotiable: apiJob.isNegotiable,
          isSalaryVisible: apiJob.isSalaryVisible,
          salaryCurrency: apiJob.salaryCurrency,
          experienceLevel: apiJob.experienceLevel || undefined,
          experienceYearsMin: apiJob.experienceYearsMin || undefined,
          locationId: apiJob.location?.id,
          locationName: apiJob.location?.city,
          locationAddress: apiJob.location?.address,
          categories: apiJob.category ? [apiJob.category.name] : [],
          technologies: apiJob.jobTechnologies?.map(jt => jt.technology.name) || [],
          description: apiJob.description || 'Chưa có mô tả',
          responsibilities: apiJob.responsibilities || [],
          requirements: apiJob.requirements || [],
          plusPoints: apiJob.niceToHave || [],
          benefits: apiJob.benefits || [],
          isHot: apiJob.isHot,
          isUrgent: apiJob.isUrgent,
          viewCount: apiJob.viewCount,
          saveCount: apiJob.saveCount,
          companyName: apiJob.employer?.companyName,
          companyLogo: apiJob.employer?.logoUrl || undefined,
        };

        setJob(mappedJob);
        setIsHidden(apiJob.status === 'hidden');
      } catch (err: any) {
        console.error('Error fetching job detail:', err);
        setError(err.response?.data?.message || 'Không thể tải chi tiết công việc');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [jobId]);

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

  const confirmHandler = async () => {
    if (!jobId) return;

    try {
      if (confirmAction === 'hide') {
        if (isHidden) {
          await unhideJob(jobId);
          setIsHidden(false);
          showToast('Đã hủy ẩn công việc thành công!');
        } else {
          await hideJob(jobId);
          setIsHidden(true);
          showToast('Đã ẩn công việc thành công!');
        }
      } else if (confirmAction === 'end') {
        // Close job via dedicated endpoint
        await closeJob(jobId);
        showToast('Đã kết thúc công việc thành công!');
        router.push('/JobList');
      } else if (confirmAction === 'delete') {
        await deleteJob(jobId);
        showToast('Đã xóa công việc thành công!');
        router.push('/JobList');
      } else if (confirmAction === 'apply') {
        setHasApplied(true);
        console.log('Đã ứng tuyển');
      } else if (confirmAction === 'unapply') {
        setHasApplied(false);
        console.log('Đã hủy ứng tuyển');
      }
    } catch (error: any) {
      console.error('Error performing action:', error);
      showToast(error.response?.data?.message || error.message || 'Vui lòng thử lại', 'error');
    } finally {
      setShowConfirmModal(false);
      setConfirmAction(null);
    }
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

  const handleSaveJobData = async (updatedJob: JobDetailData) => {
    try {
      // Validate required fields
      if (!updatedJob.locationId) {
        showToast('Vui lòng chọn địa điểm làm việc', 'error');
        return;
      }

      if (!updatedJob.categories || updatedJob.categories.length === 0) {
        showToast('Vui lòng chọn ít nhất một danh mục', 'error');
        return;
      }

      if (!updatedJob.technologies || updatedJob.technologies.length === 0) {
        showToast('Vui lòng chọn ít nhất một công nghệ', 'error');
        return;
      }

      // Get all categories from API to map names to IDs
      const allCategories = await jobCategoryApi.getList();
      const categoryIds: string[] = [];
      
      for (const catName of updatedJob.categories) {
        const category = allCategories.find(cat => cat.name === catName);
        if (category) {
          categoryIds.push(category.id);
        } else {
          showToast(`Không tìm thấy danh mục: ${catName}`, 'error');
          return;
        }
      }

      // Get all technologies from API to map names to IDs (if provided)
      let technologyIds: string[] | undefined;
      if (updatedJob.technologies && updatedJob.technologies.length > 0) {
        const allTechnologies = await technologyApi.getList();
        technologyIds = [];
        
        for (const techName of updatedJob.technologies) {
          const technology = allTechnologies.find(tech => tech.name === techName);
          if (technology) {
            technologyIds.push(technology.id);
          }
        }
      }

      // Convert expiredAt from dd/MM/yyyy to ISO date
      const [day, month, year] = updatedJob.expiredAt.split('/');
      const expiredAtISO = new Date(`${year}-${month}-${day}`).toISOString();

      // Build API payload (only fields that can be updated)
      const payload: Partial<CreateJobPayload> = {
        categoryIds,
        technologyIds,
        locationId: updatedJob.locationId!,
        title: updatedJob.title,
        description: updatedJob.description,
        requirements: updatedJob.requirements,
        responsibilities: updatedJob.responsibilities,
        niceToHave: updatedJob.plusPoints,
        benefits: updatedJob.benefits,
        salaryMin: updatedJob.salaryMin,
        salaryMax: updatedJob.salaryMax,
        isNegotiable: updatedJob.isNegotiable,
        isSalaryVisible: updatedJob.isSalaryVisible,
        salaryCurrency: updatedJob.salaryCurrency,
        employmentType: updatedJob.employmentType,
        workMode: updatedJob.workMode,
        experienceLevel: updatedJob.experienceLevel,
        experienceYearsMin: updatedJob.experienceYearsMin,
        quantity: updatedJob.quantity,
        expiredAt: expiredAtISO,
        isHot: updatedJob.isHot,
        isUrgent: updatedJob.isUrgent,
      };

      // Use jobId from URL params
      if (!jobId) {
        showToast('Không tìm thấy ID công việc', 'error');
        return;
      }
      
      console.log('Updating job with payload:', payload);
      
      const response = await updateJob(jobId, payload);
      console.log('Job updated successfully:', response);
      
      // Update local state
      setJob(updatedJob);
      setIsEditOpen(false);
      showToast('Cập nhật tin tuyển dụng thành công!');
    } catch (error: any) {
      console.error('Error updating job:', error);
      showToast(error.response?.data?.message || error.message || 'Lỗi khi cập nhật tin tuyển dụng', 'error');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mb-4"></div>
          <p className="text-gray-600">Đang tải chi tiết công việc...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Không tìm thấy công việc'}</p>
          <button
            onClick={() => router.push('/JobList')}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

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
                  {job.experienceLevel ? job.experienceLevel.charAt(0).toUpperCase() + job.experienceLevel.slice(1) : 'N/A'} • {job.employmentType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} • {job.experienceYearsMin ? `${job.experienceYearsMin} năm` : 'N/A'}
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
          <ApplicantsTab source="jobDetail" />
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

        {/* Toast Notification */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
}

// Wrap with Suspense to handle useSearchParams()
export default function JobDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    }>
      <JobDetailContent_Inner />
    </Suspense>
  );
}