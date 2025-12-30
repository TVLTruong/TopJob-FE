'use client';
import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Search, ChevronLeft, ChevronRight, Filter, Eye, Check, X } from 'lucide-react';
import RejectModal from './RejectModal';
import ApproveModal from './ApproveModal';
import EmployerDetailModal from './EmployerDetailModal';
import { getEmployersForApproval, approveEmployer, rejectEmployer, getEmployerProfile } from '@/utils/api/admin-api';
import Toast from '@/app/components/profile/Toast';

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
  foundingDate?: string;
  industries?: string[];
  technologies?: string[];
  benefits?: string[];
  contactEmail?: string;
  facebookUrl?: string;
  linkedlnUrl?: string;
  xUrl?: string;
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
  const [statusFilter, setStatusFilter] = useState<string>('pending');
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
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  // Show toast helper
  const showToast = (message: string, type: 'error' | 'success' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch employers from API
  const fetchEmployers = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      // Xử lý filter 'pending' để lấy cả PENDING_APPROVAL và PENDING_EDIT_APPROVAL
      if (statusFilter === 'pending') {
        // Gọi API không có status filter để lấy tất cả, sau đó filter ở client
        response = await getEmployersForApproval(undefined, currentPage, 10);
      } else {
        const status = statusFilter !== 'all' ? statusFilter : undefined;
        response = await getEmployersForApproval(status, currentPage, 10);
      }
      
      // Map BE data to FE format
      const mappedEmployers = response.data.map((emp: EmployerProfileAPI) => {
        // Convert BE status to FE status
        type FEStatus = 'pending_new' | 'pending_edit' | 'approved' | 'rejected';

        const feStatus: FEStatus | null = (() => {
          if (emp.status === 'PENDING_APPROVAL') return 'pending_new';
          if (emp.status === 'ACTIVE' && emp.profileStatus === 'PENDING_EDIT_APPROVAL') return 'pending_edit';
          if (emp.status === 'ACTIVE') return 'approved';
          if (emp.status === 'REJECTED') return 'rejected';
          return null;
        })();

        if (!feStatus) return null;
        
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
      }).filter(Boolean) as EmployerProfile[];
      
      // Filter cho status 'pending' ở client-side để chỉ hiển thị hồ sơ cần duyệt
      let filteredData = mappedEmployers;
      if (statusFilter === 'pending') {
        filteredData = mappedEmployers.filter((emp: EmployerProfile) => 
          emp.status === 'pending_new' || emp.status === 'pending_edit'
        );
      }
      
      setEmployers(filteredData);
      setTotalCount(statusFilter === 'pending' ? filteredData.length : (response.meta?.total || response.data.length));
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
    { value: 'pending', label: 'Tất cả', count: employers.filter(e => e.status === 'pending_new' || e.status === 'pending_edit').length },
    { value: 'PENDING_APPROVAL', label: 'Chờ duyệt (Mới)', count: employers.filter(e => e.status === 'pending_new').length },
    { value: 'PENDING_EDIT_APPROVAL', label: 'Chờ duyệt (Sửa đổi)', count: employers.filter(e => e.status === 'pending_edit').length },
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
      // Fetch full employer details from API
      const response = await getEmployerProfile(employer.id.toString());
      console.log('Employer detail from API:', response);
      
      // Map API response to EmployerProfile format
      const fullEmployer: EmployerProfile = {
        ...employer,
        ...response,
        oldData: response.oldData, // Dữ liệu cũ từ API (cho trường hợp pending_edit)
      };
      
      setSelectedEmployer(fullEmployer);
      setShowDetailModal(true);
    } catch (err) {
      console.error('Error fetching employer detail:', err);
      showToast('Không thể tải chi tiết nhà tuyển dụng', 'error');
    }
  };

  const handleOpenApproveModal = (employer: EmployerProfile) => {
    setSelectedEmployer(employer);
    setShowApproveModal(true);
  };

  const handleApprove = async () => {
    if (!selectedEmployer) return;
    
    const employerName = selectedEmployer.companyName;
    
    try {
      // Ẩn modal xác nhận trước
      setShowApproveModal(false);
      
      // Call API to approve employer
      await approveEmployer(selectedEmployer.id.toString());
      
      // Hiển thị thông báo thành công
      setSuccessMessage(`Đã duyệt hồ sơ của ${employerName} thành công!`);
      setShowSuccessNotification(true);
      
      // Tự động ẩn sau 3 giây
      setTimeout(() => {
        setShowSuccessNotification(false);
      }, 3000);
      
      fetchEmployers(); // Refresh list
      showToast('Đã duyệt nhà tuyển dụng thành công', 'success');
    } catch (err) {
      console.error('Error approving employer:', err);
      showToast(err instanceof Error ? err.message : 'Không thể duyệt nhà tuyển dụng', 'error');
    }
  };

  const handleOpenRejectModal = (employer: EmployerProfile) => {
    setSelectedEmployer(employer);
    setShowRejectModal(true);
  };

  const handleReject = async (reason: string) => {
    if (!selectedEmployer) return;
    
    const employerName = selectedEmployer.companyName;
    
    try {
      // Ẩn modal xác nhận trước
      setShowRejectModal(false);
      
      // Call API to reject employer
      await rejectEmployer(selectedEmployer.id.toString(), reason);
      
      // Hiển thị thông báo thành công
      setSuccessMessage(`Đã từ chối hồ sơ của ${employerName}. Lý do: ${reason}`);
      setShowSuccessNotification(true);
      
      // Tự động ẩn sau 3 giây
      setTimeout(() => {
        setShowSuccessNotification(false);
      }, 3000);
      
      fetchEmployers(); // Refresh list
      showToast('Đã từ chối nhà tuyển dụng', 'success');
    } catch (err) {
      console.error('Error rejecting employer:', err);
      showToast(err instanceof Error ? err.message : 'Không thể từ chối nhà tuyển dụng', 'error');
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-y">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Logo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên công ty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedEmployers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Không có hồ sơ nào
                  </td>
                </tr>
              ) : (
                paginatedEmployers.map((employer) => (
                  <tr key={employer.id} className="hover:bg-gray-50">
                    {/* Logo */}
                    <td className="px-6 py-4">
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
                    </td>

                    {/* Company Name */}
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{employer.companyName}</div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 text-sm text-gray-600">{employer.email}</td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                          statusConfig[employer.status].color
                        }`}
                      >
                        {statusConfig[employer.status].label}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(employer)}
                          className="flex items-center gap-2 px-3 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition whitespace-nowrap"
                          title="Chi tiết"
                        >
                          <span className="text-sm">Xem chi tiết</span>
                        </button>

                        {employer.status === 'pending_new' || employer.status === 'pending_edit' ? (
                          <div className="flex items-center gap-2">
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
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500 italic whitespace-nowrap">
                            Đã xử lý
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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