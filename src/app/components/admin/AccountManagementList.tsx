'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Lock, LockOpen, Trash2, Users, Filter, Eye } from 'lucide-react';
import Toast from '@/app/components/profile/Toast';
import AccountDetailModal from './AccountDetailModal';
import EmployerDetailModal from './EmployerDetailModal';

interface Account {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

// Mock employer profile data with full details
const MOCK_EMPLOYER_PROFILES: Record<string, any> = {
  '1': {
    id: 1,
    companyName: 'Công ty TNHH FPT Software',
    companyLogo: 'https://via.placeholder.com/150',
    email: 'hr@fpt-software.com',
    phone: '024 7300 8800',
    taxCode: '0100861959',
    status: 'approved' as const,
    createdDate: '15/01/2024',
    registrationType: 'new' as const,
    description: 'FPT Software là công ty thành viên của Tập đoàn FPT. Được thành lập từ năm 1999, FPT Software hiện là công ty cung cấp dịch vụ công nghệ thông tin lớn nhất Việt Nam với hơn 28,000 nhân viên.',
    address: 'Tòa nhà FPT, Đường Duy Tân, Phường Dịch Vọng Hậu, Quận Cầu Giấy, Hà Nội',
    website: 'https://fptsoftware.com',
    foundingDate: '1999-01-13',
    industries: ['Công nghệ thông tin', 'Phần mềm', 'Dịch vụ IT'],
    technologies: ['Java', 'React', 'Node.js', 'Python', 'AI/ML', 'Cloud Computing'],
    benefits: [
      'Lương thưởng cạnh tranh, đánh giá tăng lương 2 lần/năm',
      'Chế độ bảo hiểm đầy đủ theo quy định',
      'Du lịch công ty hàng năm',
      'Đào tạo và phát triển kỹ năng chuyên môn',
      'Môi trường làm việc năng động, sáng tạo'
    ],
    contactEmail: 'tuyendung@fpt.com.vn',
    facebookUrl: 'https://facebook.com/fptsoftware',
    linkedlnUrl: 'https://linkedin.com/company/fpt-software',
    xUrl: 'https://twitter.com/fptsoftware',
    locations: [
      {
        province: 'Hà Nội',
        district: 'Cầu Giấy',
        detailedAddress: 'Tòa nhà FPT, Đường Duy Tân, Phường Dịch Vọng Hậu',
        isHeadquarters: true
      },
      {
        province: 'Hồ Chí Minh',
        district: 'Quận 7',
        detailedAddress: 'Lô E2a-7, Đường D1, Khu Công nghệ cao',
        isHeadquarters: false
      }
    ]
  },
  '2': {
    id: 2,
    companyName: 'Công ty Cổ phần Viettel Solutions',
    companyLogo: 'https://via.placeholder.com/150',
    email: 'tuyendung@viettel.com.vn',
    phone: '024 6273 9999',
    taxCode: '0100109106',
    status: 'approved' as const,
    createdDate: '20/02/2024',
    registrationType: 'new' as const,
    description: 'Viettel Solutions là công ty công nghệ thông tin hàng đầu tại Việt Nam, chuyên cung cấp các giải pháp chuyển đổi số toàn diện cho doanh nghiệp và chính phủ.',
    address: 'Tòa nhà Viettel, Đường Phạm Hùng, Mỹ Đình, Nam Từ Liêm, Hà Nội',
    website: 'https://viettelsolutions.vn',
    foundingDate: '2015-06-01',
    industries: ['Công nghệ thông tin', 'Chuyển đổi số', 'Viễn thông'],
    technologies: ['Java', 'Angular', '.NET', 'Oracle', 'Big Data', 'IoT'],
    benefits: [
      'Mức lương hấp dẫn với các chế độ thưởng',
      'Bảo hiểm sức khỏe cao cấp cho nhân viên và gia đình',
      'Cơ hội đào tạo và phát triển nghề nghiệp',
      'Môi trường làm việc chuyên nghiệp'
    ],
    contactEmail: 'hr@viettelsolutions.vn',
    linkedlnUrl: 'https://linkedin.com/company/viettel-solutions',
    locations: [
      {
        province: 'Hà Nội',
        district: 'Nam Từ Liêm',
        detailedAddress: 'Tòa nhà Viettel, Đường Phạm Hùng, Mỹ Đình',
        isHeadquarters: true
      }
    ]
  }
};

// Mock data
const MOCK_EMPLOYERS: Account[] = [
  {
    id: '1',
    name: 'Công ty TNHH FPT Software',
    email: 'hr@fpt-software.com',
    phone: '024 7300 8800',
    isActive: true,
    createdAt: '15/01/2024',
    lastLogin: '29/12/2024',
  },
  {
    id: '2',
    name: 'Công ty Cổ phần Viettel Solutions',
    email: 'tuyendung@viettel.com.vn',
    phone: '024 6273 9999',
    isActive: true,
    createdAt: '20/02/2024',
    lastLogin: '28/12/2024',
  },
  {
    id: '3',
    name: 'Công ty TNHH VNG Corporation',
    email: 'recruitment@vng.com.vn',
    phone: '028 7300 8000',
    isActive: false,
    createdAt: '05/03/2024',
    lastLogin: '15/12/2024',
  },
  {
    id: '4',
    name: 'Tập đoàn Công nghệ MISA',
    email: 'hr@misa.com.vn',
    phone: '024 3562 8868',
    isActive: true,
    createdAt: '10/04/2024',
    lastLogin: '29/12/2024',
  },
  {
    id: '5',
    name: 'Công ty CP Giải pháp Công nghệ TMA',
    email: 'jobs@tma.com.vn',
    phone: '028 3997 2222',
    isActive: true,
    createdAt: '25/04/2024',
    lastLogin: '27/12/2024',
  },
  {
    id: '6',
    name: 'Ngân hàng TMCP Techcombank',
    email: 'hr.tech@techcombank.com.vn',
    phone: '1800 588 822',
    isActive: true,
    createdAt: '01/05/2024',
    lastLogin: '29/12/2024',
  },
  {
    id: '7',
    name: 'Công ty TNHH Samsung Electronics',
    email: 'careers@samsung.vn',
    phone: '1800 588 889',
    isActive: false,
    createdAt: '15/06/2024',
    lastLogin: '10/12/2024',
  },
  {
    id: '8',
    name: 'Tập đoàn Vingroup',
    email: 'tuyendung@vingroup.net',
    phone: '024 3974 9999',
    isActive: true,
    createdAt: '20/07/2024',
    lastLogin: '28/12/2024',
  },
];

const MOCK_CANDIDATES: Account[] = [
  {
    id: '1',
    name: 'Nguyễn Văn An',
    email: 'nguyenvanan@gmail.com',
    phone: '0912345678',
    isActive: true,
    createdAt: '10/01/2024',
    lastLogin: '29/12/2024',
  },
  {
    id: '2',
    name: 'Trần Thị Bình',
    email: 'tranthibinh@yahoo.com',
    phone: '0923456789',
    isActive: true,
    createdAt: '15/02/2024',
    lastLogin: '28/12/2024',
  },
  {
    id: '3',
    name: 'Lê Hoàng Cường',
    email: 'lehoangcuong@outlook.com',
    phone: '0934567890',
    isActive: false,
    createdAt: '20/03/2024',
    lastLogin: '20/12/2024',
  },
  {
    id: '4',
    name: 'Phạm Minh Đức',
    email: 'phamminhduc@gmail.com',
    phone: '0945678901',
    isActive: true,
    createdAt: '25/03/2024',
    lastLogin: '29/12/2024',
  },
  {
    id: '5',
    name: 'Hoàng Thị Em',
    email: 'hoangthiem@yahoo.com',
    phone: '0956789012',
    isActive: true,
    createdAt: '05/04/2024',
    lastLogin: '27/12/2024',
  },
  {
    id: '6',
    name: 'Vũ Đức Giang',
    email: 'vuducgiang@gmail.com',
    phone: '0967890123',
    isActive: false,
    createdAt: '10/05/2024',
    lastLogin: '15/12/2024',
  },
  {
    id: '7',
    name: 'Đỗ Thị Hà',
    email: 'dothiha@outlook.com',
    phone: '0978901234',
    isActive: true,
    createdAt: '20/06/2024',
    lastLogin: '29/12/2024',
  },
  {
    id: '8',
    name: 'Bùi Văn Hùng',
    email: 'buivanhung@gmail.com',
    phone: '0989012345',
    isActive: true,
    createdAt: '25/07/2024',
    lastLogin: '28/12/2024',
  },
  {
    id: '9',
    name: 'Ngô Thị Lan',
    email: 'ngothilan@yahoo.com',
    phone: '0990123456',
    isActive: true,
    createdAt: '30/08/2024',
    lastLogin: '29/12/2024',
  },
  {
    id: '10',
    name: 'Đinh Văn Khoa',
    email: 'dinhvankhoa@gmail.com',
    phone: '0901234567',
    isActive: false,
    createdAt: '05/09/2024',
    lastLogin: '18/12/2024',
  },
];

export default function AccountManagementList() {
  const [activeTab, setActiveTab] = useState<'employer' | 'candidate'>('employer');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'locked'>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [employerAccounts, setEmployerAccounts] = useState<Account[]>(MOCK_EMPLOYERS);
  const [candidateAccounts, setCandidateAccounts] = useState<Account[]>(MOCK_CANDIDATES);
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

  const showToast = (message: string, type: 'error' | 'success' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

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

  const handleToggleLock = (accountId: string, currentStatus: boolean) => {
    if (activeTab === 'employer') {
      setEmployerAccounts(prev =>
        prev.map(acc =>
          acc.id === accountId ? { ...acc, isActive: !currentStatus } : acc
        )
      );
    } else {
      setCandidateAccounts(prev =>
        prev.map(acc =>
          acc.id === accountId ? { ...acc, isActive: !currentStatus } : acc
        )
      );
    }
    showToast(currentStatus ? 'Đã khóa tài khoản' : 'Đã mở khóa tài khoản', 'success');
    setConfirmModal(null);
  };

  const handleDelete = (accountId: string) => {
    if (activeTab === 'employer') {
      setEmployerAccounts(prev => prev.filter(acc => acc.id !== accountId));
    } else {
      setCandidateAccounts(prev => prev.filter(acc => acc.id !== accountId));
    }
    showToast('Đã xóa tài khoản', 'success');
    setConfirmModal(null);
  };

  const handleViewDetails = (account: Account) => {
    if (activeTab === 'employer') {
      // For employers: show full EmployerDetailModal with mock data
      const employerProfile = MOCK_EMPLOYER_PROFILES[account.id];
      if (employerProfile) {
        setSelectedEmployerProfile(employerProfile);
        setShowEmployerDetailModal(true);
      } else {
        showToast('Không tìm thấy thông tin chi tiết nhà tuyển dụng', 'error');
      }
    } else {
      // For candidates: show simple AccountDetailModal
      setSelectedAccount(account);
      setShowDetailModal(true);
    }
  };

  const filteredAccounts = useMemo(() => {
    return accounts.filter(acc => {
      const matchesSearch = acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           acc.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' ||
                           (statusFilter === 'active' && acc.isActive) ||
                           (statusFilter === 'locked' && !acc.isActive);
      return matchesSearch && matchesStatus;
    });
  }, [accounts, searchQuery, statusFilter]);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const paginatedAccounts = filteredAccounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
                Số điện thoại
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
            {paginatedAccounts.length === 0 ? (
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
                  <td className="px-6 py-4 text-sm text-gray-600">{account.phone || '-'}</td>
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
          Hiển thị {filteredAccounts.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} -{' '}
          {Math.min(currentPage * itemsPerPage, filteredAccounts.length)} trong tổng số{' '}
          {filteredAccounts.length} tài khoản
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
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
                className={`px-3 py-1 rounded-lg ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
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
          onApprove={() => {}}
          onReject={() => {}}
          isViewOnly={true}
        />
      )}
    </div>
  );
}
