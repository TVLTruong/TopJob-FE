'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Lock, LockOpen, Trash2, Users, Filter, Eye } from 'lucide-react';
import Toast from '@/app/components/profile/Toast';
import AccountDetailModal from './AccountDetailModal';
import EmployerDetailModal from './EmployerDetailModal';
import {
  getEmployerAccounts,
  getCandidateAccounts,
  getEmployerDetail,
  getCandidateDetail,
  banEmployer,
  unbanEmployer,
  deleteEmployer,
  banCandidate,
  unbanCandidate,
  deleteCandidate,
} from '@/utils/api/admin-api';

interface Account {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export default function AccountManagementList() {
  const [activeTab, setActiveTab] = useState<'employer' | 'candidate'>('employer');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'locked'>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [employerAccounts, setEmployerAccounts] = useState<Account[]>([]);
  const [candidateAccounts, setCandidateAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'lock' | 'unlock' | 'delete';
    accountId: string;
    accountName: string;
    currentStatus?: boolean;
  } | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [showEmployerDetailModal, setShowEmployerDetailModal] = useState(false);
  const [selectedEmployerProfile, setSelectedEmployerProfile] = useState<any | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const showToast = (message: string, type: 'error' | 'success' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch accounts data
  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const response = activeTab === 'employer' 
        ? await getEmployerAccounts(searchQuery, currentPage, 10)
        : await getCandidateAccounts(searchQuery, currentPage, 10);
      
      if (response?.data) {
        const mappedData = response.data.map((item: any) => ({
          id: item.id,
          name: activeTab === 'employer' 
            ? (item.employer?.companyName || 'N/A')
            : (item.candidate?.fullName || 'N/A'),
          email: item.email || 'N/A',
          phone: activeTab === 'employer'
            ? (item.employer?.phoneNumber || '')
            : (item.candidate?.phoneNumber || ''),
          avatar: activeTab === 'employer'
            ? (item.employer?.logoUrl || '')
            : (item.candidate?.avatarUrl || ''),
          isActive: item.status === 'active',
          createdAt: item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : 'N/A',
          lastLogin: item.lastLogin ? new Date(item.lastLogin).toLocaleDateString('vi-VN') : undefined,
        }));

        if (activeTab === 'employer') {
          setEmployerAccounts(mappedData);
        } else {
          setCandidateAccounts(mappedData);
        }
        
        // Backend returns meta: { total, page, limit, totalPages }
        setTotalCount(response.meta?.total || response.total || response.data.length);
      }
    } catch (error: any) {
      showToast(error?.response?.data?.message || 'Không thể tải danh sách tài khoản', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch accounts when tab, search, or page changes
  useEffect(() => {
    fetchAccounts();
  }, [activeTab, currentPage]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        fetchAccounts();
      } else {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const accounts = activeTab === 'employer' ? employerAccounts : candidateAccounts;
  // Tổng số tài khoản hoạt động bao gồm cả NTD và ứng viên
  const totalActiveCount = employerAccounts.filter(acc => acc.isActive).length + 
                           candidateAccounts.filter(acc => acc.isActive).length;

  const filterOptions = [
    { value: 'all', label: 'Tất cả', count: accounts.length },
    { value: 'active', label: 'Hoạt động', count: accounts.filter(acc => acc.isActive).length },
    { value: 'locked', label: 'Đã khóa', count: accounts.filter(acc => !acc.isActive).length },
  ];

  const getActiveFilterLabel = () => {
    const option = filterOptions.find(opt => opt.value === statusFilter);
    return option?.label || 'Tất cả';
  };

  const handleToggleLock = async (accountId: string, currentStatus: boolean) => {
    try {
      if (currentStatus) {
        // Ban/Lock account
        const reason = 'Khóa bởi quản trị viên';
        if (activeTab === 'employer') {
          await banEmployer(accountId, reason);
        } else {
          await banCandidate(accountId, reason);
        }
        showToast('Đã khóa tài khoản', 'success');
      } else {
        // Unban/Unlock account
        if (activeTab === 'employer') {
          await unbanEmployer(accountId);
        } else {
          await unbanCandidate(accountId);
        }
        showToast('Đã mở khóa tài khoản', 'success');
      }
      
      // Refresh the list
      await fetchAccounts();
      setConfirmModal(null);
    } catch (error: any) {
      showToast(error?.response?.data?.message || 'Không thể thực hiện thao tác', 'error');
    }
  };

  const handleDelete = async (accountId: string) => {
    try {
      if (activeTab === 'employer') {
        await deleteEmployer(accountId);
      } else {
        await deleteCandidate(accountId);
      }
      showToast('Đã xóa tài khoản', 'success');
      
      // Refresh the list
      await fetchAccounts();
      setConfirmModal(null);
    } catch (error: any) {
      console.error('Error deleting account:', error);
      showToast(error?.response?.data?.message || 'Không thể xóa tài khoản', 'error');
    }
  };

  const handleViewDetails = async (account: Account) => {
    try {
      if (activeTab === 'employer') {
        // Fetch employer details
        const employerData = await getEmployerDetail(account.id);
        if (employerData) {
          // Transform API response to match EmployerDetailModal props
          const transformedData = {
            id: employerData.profile?.id || employerData.user?.id,
            companyName: employerData.profile?.companyName || 'N/A',
            companyLogo: employerData.profile?.logoUrl || '',
            email: employerData.user?.email || account.email,
            phone: employerData.profile?.contactPhone || account.phone || '',
            status: employerData.profile?.status === 'approved' ? 'approved' : 'pending_new',
            createdDate: employerData.user?.createdAt 
              ? new Date(employerData.user.createdAt).toLocaleDateString('vi-VN')
              : account.createdAt,
            registrationType: 'new' as const,
            description: employerData.profile?.description || '',
            website: employerData.profile?.website || '',
            foundingDate: employerData.profile?.foundedDate 
              ? employerData.profile.foundedDate.toString()
              : '',
            contactEmail: employerData.profile?.contactEmail || employerData.user?.email || '',
          };
          setSelectedEmployerProfile(transformedData);
          setShowEmployerDetailModal(true);
        }
      } else {
        // For candidates: show simple AccountDetailModal
        setSelectedAccount(account);
        setShowDetailModal(true);
      }
    } catch (error: any) {
      console.error('Error fetching account details:', error);
      showToast(error?.response?.data?.message || 'Không thể tải thông tin chi tiết', 'error');
    }
  };

  const filteredAccounts = useMemo(() => {
    return accounts.filter(acc => {
      const matchesStatus = statusFilter === 'all' ||
                           (statusFilter === 'active' && acc.isActive) ||
                           (statusFilter === 'locked' && !acc.isActive);
      return matchesStatus;
    });
  }, [accounts, statusFilter]);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const paginatedAccounts = filteredAccounts;

  return (
    <div className="bg-white rounded-lg border">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header with Title */}
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý tài khoản</h1>
      </div>

      {/* Active Account Count */}
      <div className="px-6 pt-6 pb-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
          <Users className="w-6 h-6 text-blue-600" />
          <div>
            <p className="text-sm text-gray-600">Tổng số tài khoản đang hoạt động</p>
            <p className="text-2xl font-bold text-blue-600">{totalActiveCount}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6">
        <div className="border-b">
          <div className="flex gap-8">
            <button
              onClick={() => {
                setActiveTab('employer');
                setCurrentPage(1);
              }}
              className={`pb-3 px-1 font-medium transition relative ${
                activeTab === 'employer'
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Nhà tuyển dụng
              {activeTab === 'employer' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab('candidate');
                setCurrentPage(1);
              }}
              className={`pb-3 px-1 font-medium transition relative ${
                activeTab === 'candidate'
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Ứng viên
              {activeTab === 'candidate' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email..."
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
                {filteredAccounts.length}
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
                          setStatusFilter(option.value as 'all' | 'active' | 'locked');
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
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-y">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày tạo
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
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    Đang tải...
                  </div>
                </td>
              </tr>
            ) : paginatedAccounts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Không tìm thấy tài khoản
                </td>
              </tr>
            ) : (
              paginatedAccounts.map((account) => (
                <tr key={account.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{account.name}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{account.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{account.createdAt}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        account.isActive
                          ? 'bg-green-100 text-green-600 border-green-300'
                          : 'bg-red-100 text-red-600 border-red-300'
                      }`}
                    >
                      {account.isActive ? 'Hoạt động' : 'Đã khóa'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetails(account)}
                        className="p-2.5 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition border-2 border-blue-200 hover:border-blue-300 font-semibold"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setConfirmModal({
                          isOpen: true,
                          type: account.isActive ? 'lock' : 'unlock',
                          accountId: account.id,
                          accountName: account.name,
                          currentStatus: account.isActive
                        })}
                        className={`p-2.5 rounded-lg transition border-2 font-semibold ${
                          account.isActive
                            ? 'text-orange-700 bg-orange-50 hover:bg-orange-100 border-orange-200 hover:border-orange-300'
                            : 'text-green-700 bg-green-50 hover:bg-green-100 border-green-200 hover:border-green-300'
                        }`}
                        title={account.isActive ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                      >
                        {account.isActive ? (
                          <Lock className="w-4 h-4" />
                        ) : (
                          <LockOpen className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => setConfirmModal({
                          isOpen: true,
                          type: 'delete',
                          accountId: account.id,
                          accountName: account.name
                        })}
                        className="p-2.5 text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition border-2 border-red-200 hover:border-red-300 font-semibold"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination - Always show */}
      <div className="flex items-center justify-between px-6 py-4 border-t">
        <div className="text-sm text-gray-500">
          {loading ? (
            'Đang tải...'
          ) : (
            <>
              Hiển thị {filteredAccounts.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} -{' '}
              {Math.min(currentPage * itemsPerPage, totalCount)} trong tổng số{' '}
              {totalCount} tài khoản
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1 || loading}
            className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1">
            {totalPages > 0 && Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              // Show first page, last page, current page and pages around it
              if (totalPages <= 5) {
                return i + 1;
              }
              if (currentPage <= 3) {
                return i + 1;
              }
              if (currentPage >= totalPages - 2) {
                return totalPages - 4 + i;
              }
              return currentPage - 2 + i;
            }).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                disabled={loading}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0 || loading}
            className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModal?.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {confirmModal.type === 'delete' && 'Xác nhận xóa tài khoản'}
              {confirmModal.type === 'lock' && 'Xác nhận khóa tài khoản'}
              {confirmModal.type === 'unlock' && 'Xác nhận mở khóa tài khoản'}
            </h3>
            <p className="text-gray-600 mb-6">
              {confirmModal.type === 'delete' && (
                <>
                  Bạn có chắc chắn muốn <span className="font-semibold text-red-600">xóa vĩnh viễn</span> tài khoản{' '}              
                  <span className="font-semibold">{confirmModal.accountName}</span>?
                  <br />
                  <span className="text-sm text-red-600 mt-2 block">Hành động này không thể hoàn tác!</span>
                </>
              )}
              {confirmModal.type === 'lock' && (
                <>
                  Bạn có chắc chắn muốn <span className="font-semibold text-orange-600">khóa</span> tài khoản{' '}
                  <span className="font-semibold">{confirmModal.accountName}</span>?
                  <br />
                  <span className="text-sm text-gray-500 mt-2 block">Tài khoản sẽ không thể đăng nhập sau khi bị khóa.</span>
                </>
              )}
              {confirmModal.type === 'unlock' && (
                <>
                  Bạn có chắc chắn muốn <span className="font-semibold text-green-600">mở khóa</span> tài khoản{' '}
                  <span className="font-semibold">{confirmModal.accountName}</span>?
                  <br />
                  <span className="text-sm text-gray-500 mt-2 block">Tài khoản sẽ có thể đăng nhập trở lại.</span>
                </>
              )}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  if (confirmModal.type === 'delete') {
                    handleDelete(confirmModal.accountId);
                  } else {
                    handleToggleLock(confirmModal.accountId, confirmModal.currentStatus!);
                  }
                }}
                className={`px-4 py-2 rounded-lg font-bold transition border-2 ${
                  confirmModal.type === 'delete'
                    ? 'bg-red-600 hover:bg-red-700 text-white border-red-700'
                    : confirmModal.type === 'lock'
                    ? 'bg-orange-600 hover:bg-orange-700 text-white border-orange-700'
                    : 'bg-green-600 hover:bg-green-700 text-white border-green-700'
                }`}
              >
                {confirmModal.type === 'delete' && 'Xóa'}
                {confirmModal.type === 'lock' && 'Khóa'}
                {confirmModal.type === 'unlock' && 'Mở khóa'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Account Detail Modal */}
      {showDetailModal && selectedAccount && (
        <AccountDetailModal
          account={selectedAccount}
          accountType={activeTab}
          onClose={() => setShowDetailModal(false)}
        />
      )}

      {/* Employer Detail Modal */}
      {showEmployerDetailModal && selectedEmployerProfile && (
        <EmployerDetailModal
          employer={selectedEmployerProfile}
          onClose={() => {
            setShowEmployerDetailModal(false);
            setSelectedEmployerProfile(null);
          }}
        />
      )}
    </div>
  );
}
