'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Filter, Eye, Check, X } from 'lucide-react';
import ApproveModal from './ApproveModal';
import RejectModal from './RejectModal';
import JobDetailModal from './JobDetailModal';
import { getJobsForApproval, approveJob, rejectJob, getJobDetail } from '@/utils/api/admin-api';
import Toast from '@/app/components/profile/Toast';

interface JobPostingAPI {
  id: string;
  title: string;
  employer?: {
    companyName?: string;
  };
  salaryMin?: number;
  salaryMax?: number;
  isNegotiable?: boolean;
  experienceLevel?: string;
  status: 'PENDING_APPROVAL' | 'ACTIVE' | 'REJECTED';
  createdAt: string;
  description?: string;
  requirements?: string[];
  responsibilities?: string[];
  niceToHave?: string[];
  benefits?: string[];
  location?: {
    id: string;
    address: string;
    city: string;
  };
  employmentType?: string;
  workMode?: string;
  quantity?: number;
  applyCount?: number;
  expiredAt?: string;
  publishedAt?: string;
  experienceYearsMin?: number;
  category?: {
    id: string;
    name: string;
  };
  jobCategories?: Array<{
    categoryId: string;
    isPrimary: boolean;
    category: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
  jobTechnologies?: Array<{
    technologyId: string;
    isPrimary: boolean;
    technology: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
  viewCount?: number;
  saveCount?: number;
  isHot?: boolean;
  isUrgent?: boolean;
}

interface JobPosting {
  id: number;
  jobTitle: string;
  companyName: string;
  salary: string;
  level: string;
  status: 'pending' | 'approved' | 'rejected';
  createdDate: string;
  description?: string;
  requirements?: string[];
  responsibilities?: string[];
  plusPoints?: string[];
  benefits?: string[];
  employmentType?: string;
  workMode?: string;
  location?: string;
  locationAddress?: string;
  quantity?: number;
  applicantsCount?: number;
  expiredAt?: string;
  publishedAt?: string;
  experienceYearsMin?: number;
  categories?: string[];
  technologies?: string[];
  viewCount?: number;
  saveCount?: number;
  isHot?: boolean;
  isUrgent?: boolean;
}

export default function JobPostingApprovalList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  
  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  // Show toast helper
  const showToast = (message: string, type: 'error' | 'success' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch jobs from API
  const fetchJobs = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getJobsForApproval(
        searchQuery || undefined,
        undefined,
        undefined,
        currentPage,
        10
      );
      
      // Map BE data to FE format
      const mappedJobs = response.data.map((job: JobPostingAPI) => {
        // Convert BE status to FE status
        let feStatus: 'pending' | 'approved' | 'rejected';
        switch (job.status) {
          case 'PENDING_APPROVAL':
            feStatus = 'pending';
            break;
          case 'ACTIVE':
            feStatus = 'approved';
            break;
          case 'REJECTED':
            feStatus = 'rejected';
            break;
          default:
            feStatus = 'pending';
        }
        
        return {
          id: parseInt(job.id, 10),
          jobTitle: job.title,
          companyName: job.employer?.companyName || 'N/A',
          salary: job.salaryMin && job.salaryMax 
            ? `${job.salaryMin / 1000000}-${job.salaryMax / 1000000} triệu/tháng`
            : job.isNegotiable ? 'Thỏa thuận' : 'N/A',
          level: job.experienceLevel || 'N/A',
          status: feStatus,
          createdDate: new Date(job.createdAt).toLocaleDateString('vi-VN'),
          description: job.description,
          requirements: job.requirements || [],
          location: job.location?.city,
          locationAddress: job.location?.address,
          responsibilities: job.responsibilities,
          plusPoints: job.niceToHave,
          benefits: job.benefits,
          employmentType: job.employmentType,
          workMode: job.workMode,
          quantity: job.quantity,
          applicantsCount: job.applyCount,
          expiredAt: job.expiredAt ? new Date(job.expiredAt).toLocaleDateString('vi-VN') : undefined,
          publishedAt: job.publishedAt ? new Date(job.publishedAt).toLocaleDateString('vi-VN') : undefined,
          experienceYearsMin: job.experienceYearsMin,
          categories: job.jobCategories?.map(jc => jc.category.name) || (job.category ? [job.category.name] : []),
          technologies: job.jobTechnologies?.map(jt => jt.technology.name) || [],
          viewCount: job.viewCount,
          saveCount: job.saveCount,
          isHot: job.isHot,
          isUrgent: job.isUrgent,
        };
      });
      
      setJobPostings(mappedJobs);
      setTotalCount(response.meta?.total || response.data.length);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách tin tuyển dụng');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const statusConfig = {
    pending: { label: 'Chờ duyệt', color: 'bg-orange-100 text-orange-600 border-orange-300' },
    approved: { label: 'Đã duyệt', color: 'bg-green-100 text-green-600 border-green-300' },
    rejected: { label: 'Từ chối', color: 'bg-red-100 text-red-600 border-red-300' },
  };

  const filterOptions = [
    { value: 'all', label: 'Tất cả', count: totalCount },
    { value: 'PENDING_APPROVAL', label: 'Chờ duyệt', count: jobPostings.filter(j => j.status === 'pending').length },
    { value: 'ACTIVE', label: 'Đã duyệt', count: jobPostings.filter(j => j.status === 'approved').length },
    { value: 'REJECTED', label: 'Từ chối', count: jobPostings.filter(j => j.status === 'rejected').length },
  ];

  const filteredJobs = useMemo(() => {
    let filtered = jobPostings;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(j => j.status === statusFilter);
    }

    return filtered;
  }, [jobPostings, statusFilter]);

  const getActiveFilterLabel = () => {
    const option = filterOptions.find(opt => opt.value === statusFilter);
    return option?.label || 'Tất cả';
  };

  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const paginatedJobs = filteredJobs;

  const handleViewDetails = async (job: JobPosting) => {
    try {
      const detail = await getJobDetail(job.id.toString());
      // The API might return data directly or wrapped in a data property
      const detailData = (detail.data || detail) as JobPostingAPI;
      
      // Map the detail data to ensure categories and technologies are properly formatted
      setSelectedJob({
        ...job,
        description: detailData?.description || job.description,
        requirements: detailData?.requirements || job.requirements,
        responsibilities: detailData?.responsibilities || job.responsibilities,
        plusPoints: detailData?.niceToHave || job.plusPoints,
        benefits: detailData?.benefits || job.benefits,
        // Keep the already mapped categories and technologies from job
        categories: detailData?.jobCategories?.map(jc => jc.category.name) || 
                   (detailData?.category ? [detailData.category.name] : job.categories),
        technologies: detailData?.jobTechnologies?.map(jt => jt.technology.name) || job.technologies,
      });
      setShowDetailModal(true);
    } catch (err) {
      console.error('Error fetching job detail:', err);
      showToast('Không thể tải chi tiết tin tuyển dụng', 'error');
    }
  };

  const handleOpenApproveModal = (job: JobPosting) => {
    setSelectedJob(job);
    setShowApproveModal(true);
  };

  const handleApprove = async () => {
    if (!selectedJob) return;
    
    try {
      await approveJob(selectedJob.id.toString());
      setShowApproveModal(false);
      fetchJobs(); // Refresh list
      showToast('Đã duyệt tin tuyển dụng thành công', 'success');
    } catch (err) {
      console.error('Error approving job:', err);
      showToast(err instanceof Error ? err.message : 'Không thể duyệt tin tuyển dụng', 'error');
    }
  };

  const handleOpenRejectModal = (job: JobPosting) => {
    setSelectedJob(job);
    setShowRejectModal(true);
  };

  const handleReject = async (reason: string) => {
    if (!selectedJob) return;
    
    try {
      await rejectJob(selectedJob.id.toString(), reason);
      setShowRejectModal(false);
      fetchJobs(); // Refresh list
      showToast('Đã từ chối tin tuyển dụng', 'success');
    } catch (err) {
      console.error('Error rejecting job:', err);
      showToast(err instanceof Error ? err.message : 'Không thể từ chối tin tuyển dụng', 'error');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="p-6">
        <div>
          <h2 className="text-2xl font-bold mb-6">
            Số tin cần duyệt: {jobPostings.filter(j => j.status === 'pending').length}
          </h2>
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Đang tải...</p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Search & Filter controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          {/* Search Input */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tiêu đề, công ty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className={`flex items-center justify-between gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors w-56 ${
                statusFilter !== 'all'
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Filter className="w-4 h-4 shrink-0" />
                <span className="truncate">{getActiveFilterLabel()}</span>
              </div>
              <span
                className={`ml-1 px-2 py-0.5 rounded-full text-xs min-w-[28px] text-center ${
                  statusFilter !== 'all'
                    ? 'bg-blue-600 text-white'
                    : 'invisible bg-blue-600 text-white'
                }`}
              >
                {filteredJobs.length}
              </span>
            </button>

            {showFilterDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowFilterDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                  <div className="p-2">
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                      Lọc theo trạng thái
                    </div>
                    {filterOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setStatusFilter(option.value);
                          setShowFilterDropdown(false);
                          setCurrentPage(1);
                        }}
                        className={`w-full px-3 py-2 text-left text-sm rounded-md transition-colors flex items-center justify-between ${
                          statusFilter === option.value
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span>{option.label}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          statusFilter === option.value
                            ? 'bg-blue-100'
                            : 'bg-gray-100'
                        }`}>
                          {option.count}
                        </span>
                      </button>
                    ))}
                  </div>
                  {statusFilter !== 'all' && (
                    <div className="border-t p-2">
                      <button
                        onClick={() => {
                          setStatusFilter('all');
                          setShowFilterDropdown(false);
                        }}
                        className="w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md text-center"
                      >
                        Xóa bộ lọc
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="border border-gray-200 rounded-lg bg-gray-50 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[2fr_2fr_1.5fr_1.5fr_1.2fr] gap-4 py-4 px-4 text-sm font-medium text-gray-600 border-b border-gray-200">
            <div>Tiêu đề tin</div>
            <div>Công ty</div>
            <div>Mức lương</div>
            <div>Trạng thái</div>
            <div>Thao tác</div>
          </div>

          {/* Table Body */}
          <div className="bg-white">
            {paginatedJobs.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                Không có tin tuyển dụng nào
              </div>
            ) : (
              paginatedJobs.map((job) => (
                <div
                  key={job.id}
                  className="grid grid-cols-[2fr_2fr_1.5fr_1.5fr_1.2fr] gap-4 py-4 px-4 border-b border-gray-200 items-center hover:bg-gray-50 transition"
                >
                  {/* Job Title */}
                  <div className="text-sm font-medium text-gray-900">{job.jobTitle}</div>

                  {/* Company Name */}
                  <div className="text-sm text-gray-600">{job.companyName}</div>

                  {/* Salary */}
                  <div className="text-sm text-gray-600">{job.salary}</div>

                  {/* Status */}
                  <div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                        statusConfig[job.status].color
                      }`}
                    >
                      {statusConfig[job.status].label}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 justify-end h-10">
                    <button
                      onClick={() => handleViewDetails(job)}
                      className="flex items-center gap-2 px-3 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition whitespace-nowrap"
                      title="Chi tiết"
                    >
                      
                      <span className="text-sm">Xem chi tiết</span>
                    </button>

                    <div className="w-20 flex items-center justify-center">
                      {job.status === 'pending' ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenApproveModal(job)}
                            className="p-2 text-white bg-green-600 hover:bg-green-700 rounded-lg transition"
                            title="Duyệt"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenRejectModal(job)}
                            className="p-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
                            title="Từ chối"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500 italic whitespace-nowrap">
                          Đã xử lý
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600">
            Trang {currentPage} của {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-lg transition ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showDetailModal && selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setShowDetailModal(false)}
        />
      )}

      {showApproveModal && selectedJob && (
        <ApproveModal
          onClose={() => setShowApproveModal(false)}
          onConfirm={handleApprove}
          employerName={selectedJob.jobTitle}
        />
      )}

      {showRejectModal && selectedJob && (
        <RejectModal
          onClose={() => setShowRejectModal(false)}
          onConfirm={handleReject}
          employerName={selectedJob.jobTitle}
        />
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
  );
}
