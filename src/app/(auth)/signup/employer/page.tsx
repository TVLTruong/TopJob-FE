"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EmployerSignUpPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (password !== confirmPassword) {
      setError("Mật khẩu và mật khẩu xác nhận không khớp!");
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    setLoading(true);

    try {
      const registerData = {
        email: email,
        password: password,
        fullName: fullName,
        position: position,
        phoneNumber: phoneNumber,
        companyName: companyName,
      };

      // TODO: Thay đổi endpoint khi backend có API register employer
      const response = await fetch('http://localhost:3001/auth/register/employer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Đăng ký thất bại, vui lòng thử lại.');
      }

      console.log('Đăng ký nhà tuyển dụng thành công!');
      
      // Chuyển hướng đến trang thông báo chờ duyệt
      router.push('/signup/employer/pending');

    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Đã có lỗi xảy ra');
      console.error('Lỗi khi đăng ký:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-12 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="w-full max-w-2xl">
        
        <div className="bg-white rounded-2xl shadow-xl p-8">
          
          <div className="mb-6">
            <Link 
              href="/signup" 
              className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-1 mb-4"
            >
              ← Quay lại chọn loại tài khoản
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              Đăng ký Nhà tuyển dụng
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Tạo tài khoản để đăng tin tuyển dụng và tìm kiếm ứng viên
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              <div>
                <label 
                  htmlFor="fullName" 
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Họ và tên <span className="text-red-600">*</span>
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label 
                  htmlFor="phoneNumber" 
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Số điện thoại <span className="text-red-600">*</span>
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="0901234567"
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email công ty <span className="text-red-600">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hr@company.com"
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label 
                  htmlFor="position" 
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Chức vụ <span className="text-red-600">*</span>
                </label>
                <input
                  id="position"
                  name="position"
                  type="text"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="HR Manager, Trưởng phòng nhân sự..."
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

            </div>

            <div>
              <label 
                htmlFor="companyName" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tên công ty <span className="text-red-600">*</span>
              </label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Công ty TNHH ABC"
                required
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              <div>
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mật khẩu <span className="text-red-600">*</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label 
                  htmlFor="confirmPassword" 
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Xác nhận mật khẩu <span className="text-red-600">*</span>
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Lưu ý:</strong> Tài khoản nhà tuyển dụng cần được xét duyệt bởi quản trị viên trước khi sử dụng. 
                Thời gian xét duyệt thường từ 1-2 ngày làm việc.
              </p>
            </div>

            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang xử lý...' : 'Đăng ký và chờ xét duyệt'}
            </button>
          </form>

          <div className="mt-6 text-sm text-center text-gray-600">
            Đã có tài khoản?{' '}
            <Link href="/login" className="font-semibold text-blue-600 hover:underline">
              Đăng nhập
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
