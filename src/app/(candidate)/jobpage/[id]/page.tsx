'use client';
import React, { useState, useEffect, Suspense } from 'react';
import JobDetailContent, { JobDetailData } from '@/app/components/job/JobDetailContents';
import Toast from '@/app/components/profile/Toast';
import { Heart, X } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getCandidateJobDetail, type JobFromAPI } from '@/utils/api/job-api';
import { CandidateApi } from '@/utils/api/candidate-api';

function JobDetailContent_Inner() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;
  
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'apply' | 'unapply' | null>(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null);
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
        
        // Use candidate API endpoint
        const apiJob: JobFromAPI = await getCandidateJobDetail(jobId);
        
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
          categories: apiJob.jobCategories?.map(jc => jc.category.name) || 
                     (apiJob.category ? [apiJob.category.name] : []),
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
      } catch (err: any) {
        console.error('Error fetching job detail:', err);
        setError(err.response?.data?.message || 'Không thể tải chi tiết công việc');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [jobId]);

  // Initialize applied/saved states
  useEffect(() => {
    const initStates = async () => {
      try {
        if (!user) return;
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        // Fetch applications to check if applied
        const applications = await CandidateApi.getApplications(token);
        const matched = applications.find(app => app.jobId === jobId);
        setHasApplied(!!matched);
        setApplicationStatus(matched?.status || null);

        // Fetch saved jobs to check if saved
        const savedJobs = await CandidateApi.getSavedJobs(token);
        const saved = savedJobs.some(j => j.id === jobId);
        setIsSaved(saved);
      } catch (e) {
        // Silent failure for init states
      }
    };
    initStates();
  }, [user, jobId]);

  const handleApply = () => {
    // withdrawn status = chưa ứng tuyển, cho phép ứng tuyển lại
    const isAppliedAndActive = hasApplied && applicationStatus && !['withdrawn'].includes(applicationStatus);
    
    if (isAppliedAndActive) {
      const cancelable = ['new', 'viewed', 'shortlisted'];
      if (!cancelable.includes(applicationStatus)) {
        showToast('Không thể hủy ở trạng thái hiện tại', 'error');
        return;
      }
      setConfirmAction('unapply');
    } else {
      setConfirmAction('apply');
    }
    setShowConfirmModal(true);
  };

  const canUnapply = () => {
    const cancelable = ['new', 'viewed', 'shortlisted'];
    // Có thể hủy nếu status ở trạng thái cancelable
    return hasApplied && applicationStatus && cancelable.includes(applicationStatus);
  };

  const isBlockedStatus = () => {
    // Block apply nếu status là hired hoặc rejected
    const blocked = ['hired', 'rejected'];
    return hasApplied && applicationStatus && blocked.includes(applicationStatus);
  };

  const handleSaveJob = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        showToast('Vui lòng đăng nhập để lưu công việc', 'error');
        return;
      }
      const res = await CandidateApi.toggleSavedJob(token, jobId);
      setIsSaved(res.saved);
      showToast(res.saved ? 'Đã lưu công việc' : 'Đã bỏ lưu công việc');
    } catch (e: any) {
      showToast(e?.message || 'Không thể lưu công việc', 'error');
    }
  };

  const confirmHandler = async () => {
    try {
      if (confirmAction === 'apply') {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          showToast('Vui lòng đăng nhập để ứng tuyển', 'error');
          return;
        }
        // Call apply API (use default CV if not specified)
        await CandidateApi.applyJob(token, jobId, {});
        setHasApplied(true);
        setApplicationStatus('new');
        showToast('Đã ứng tuyển thành công!');
      } else if (confirmAction === 'unapply') {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          showToast('Vui lòng đăng nhập để hủy ứng tuyển', 'error');
          return;
        }
        await CandidateApi.unapplyJob(token, jobId);
        setHasApplied(false);
        setApplicationStatus('withdrawn');
        showToast('Đã hủy ứng tuyển thành công!');
      }
    } catch (error: any) {
      console.error('Error performing action:', error);
      const msg = error?.message || error?.response?.data?.message || 'Vui lòng thử lại';
      showToast(msg, 'error');
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
            onClick={() => router.push('/listjobpage')}
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
            
            {/* Candidate Actions */}
            <div className="flex items-center gap-3">
              {isBlockedStatus() ? (
                <div className="px-6 py-2 rounded-lg font-medium text-gray-600 bg-gray-100">
                  <span className="text-sm">
                    {applicationStatus === 'hired' ? 'Đã tuyển' : 'Từ chối'}
                  </span>
                </div>
              ) : canUnapply() ? (
                <button 
                  onClick={handleApply}
                  className="flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors bg-red-600 text-white hover:bg-red-700"
                >
                  <span className="text-sm">Hủy ứng tuyển</span>
                </button>
              ) : (
                <button 
                  onClick={handleApply}
                  className="flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  <span className="text-sm">Ứng tuyển</span>
                </button>
              )}
              
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
          </div>
        </div>

        {/* Job Detail Content */}
        <JobDetailContent job={job} />

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

// Wrap with Suspense to handle useParams()
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
