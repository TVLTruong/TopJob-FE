'use client';
import React, { useMemo, useState } from 'react';
import { Search, MoreVertical, Trash2, Edit3, ChevronLeft, ChevronRight, Eye, EyeOff, X, Filter } from 'lucide-react';
import Header from '@/app/components/companyProfile/Header';

interface Job {
  id: number;
  title: string;
  status: 'pending' | 'active' | 'full' | 'closed';
  postedDate: string;
  deadline: string;
  type: 'fulltime' | 'freelance';
  applicants: number;
  totalQuantity: number;
  isHidden?: boolean;
}

export default function JobListingsTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'hide' | 'unhide' | 'delete' | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([
    { id: 1, title: 'Social Media Assistant', status: 'pending', postedDate: '26/04/2025', deadline: '26/05/2025', type: 'fulltime', applicants: 4, totalQuantity: 20 },
    { id: 2, title: 'Senior Designer', status: 'full', postedDate: '26/04/2025', deadline: '26/05/2025', type: 'fulltime', applicants: 24, totalQuantity: 24 },
    { id: 3, title: 'Visual Designer', status: 'pending', postedDate: '26/04/2025', deadline: '26/05/2025', type: 'freelance', applicants: 1, totalQuantity: 20 },
    { id: 4, title: 'Data Science', status: 'closed', postedDate: '26/04/2025', deadline: '26/05/2025', type: 'freelance', applicants: 10, totalQuantity: 26 },
    { id: 5, title: 'Kotlin Developer', status: 'full', postedDate: '26/04/2025', deadline: '26/05/2025', type: 'fulltime', applicants: 30, totalQuantity: 30 },
    { id: 6, title: 'React Developer', status: 'closed', postedDate: '26/04/2025', deadline: '26/05/2025', type: 'fulltime', applicants: 10, totalQuantity: 14 },
    { id: 7, title: 'C++ Developer', status: 'closed', postedDate: '26/04/2025', deadline: '26/05/2025', type: 'fulltime', applicants: 20, totalQuantity: 30 },
    { id: 8, title: 'Python Developer', status: 'closed', postedDate: '26/04/2025', deadline: '26/05/2025', type: 'fulltime', applicants: 20, totalQuantity: 30 },
    { id: 9, title: 'Java Developer', status: 'full', postedDate: '26/04/2025', deadline: '26/05/2025', type: 'fulltime', applicants: 30, totalQuantity: 30 },
    { id: 10, title: 'Rust Developer', status: 'pending', postedDate: '26/04/2025', deadline: '26/05/2025', type: 'fulltime', applicants: 5, totalQuantity: 30 },
  ]);

  const statusConfig = {
    pending: { label: 'Chờ duyệt', color: 'bg-orange-100 text-orange-600 border-orange-300' },
    active: { label: 'Đã đăng', color: 'bg-green-100 text-green-600 border-green-300' },
    full: { label: 'Đã đủ', color: 'bg-blue-100 text-blue-600 border-blue-300' },
    closed: { label: 'Đã đóng', color: 'bg-red-100 text-red-600 border-red-300' },
  };

  const typeConfig = {
    fulltime: { label: 'Fulltime', color: 'border-blue-600 text-blue-600' },
    freelance: { label: 'Freelance', color: 'border-orange-500 text-orange-500' },
  };

  const handleEdit = (id: number) => {
    console.log('Chỉnh sửa công việc:', id);
    setOpenDropdownId(null);
  };

  const handleHide = (id: number) => {
    const job = jobs.find(j => j.id === id);
    setSelectedJobId(id);
    setConfirmAction(job?.isHidden ? 'unhide' : 'hide');
    setShowConfirmModal(true);
    setOpenDropdownId(null);
  };

  const handleDelete = (id: number) => {
    setSelectedJobId(id);
    setConfirmAction('delete');
    setShowConfirmModal(true);
    setOpenDropdownId(null);
  };

  const confirmHandler = () => {
    if (confirmAction === 'delete' && selectedJobId) {
      setJobs(prev => prev.filter(j => j.id !== selectedJobId));
    } else if (confirmAction === 'hide' && selectedJobId) {
      setJobs(prev => prev.map(j => j.id === selectedJobId ? { ...j, isHidden: true } : j));
    } else if (confirmAction === 'unhide' && selectedJobId) {
      setJobs(prev => prev.map(j => j.id === selectedJobId ? { ...j, isHidden: false } : j));
    }
    setShowConfirmModal(false);
    setConfirmAction(null);
    setSelectedJobId(null);
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
    { value: 'pending', label: 'Chờ duyệt', count: jobs.filter(j => j.status === 'pending').length },
    { value: 'active', label: 'Đã đăng', count: jobs.filter(j => j.status === 'active').length },
    { value: 'full', label: 'Đã đủ', count: jobs.filter(j => j.status === 'full').length },
    { value: 'closed', label: 'Đã đóng', count: jobs.filter(j => j.status === 'closed').length },
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
          <h2 className="text-2xl font-bold">Tổng số công việc: {jobs.length}</h2>
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
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(prev => !prev)}
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

      {/* Table Body */}
      <div className="divide-y px-6">
        {filteredJobs.map((job) => (
          <div key={job.id} className="grid grid-cols-[2fr_1.2fr_1.2fr_1.2fr_1fr_1fr_auto] gap-4 py-4 hover:bg-gray-50 items-center">
            <div>
              <a href={"/JobList/JobDetail"} className="font-medium text-gray-900 hover:text-blue-600 hover:underline">
                {job.title}
              </a>
            </div>
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${statusConfig[job.status].color}`}>
                {statusConfig[job.status].label}
              </span>
            </div>
            <div className="text-gray-600 text-sm">
              {job.postedDate}
            </div>
            <div className="text-gray-600 text-sm">
              {job.deadline}
            </div>
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${typeConfig[job.type].color}`}>
                {typeConfig[job.type].label}
              </span>
            </div>
            <div className="text-gray-600 text-sm">
              <span className="font-medium text-gray-900">{job.applicants}</span>
              <span className="text-gray-400">/{job.totalQuantity}</span>
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
                      onClick={() => handleEdit(job.id)}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Sửa</span>
                    </button>
                    <button
                      onClick={() => handleHide(job.id)}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                      {job.isHidden ? (
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
        ))}
      </div>

      {/* Footer Pagination */}
      <div className="p-4 border-t">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="px-4 py-2 rounded-lg bg-green-500 text-white">
            1
          </button>
          <button className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
            2
          </button>
          <button
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

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
    </>
  );
}