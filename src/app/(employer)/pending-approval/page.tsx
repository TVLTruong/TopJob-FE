"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function PendingApprovalPage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // Redirect nếu không phải EMPLOYER hoặc chưa login
      if (!user || user.role !== 'EMPLOYER') {
        router.push('/login');
        return;
      }

      // Redirect nếu status không phải PENDING_APPROVAL
      if (user.status && user.status !== 'PENDING_APPROVAL') {
        if (user.status === 'PENDING_PROFILE_COMPLETION') {
          router.push('/completeProfile');
        } else if (user.status === 'ACTIVE') {
          router.push('/employer/dashboard');
        } else {
          router.push('/');
        }
      }
    }
  }, [user, isLoading, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 text-center">
            {/* Icon */}
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <svg className="w-24 h-24 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="absolute -bottom-1 -right-1 bg-yellow-100 rounded-full p-2">
                  <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Hồ sơ đang chờ xét duyệt
            </h1>

            {/* Message */}
            <p className="text-lg text-gray-600 mb-6 max-w-lg mx-auto">
              Cảm ơn bạn đã gửi hồ sơ đăng ký nhà tuyển dụng. Chúng tôi đang xem xét thông tin của bạn.
            </p>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left max-w-md mx-auto">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Thông tin quan trọng
              </h3>
              <ul className="space-y-2 text-sm text-blue-900">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Thời gian xử lý: <strong>24-48 giờ làm việc</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Kết quả sẽ được gửi qua email: <strong>{user?.email}</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Nếu có thắc mắc, vui lòng liên hệ: <strong>support@topjob.vn</strong></span>
                </li>
              </ul>
            </div>

            {/* Status Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold mb-8">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              Trạng thái: Chờ xét duyệt
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Về trang chủ
              </Link>
              <button
                onClick={handleLogout}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                Đăng xuất
              </button>
            </div>

            {/* Help Text */}
            <p className="mt-8 text-sm text-gray-500">
              Bạn có thể đóng trang này. Chúng tôi sẽ thông báo qua email khi hồ sơ được duyệt.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
