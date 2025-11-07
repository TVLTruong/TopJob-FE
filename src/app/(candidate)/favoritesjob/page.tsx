"use client";

import { useState, useEffect } from "react";
import { Heart, Trash2, Search } from "lucide-react";
import Jobcard from "@/app/components/job/Jobcard";
import { Job } from "@/app/components/types/job.types";

// Mock data - Sau này sẽ lấy từ localStorage hoặc API
const mockSavedJobs: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    companyName: "Tech Corp",
    salary: "25 - 40 triệu",
    type: "Full-time",
    location: "TP.HCM",
    experience: "3+ năm",
    logoUrl: "/placeholder-logo.png",
    tags: []
  },
  {
    id: "2",
    title: "Backend Developer",
    companyName: "Digital Solutions",
    salary: "20 - 35 triệu",
    type: "Remote",
    location: "Hà Nội",
    experience: "2+ năm",
    logoUrl: "/placeholder-logo.png",
    tags: []
  },
  {
    id: "3",
    title: "Full Stack Developer",
    companyName: "Innovation Hub",
    salary: "30 - 50 triệu",
    type: "Hybrid",
    location: "Đà Nẵng",
    experience: "4+ năm",
    logoUrl: "/placeholder-logo.png",
    tags: []
  },
  {
    id: "4",
    title: "UI/UX Designer",
    companyName: "Creative Agency",
    salary: "15 - 25 triệu",
    type: "Part-time",
    location: "TP.HCM",
    experience: "1+ năm",
    logoUrl: "/placeholder-logo.png",
    tags: []
  },
  {
    id: "5",
    title: "DevOps Engineer",
    companyName: "Cloud Systems",
    salary: "35 - 60 triệu",
    type: "Full-time",
    location: "Hà Nội",
    experience: "5+ năm",
    logoUrl: "/placeholder-logo.png",
    tags: []
  },
  {
    id: "6",
    title: "Mobile Developer",
    companyName: "App Studio",
    salary: "22 - 38 triệu",
    type: "Remote",
    location: "TP.HCM",
    experience: "3+ năm",
    logoUrl: "/placeholder-logo.png",
    tags: []
  },
  {
    id: "7",
    title: "Data Scientist",
    companyName: "AI Analytics",
    salary: "40 - 70 triệu",
    type: "Full-time",
    location: "Hà Nội",
    experience: "3+ năm",
    logoUrl: "/placeholder-logo.png",
    tags: []
  },
  {
    id: "8",
    title: "Game Developer (Unity/Unreal)",
    companyName: "Pixel Studio",
    salary: "25 - 45 triệu",
    type: "Hybrid",
    location: "TP.HCM",
    experience: "2+ năm",
    logoUrl: "/placeholder-logo.png",
    tags: []
  },
  {
    id: "9",
    title: "AI Engineer",
    companyName: "DeepMind Asia",
    salary: "45 - 80 triệu",
    type: "Full-time",
    location: "Đà Nẵng",
    experience: "4+ năm",
    logoUrl: "/placeholder-logo.png",
    tags: []
  },
  {
    id: "10",
    title: "Project Manager",
    companyName: "NextGen Solutions",
    salary: "30 - 55 triệu",
    type: "Hybrid",
    location: "TP.HCM",
    experience: "5+ năm",
    logoUrl: "/placeholder-logo.png",
    tags: []
  }
];

const ITEMS_PER_PAGE = 8;

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Load saved jobs (demo: luôn dùng mock để hiển thị đầy đủ và có phân trang)
  useEffect(() => {
    try {
      setSavedJobs(mockSavedJobs);
      localStorage.setItem("savedJobs", JSON.stringify(mockSavedJobs.map(j => j.id)));
    } catch (error) {
      console.error("Error initializing saved jobs:", error);
      setSavedJobs(mockSavedJobs);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle unsave job
  const handleUnsaveJob = (jobId: string) => {
    const updatedJobs = savedJobs.filter(job => job.id !== jobId);
    setSavedJobs(updatedJobs);
    
    // Cập nhật localStorage
    const jobIds = updatedJobs.map(j => j.id);
    localStorage.setItem("savedJobs", JSON.stringify(jobIds));
  };

  // Handle apply job
  const handleApplyJob = (jobId: string) => {
    console.log("Applying for job:", jobId);
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

  const confirmClearAll = () => {
    setSavedJobs([]);
    localStorage.removeItem("savedJobs");
    setShowDeleteModal(false);
    showToast("Đã xóa tất cả công việc yêu thích", "success");
  };

  // Filter jobs by search term
  const filteredJobs = savedJobs.filter(job => {
    const matchSearch = searchTerm === "" || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
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

  return (
    <div className="min-h-screen bg-gray-50">
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
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-white/20 rounded-lg">
              <Heart className="w-8 h-8 text-white" fill="white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Công việc yêu thích
            </h1>
          </div>
          <p className="text-white/90 text-lg">
            Quản lý và theo dõi các công việc bạn quan tâm
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-[1400px] py-8">
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
              href="/viec-lam"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
            >
              <Search className="w-5 h-5" />
              Tìm việc ngay
            </a>
          </div>
        ) : (
          <>
            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên công việc hoặc công ty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Results Info and Clear All Button */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {filteredJobs.length} công việc
                </h2>
                <p className="text-gray-600 mt-1">
                  {searchTerm && `Kết quả tìm kiếm cho "${searchTerm}"`}
                </p>
              </div>
              
              <button
                onClick={handleClearAll}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Xóa tất cả</span>
              </button>
            </div>

            {/* Jobs Grid */}
            {filteredJobs.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center">
                <p className="text-gray-600">Không tìm thấy công việc phù hợp</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
                  {currentJobs.map((job) => (
                    <Jobcard
                      key={job.id}
                      job={job}
                      onApply={handleApplyJob}
                      onSave={handleUnsaveJob}
                      isSaved={true}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    {/* Page Numbers */}
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNum = index + 1;
                      
                      // Show first page, last page, current page and adjacent pages
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
                                ? "bg-emerald-600 text-white"
                                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      } else if (
                        pageNum === currentPage - 2 ||
                        pageNum === currentPage + 2
                      ) {
                        return <span key={pageNum} className="text-gray-500">...</span>;
                      }
                      return null;
                    })}
                  </div>
                )}
              </>
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