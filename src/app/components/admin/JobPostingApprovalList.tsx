'use client';
import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Filter, Eye, Check, X } from 'lucide-react';
import ApproveModal from './ApproveModal';
import RejectModal from './RejectModal';
import JobDetailModal from './JobDetailModal';

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
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([
    {
      id: 1,
      jobTitle: 'Senior Frontend Developer',
      companyName: 'Tech Solutions Vietnam',
      salary: '20-30 triệu/tháng',
      level: 'Senior',
      status: 'pending',
      createdDate: '24/05/2025',
      description: 'Chúng tôi đang tìm kiếm một Senior Frontend Developer có kinh nghiệm với React, TypeScript...',
      requirements: ['React', 'TypeScript', '5+ năm kinh nghiệm', 'English']
    },
    {
      id: 2,
      jobTitle: 'Backend Engineer',
      companyName: 'Digital Innovations Inc',
      salary: '18-25 triệu/tháng',
      level: 'Mid-level',
      status: 'pending',
      createdDate: '23/05/2025',
      description: 'Tuyển dụng Backend Engineer làm việc với Node.js, MongoDB...',
      requirements: ['Node.js', 'MongoDB', '3+ năm', 'Docker']
    },
    {
      id: 3,
      jobTitle: 'UI/UX Designer',
      companyName: 'Smart Business Solutions',
      salary: '15-20 triệu/tháng',
      level: 'Mid-level',
      status: 'pending',
      createdDate: '22/05/2025',
      description: 'Tuyển dụng UI/UX Designer có kinh nghiệm thiết kế...',
      requirements: ['Figma', 'Prototyping', 'Design System']
    },
    {
      id: 4,
      jobTitle: 'DevOps Engineer',
      companyName: 'CloudTech Vietnam',
      salary: '25-35 triệu/tháng',
      level: 'Senior',
      status: 'pending',
      createdDate: '21/05/2025',
      description: 'Tuyển DevOps Engineer quản lý cloud infrastructure...',
      requirements: ['AWS/GCP', 'Kubernetes', 'CI/CD', 'Linux']
    },
  ]);

  const statusConfig = {
    pending: { label: 'Chờ duyệt', color: 'bg-orange-100 text-orange-600 border-orange-300' },
    approved: { label: 'Đã duyệt', color: 'bg-green-100 text-green-600 border-green-300' },
    rejected: { label: 'Từ chối', color: 'bg-red-100 text-red-600 border-red-300' },
  };

  const filterOptions = [
    { value: 'all', label: 'Tất cả', count: jobPostings.length },
    { value: 'pending', label: 'Chờ duyệt', count: jobPostings.filter(j => j.status === 'pending').length },
    { value: 'approved', label: 'Đã duyệt', count: jobPostings.filter(j => j.status === 'approved').length },
    { value: 'rejected', label: 'Từ chối', count: jobPostings.filter(j => j.status === 'rejected').length },
  ];

  const filteredJobs = useMemo(() => {
    let filtered = jobPostings;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(j => j.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(j =>
        j.jobTitle.toLowerCase().includes(query) ||
        j.companyName.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [jobPostings, statusFilter, searchQuery]);

  const getActiveFilterLabel = () => {
    const option = filterOptions.find(opt => opt.value === statusFilter);
    return option?.label || 'Tất cả';
  };

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewDetails = (job: JobPosting) => {
    setSelectedJob(job);
    setShowDetailModal(true);
  };

  const handleOpenApproveModal = (job: JobPosting) => {
    setSelectedJob(job);
    setShowApproveModal(true);
  };

  const handleApprove = () => {
    if (selectedJob) {
      setJobPostings(prev =>
        prev.map(j =>
          j.id === selectedJob.id ? { ...j, status: 'approved' as const } : j
        )
      );
    }
    setShowApproveModal(false);
  };

  const handleOpenRejectModal = (job: JobPosting) => {
    setSelectedJob(job);
    setShowRejectModal(true);
  };

  const handleReject = (reason: string) => {
    if (selectedJob) {
      setJobPostings(prev =>
        prev.map(j =>
          j.id === selectedJob.id ? { ...j, status: 'rejected' as const } : j
        )
      );
    }
    setShowRejectModal(false);
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
            <div className="flex items-center gap-1">
              Tiêu đề tin
              <span className="text-gray-400">⇅</span>
            </div>
            <div className="flex items-center gap-1">
              Công ty
              <span className="text-gray-400">⇅</span>
            </div>
            <div className="flex items-center gap-1">
              Mức lương
              <span className="text-gray-400">⇅</span>
            </div>
            <div className="flex items-center gap-1">
              Trạng thái
              <span className="text-gray-400">⇅</span>
            </div>
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
    </div>
  );
}
