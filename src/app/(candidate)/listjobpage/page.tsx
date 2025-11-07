"use client";

import { useState } from "react";

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

export default function JobApplicationHistory() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedJobs, setSelectedJobs] = useState<number[]>([]);
  const [showDropdown, setShowDropdown] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  const [showCancelModal, setShowCancelModal] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  
  const [applications, setApplications] = useState([
    {
      id: 1,
      company: "Nomad",
      logo: "N",
      logoColor: "bg-emerald-500",
      position: "Frontend Developer",
      date: "24/06/2021",
      status: "pending",
      statusText: "Chờ duyệt",
      statusColor: "text-amber-600 bg-amber-50 border-amber-200"
    },
    {
      id: 2,
      company: "Udacity",
      logo: "U",
      logoColor: "bg-cyan-500",
      position: "Backend Developer",
      date: "20/06/2021",
      status: "approved",
      statusText: "Đã duyệt",
      statusColor: "text-emerald-600 bg-emerald-50 border-emerald-200"
    },
    {
      id: 3,
      company: "Packer",
      logo: "P",
      logoColor: "bg-red-500",
      position: "DevOps Engineer",
      date: "18/06/2021",
      status: "passed",
      statusText: "Đã đậu",
      statusColor: "text-blue-600 bg-blue-50 border-blue-200"
    },
    {
      id: 4,
      company: "Divvy",
      logo: "D",
      logoColor: "bg-purple-500",
      position: "QA Engineer",
      date: "14/06/2021",
      status: "rejected",
      statusText: "Từ chối",
      statusColor: "text-red-600 bg-red-50 border-red-200"
    },
    {
      id: 5,
      company: "DigitalOcean",
      logo: "DO",
      logoColor: "bg-blue-500",
      position: "Data Engineer",
      date: "10/06/2021",
      status: "pending",
      statusText: "Chờ duyệt",
      statusColor: "text-amber-600 bg-amber-50 border-amber-200"
    }
  ]);

  const tabs = [
    { id: "all", label: "Tất cả", count: 45 },
    { id: "pending", label: "Chờ duyệt", count: 20 },
    { id: "approved", label: "Đã duyệt", count: 15 },
    { id: "passed", label: "Đã đậu", count: 5 },
    { id: "rejected", label: "Từ chối", count: 5 }
  ];

  // Show toast notification
  const showToast = (message: string, type: 'error' | 'success' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSelectAll = (e: { target: { checked: any; }; }) => {
    if (e.target.checked) {
      setSelectedJobs(applications.map(app => app.id));
    } else {
      setSelectedJobs([]);
    }
  };

  const handleSelectJob = (id: number) => {
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

  const confirmBulkDelete = () => {
    setApplications(prev => prev.filter(app => !selectedJobs.includes(app.id)));
    showToast(`Đã xóa ${selectedJobs.length} lịch sử ứng tuyển`, "success");
    setSelectedJobs([]);
    setShowBulkDeleteModal(false);
  };

  const handleCancelApplication = (id: number) => {
    setShowCancelModal(id);
    setShowDropdown(null);
  };

  const confirmCancelApplication = () => {
    if (showCancelModal) {
      setApplications(prev => prev.filter(app => app.id !== showCancelModal));
      showToast("Đã hủy ứng tuyển thành công", "success");
      setShowCancelModal(null);
    }
  };

  const handleDeleteApplication = (id: number) => {
    setShowDeleteModal(id);
    setShowDropdown(null);
  };

  const confirmDeleteApplication = () => {
    if (showDeleteModal) {
      setApplications(prev => prev.filter(app => app.id !== showDeleteModal));
      showToast("Đã xóa lịch sử ứng tuyển", "success");
      setShowDeleteModal(null);
    }
  };

  const canCancelApplication = (status: string) => {
    return status !== "passed"; // Có thể hủy tất cả trừ đã đậu
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-[9999] animate-slide-in">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg min-w-[300px] ${
            toast.type === 'error' 
              ? 'bg-red-50 border border-red-200 text-red-800' 
              : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
          }`}>
            <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
              toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'
            }`}>
              {toast.type === 'error' ? (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <p className="text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => setToast(null)}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
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
              <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Đã chọn {selectedJobs.length} công việc
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleDeleteSelected}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <TrashIcon />
                    Xóa đã chọn
                  </button>
                  <button
                    onClick={() => setSelectedJobs([])}
                    className="px-4 py-2 border border-gray-300 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Hủy
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
                {applications.map((app, index) => (
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
                        <div className={`w-10 h-10 ${app.logoColor} rounded-lg flex items-center justify-center text-white font-bold text-sm`}>
                          {app.logo}
                        </div>
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
                      <span className={`px-3 py-1 text-xs font-medium rounded-full border ${app.statusColor}`}>
                        {app.statusText}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      <button
                        onClick={() => setShowDropdown(showDropdown === app.id ? null : app.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MoreIcon />
                      </button>

                      {/* Dropdown Menu */}
                      {showDropdown === app.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setShowDropdown(null)}
                          />
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                            {canCancelApplication(app.status) && (
                              <button
                                onClick={() => handleCancelApplication(app.id)}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                              >
                                <CloseIcon />
                                Hủy ứng tuyển
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteApplication(app.id)}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                            >
                              <TrashIcon />
                              Xóa lịch sử
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
            <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mx-auto mb-4">
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
                className="flex-1 px-4 py-2.5 text-white bg-amber-500 hover:bg-amber-600 rounded-lg transition-colors font-medium"
              >
                Hủy ứng tuyển
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Single Application Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-scale-in">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
              <TrashIcon />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              Xóa lịch sử ứng tuyển?
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Bạn có chắc chắn muốn xóa lịch sử ứng tuyển này? Hành động này không thể hoàn tác.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="flex-1 px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                onClick={confirmDeleteApplication}
                className="flex-1 px-4 py-2.5 text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors font-medium"
              >
                Xóa
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
              <TrashIcon />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              Xóa {selectedJobs.length} lịch sử ứng tuyển?
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Bạn có chắc chắn muốn xóa {selectedJobs.length} lịch sử ứng tuyển đã chọn? Hành động này không thể hoàn tác.
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
                className="flex-1 px-4 py-2.5 text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors font-medium"
              >
                Xóa tất cả
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}