'use client';
import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Search, ChevronLeft, ChevronRight, Filter, Check, X } from 'lucide-react';
import RejectModal from './RejectModal';
import ApproveModal from './ApproveModal';
import EmployerDetailModal from './EmployerDetailModal';
import { getEmployersForApproval, approveEmployer, rejectEmployer, getEmployerProfile, EmployerApprovalType } from '@/utils/api/admin-api';
import Toast from '@/app/components/profile/Toast';

interface EmployerProfileAPI {
  id: string;
  companyName: string;
  logoUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  taxCode?: string;
  status: 'pending_approval' | 'activate';
  profileStatus: 'pending_new_approval' | 'pending_edit_approval' | 'approved';
  createdAt: string;
  description?: string;
  address?: string;
  website?: string;
  user?: {
    email?: string;
    status?: string;
  };
}

interface EmployerProfile {
  id: number;
  companyName: string;
  companyLogo: string;
  email: string;
  phone: string;
  taxCode: string;
  status: 'pending_new' | 'pending_edit';
  createdDate: string;
  registrationType: 'new' | 'edit';
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
  const [statusFilter, setStatusFilter] = useState<EmployerApprovalType>(EmployerApprovalType.ALL);
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
      
      const response = await getEmployersForApproval(statusFilter, currentPage, 10);
      
      // Map BE data to FE format
      const mappedEmployers = response.data.map((emp: EmployerProfileAPI) => {
        // Determine FE status based on profileStatus
        let feStatus: 'pending_new' | 'pending_edit';
        let registrationType: 'new' | 'edit';
        
        if (emp.profileStatus === 'pending_new_approval') {
          feStatus = 'pending_new';
          registrationType = 'new';
        } else if (emp.profileStatus === 'pending_edit_approval') {
          feStatus = 'pending_edit';
          registrationType = 'edit';
        } else {
          return null; // Skip non-pending records
        }
        
        return {
          id: parseInt(emp.id, 10),
          companyName: emp.companyName,
          companyLogo: emp.logoUrl || '',
          email: emp.contactEmail || emp.user?.email || '',
          phone: emp.contactPhone || '',
          taxCode: emp.taxCode || '',
          status: feStatus,
          createdDate: new Date(emp.createdAt).toLocaleDateString('vi-VN'),
          registrationType,
          description: emp.description,
          address: emp.address,
          website: emp.website,
        };
      }).filter(Boolean) as EmployerProfile[];
      
      setEmployers(mappedEmployers);
      setTotalCount(response.meta?.total || mappedEmployers.length);
    } catch (err) {
      console.error('Error fetching employers:', err);
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách nhà tuyển dụng');
      showToast('Không thể tải danh sách nhà tuyển dụng', 'error');
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
  };

  const filterOptions = [
    { value: EmployerApprovalType.ALL, label: 'Tất cả', count: totalCount },
    { value: EmployerApprovalType.NEW, label: 'Chờ duyệt (Mới)', count: employers.filter(e => e.status === 'pending_new').length },
    { value: EmployerApprovalType.EDIT, label: 'Chờ duyệt (Sửa đổi)', count: employers.filter(e => e.status === 'pending_edit').length },
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
      console.log('employer categories from API:', response.employer.employerCategory);
      console.log('all employer fields from API:', Object.keys(response.employer));
      
      // Map API response to EmployerProfile format
      const fullEmployer: EmployerProfile = {
        ...employer, // This already has the correct FE status ('pending_new' or 'pending_edit')
        companyName: response.employer.companyName,
        companyLogo: response.employer.logoUrl || '',
        email: response.employer.contactEmail || response.user.email,
        phone: response.employer.contactPhone || '',
        description: response.employer.description,
        address: response.employer.locations?.[0]?.detailedAddress,
        website: response.employer.website,
        foundingDate: response.employer.foundedDate?.toString(),
        industries: response.employer.industries || undefined,
        technologies: response.employer.technologies || undefined,
        benefits: response.employer.benefits 
          ? response.employer.benefits.flatMap((b: string) => b.replace(/\\n/g, '\n').split('\n').filter((item: string) => item.trim()))
          : undefined,
        contactEmail: response.employer.contactEmail || undefined,
        facebookUrl: response.employer.facebookUrl || undefined,
        linkedlnUrl: response.employer.linkedlnUrl || undefined,
        xUrl: response.employer.xUrl || undefined,
        locations: response.employer.locations?.map((loc: any) => ({
          id: loc.id,
          province: loc.province,
          district: loc.district,
          detailedAddress: loc.detailedAddress || '',
          isHeadquarters: loc.isHeadquarters,
        })),
      };
      
      // Build oldData from pendingEdits if this is edit approval
      if (response.hasPendingEdits && response.pendingEdits && response.pendingEdits.length > 0) {
        const oldData: Partial<EmployerProfile> = {};
        
        response.pendingEdits.forEach((edit: any) => {
          const fieldName = edit.fieldName;
          const oldValue = edit.oldValue;
          const newValue = edit.newValue;

          // Parse old values based on field type
          if (fieldName === 'companyName') {
            oldData.companyName = oldValue;
            fullEmployer.companyName = newValue;
          } else if (fieldName === 'description') {
            oldData.description = oldValue;
            fullEmployer.description = newValue;
          } else if (fieldName === 'website') {
            oldData.website = oldValue;
            fullEmployer.website = newValue;
          } else if (fieldName === 'contactEmail') {
            oldData.contactEmail = oldValue;
            oldData.email = oldValue; // Also set email field
            fullEmployer.contactEmail = newValue;
            fullEmployer.email = newValue;
          } else if (fieldName === 'contactPhone') {
            oldData.phone = oldValue;
            fullEmployer.phone = newValue;
          } else if (fieldName === 'employerCategory') {
            oldData.industries = oldValue ? JSON.parse(oldValue) : [];
            fullEmployer.industries = newValue ? JSON.parse(newValue) : [];
          } else if (fieldName === 'technologies') {
            oldData.technologies = oldValue ? JSON.parse(oldValue) : [];
            fullEmployer.technologies = newValue ? JSON.parse(newValue) : [];
          } else if (fieldName === 'benefits') {
            const oldBenefits = oldValue ? JSON.parse(oldValue) : [];
            const newBenefits = newValue ? JSON.parse(newValue) : []; 
            oldData.benefits = oldBenefits.flatMap((b: string) => b.replace(/\\n/g, '\n').split('\n')).filter((item: string) => item.trim() !== '');
            fullEmployer.benefits = newBenefits.flatMap((b: string) => b.replace(/\\n/g, '\n').split('\n')).filter((item: string) => item.trim() !== '');
          } else if (fieldName === 'locations') {
            oldData.locations = oldValue ? JSON.parse(oldValue) : [];
            fullEmployer.locations = newValue ? JSON.parse(newValue) : [];
          } else if (fieldName === 'logoUrl') {
            oldData.companyLogo = oldValue;
            fullEmployer.companyLogo = newValue;
          } else if (fieldName === 'facebookUrl') {
            oldData.facebookUrl = oldValue;
            fullEmployer.facebookUrl = newValue;
          } else if (fieldName === 'linkedlnUrl') {
            oldData.linkedlnUrl = oldValue;
            fullEmployer.linkedlnUrl = newValue;
          } else if (fieldName === 'xUrl') {
            oldData.xUrl = oldValue;
            fullEmployer.xUrl = newValue;
          }
        });
        
        fullEmployer.oldData = oldData;
      }

      console.log('Full employer with oldData:', fullEmployer);
      console.log('Industries:', fullEmployer.industries);
      console.log('Old industries:', fullEmployer.oldData?.industries);
      console.log('Technologies:', fullEmployer.technologies);
      console.log('Old technologies:', fullEmployer.oldData?.technologies);
      
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
      // Close modal first
      setShowApproveModal(false);
      
      // Call API to approve employer
      await approveEmployer(selectedEmployer.id.toString());
      
      showToast(`Đã duyệt hồ sơ của ${employerName} thành công!`, 'success');
      
      // Refresh list
      fetchEmployers();
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
      // Close modal first
      setShowRejectModal(false);
      
      // Call API to reject employer
      await rejectEmployer(selectedEmployer.id.toString(), reason);
      
      showToast(`Đã từ chối hồ sơ của ${employerName}`, 'success');
      
      // Refresh list
      fetchEmployers();
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
            Số hồ sơ cần duyệt: {employers.length}
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
                statusFilter !== EmployerApprovalType.ALL
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
                  statusFilter !== EmployerApprovalType.ALL
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
                  {statusFilter !== EmployerApprovalType.ALL && (
                    <div className="border-t p-2">
                      <button
                        onClick={() => {
                          setStatusFilter(EmployerApprovalType.ALL);
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
          <div className="grid grid-cols-[1fr_2fr_2fr_1.5fr_1.5fr_1fr] gap-4 py-4 px-4 text-sm font-medium text-gray-600 border-b border-gray-200">
            <div>Logo</div>
            <div>Tên công ty</div>
            <div>Email</div>
            {/* <div>Mã số thuế</div> */}
            <div>Trạng thái</div>
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
                  className="grid grid-cols-[1fr_2fr_2fr_1.5fr_1.5fr_1fr] gap-4 py-4 px-4 border-b border-gray-200 items-center hover:bg-gray-50 transition"
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
                    {/* <td className="px-6 py-4"> */}
                      <div className="font-medium text-gray-900">{employer.companyName}</div>
                    {/* </td> */}

                  {/* Email */}
                  <div className="text-sm text-gray-600 truncate">{employer.email}</div>

                  {/* Tax Code */}
                  {/* <div className="text-sm text-gray-600">{employer.taxCode}</div> */}

                    {/* Status */}
                    {/* <td className="px-6 py-4"> */}
                    <div>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                          statusConfig[employer.status].color
                        }`}
                      >
                        {statusConfig[employer.status].label}
                      </span>
                    </div>
                    {/* </td> */}

                  {/* Actions */}
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      onClick={() => handleViewDetails(employer)}
                      className="px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition whitespace-nowrap"
                      title="Chi tiết"
                    >
                      Xem chi tiết
                    </button>

                    <button
                      onClick={() => handleOpenApproveModal(employer)}
                      className="p-1.5 text-white bg-green-600 hover:bg-green-700 rounded-lg transition"
                      title="Duyệt"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenRejectModal(employer)}
                      className="p-1.5 text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
                      title="Từ chối"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
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
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 rounded-lg transition ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
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
        )}
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
