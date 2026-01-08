"use client";

import { useState, useEffect } from "react";
import { Heart, Trash2, Search } from "lucide-react";
import Image from "next/image";
import images from "@/app/utils/images";
import Jobcard from "@/app/components/job/Jobcard";
import { Job } from "@/app/components/types/job.types";
import { getSavedJobs } from "@/utils/api/saved-jobs-api";
import { JobFromAPI } from "@/utils/api/job-api";
import { useRouter } from "next/navigation";
import { useSavedJobs } from "@/contexts/SavedJobsContext";

// Transform API job to Job type for Jobcard
function transformJobFromAPI(apiJob: JobFromAPI): Job {
  const employmentTypeMap: Record<string, string> = {
    'full_time': 'Full-time',
    'part_time': 'Part-time',
    'freelance': 'Freelance',
    'internship': 'Internship',
    'contract': 'Contract',
  };

  const experienceLevelMap: Record<string, string> = {
    'intern': 'Intern',
    'fresher': 'Fresher',
    'junior': 'Junior',
    'middle': 'Middle',
    'senior': 'Senior',
    'lead': 'Lead',
    'manager': 'Manager',
  };

  // Format salary
  let salaryText = 'Thỏa thuận';
  if (apiJob.isSalaryVisible && apiJob.salaryMin && apiJob.salaryMax) {
    const minInMillions = Math.round(apiJob.salaryMin / 1000000);
    const maxInMillions = Math.round(apiJob.salaryMax / 1000000);
    salaryText = `${minInMillions} - ${maxInMillions} triệu`;
  } else if (apiJob.isNegotiable) {
    salaryText = 'Thỏa thuận';
  }

  // Get job categories
  const categoryNames = apiJob.jobCategories?.map(jc => jc.category.name) || [];

  // Get first technology if available
  const firstTechnology = apiJob.jobTechnologies?.[0]?.technology?.name;

  // Combine tags: categories first, then technology
  const tags = [...categoryNames];
  if (firstTechnology) {
    tags.push(firstTechnology);
  }

  return {
    id: apiJob.id,
    title: apiJob.title,
    companyName: apiJob.employer?.companyName || 'Unknown Company',
    location: apiJob.location?.city || apiJob.location?.address || 'Remote',
    type: employmentTypeMap[apiJob.employmentType] || apiJob.employmentType,
    experience: apiJob.experienceLevel ? experienceLevelMap[apiJob.experienceLevel] : 'All levels',
    salary: salaryText,
    tags: tags,
    logoUrl: apiJob.employer?.logoUrl || '/placeholder-logo.png',
  };
}

const ITEMS_PER_PAGE = 12;

export default function SavedJobsPage() {
  const router = useRouter();
  const { unsaveJobFromFavorites, refreshSavedJobs } = useSavedJobs();
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSaved, setTotalSaved] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved jobs from API
  useEffect(() => {
    loadSavedJobs();
  }, [currentPage]);

  const loadSavedJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getSavedJobs(currentPage, ITEMS_PER_PAGE);
      console.log('Favoritesjob - Full API response:', JSON.stringify(response, null, 2));
      
      // Handle both response formats: 
      // 1. Direct array from unwrapped axios response
      // 2. Wrapped object { data: [...], meta: {...} }
      let jobsFromApi: any[] = [];
      let total = 0;
      let totalPages = 1;
      
      if (Array.isArray(response)) {
        // Direct array response (current case)
        jobsFromApi = response;
        total = response.length;
        totalPages = 1;
      } else if (response?.data && Array.isArray(response.data)) {
        // Wrapped response
        jobsFromApi = response.data;
        total = response.meta?.total ?? 0;
        totalPages = response.meta?.totalPages ?? 1;
      }

      console.log('Favoritesjob - jobs from API:', jobsFromApi.length);
      const transformedJobs = jobsFromApi.map(transformJobFromAPI);
      console.log('Favoritesjob - transformed jobs:', transformedJobs.length);
      setSavedJobs(transformedJobs);
      setTotalSaved(total);
      setTotalPages(totalPages);
    } catch (err: any) {
      console.error("Error loading saved jobs:", err);
      if (err.response?.status === 401) {
        setError('Vui lòng đăng nhập để xem công việc yêu thích');
      } else {
        setError('Không thể tải danh sách công việc yêu thích');
      }
      setSavedJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle unsave job
  const handleUnsaveJob = async (jobId: string) => {
    try {
      await unsaveJobFromFavorites(jobId);
      setSavedJobs(prev => prev.filter(job => job.id !== jobId));
      setTotalSaved(prev => prev - 1);
      showToast('Đã xóa khỏi công việc yêu thích', 'success');
    } catch (err: any) {
      console.error('Error unsaving job:', err);
      showToast('Không thể xóa công việc yêu thích', 'error');
    }
  };

  // Handle apply job
  const handleApplyJob = (jobId: string) => {
    router.push(`/JobList/JobDetail?id=${jobId}`);
  };

  // Show toast notification
  const showToast = (message: string, type: 'error' | 'success' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Clear all saved jobs
  const handleClearAll = () => {
    setShowDeleteModal(true);
  };

  const confirmClearAll = async () => {
    try {
      // Delete each job from local list and call API
      const jobIdsToDelete = savedJobs.map(job => job.id);
      for (const jobId of jobIdsToDelete) {
        await unsaveJobFromFavorites(jobId);
      }
      setSavedJobs([]);
      setTotalSaved(0);
      setShowDeleteModal(false);
      showToast("Đã xóa tất cả công việc yêu thích", "success");
      loadSavedJobs();
    } catch (err: any) {
      console.error('Error clearing all:', err);
      showToast('Không thể xóa công việc yêu thích', 'error');
    }
  };

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải công việc đã lưu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => loadSavedJobs()}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-[9999] animate-slide-in">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg min-w-[300px] ${
            toast.type === 'error' 
              ? 'bg-red-50 border border-red-200 text-red-800' 
              : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
          }`}>
            <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
              toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'
            }`}>
              {toast.type === 'error' ? (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <p className="text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => setToast(null)}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="relative w-full text-white py-16">
        <div className="absolute inset-0 z-0">
          <Image
            src={images.searcherBG}
            alt="Background"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            priority
          />
        </div>
        <div className="container mx-auto px-4 max-w-6xl text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Công việc yêu thích
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto">
            Quản lý và theo dõi các công việc bạn quan tâm
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-[1400px] py-8 bg-gray-50">
        {savedJobs.length === 0 ? (
          // Empty State
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Chưa có công việc yêu thích
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Hãy lưu các công việc bạn quan tâm để dễ dàng theo dõi và ứng tuyển sau
            </p>
            <a
              href="/jobpage"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
            >
              <Search className="w-5 h-5" />
              Tìm việc ngay
            </a>
          </div>
        ) : (
          <>
            {/* Header and Stats */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Công việc yêu thích</h2>
              <p className="text-gray-600">
                Tổng cộng {totalSaved} công việc đã lưu
              </p>
            </div>

            {/* Clear All Button */}
            {savedJobs.length > 0 && (
              <div className="mb-6 flex justify-end">
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Xóa tất cả</span>
                </button>
              </div>
            )}

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center mb-8">
              {savedJobs.map((job) => (
                <Jobcard
                  key={job.id}
                  job={job}
                  onClick={() => handleApplyJob(job.id)}
                  onSave={handleUnsaveJob}
                  isSaved={true}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                {/* Previous Button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Trước
                </button>

                {/* Page Numbers */}
                {[...Array(totalPages)].map((_, index) => {
                  const pageNum = index + 1;

                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-colors ${
                          currentPage === pageNum
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }

                  if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                    return (
                      <span key={pageNum} className="text-gray-500">
                        ...
                      </span>
                    );
                  }

                  return null;
                })}

                {/* Next Button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Tiếp
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-scale-in">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              Xóa tất cả công việc?
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Bạn có chắc chắn muốn xóa tất cả công việc đã lưu? Hành động này không thể hoàn tác.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                onClick={confirmClearAll}
                className="flex-1 px-4 py-2.5 text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors font-medium"
              >
                Xóa tất cả
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}