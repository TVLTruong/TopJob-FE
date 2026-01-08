"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CandidateApi } from "@/utils/api/candidate-api";
import Toast from "@/app/components/profile/Toast";

// Icons
const MoreIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

type ApplicationStatus = 'new' | 'viewed' | 'shortlisted' | 'rejected' | 'hired' | 'withdrawn';

interface ApplicationRow {
  id: string;
  jobId: string;
  company: string;
  position: string;
  date: string;
  status: ApplicationStatus;
}

const STATUS_LABEL: Record<ApplicationStatus, string> = {
  new: 'Đã nộp',
  viewed: 'Nhà tuyển dụng đã xem',
  shortlisted: 'Bạn được quan tâm',
  rejected: 'Từ chối',
  hired: 'Đã tuyển',
  withdrawn: 'Đã rút hồ sơ',
};

const STATUS_STYLE: Record<ApplicationStatus, string> = {
  new: 'text-emerald-700 bg-emerald-50 border-emerald-100',
  viewed: 'text-blue-700 bg-blue-50 border-blue-100',
  shortlisted: 'text-indigo-700 bg-indigo-50 border-indigo-100',
  rejected: 'text-red-700 bg-red-50 border-red-100',
  hired: 'text-emerald-800 bg-emerald-100 border-emerald-200',
  withdrawn: 'text-gray-700 bg-gray-100 border-gray-200',
};

const cancelableStatuses: ApplicationStatus[] = ['new', 'viewed', 'shortlisted'];

export default function JobApplicationHistory() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  const [showCancelModal, setShowCancelModal] = useState<string | null>(null);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const dropdownRefs = useRef<Record<string, { top: number; right: number }>>({});

  const tabs = useMemo(() => {
    const counts: Record<string, number> = { all: applications.length };
    applications.forEach((app) => {
      counts[app.status] = (counts[app.status] || 0) + 1;
    });
    return [
      { id: 'all', label: 'Tất cả', count: counts.all },
      { id: 'new', label: 'Đã nộp', count: counts.new || 0 },
      { id: 'viewed', label: 'Đã xem', count: counts.viewed || 0 },
      { id: 'shortlisted', label: 'Được quan tâm', count: counts.shortlisted || 0 },
      { id: 'hired', label: 'Đã tuyển', count: counts.hired || 0 },
      { id: 'rejected', label: 'Từ chối', count: counts.rejected || 0 },
      { id: 'withdrawn', label: 'Đã rút', count: counts.withdrawn || 0 },
    ];
  }, [applications]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setApplications([]);
          return;
        }
        const res = await CandidateApi.getApplications(token);
        const mapped: ApplicationRow[] = res.map((a) => {
          const status = (a.status || 'new').toLowerCase() as ApplicationStatus;
          const job: any = (a as any).job || {};
          return {
            id: a.id,
            jobId: a.jobId,
            company: job.employer?.companyName || 'Không rõ',
            position: job.title || 'Không rõ',
            date: a.appliedAt ? new Date(a.appliedAt).toLocaleDateString('vi-VN') : '',
            status: status,
          };
        });
        setApplications(mapped);
      } catch (err) {
        setToast({ message: 'Không thể tải lịch sử ứng tuyển', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  // Show toast notification
  const showToast = (message: string, type: 'error' | 'success' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSelectAll = (e: { target: { checked: boolean; }; }) => {
    if (e.target.checked) {
      setSelectedJobs(applications.map(app => app.id));
    } else {
      setSelectedJobs([]);
    }
  };

  const handleSelectJob = (id: string) => {
    setSelectedJobs(prev => {
      if (prev.includes(id)) {
        return prev.filter(jobId => jobId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleDeleteSelected = () => {
    setShowBulkDeleteModal(true);
  };

  const confirmBulkDelete = async () => {
    const cancelableSelected = applications.filter(
      (app) => selectedJobs.includes(app.id) && canCancelApplication(app.status)
    );

    if (cancelableSelected.length === 0) {
      showToast('Bạn không thể hủy ứng tuyển ở trạng thái này, vui lòng thao tác lại!', 'error');
      setShowBulkDeleteModal(false);
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        showToast('Vui lòng đăng nhập để hủy ứng tuyển', 'error');
        setShowBulkDeleteModal(false);
        return;
      }

      await Promise.all(cancelableSelected.map((app) => CandidateApi.unapplyJob(token, app.jobId)));

      setApplications((prev) =>
        prev.map((app) =>
          selectedJobs.includes(app.id)
            ? { ...app, status: canCancelApplication(app.status) ? 'withdrawn' : app.status }
            : app
        )
      );

      const nonCancelableCount = selectedJobs.length - cancelableSelected.length;
      showToast(
        nonCancelableCount > 0
          ? `Đã hủy ${cancelableSelected.length} ứng tuyển, ${nonCancelableCount} mục không thể hủy`
          : `Đã hủy ${cancelableSelected.length} ứng tuyển`,
        nonCancelableCount > 0 ? 'error' : 'success'
      );
    } catch (e: any) {
      showToast(e?.message || 'Không thể hủy một số ứng tuyển', 'error');
    } finally {
      setSelectedJobs([]);
      setShowBulkDeleteModal(false);
    }
  };

  const handleCancelApplication = (id: string) => {
    setShowCancelModal(id);
  };

  const confirmCancelApplication = async () => {
    if (!showCancelModal) return;
    const application = applications.find(a => a.id === showCancelModal);
    if (!application) return;
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        showToast('Vui lòng đăng nhập để hủy ứng tuyển', 'error');
        return;
      }
      await CandidateApi.unapplyJob(token, application.jobId);
      setApplications(prev => prev.map(app => app.id === application.id ? { ...app, status: 'withdrawn' } : app));
      showToast("Đã hủy ứng tuyển thành công", "success");
    } catch (e: any) {
      showToast(e?.message || 'Không thể hủy ứng tuyển', 'error');
    } finally {
      setShowCancelModal(null);
    }
  };

  const canCancelApplication = (status: ApplicationStatus) => {
    return cancelableStatuses.includes(status);
  };

  const handleCancelClick = (app: ApplicationRow) => {
    if (!canCancelApplication(app.status)) {
      showToast('Trạng thái hiện tại không thể hủy ứng tuyển', 'error');
      setShowDropdown(null);
      return;
    }
    handleCancelApplication(app.id);
    setShowDropdown(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Toast Notification */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lịch sử ứng tuyển</h1>
          <p className="text-gray-600">Quản lý và theo dõi các công việc bạn đã ứng tuyển</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-t-xl shadow-sm border-b border-gray-200">
          <div className="flex overflow-x-auto">
                {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-emerald-600 text-emerald-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-b-xl shadow-sm border border-t-0 border-gray-200">
          
          {/* Toolbar */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <h2 className="text-xl font-bold text-gray-900">Lịch sử ứng tuyển</h2>
            </div>
            
            {/* Bulk Actions */}
            {selectedJobs.length > 0 && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Đã chọn {selectedJobs.length} công việc
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleDeleteSelected}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <TrashIcon />
                    Hủy ứng tuyển
                  </button>
                  <button
                    onClick={() => setSelectedJobs([])}
                    className="px-4 py-2 border border-gray-300 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedJobs.length === applications.length && applications.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên công ty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vị trí
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày ứng tuyển
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading && (
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-500" colSpan={7}>Đang tải...</td>
                  </tr>
                )}
                {!loading && applications.filter(a => activeTab === 'all' ? true : a.status === activeTab).length === 0 && (
                  <tr>
                    <td className="px-6 py-6 text-center text-gray-500" colSpan={7}>Không có dữ liệu</td>
                  </tr>
                )}
                {(!loading ? applications.filter(a => activeTab === 'all' ? true : a.status === activeTab) : []).map((app, index) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedJobs.includes(app.id)}
                        onChange={() => handleSelectJob(app.id)}
                        className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-900">{app.company}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {app.position}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {app.date}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full border ${STATUS_STYLE[app.status]}`}>
                        {STATUS_LABEL[app.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                          dropdownRefs.current[app.id] = {
                            top: rect.bottom + 8,
                            right: window.innerWidth - rect.right,
                          };
                          setShowDropdown(showDropdown === app.id ? null : app.id);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Mở menu thao tác"
                      >
                        <MoreIcon />
                      </button>

                      {showDropdown === app.id && (
                        <>
                          <div className="fixed inset-0 z-[60]" onClick={() => setShowDropdown(null)} />
                          <div
                            className="fixed w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-[70]"
                            style={{
                              top: dropdownRefs.current[app.id]?.top || 0,
                              right: dropdownRefs.current[app.id]?.right || 0,
                            }}
                          >
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCancelClick(app);
                              }}
                              className={`w-full px-4 py-2 text-left text-sm transition-colors flex items-center gap-2 ${
                                canCancelApplication(app.status)
                                  ? 'text-red-600 hover:bg-red-50'
                                  : 'text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              <CloseIcon />
                              Hủy ứng tuyển
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-center gap-2">
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium">
              1
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              2
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              3
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              4
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              5
            </button>
            <span className="px-2 text-gray-500">...</span>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              33
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              →
            </button>
          </div>

        </div>

      </div>

      {/* Cancel Application Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-scale-in">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
              <CloseIcon />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              Hủy ứng tuyển?
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Bạn có chắc chắn muốn hủy ứng tuyển vị trí này? Hành động này không thể hoàn tác.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(null)}
                className="flex-1 px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Không
              </button>
              <button
                onClick={confirmCancelApplication}
                className="flex-1 px-4 py-2.5 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-medium"
              >
                Hủy ứng tuyển
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Modal */}
      {showBulkDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-scale-in">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
              <CloseIcon />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              Hủy {selectedJobs.length} ứng tuyển?
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Bạn có chắc chắn muốn hủy {selectedJobs.length} ứng tuyển đã chọn? Hành động này sẽ rút hồ sơ và không thể hoàn tác.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowBulkDeleteModal(false)}
                className="flex-1 px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                onClick={confirmBulkDelete}
                className="flex-1 px-4 py-2.5 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-medium"
              >
                Hủy tất cả
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}