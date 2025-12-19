"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function SignUpPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State mới để xử lý loading và lỗi
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * XỬ LÝ SUBMIT (ĐÃ CẬP NHẬT)
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Xóa lỗi cũ

    // 1. Kiểm tra mật khẩu phía client
    if (password !== confirmPassword) {
      setError("Mật khẩu và mật khẩu xác nhận không khớp!");
      return;
    }

    setLoading(true);

    try {
      // 2. Chuẩn bị dữ liệu gửi đến NestJS (đúng theo RegisterDto)
      const registerData = {
        email: email,
        password: password,
        fullName: fullName,
        // 'role' không cần nữa, vì backend đã tự gán 'CANDIDATE'
      };

      // 3. Gọi API Backend NestJS
      const response = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      // 4. Xử lý kết quả
      if (!response.ok) {
        // Nếu server trả về lỗi (4xx, 5xx)
        const errorData = await response.json();
        // errorData.message là thông báo từ NestJS (ví dụ: "Email này đã được đăng ký")
        throw new Error(errorData.message || 'Đăng ký thất bại, vui lòng thử lại.');
      }

      // ĐĂNG KÝ THÀNH CÔNG
      // const newUser = await response.json(); // Lấy data user nếu cần
      console.log('Đăng ký thành công!');
      
      // Thông báo cho người dùng và gợi ý họ đăng nhập
      alert('Đăng ký thành công! Giờ bạn có thể đăng nhập.');
      // Tùy chọn: Tự động chuyển hướng họ sang trang đăng nhập
      // window.location.href = '/login'; 

    } catch (error: unknown) {
      // Bắt lỗi (từ server hoặc lỗi mạng)
      setError(error instanceof Error ? error.message : 'An error occurred');
      console.error('Lỗi khi đăng ký:', error);
    } finally {
      // 5. Dù thành công hay thất bại, dừng loading
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
            
      <main className="flex flex-col flex-1 md:flex-row">
        
        {/* Cột Trái (Ảnh) */}
        <div className="items-center justify-center flex-1 hidden p-12 md:flex">
          <Image
            src="/signup_login.png" 
            alt="JOBS Illustration"
            width={600}
            height={450}
            className="object-contain"
            priority
          />
        </div>

        {/* Cột Phải (Form) */}
        {/* <div className="flex items-center justify-center w-full p-8 md:w-2/5"> */}
        <div className="flex items-start md:items-center justify-center w-full px-8 pt-2 pb-8 md:pt-8 md:w-2/5">

          <div className="w-full max-w-md space-y-5">
            
            <h1 className="text-3xl font-semibold text-gray-900 text-center">
              Tạo tài khoản mới
            </h1>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* (Các input Họ tên, Email, Mật khẩu, Nhập lại MK giữ nguyên) */}
              <div>
                <label 
                  htmlFor="fullName" 
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Họ tên <span className="text-red-600">*</span>
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nhập vào Họ tên"
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email <span className="text-red-600">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập vào địa chỉ email"
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

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
                  placeholder="Nhập mật khẩu"
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label 
                  htmlFor="confirmPassword" 
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nhập lại mật khẩu <span className="text-red-600">*</span>
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Hiển thị lỗi (nếu có) */}
              {error && (
                <p className="text-sm text-center text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading} // <-- Thêm 'disabled'
                className="w-full py-3 font-semibold text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
              >
                {/* Thay đổi text khi loading */}
                {loading ? 'Đang xử lý...' : 'Tiếp tục'}
              </button>
            </form>

            {/* XÓA NÚT GOOGLE VÀ DÒNG "HOẶC" */}

            {/* Link "Đăng nhập" (Giữ nguyên) */}
            <div className="text-sm text-center text-gray-600">
              Bạn đã có tài khoản?{" "}
              <Link href="/login" className="font-semibold text-emerald-600 hover:underline">
                Đăng nhập
              </Link>
            </div>

            {/* Disclaimer (Điều khoản) (Giữ nguyên)
            <p className="text-xs text-center text-gray-500">
              Bằng cách nhấp vào Tiếp tục, bạn xác nhận rằng bạn đã đọc và
              chấp nhận 
              <a href="/terms" className="text-emerald-600 hover:underline"> Điều khoản dịch vụ </a> 
              và 
              <a href="/policy" className="text-emerald-600 hover:underline"> Chính sách bảo mật</a>.
            </p> */}
          </div>
        </div>
      </main>
    </div>
  );
}
