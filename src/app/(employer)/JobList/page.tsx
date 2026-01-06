'use client';
import React, { useMemo, useState, useEffect } from 'react';
import { Search, MoreVertical, Trash2, Edit3, ChevronLeft, ChevronRight, Eye, EyeOff, X, Filter } from 'lucide-react';
import { getEmployerJobs, type JobFromAPI, hideJob, unhideJob, deleteJob } from '@/utils/api/job-api';
import { useRouter } from 'next/navigation';
import Toast from '@/app/components/profile/Toast';
import Header from '@/app/components/companyProfile/Header';

interface Job {
  id: string;
  title: string;
  status: string; // Backend: pending_approval, active, closed, expired, etc.
  createdAt: string;
  expiredAt: string;
  employmentType: string; // full_time, part_time, freelance, etc.
  applyCount?: number;
  quantity: number;
  isHidden?: boolean;
}

export default function JobListingsTab() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'hide' | 'unhide' | 'delete' | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalJobs, setTotalJobs] = useState(0);
  const itemsPerPage = 10;
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  // Show toast helper
  const showToast = (message: string, type: 'error' | 'success' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getEmployerJobs(currentPage, itemsPerPage);
        
        // Map JobFromAPI to Job interface
        const mappedJobs: Job[] = (response.data || []).map((apiJob: JobFromAPI) => ({
          id: apiJob.id,
          title: apiJob.title,
          status: apiJob.status,
          createdAt: new Date(apiJob.createdAt).toISOString(),
          expiredAt: apiJob.expiredAt ? new Date(apiJob.expiredAt).toISOString() : new Date().toISOString(),
          employmentType: apiJob.employmentType,
          applyCount: apiJob.applyCount || 0,
          quantity: apiJob.quantity,
          isHidden: false, // Backend doesn't have this field yet
        }));
        
        setJobs(mappedJobs);
        setTotalJobs(response.meta?.total || 0);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Không thể tải danh sách công việc');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [currentPage]);

  const statusConfig: Record<string, { label: string; color: string }> = {
    pending_approval: { label: 'Chờ duyệt', color: 'bg-orange-100 text-orange-600 border-orange-300' },
    active: { label: 'Đã đăng', color: 'bg-green-100 text-green-600 border-green-300' },
    closed: { label: 'Đã đóng', color: 'bg-red-100 text-red-600 border-red-300' },
    expired: { label: 'Hết hạn', color: 'bg-gray-100 text-gray-600 border-gray-300' },
    rejected: { label: 'Bị từ chối', color: 'bg-red-100 text-red-600 border-red-300' },
    hidden: { label: 'Đã ẩn', color: 'bg-gray-100 text-gray-600 border-gray-300' },
    removed_by_admin: { label: 'Đã gỡ', color: 'bg-red-100 text-red-600 border-red-300' },
    draft: { label: 'Nháp', color: 'bg-gray-100 text-gray-600 border-gray-300' },
  };

  const typeConfig: Record<string, { label: string; color: string }> = {
    full_time: { label: 'Full-time', color: 'border-blue-600 text-blue-600' },
    part_time: { label: 'Part-time', color: 'border-purple-600 text-purple-600' },
    freelance: { label: 'Freelance', color: 'border-orange-500 text-orange-500' },
    internship: { label: 'Thực tập', color: 'border-green-500 text-green-500' },
    contract: { label: 'Hợp đồng', color: 'border-gray-600 text-gray-600' },
  };

  const handleView = (id: string) => {
    setOpenDropdownId(null);
    router.push(`/JobList/JobDetail?id=${id}`);
  };

  const handleHide = (id: string) => {
    const job = jobs.find(j => j.id === id);
    setSelectedJobId(id);
    // Check if job is currently hidden by status
    setConfirmAction(job?.status === 'hidden' ? 'unhide' : 'hide');
    setShowConfirmModal(true);
    setOpenDropdownId(null);
  };

  const handleDelete = (id: string) => {
    setSelectedJobId(id);
    setConfirmAction('delete');
    setShowConfirmModal(true);
    setOpenDropdownId(null);
  };

  const confirmHandler = async () => {
    if (!selectedJobId) return;

    try {
      if (confirmAction === 'delete') {
        await deleteJob(selectedJobId);
        setJobs(prev => prev.filter(j => j.id !== selectedJobId));
        showToast('Xóa công việc thành công!');
      } else if (confirmAction === 'hide') {
        await hideJob(selectedJobId);
        setJobs(prev => prev.map(j => j.id === selectedJobId ? { ...j, status: 'hidden', isHidden: true } : j));
        showToast('Ẩn công việc thành công!');
      } else if (confirmAction === 'unhide') {
        await unhideJob(selectedJobId);
        setJobs(prev => prev.map(j => j.id === selectedJobId ? { ...j, status: 'active', isHidden: false } : j));
        showToast('Hủy ẩn công việc thành công!');
      }
    } catch (error: any) {
      console.error('Error performing action:', error);
      showToast(`Lỗi: ${error.response?.data?.message || error.message || 'Vui lòng thử lại'}`, 'error');
    } finally {
      setShowConfirmModal(false);
      setConfirmAction(null);
      setSelectedJobId(null);
    }
  };

  const cancelHandler = () => {
    setShowConfirmModal(false);
    setConfirmAction(null);
    setSelectedJobId(null);
  };

  const getModalContent = () => {
    switch (confirmAction) {
      case 'hide':
        return {
          title: 'Xác nhận ẩn',
          message: 'Bạn có chắc chắn muốn ẩn công việc này không?',
          confirmText: 'Ẩn',
          confirmClass: 'bg-orange-600 hover:bg-orange-700'
        };
      case 'unhide':
        return {
          title: 'Xác nhận hủy ẩn',
          message: 'Bạn có chắc chắn muốn hủy ẩn công việc này không?',
          confirmText: 'Hủy ẩn',
          confirmClass: 'bg-green-600 hover:bg-green-700'
        };
      case 'delete':
        return {
          title: 'Xác nhận xóa',
          message: 'Bạn có chắc chắn muốn xóa công việc này không? Hành động này không thể hoàn tác.',
          confirmText: 'Xóa',
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

  const filterOptions = [
    { value: 'all', label: 'Tất cả', count: jobs.length },
    { value: 'pending_approval', label: 'Chờ duyệt', count: jobs.filter(j => j.status === 'pending_approval').length },
    { value: 'active', label: 'Đã đăng', count: jobs.filter(j => j.status === 'active').length },
    { value: 'hidden', label: 'Đã ẩn', count: jobs.filter(j => j.status === 'hidden').length },
    { value: 'closed', label: 'Đã đóng', count: jobs.filter(j => j.status === 'closed').length },
    { value: 'expired', label: 'Hết hạn', count: jobs.filter(j => j.status === 'expired').length },
  ];

  const getStatusLabel = (value: string) => filterOptions.find(opt => opt.value === value)?.label || 'Tất cả';

  const filteredJobs = useMemo(() => {
    let data = jobs;
    if (statusFilter !== 'all') {
      data = data.filter(job => job.status === statusFilter);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      data = data.filter(job => job.title.toLowerCase().includes(query));
    }
    return data;
  }, [jobs, statusFilter, searchQuery]);

  return (
    <>
      <Header />
      <div className="bg-white rounded-xl shadow-sm min-h-screen">
        {/* Header */}
        <div className="p-6">
          {/* Total count header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Tổng số công việc: {totalJobs}</h2>
          </div>

          {/* Search & Filter controls with result count */}
          <div className="flex items-center justify-between gap-4 mb-4">
            {/* Result count message on left */}
            <div className="text-sm text-gray-600 min-w-[200px]">
              {(searchQuery || statusFilter !== 'all') && (
                <>
                  {filteredJobs.length > 0 ? (
                    <span>Đã tìm thấy <strong>{filteredJobs.length}</strong> kết quả</span>
                  ) : (
                    <span className="text-red-600">Không tìm thấy kết quả nào</span>
                  )}
                </>
              )}
            </div>
            
            {/* Search & Filter on right */}
            <div className="flex items-center gap-3">
              {/* Search Input */}
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm"
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
                  className={`flex items-center justify-between gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors w-48 ${
                    statusFilter !== 'all'
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Filter className="w-4 h-4 shrink-0" />
                    <span className="truncate">{getStatusLabel(statusFilter)}</span>
                  </div>
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
                        Lọc theo tình trạng
                      </div>
                      {filterOptions.map(option => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setStatusFilter(option.value);
                            setShowFilterDropdown(false);
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
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-600'
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
        </div>

        {/* Table Header */}
        <div className="border border-gray-200 rounded-lg bg-gray-50">
          <div className="grid grid-cols-[2fr_1.2fr_1.2fr_1.2fr_1fr_1fr_auto] gap-4 py-4 px-4 text-sm font-medium text-gray-600">
            <div className="flex items-center">
              Vị trí
            </div>
            <div className="flex items-center">
              Tình trạng
            </div>
            <div className="flex items-center">
              Ngày đăng
            </div>
            <div className="flex items-center">
              Hạn chót
            </div>
            <div className="flex items-center">
              Hình thức
            </div>
            <div className="flex items-center">
              Số lượng
            </div>
            <div className="w-10"></div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-4 text-gray-600">Đang tải danh sách công việc...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="p-12 text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-900 font-medium mb-2">Không thể tải dữ liệu</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Table Body */}
      {!loading && !error && (
      <div className="divide-y px-6">
        {filteredJobs.map((job) => {
          const formatDate = (dateStr: string) => {
            const date = new Date(dateStr);
            const dd = String(date.getDate()).padStart(2, '0');
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const yyyy = date.getFullYear();
            return `${dd}/${mm}/${yyyy}`;
          };
          
          return (
          <div key={job.id} className="grid grid-cols-[2fr_1.2fr_1.2fr_1.2fr_1fr_1fr_auto] gap-4 py-4 hover:bg-gray-50 items-center">
            <div>
              <button 
                onClick={() => handleView(job.id)}
                className="font-medium text-gray-900 hover:text-blue-600 hover:underline text-left"
              >
                {job.title}
              </button>
            </div>
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${statusConfig[job.status]?.color || 'bg-gray-100 text-gray-600 border-gray-300'}`}>
                {statusConfig[job.status]?.label || job.status}
              </span>
            </div>
            <div className="text-gray-600 text-sm">
              {formatDate(job.createdAt)}
            </div>
            <div className="text-gray-600 text-sm">
              {formatDate(job.expiredAt)}
            </div>
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${typeConfig[job.employmentType]?.color || 'border-gray-600 text-gray-600'}`}>
                {typeConfig[job.employmentType]?.label || job.employmentType}
              </span>
            </div>
            <div className="text-gray-600 text-sm">
              <span className="font-medium text-gray-900">{job.applyCount || 0}</span>
              <span className="text-gray-400">/{job.quantity}</span>
            </div>
            <div className="w-10 flex items-center justify-center">
              <div className="relative">
                <button
                  onClick={() => setOpenDropdownId(openDropdownId === job.id ? null : job.id)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
                {openDropdownId === job.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <button 
                      onClick={() => handleView(job.id)}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Xem chi tiết</span>
                    </button>
                    <button
                      onClick={() => handleHide(job.id)}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                      {job.status === 'hidden' ? (
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
                      onClick={() => handleDelete(job.id)}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Xóa</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          );
        })}
      </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredJobs.length === 0 && (
        <div className="p-12 text-center">
          <p className="text-gray-600">Không tìm thấy công việc nào</p>
        </div>
      )}

      {/* Footer Pagination */}
      {!loading && !error && totalJobs > 0 && (
      <div className="p-4 border-t">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          {/* Page numbers */}
          {Array.from({ length: Math.ceil(totalJobs / itemsPerPage) }, (_, i) => i + 1).map(pageNum => (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`px-4 py-2 rounded-lg ${
                currentPage === pageNum
                  ? 'bg-green-500 text-white'
                  : 'border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {pageNum}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={currentPage >= Math.ceil(totalJobs / itemsPerPage)}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <div className="text-center mt-2 text-sm text-gray-600">
          Trang {currentPage} / {Math.ceil(totalJobs / itemsPerPage)} - Tổng {totalJobs} công việc
        </div>
      </div>
      )}

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
    </>
  );
}