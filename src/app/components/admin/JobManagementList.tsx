'use client';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Search, ChevronLeft, ChevronRight, Filter, Eye, MoreVertical, EyeOff, Trash2, Flame } from 'lucide-react';
import JobDetailModal from './JobDetailModal';
import { getAllJobs, getJobDetail, updateJobStatus, deleteJob, toggleJobHot, restoreJob } from '@/utils/api/admin-api';
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
  status: 'pending_approval' | 'active' | 'rejected' | 'hidden' | 'expired' | 'closed' | 'draft' | 'removed_by_admin' | 'removed_by_employer';
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
  status: 'pending' | 'approved' | 'rejected' | 'hidden' | 'inactive' | 'removed_by_admin' | 'removed_by_employer';
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

export default function JobManagementList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [showActionMenu, setShowActionMenu] = useState<number | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const actionButtonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});
  
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
      const response = await getAllJobs(
        searchQuery || undefined,
        statusFilter !== 'all' ? statusFilter : undefined,
        undefined,
        undefined,
        currentPage,
        10
      );
      
      // Map BE data to FE format
      const mappedJobs = response.data.map((job: JobPostingAPI) => {
        // Convert BE status to FE status (backend returns lowercase snake_case)
        let feStatus: 'pending' | 'approved' | 'rejected' | 'hidden' | 'inactive' | 'removed_by_admin' | 'removed_by_employer';
        switch (job.status) {
          case 'pending_approval':
            feStatus = 'pending';
            break;
          case 'active':
            feStatus = 'approved';
            break;
          case 'rejected':
            feStatus = 'rejected';
            break;
          case 'hidden':
            feStatus = 'hidden';
            break;
          case 'expired':
          case 'closed':
          case 'draft':
            feStatus = 'inactive';
            break;
          case 'removed_by_admin':
            feStatus = 'removed_by_admin';
            break;
          case 'removed_by_employer':
            feStatus = 'removed_by_employer';
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
  }, [currentPage, searchQuery, statusFilter]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const statusConfig = {
    pending: { label: 'Chờ duyệt', color: 'bg-orange-100 text-orange-600 border-orange-300' },
    approved: { label: 'Đang hoạt động', color: 'bg-green-100 text-green-600 border-green-300' },
    rejected: { label: 'Từ chối', color: 'bg-red-100 text-red-600 border-red-300' },
    hidden: { label: 'Đã ẩn', color: 'bg-gray-100 text-gray-600 border-gray-300' },
    inactive: { label: 'Không hoạt động', color: 'bg-gray-100 text-gray-600 border-gray-300' },
    removed_by_admin: { label: 'Đã xóa bởi Admin', color: 'bg-red-100 text-red-700 border-red-300' },
    removed_by_employer: { label: 'Đã xóa bởi NTD', color: 'bg-red-100 text-red-700 border-red-300' },
  } as const;

  const filterOptions = [
    { value: 'all', label: 'Tất cả', count: totalCount },
    { value: 'active', label: 'Đang hoạt động', count: jobPostings.filter(j => j.status === 'approved').length },
    { value: 'pending_approval', label: 'Chờ duyệt', count: jobPostings.filter(j => j.status === 'pending').length },
    { value: 'rejected', label: 'Từ chối', count: jobPostings.filter(j => j.status === 'rejected').length },
    { value: 'hidden', label: 'Đã ẩn', count: jobPostings.filter(j => j.status === 'hidden').length },
    { value: 'expired', label: 'Hết hạn', count: jobPostings.filter(j => j.status === 'inactive').length },
    { value: 'closed', label: 'Đã đóng', count: jobPostings.filter(j => j.status === 'inactive').length },
    { value: 'removed_by_admin', label: 'Đã xóa bởi Admin', count: jobPostings.filter(j => j.status === 'removed_by_admin').length },
    { value: 'removed_by_employer', label: 'Đã xóa bởi NTD', count: jobPostings.filter(j => j.status === 'removed_by_employer').length },
  ];

  const filteredJobs = useMemo(() => {
    return jobPostings;
  }, [jobPostings]);

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
      const detailData = (detail.data || detail) as JobPostingAPI;
      
      setSelectedJob({
        ...job,
        description: detailData?.description || job.description,
        requirements: detailData?.requirements || job.requirements,
        responsibilities: detailData?.responsibilities || job.responsibilities,
        plusPoints: detailData?.niceToHave || job.plusPoints,
        benefits: detailData?.benefits || job.benefits,
        categories: detailData?.jobCategories?.map(jc => jc.category.name) || 
                   (detailData?.category ? [detailData.category.name] : job.categories),
        technologies: detailData?.jobTechnologies?.map(jt => jt.technology.name) || job.technologies,
      });
      setShowDetailModal(true);
      setShowActionMenu(null);
    } catch (err) {
      console.error('Error fetching job detail:', err);
      showToast('Không thể tải chi tiết tin tuyển dụng', 'error');
    }
  };

  const handleToggleVisibility = async (job: JobPosting) => {
    try {
      const newStatus = job.status === 'approved' ? 'hidden' : 'active';
      await updateJobStatus(job.id.toString(), newStatus);
      showToast(
        job.status === 'approved' ? 'Đã ẩn tin tuyển dụng' : 'Đã hiển thị tin tuyển dụng',
        'success'
      );
      fetchJobs();
      setShowActionMenu(null);
    } catch (err) {
      console.error('Error toggling job visibility:', err);
      showToast('Không thể thay đổi trạng thái tin tuyển dụng', 'error');
    }
  };

  const handleDeleteJob = async (job: JobPosting) => {
    if (!confirm('Bạn có chắc chắn muốn xóa tin tuyển dụng này?')) {
      return;
    }

    try {
      // Backend will set status to REMOVED_BY_ADMIN
      await deleteJob(job.id.toString());
      showToast('Đã xóa tin tuyển dụng thành công', 'success');
      fetchJobs(); // Refresh to get updated status from backend
      setShowActionMenu(null);
    } catch (err) {
      console.error('Error deleting job:', err);
      showToast('Không thể xóa tin tuyển dụng', 'error');
    }
  };

  const handleRestoreJob = async (job: JobPosting) => {
    if (!confirm('Bạn có chắc chắn muốn khôi phục tin tuyển dụng này?')) {
      return;
    }

    try {
      // Backend will set status to ACTIVE
      await restoreJob(job.id.toString());
      showToast('Đã khôi phục tin tuyển dụng thành công', 'success');
      fetchJobs(); // Refresh to get updated status from backend
      setShowActionMenu(null);
    } catch (err) {
      console.error('Error restoring job:', err);
      showToast('Không thể khôi phục tin tuyển dụng', 'error');
    }
  };

  const handleToggleHot = async (job: JobPosting) => {
    if (job.status !== 'approved') {
      showToast('Chỉ có thể đặt tin nổi bật cho tin đang hoạt động', 'error');
      return;
    }

    try {
      await toggleJobHot(job.id.toString(), !job.isHot);
      showToast(
        job.isHot ? 'Đã bỏ đánh dấu tin nổi bật' : 'Đã đánh dấu tin nổi bật',
        'success'
      );
      fetchJobs();
      setShowActionMenu(null);
    } catch (err) {
      console.error('Error toggling hot status:', err);
      showToast('Không thể thay đổi trạng thái tin nổi bật', 'error');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="p-6">
        <div>
          <h2 className="text-2xl font-bold mb-6">
            Quản lý tin tuyển dụng
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
          <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1.2fr_1.5fr] gap-4 py-4 px-4 text-sm font-medium text-gray-600 border-b border-gray-200">
            <div>Tiêu đề</div>
            <div>Tên công ty</div>
            <div>Ngày đăng</div>
            <div>Ngày hết hạn</div>
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
                  className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1.2fr_1.5fr] gap-4 py-4 px-4 border-b border-gray-200 items-center hover:bg-gray-50 transition"
                >
                  {/* Job Title */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">{job.jobTitle}</span>
                    {job.isHot && (
                      <span title="Tin nổi bật">
                        <Flame className="w-4 h-4 text-orange-500" />
                      </span>
                    )}
                  </div>

                  {/* Company Name */}
                  <div className="text-sm text-gray-600">{job.companyName}</div>

                  {/* Posted Date */}
                  <div className="text-sm text-gray-600">{job.publishedAt || job.createdDate}</div>

                  {/* Expiry Date */}
                  <div className="text-sm text-gray-600">{job.expiredAt || 'N/A'}</div>

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
                  <div className="flex items-center gap-2 justify-end h-10 relative">
                    <button
                      onClick={() => handleViewDetails(job)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Chi tiết</span>
                    </button>

                    <button
                      ref={(el) => {
                        actionButtonRefs.current[job.id] = el;
                      }}
                      onClick={() => {
                        if (showActionMenu === job.id) {
                          setShowActionMenu(null);
                          setDropdownPosition(null);
                        } else {
                          const button = actionButtonRefs.current[job.id];
                          if (button) {
                            const rect = button.getBoundingClientRect();
                            setDropdownPosition({
                              top: rect.bottom + window.scrollY + 4,
                              left: rect.right + window.scrollX - 224, // 224px = width of dropdown (56 * 4)
                            });
                          }
                          setShowActionMenu(job.id);
                        }
                      }}
                      className="p-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                      title="Thao tác khác"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {/* Action Menu Dropdown */}
                    {showActionMenu === job.id && isMounted && dropdownPosition && createPortal(
                      <>
                        <div
                          className="fixed inset-0 z-[100]"
                          onClick={() => {
                            setShowActionMenu(null);
                            setDropdownPosition(null);
                          }}
                        />
                        <div 
                          className="fixed w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-[101]"
                          style={{
                            top: `${dropdownPosition.top}px`,
                            left: `${dropdownPosition.left}px`,
                          }}
                        >
                          <div className="py-1">
                            {/* Show different actions based on job status */}
                            {job.status === 'removed_by_admin' || job.status === 'removed_by_employer' ? (
                              /* Job is removed - show restore option */
                              <button
                                onClick={() => handleRestoreJob(job)}
                                className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 flex items-center gap-2"
                              >
                                <Eye className="w-4 h-4" />
                                Khôi phục tin
                              </button>
                            ) : (
                              /* Job is not removed - show normal actions */
                              <>
                                {/* is_hot toggle */}
                                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase border-b">
                                  Tin nổi bật
                                </div>
                                <button
                                  onClick={() => handleToggleHot(job)}
                                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between gap-2 ${
                                    job.status !== 'approved' ? 'opacity-50 cursor-not-allowed' : 'text-gray-700'
                                  }`}
                                  disabled={job.status !== 'approved'}
                                >
                                  <div className="flex items-center gap-2">
                                    <Flame className="w-4 h-4" />
                                    <span>Tin nổi bật</span>
                                  </div>
                                  <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                    job.isHot ? 'bg-orange-500' : 'bg-gray-300'
                                  }`}>
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                      job.isHot ? 'translate-x-5' : 'translate-x-0.5'
                                    }`} />
                                  </div>
                                </button>

                                <div className="border-t my-1"></div>
                                
                                {/* Delete */}
                                <button
                                  onClick={() => handleDeleteJob(job)}
                                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Xóa tin
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </>,
                      document.body
                    )}
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
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let page;
              if (totalPages <= 5) {
                page = i + 1;
              } else if (currentPage <= 3) {
                page = i + 1;
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i;
              } else {
                page = currentPage - 2 + i;
              }
              return (
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
              );
            })}
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
          job={{
            ...selectedJob,
            status: selectedJob.status === 'hidden' || 
                   selectedJob.status === 'inactive' || 
                   selectedJob.status === 'removed_by_admin' || 
                   selectedJob.status === 'removed_by_employer'
              ? 'approved' as const
              : selectedJob.status as 'pending' | 'approved' | 'rejected'
          }}
          onClose={() => setShowDetailModal(false)}
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
