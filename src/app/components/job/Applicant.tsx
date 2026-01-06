'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MoreVertical, Trash2, ChevronLeft, ChevronRight, Filter, X, AlertCircle } from 'lucide-react';
import StatusChangeModal from '@/app/components/common/StatusChangeModal';
import { getJobApplications, type ApplicationFromAPI } from '@/utils/api/job-api';

interface Applicant {
  id: number;
  candidateId: string;
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

interface ApplicantsTabProps {
  jobId?: string;
}

export default function ApplicantsTab({ jobId }: ApplicantsTabProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApplicants, setSelectedApplicants] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  // Map BE status to FE status
  const mapApplicationStatus = (beStatus: ApplicationFromAPI['status']): Applicant['status'] => {
    switch (beStatus) {
      case 'NEW':
      case 'REVIEWING':
        return 'pending';
      case 'SHORTLISTED':
      case 'INTERVIEWING':
        return 'approved';
      case 'OFFERED':
      case 'HIRED':
        return 'passed';
      case 'REJECTED':
        return 'rejected';
      default:
        return 'pending';
    }
  };

  // Fetch applications from API
  useEffect(() => {
    const fetchApplications = async () => {
      if (!jobId) return;

      try {
        setLoading(true);
        setError(null);
        const response = await getJobApplications(jobId, currentPage, 10);
        
        // Map API data to component format
        const mappedApplicants = response.data.map((app: ApplicationFromAPI) => ({
          id: parseInt(app.id, 10),
          candidateId: app.candidateId,
          name: app.candidate?.fullName || 'Chưa có tên',
          avatar: app.candidate?.avatarUrl || '/default-avatar.png',
          position: 'Ứng viên', // We don't have position info in Application entity
          status: mapApplicationStatus(app.status),
          appliedDate: new Date(app.appliedAt).toLocaleDateString('vi-VN'),
        }));
        
        setApplicants(mappedApplicants);
        setTotalCount(response.meta?.total || response.data.length);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError(err instanceof Error ? err.message : 'Không thể tải danh sách ứng viên');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [jobId, currentPage]);

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

  const handleOpenProfile = (candidateId: string) => {
    router.push(`/AllApplicant/${candidateId}?from=jobDetail`);
  };

  const handleOpenJobDetail = () => {
    router.push('/JobList/JobDetail');
  };

  // Logic for status change
  const handleStatusChangeClick = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setShowStatusModal(true);
  };

  const handleStatusChange = (newStatus: 'pending' | 'approved' | 'passed' | 'rejected') => {
    if (!selectedApplicant) return;

    setApplicants(prev =>
      prev.map(applicant =>
        applicant.id === selectedApplicant.id
          ? { ...applicant, status: newStatus }
          : applicant
      )
    );
    
    setShowStatusModal(false);
    setSelectedApplicant(null);
  };

  const handleCancelStatusChange = () => {
    setShowStatusModal(false);
    setSelectedApplicant(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm min-h-screen">
      {/* Header */}
      <div className="p-6">
        {/* Total count header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Tổng số ứng viên: {totalCount}</h2>
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

        {/* Search & Filter controls with result count */}
        <div className="flex items-center justify-between gap-4 mb-4">
          {/* Result count message on left */}
          <div className="text-sm text-gray-600 min-w-[200px]">
            {(searchQuery || statusFilter !== 'all') && (
              <>
                {filteredApplicants.length > 0 ? (
                  <span>Đã tìm thấy <strong>{filteredApplicants.length}</strong> kết quả</span>
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
            </div>
            <div className="flex items-center gap-1">
              Vị trí ứng
            </div>
            <div className="flex items-center gap-1">
              Trạng thái
            </div>
            <div className="flex items-center gap-1">
              Ngày ứng tuyển
            </div>
            <div className="flex items-center gap-1">
              Tùy chọn
            </div>
          </div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y px-6 min-h-[600px]">
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
                  onClick={() => handleOpenProfile(applicant.candidateId)}
                  className="flex items-center gap-3 text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    <img 
                      src={applicant.avatar} 
                      alt={applicant.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"%3E%3Cpath d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"%3E%3C/path%3E%3Ccircle cx="12" cy="7" r="4"%3E%3C/circle%3E%3C/svg%3E';
                      }}
                    />
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
              <div className="text-gray-600 text-sm pl-[5px]">
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

      {/* Status Change Modal */}
      {showStatusModal && selectedApplicant && (
        <StatusChangeModal
          applicantName={selectedApplicant.name}
          currentStatus={selectedApplicant.status}
          onClose={() => {
            setShowStatusModal(false);
            setSelectedApplicant(null);
          }}
          onConfirm={handleStatusChange}
        />
      )}
    </div>
  );
}