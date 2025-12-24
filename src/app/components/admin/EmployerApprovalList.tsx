'use client';
import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Search, ChevronLeft, ChevronRight, Filter, Eye, Check, X } from 'lucide-react';
import RejectModal from './RejectModal';
import ApproveModal from './ApproveModal';
import EmployerDetailModal from './EmployerDetailModal';
import { getEmployersForApproval, approveEmployer, rejectEmployer, getEmployerProfile } from '@/utils/api/admin-api';

interface EmployerProfileAPI {
  id: string;
  companyName: string;
  logoUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  taxCode?: string;
  status: 'PENDING_APPROVAL' | 'PENDING_EDIT_APPROVAL' | 'ACTIVE' | 'REJECTED';
  profileStatus?: 'PENDING_EDIT_APPROVAL' | 'APPROVED';
  createdAt: string;
  description?: string;
  address?: string;
  website?: string;
  user?: {
    email?: string;
  };
}

interface EmployerProfile {
  id: number;
  companyName: string;
  companyLogo: string;
  email: string;
  phone: string;
  taxCode: string;
  status: 'pending_new' | 'pending_edit' | 'approved' | 'rejected';
  createdDate: string;
  registrationType?: 'new' | 'edit';
  description?: string;
  address?: string;
  website?: string;
  technologies?: string[];
  benefits?: string[];
  locations?: Array<{
    id?: string;
    province: string;
    district: string;
    detailedAddress: string;
    isHeadquarters: boolean;
  }>;
  oldData?: Partial<EmployerProfile>;
}

export default function EmployerApprovalList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEmployer, setSelectedEmployer] = useState<EmployerProfile | null>(null);
  const [employers, setEmployers] = useState<EmployerProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch employers from API
  const fetchEmployers = React.useCallback(async () => {

    try {
      setLoading(true);
      setError(null);
      const status = statusFilter !== 'all' ? statusFilter : undefined;
      const response = await getEmployersForApproval(status, currentPage, 10);
      
      // Map BE data to FE format
      const mappedEmployers = response.data.map((emp: EmployerProfileAPI) => {
        // Convert BE status to FE status
        let feStatus: 'pending_new' | 'pending_edit' | 'approved' | 'rejected';
        // Check both status and profileStatus for accurate mapping
        if (emp.status === 'PENDING_APPROVAL') {
          feStatus = 'pending_new';
        } else if (emp.status === 'ACTIVE' && emp.profileStatus === 'PENDING_EDIT_APPROVAL') {
          feStatus = 'pending_edit';
        } else if (emp.status === 'ACTIVE') {
          feStatus = 'approved';
        } else if (emp.status === 'REJECTED') {
          feStatus = 'rejected';
        } else {
          feStatus = 'pending_new';
        }
        
        return {
          id: parseInt(emp.id, 10),
          companyName: emp.companyName,
          companyLogo: emp.logoUrl || '',
          email: emp.contactEmail || emp.user?.email || '',
          phone: emp.contactPhone || '',
          taxCode: emp.taxCode || '',
          status: feStatus,
          createdDate: new Date(emp.createdAt as string).toLocaleDateString('vi-VN'),
          // Determine registration type based on both status and profileStatus
          registrationType: (emp.status === 'PENDING_APPROVAL' || 
                            (emp.status === 'ACTIVE' && emp.profileStatus !== 'PENDING_EDIT_APPROVAL'))
                            ? 'new' 
                            : 'edit',
          description: emp.description,
          address: emp.address,
          website: emp.website,
        };
      });
      
      setEmployers(mappedEmployers);
      setTotalCount(response.meta?.total || response.data.length);
    } catch (err) {
      console.error('Error fetching employers:', err);
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách nhà tuyển dụng');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, currentPage]);

  useEffect(() => {
    fetchEmployers();
  }, [fetchEmployers]);

  const statusConfig = {
    pending_new: { label: 'Chờ duyệt (Mới)', color: 'bg-orange-100 text-orange-600 border-orange-300' },
    pending_edit: { label: 'Chờ duyệt (Sửa đổi)', color: 'bg-yellow-100 text-yellow-600 border-yellow-300' },
    approved: { label: 'Đã duyệt', color: 'bg-green-100 text-green-600 border-green-300' },
    rejected: { label: 'Từ chối', color: 'bg-red-100 text-red-600 border-red-300' },
  };

  const filterOptions = [
    { value: 'all', label: 'Tất cả', count: totalCount },
    { value: 'PENDING_APPROVAL', label: 'Chờ duyệt (Mới)', count: employers.filter(e => e.status === 'pending_new').length },
    { value: 'PENDING_EDIT_APPROVAL', label: 'Chờ duyệt (Sửa đổi)', count: employers.filter(e => e.status === 'pending_edit').length },
    { value: 'ACTIVE', label: 'Đã duyệt', count: employers.filter(e => e.status === 'approved').length },
    { value: 'REJECTED', label: 'Từ chối', count: employers.filter(e => e.status === 'rejected').length },
  ];

  const filteredEmployers = useMemo(() => {
    let filtered = employers;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(e =>
        e.companyName.toLowerCase().includes(query) ||
        e.email.toLowerCase().includes(query) ||
        e.phone.includes(query)
      );
    }

    return filtered;
  }, [employers, searchQuery]);

  const getActiveFilterLabel = () => {
    const option = filterOptions.find(opt => opt.value === statusFilter);
    return option?.label || 'Tất cả';
  };

  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const paginatedEmployers = filteredEmployers;

  const handleViewDetails = async (employer: EmployerProfile) => {
    try {
      const response = await getEmployerProfile(employer.id.toString());
      console.log('Full API Response:', response);
      
      // Backend returns { employer, user, pendingEdits, hasPendingEdits } directly
      const detail = response.employer || {};
      console.log('Employer detail:', detail);
      
      // Determine correct registration type from detail
      const registrationType: 'new' | 'edit' = 
        (detail.status === 'ACTIVE' && detail.profileStatus === 'PENDING_EDIT_APPROVAL')
          ? 'edit'
          : 'new';
      
      // Map backend response to frontend interface
      const mappedEmployer = {
        ...employer,
        registrationType: registrationType,
        description: detail.description || employer.description,
        website: detail.website || employer.website,
        technologies: detail.technologies || [],
        benefits: detail.benefits || [],
        locations: detail.locations || [],
      };
      console.log('Mapped employer:', mappedEmployer);
      
      setSelectedEmployer(mappedEmployer);
      setShowDetailModal(true);
    } catch (err) {
      console.error('Error fetching employer detail:', err);
      alert('Không thể tải chi tiết nhà tuyển dụng');
    }
  };

  const handleOpenApproveModal = (employer: EmployerProfile) => {
    setSelectedEmployer(employer);
    setShowApproveModal(true);
  };

  const handleApprove = async () => {
    if (!selectedEmployer) return;
    
    try {
      await approveEmployer(selectedEmployer.id.toString());
      setShowApproveModal(false);
      fetchEmployers(); // Refresh list
      alert('Đã duyệt nhà tuyển dụng thành công');
    } catch (err) {
      console.error('Error approving employer:', err);
      alert(err instanceof Error ? err.message : 'Không thể duyệt nhà tuyển dụng');
    }
  };

  const handleOpenRejectModal = (employer: EmployerProfile) => {
    setSelectedEmployer(employer);
    setShowRejectModal(true);
  };

  const handleReject = async (reason: string) => {
    if (!selectedEmployer) return;
    
    try {
      await rejectEmployer(selectedEmployer.id.toString(), reason);
      setShowRejectModal(false);
      fetchEmployers(); // Refresh list
      alert('Đã từ chối nhà tuyển dụng');
    } catch (err) {
      console.error('Error rejecting employer:', err);
      alert(err instanceof Error ? err.message : 'Không thể từ chối nhà tuyển dụng');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="p-6">
        <div>
          <h2 className="text-2xl font-bold mb-6">
            Số hồ sơ cần duyệt: {employers.filter(e => e.status === 'pending_new' || e.status === 'pending_edit').length}
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
              placeholder="Tìm kiếm theo tên công ty, email, SĐT..."
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
                {filteredEmployers.length}
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
          <div className="grid grid-cols-[1fr_2fr_1.5fr_1.5fr_1.5fr_1fr] gap-4 py-4 px-4 text-sm font-medium text-gray-600 border-b border-gray-200">
            <div>Logo</div>
            <div className="flex items-center gap-1">
              Tên công ty
              <span className="text-gray-400">⇅</span>
            </div>
            <div className="flex items-center gap-1">
              Email
              <span className="text-gray-400">⇅</span>
            </div>
            {/* <div className="flex items-center gap-1">
              Mã số thuế
              <span className="text-gray-400">⇅</span>
            </div> */}
            <div className="flex items-center gap-1">
              Trạng thái
              <span className="text-gray-400">⇅</span>
            </div>
            <div>Thao tác</div>
          </div>

          {/* Table Body */}
          <div className="bg-white">
            {paginatedEmployers.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                Không có hồ sơ nào
              </div>
            ) : (
              paginatedEmployers.map((employer) => (
                <div
                  key={employer.id}
                  className="grid grid-cols-[1fr_2fr_1.5fr_1.5fr_1.5fr_1fr] gap-4 py-4 px-4 border-b border-gray-200 items-center hover:bg-gray-50 transition"
                >
                  {/* Logo */}
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                    {employer.companyLogo ? (
                      <Image
                        src={employer.companyLogo}
                        alt={employer.companyName}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400"></div>
                    )}
                  </div>

                  {/* Company Name */}
                  <div className="text-sm font-medium text-gray-900">{employer.companyName}</div>

                  {/* Email */}
                  <div className="text-sm text-gray-600">{employer.email}</div>

                  {/* Tax Code */}
                  <div className="text-sm text-gray-600">{employer.taxCode}</div>

                  {/* Status */}
                  <div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                        statusConfig[employer.status].color
                      }`}
                    >
                      {statusConfig[employer.status].label}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      onClick={() => handleViewDetails(employer)}
                      className="flex items-center gap-2 px-3 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition whitespace-nowrap"
                      title="Chi tiết"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">Chi tiết</span>
                    </button>

                    {employer.status === 'pending_new' || employer.status === 'pending_edit' ? (
                      <>
                        <button
                          onClick={() => handleOpenApproveModal(employer)}
                          className="p-2 text-white bg-green-600 hover:bg-green-700 rounded-lg transition"
                          title="Duyệt"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenRejectModal(employer)}
                          className="p-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
                          title="Từ chối"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <div className="px-3 py-2 text-sm text-gray-500 italic">
                        Đã xử lý
                      </div>
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
      {showDetailModal && selectedEmployer && (
        <EmployerDetailModal
          employer={selectedEmployer}
          onClose={() => setShowDetailModal(false)}
        />
      )}

      {showApproveModal && selectedEmployer && (
        <ApproveModal
          onClose={() => setShowApproveModal(false)}
          onConfirm={handleApprove}
          employerName={selectedEmployer.companyName}
        />
      )}

      {showRejectModal && selectedEmployer && (
        <RejectModal
          onClose={() => setShowRejectModal(false)}
          onConfirm={handleReject}
          employerName={selectedEmployer.companyName}
        />
      )}
    </div>
  );
}