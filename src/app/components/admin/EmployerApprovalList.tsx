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

// Mock data
const MOCK_EMPLOYERS: EmployerProfile[] = [
  {
    id: 1,
    companyName: 'Công ty TNHH Công nghệ ABC',
    companyLogo: '',
    email: 'hr@abc.com',
    phone: '0901234567',
    taxCode: '0123456789',
    status: 'pending_new',
    createdDate: '26/12/2025',
    registrationType: 'new',
    description: 'Công ty chuyên về phát triển phần mềm và giải pháp công nghệ cho doanh nghiệp. Chúng tôi có đội ngũ kỹ sư giàu kinh nghiệm và cam kết mang đến những sản phẩm chất lượng cao.',
    website: 'https://abc-tech.com',
    foundingDate: '2020-01-15',
    industries: ['Công nghệ thông tin', 'Phần mềm', 'Thương mại điện tử'],
    technologies: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS', 'Docker'],
    benefits: [
      'Lương thưởng cạnh tranh theo năng lực',
      'Thưởng hiệu suất hàng quý',
      'Bảo hiểm sức khỏe cao cấp',
      'Du lịch hàng năm',
      'Team building định kỳ',
      'Môi trường làm việc trẻ trung, năng động'
    ],
    contactEmail: 'contact@abc.com',
    facebookUrl: 'https://facebook.com/abctech',
    linkedlnUrl: 'https://linkedin.com/company/abc-tech',
    xUrl: 'https://x.com/abctech',
    locations: [
      {
        province: 'Hồ Chí Minh',
        district: 'Quận 1',
        detailedAddress: '123 Đường Nguyễn Huệ',
        isHeadquarters: true
      },
      {
        province: 'Hà Nội',
        district: 'Quận Hoàn Kiếm',
        detailedAddress: '456 Phố Tràng Tiền',
        isHeadquarters: false
      }
    ]
  },
  {
    id: 2,
    companyName: 'Tập đoàn XYZ Việt Nam',
    companyLogo: '',
    email: 'recruit@xyz.vn',
    phone: '0912345678',
    taxCode: '9876543210',
    status: 'pending_edit',
    createdDate: '25/12/2025',
    registrationType: 'edit',
    description: 'Tập đoàn đa quốc gia chuyên về tài chính và ngân hàng số. Chúng tôi đang tìm kiếm những tài năng trẻ để cùng phát triển trong kỷ nguyên chuyển đổi số.',
    website: 'https://xyz-group.vn',
    foundingDate: '2015-06-20',
    industries: ['Tài chính - Ngân hàng', 'Công nghệ thông tin', 'Fintech'],
    technologies: ['Java', 'Spring Boot', 'Angular', 'MongoDB', 'Kubernetes', 'Azure'],
    benefits: [
      'Lương gross lên đến 3000$',
      'Thưởng 13-16 tháng lương',
      'Bảo hiểm PVI cao cấp',
      'Nghỉ phép năm 15 ngày',
      'Đào tạo nâng cao kỹ năng'
    ],
    contactEmail: 'hr@xyz.vn',
    facebookUrl: 'https://facebook.com/xyzgroup',
    linkedlnUrl: 'https://linkedin.com/company/xyz-group',
    locations: [
      {
        province: 'Hồ Chí Minh',
        district: 'Quận 7',
        detailedAddress: '789 Đường Nguyễn Văn Linh',
        isHeadquarters: true
      }
    ]
  },
  {
    id: 3,
    companyName: 'Công ty Giải pháp DEF',
    companyLogo: '',
    email: 'jobs@def.com',
    phone: '0923456789',
    taxCode: '5555666677',
    status: 'approved',
    createdDate: '20/12/2025',
    registrationType: 'new',
    description: 'Chuyên cung cấp giải pháp Marketing và Quảng cáo số cho các doanh nghiệp lớn tại Việt Nam và khu vực.',
    website: 'https://def-solutions.com',
    foundingDate: '2018-03-10',
    industries: ['Marketing - Quảng cáo', 'Truyền thông - Media'],
    technologies: ['Python', 'Django', 'React', 'MySQL', 'Docker'],
    benefits: [
      'Lương cạnh tranh',
      'Thưởng theo dự án',
      'Team building hàng quý'
    ],
    contactEmail: 'info@def.com',
    locations: [
      {
        province: 'Hà Nội',
        district: 'Quận Cầu Giấy',
        detailedAddress: '101 Phố Duy Tân',
        isHeadquarters: true
      }
    ]
  },
  {
    id: 4,
    companyName: 'Startup GHI Technology',
    companyLogo: '',
    email: 'hello@ghi.tech',
    phone: '0934567890',
    taxCode: '7777888899',
    status: 'rejected',
    createdDate: '15/12/2025',
    registrationType: 'new',
    description: 'Startup về AI và Machine Learning, chuyên phát triển các sản phẩm thông minh cho ngành giáo dục.',
    website: 'https://ghi.tech',
    foundingDate: '2023-09-01',
    industries: ['Công nghệ thông tin', 'AI & Machine Learning', 'Giáo dục - Đào tạo'],
    technologies: ['Python', 'TensorFlow', 'Next.js', 'PostgreSQL', 'AWS'],
    benefits: [
      'Cổ phiếu startup',
      'Làm việc linh hoạt',
      'Môi trường sáng tạo'
    ],
    contactEmail: 'careers@ghi.tech',
    xUrl: 'https://x.com/ghitech',
    locations: [
      {
        province: 'Đà Nẵng',
        district: 'Quận Hải Châu',
        detailedAddress: '55 Đường Bạch Đằng',
        isHeadquarters: true
      }
    ]
  }
];

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
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch employers from API (using mock data for now)
  const fetchEmployers = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use mock data
      let filteredData = [...MOCK_EMPLOYERS];
      
      // Filter by status
      if (statusFilter !== 'all') {
        const statusMap: Record<string, 'pending_new' | 'pending_edit' | 'approved' | 'rejected'> = {
          'PENDING_APPROVAL': 'pending_new',
          'PENDING_EDIT_APPROVAL': 'pending_edit',
          'ACTIVE': 'approved',
          'REJECTED': 'rejected'
        };
        const feStatus = statusMap[statusFilter];
        if (feStatus) {
          filteredData = filteredData.filter(e => e.status === feStatus);
        }
      }
      
      setEmployers(filteredData);
      setTotalCount(filteredData.length);
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Use mock data - find the full employer data
      const fullEmployer = MOCK_EMPLOYERS.find(e => e.id === employer.id) || employer;
      
      console.log('Employer detail (mock):', fullEmployer);
      
      setSelectedEmployer(fullEmployer);
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
    
    const employerName = selectedEmployer.companyName;
    
    try {
      // Ẩn modal xác nhận trước
      setShowApproveModal(false);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      // await approveEmployer(selectedEmployer.id.toString());
      
      // Hiển thị thông báo thành công
      setSuccessMessage(`Đã duyệt hồ sơ của ${employerName} thành công!`);
      setShowSuccessNotification(true);
      
      // Tự động ẩn sau 3 giây
      setTimeout(() => {
        setShowSuccessNotification(false);
      }, 3000);
      
      fetchEmployers(); // Refresh list
    } catch (err) {
      console.error('Error approving employer:', err);
      setSuccessMessage(err instanceof Error ? err.message : 'Không thể duyệt nhà tuyển dụng');
      setShowSuccessNotification(true);
      setTimeout(() => {
        setShowSuccessNotification(false);
      }, 3000);
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
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      // await rejectEmployer(selectedEmployer.id.toString(), reason);
      
      // Hiển thị thông báo thành công
      setSuccessMessage(`Đã từ chối hồ sơ của ${employerName}. Lý do: ${reason}`);
      setShowSuccessNotification(true);
      
      // Tự động ẩn sau 3 giây
      setTimeout(() => {
        setShowSuccessNotification(false);
      }, 3000);
      
      fetchEmployers(); // Refresh list
    } catch (err) {
      console.error('Error rejecting employer:', err);
      setSuccessMessage(err instanceof Error ? err.message : 'Không thể từ chối nhà tuyển dụng');
      setShowSuccessNotification(true);
      setTimeout(() => {
        setShowSuccessNotification(false);
      }, 3000);
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
                  <div className="flex items-center gap-2 justify-end h-10">
                    <button
                      onClick={() => handleViewDetails(employer)}
                      className="flex items-center gap-2 px-3 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition whitespace-nowrap"
                      title="Chi tiết"
                    >
                      <span className="text-sm">Xem chi tiết</span>
                    </button>

                    <div className="w-20 flex items-center justify-center">
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

      {/* Success Notification */}
      {showSuccessNotification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 min-w-[320px] max-w-md">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Thành công!</h3>
                <p className="text-sm text-gray-600">{successMessage}</p>
              </div>
              <button
                onClick={() => setShowSuccessNotification(false)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}