'use client';
import React, { useState, useMemo } from 'react';
import { Search, MoreVertical, Trash2, Edit3, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

interface Applicant {
  id: number;
  name: string;
  avatar: string;
  status: 'pending' | 'approved' | 'passed' | 'rejected';
  appliedDate: string;
}

export default function ApplicantsTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApplicants, setSelectedApplicants] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [applicants, setApplicants] = useState<Applicant[]>([
    { id: 1, name: 'Jake Gyll', avatar: '👨', status: 'pending', appliedDate: '24/05/2025' },
    { id: 2, name: 'Guy Hawkins', avatar: '👨‍🦰', status: 'pending', appliedDate: '24/05/2025' },
    { id: 3, name: 'Cyndy Lillibridge', avatar: '👩', status: 'passed', appliedDate: '24/05/2025' },
    { id: 4, name: 'Rodolfo Goode', avatar: '👨‍🦱', status: 'rejected', appliedDate: '24/05/2025' },
    { id: 5, name: 'Leif Floyd', avatar: '👨‍💼', status: 'approved', appliedDate: '24/05/2025' },
    { id: 6, name: 'Jenny Wilson', avatar: '👩‍🦰', status: 'approved', appliedDate: '24/05/2025' },
    { id: 7, name: 'Jerome Bell', avatar: '👨‍🦲', status: 'pending', appliedDate: '24/05/2025' },
    { id: 8, name: 'Eleanor Pena', avatar: '👩‍🦱', status: 'rejected', appliedDate: '24/05/2025' },
    { id: 9, name: 'Darrell Steward', avatar: '👨‍🦳', status: 'passed', appliedDate: '24/05/2025' },
    { id: 10, name: 'Floyd Miles', avatar: '👨‍💻', status: 'pending', appliedDate: '24/05/2025' },
  ]);

  const statusConfig = {
    pending: { label: 'Chờ duyệt', color: 'bg-orange-100 text-orange-600 border-orange-300' },
    approved: { label: 'Đã duyệt', color: 'bg-green-100 text-green-600 border-green-300' },
    passed: { label: 'Đã đậu', color: 'bg-blue-100 text-blue-600 border-blue-300' },
    rejected: { label: 'Từ chối', color: 'bg-red-100 text-red-600 border-red-300' },
  };

  const filterOptions = [
    { value: 'all', label: 'Tất cả trạng thái', count: applicants.length },
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
    return option?.label || 'Tất cả trạng thái';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            Tổng số ứng viên: {filteredApplicants.length}
            {searchQuery && ` (tìm thấy từ ${applicants.length})`}
          </h2>
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative w-64">
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
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                  statusFilter !== 'all'
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>{getActiveFilterLabel()}</span>
                {statusFilter !== 'all' && (
                  <span className="ml-1 px-2 py-0.5 bg-blue-600 text-white rounded-full text-xs">
                    {filteredApplicants.length}
                  </span>
                )}
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
        </div>

        {/* Active Filters Display */}
        {(searchQuery || statusFilter !== 'all') && (
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="text-sm text-gray-600">Đang lọc:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                Tìm kiếm: "{searchQuery}"
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
        )}

        {/* Table Header */}
        <div className="border border-gray-200 rounded-lg bg-gray-50">
          <div className="grid grid-cols-12 gap-4 py-4 px-4 text-sm font-medium text-gray-600">
            <div className="col-span-1 flex items-center">
              <input
                type="checkbox"
                checked={filteredApplicants.length > 0 && selectedApplicants.length === filteredApplicants.length}
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded border-gray-300"
              />
            </div>
            <div className="col-span-3 flex items-center gap-1">
              Họ tên
              <span className="text-gray-400">⇅</span>
            </div>
            <div className="col-span-3 flex items-center gap-1">
              Trạng thái
              <span className="text-gray-400">⇅</span>
            </div>
            <div className="col-span-3 flex items-center gap-1">
              Ngày ứng tuyển
              <span className="text-gray-400">⇅</span>
            </div>
            <div className="col-span-2 flex items-center gap-1">
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
            <div key={applicant.id} className="grid grid-cols-12 gap-4 py-4 hover:bg-gray-50 items-center">
              <div className="col-span-1">
                <input
                  type="checkbox"
                  checked={selectedApplicants.includes(applicant.id)}
                  onChange={() => toggleSelect(applicant.id)}
                  className="w-4 h-4 rounded border-gray-300"
                />
              </div>
              <div className="col-span-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-2xl">
                  {applicant.avatar}
                </div>
                <span className="font-medium text-gray-900">{applicant.name}</span>
              </div>
              <div className="col-span-3">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${statusConfig[applicant.status].color}`}>
                  {statusConfig[applicant.status].label}
                </span>
              </div>
              <div className="col-span-3 text-gray-600 text-sm">
                {applicant.appliedDate}
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <button className="min-w-[100px] px-4 py-1.5 border border-blue-600 text-blue-600 rounded-lg text-sm hover:bg-blue-50 whitespace-nowrap">
                  Xem hồ sơ
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
                        <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                          <Edit3 className="w-4 h-4" />
                          <span>Sửa trạng thái</span>
                        </button>
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
    </div>
  );
}