'use client';
import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MoreVertical, Trash2, ChevronLeft, ChevronRight, Filter, X, AlertCircle } from 'lucide-react';

interface Applicant {
  id: number;
  name: string;
  avatar: string;
  position: string;
  status: 'pending' | 'approved' | 'passed' | 'rejected';
  appliedDate: string;
}

type StatusChangeModalType = {
  applicantId: number;
  currentStatus: 'pending' | 'approved' | 'passed' | 'rejected';
  applicantName: string;
} | null;

export default function ApplicantsTab() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApplicants, setSelectedApplicants] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [statusChangeModal, setStatusChangeModal] = useState<StatusChangeModalType>(null);
  const [confirmationModal, setConfirmationModal] = useState<{
    applicantId: number;
    applicantName: string;
    currentStatus: 'pending' | 'approved' | 'passed' | 'rejected';
    newStatus: 'pending' | 'approved' | 'passed' | 'rejected';
  } | null>(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [applicants, setApplicants] = useState<Applicant[]>([
    { id: 1, name: 'Jake Gyll', avatar: '👨', position: 'Senior Product Designer', status: 'pending', appliedDate: '24/05/2025' },
    { id: 2, name: 'Guy Hawkins', avatar: '👨‍🦰', position: 'UI/UX Researcher', status: 'pending', appliedDate: '24/05/2025' },
    { id: 3, name: 'Cyndy Lillibridge', avatar: '👩', position: 'Frontend Developer', status: 'passed', appliedDate: '24/05/2025' },
    { id: 4, name: 'Rodolfo Goode', avatar: '👨‍🦱', position: 'QA Automation Engineer', status: 'rejected', appliedDate: '24/05/2025' },
    { id: 5, name: 'Leif Floyd', avatar: '👨‍💼', position: 'Product Manager', status: 'approved', appliedDate: '24/05/2025' },
    { id: 6, name: 'Jenny Wilson', avatar: '👩‍🦰', position: 'Senior Backend Engineer', status: 'approved', appliedDate: '24/05/2025' },
    { id: 7, name: 'Jerome Bell', avatar: '👨‍🦲', position: 'Mobile Developer', status: 'pending', appliedDate: '24/05/2025' },
    { id: 8, name: 'Eleanor Pena', avatar: '👩‍🦱', position: 'Data Analyst', status: 'rejected', appliedDate: '24/05/2025' },
    { id: 9, name: 'Darrell Steward', avatar: '👨‍🦳', position: 'DevOps Engineer', status: 'passed', appliedDate: '24/05/2025' },
    { id: 10, name: 'Floyd Miles', avatar: '👨‍💻', position: 'Growth Marketer', status: 'pending', appliedDate: '24/05/2025' },
  ]);

  const statusConfig = {
    pending: { label: 'Chờ duyệt', color: 'bg-orange-100 text-orange-600 border-orange-300' },
    approved: { label: 'Đã duyệt', color: 'bg-green-100 text-green-600 border-green-300' },
    passed: { label: 'Đã đậu', color: 'bg-blue-100 text-blue-600 border-blue-300' },
    rejected: { label: 'Từ chối', color: 'bg-red-100 text-red-600 border-red-300' },
  };

  const filterOptions = [
    { value: 'all', label: 'Tất cả', count: applicants.length },
    { value: 'pending', label: 'Chờ duyệt', count: applicants.filter(a => a.status === 'pending').length },
    { value: 'approved', label: 'Đã duyệt', count: applicants.filter(a => a.status === 'approved').length },
    { value: 'passed', label: 'Đã đậu', count: applicants.filter(a => a.status === 'passed').length },
    { value: 'rejected', label: 'Từ chối', count: applicants.filter(a => a.status === 'rejected').length },
  ];

  // Filter and search logic
  const filteredApplicants = useMemo(() => {
    let filtered = applicants;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(a => a.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(a => 
        a.name.toLowerCase().includes(query) ||
        a.appliedDate.includes(query)
      );
    }

    return filtered;
  }, [applicants, statusFilter, searchQuery]);

  const toggleSelectAll = () => {
    if (selectedApplicants.length === filteredApplicants.length) {
      setSelectedApplicants([]);
    } else {
      setSelectedApplicants(filteredApplicants.map(a => a.id));
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedApplicants(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleDelete = (id: number) => {
    setApplicants(prev => prev.filter(a => a.id !== id));
    setOpenDropdownId(null);
  };

  const handleBulkDelete = () => {
    setApplicants(prev => prev.filter(a => !selectedApplicants.includes(a.id)));
    setSelectedApplicants([]);
  };

  const getActiveFilterLabel = () => {
    const option = filterOptions.find(opt => opt.value === statusFilter);
    return option?.label || 'Tất cả';
  };

  const handleOpenProfile = () => {
    router.push('/profile');
  };

  const handleOpenJobDetail = () => {
    router.push('/JobList/JobDetail');
  };

  // Logic for status change
  const getAvailableStatuses = (currentStatus: 'pending' | 'approved' | 'passed' | 'rejected') => {
    switch (currentStatus) {
      case 'pending':
        return [{ value: 'approved', label: 'Đã duyệt' }];
      case 'approved':
        return [
          { value: 'passed', label: 'Đã đậu' },
          { value: 'rejected', label: 'Từ chối' }
        ];
      case 'passed':
      case 'rejected':
        return [];
      default:
        return [];
    }
  };

  const handleStatusChangeClick = (applicant: Applicant) => {
    const availableStatuses = getAvailableStatuses(applicant.status);
    
    if (availableStatuses.length === 0) {
      setNotificationMessage(`Không thể thay đổi trạng thái "${statusConfig[applicant.status].label}"`);
      setShowNotificationModal(true);
      return;
    }

    setStatusChangeModal({
      applicantId: applicant.id,
      currentStatus: applicant.status,
      applicantName: applicant.name
    });
  };

  const handleSelectNewStatus = (newStatus: 'pending' | 'approved' | 'passed' | 'rejected') => {
    if (!statusChangeModal) return;

    setConfirmationModal({
      applicantId: statusChangeModal.applicantId,
      applicantName: statusChangeModal.applicantName,
      currentStatus: statusChangeModal.currentStatus,
      newStatus: newStatus
    });
    setStatusChangeModal(null);
  };

  const handleConfirmStatusChange = () => {
    if (!confirmationModal) return;

    setApplicants(prev =>
      prev.map(applicant =>
        applicant.id === confirmationModal.applicantId
          ? { ...applicant, status: confirmationModal.newStatus }
          : applicant
      )
    );

    setConfirmationModal(null);
  };

  const handleCancelStatusChange = () => {
    setStatusChangeModal(null);
  };

  const handleCancelConfirmation = () => {
    setConfirmationModal(null);
  };


  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">
            Tổng số ứng viên: {filteredApplicants.length}
            {searchQuery && ` (tìm thấy từ ${applicants.length})`}
          </h2>
        </div>

        {/* Active Filters Display (reserve space to avoid layout jump) */}
        <div className="mb-4 min-h-[40px]">
          {(searchQuery || statusFilter !== 'all') ? (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-600">Đang lọc:</span>
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {`Tìm kiếm: "${searchQuery}"`}
                  <button
                    onClick={() => setSearchQuery('')}
                    className="hover:text-gray-900"
                  >
                    ×
                  </button>
                </span>
              )}
              {statusFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {getActiveFilterLabel()}
                  <button
                    onClick={() => setStatusFilter('all')}
                    className="hover:text-blue-900"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          ) : null}
        </div>

        {/* Search & Filter controls near table */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          {/* Search Input */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, ngày..."
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
                {filteredApplicants.length}
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

        {/* Active Filters Display */}
        {(searchQuery || statusFilter !== 'all') && (
          <div className="mb-4 flex flex-wrap gap-2 items-center">
            {searchQuery && (
              <span className="px-3 py-1 bg-gray-100 border rounded-full text-sm">
                {`Tìm: "${searchQuery}"`}
              </span>
            )}
            {statusFilter !== 'all' && (
              <span className="px-3 py-1 bg-gray-100 border rounded-full text-sm">
                {`Trạng thái: ${statusFilter}`}
              </span>
            )}
            <button
              onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
              className="text-sm text-blue-600 ml-2"
            >
              Clear
            </button>
          </div>
        )}

        {/* Table Header */}
        <div className="border border-gray-200 rounded-lg bg-gray-50">
          <div className="grid grid-cols-[48px_2fr_2fr_1.5fr_1.5fr_1fr] gap-4 py-4 px-4 text-sm font-medium text-gray-600">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={filteredApplicants.length > 0 && selectedApplicants.length === filteredApplicants.length}
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded border-gray-300"
              />
            </div>
            <div className="flex items-center gap-1">
              Họ tên
              <span className="text-gray-400">⇅</span>
            </div>
            <div className="flex items-center gap-1">
              Vị trí ứng
              <span className="text-gray-400">⇅</span>
            </div>
            <div className="flex items-center gap-1">
              Trạng thái
              <span className="text-gray-400">⇅</span>
            </div>
            <div className="flex items-center gap-1">
              Ngày ứng tuyển
              <span className="text-gray-400">⇅</span>
            </div>
            <div className="flex items-center gap-1">
              Tùy chọn
              <span className="text-gray-400">⇅</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y px-6">
        {filteredApplicants.length === 0 ? (
          <div className="py-12 text-center">
            <div className="text-gray-400 mb-2">
              <Search className="w-12 h-12 mx-auto mb-3" />
            </div>
            <p className="text-gray-600 font-medium">Không tìm thấy ứng viên</p>
            <p className="text-sm text-gray-500 mt-1">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
          </div>
        ) : (
          filteredApplicants.map((applicant) => (
            <div key={applicant.id} className="grid grid-cols-[48px_2fr_2fr_1.5fr_1.5fr_1fr] gap-4 py-4 hover:bg-gray-50 items-center">
              <div>
                <input
                  type="checkbox"
                  checked={selectedApplicants.includes(applicant.id)}
                  onChange={() => toggleSelect(applicant.id)}
                  className="w-4 h-4 rounded border-gray-300"
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleOpenProfile}
                  className="flex items-center gap-3 text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-2xl">
                    {applicant.avatar}
                  </div>
                  <span className="font-medium text-gray-900 hover:text-blue-600 underline-offset-2">
                    {applicant.name}
                  </span>
                </button>
              </div>
              <div className="text-sm text-gray-700">
                <button
                  type="button"
                  onClick={handleOpenJobDetail}
                  className="text-left w-full hover:text-blue-600"
                  title={applicant.position}
                >
                  <span className="truncate block">{applicant.position}</span>
                </button>
              </div>
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${statusConfig[applicant.status].color}`}>
                  {statusConfig[applicant.status].label}
                </span>
              </div>
              <div className="text-gray-600 text-sm">
                {applicant.appliedDate}
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleStatusChangeClick(applicant)}
                  className="min-w-[120px] px-4 py-1.5 border border-blue-600 text-blue-600 rounded-lg text-sm hover:bg-blue-50 whitespace-nowrap"
                >
                  Đổi trạng thái
                </button>
                <div className="relative">
                  <button
                    onClick={() => setOpenDropdownId(openDropdownId === applicant.id ? null : applicant.id)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                  {openDropdownId === applicant.id && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setOpenDropdownId(null)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                        <button
                          onClick={() => handleDelete(applicant.id)}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Xóa</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Pagination */}
      {filteredApplicants.length > 0 && (
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
      )}

      {/* Selected Actions Footer */}
      {selectedApplicants.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg py-4 px-6 z-50">
          <div className="max-w-md mx-auto flex flex-col items-center gap-4">
            <div className="text-lg font-medium">
              Đã chọn <span className="text-green-600">{selectedApplicants.length}</span> ứng viên
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSelectedApplicants([])}
                className="px-6 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
              >
                Hủy chọn
              </button>
              <button 
                onClick={handleBulkDelete}
                className="px-6 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Change Confirmation Modal */}
      {statusChangeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">Đổi trạng thái</h3>
                <button
                  onClick={handleCancelStatusChange}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-600 mb-2">
                  Ứng viên: <span className="font-semibold text-gray-900">{statusChangeModal.applicantName}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Trạng thái hiện tại: <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusConfig[statusChangeModal.currentStatus].color}`}>
                    {statusConfig[statusChangeModal.currentStatus].label}
                  </span>
                </p>
              </div>

              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-3">Chọn trạng thái mới:</p>
                <div className="space-y-2">
                  {getAvailableStatuses(statusChangeModal.currentStatus).map((status) => (
                    <button
                      key={status.value}
                      onClick={() => handleSelectNewStatus(status.value as 'pending' | 'approved' | 'passed' | 'rejected')}
                      className={`w-full px-4 py-3 rounded-lg border-2 text-left font-medium transition-all hover:shadow-md ${
                        status.value === 'passed' 
                          ? 'border-blue-500 text-blue-700 hover:bg-blue-50' 
                          : status.value === 'rejected'
                          ? 'border-red-500 text-red-700 hover:bg-red-50'
                          : 'border-green-500 text-green-700 hover:bg-green-50'
                      }`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleCancelStatusChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Final Confirmation Modal */}
      {confirmationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">Xác nhận đổi trạng thái</h3>
                <button
                  onClick={handleCancelConfirmation}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Bạn có chắc chắn muốn đổi trạng thái của ứng viên <span className="font-semibold text-gray-900">{confirmationModal.applicantName}</span>?
                </p>
                
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Từ:</span>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusConfig[confirmationModal.currentStatus].color}`}>
                      {statusConfig[confirmationModal.currentStatus].label}
                    </span>
                  </div>
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Sang:</span>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusConfig[confirmationModal.newStatus].color}`}>
                      {statusConfig[confirmationModal.newStatus].label}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCancelConfirmation}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Hủy
                </button>
                <button
                  onClick={handleConfirmStatusChange}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0">
                  <AlertCircle className="w-8 h-8 text-yellow-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Thông báo</h3>
                  <p className="text-gray-600">{notificationMessage}</p>
                </div>
              </div>
              
              <button
                onClick={() => setShowNotificationModal(false)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}