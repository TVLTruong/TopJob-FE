"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import hook để điều hướng
import { useAuth } from "@/contexts/AuthContext"; // Import hook Auth

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth(); // Lấy hàm login từ Context
  const router = useRouter(); // Khởi tạo router

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Gọi API Login của NestJS
      const response = await fetch('http://localhost:4000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // errorData.message là "Email hoặc mật khẩu không hợp lệ" từ NestJS
        throw new Error(errorData.message || 'Đăng nhập thất bại');
      }

      // 2. Lấy accessToken từ kết quả
      const data = await response.json(); // { accessToken: "..." }
      
      // 3. GỌI HÀM LOGIN CỦA CONTEXT
      // Đây là bước mấu chốt: Lưu token vào Context và localStorage
      login(data.accessToken);

      // 4. Đăng nhập thành công, chuyển hướng về trang chủ
      router.push('/'); 

    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Dùng layout 1 cột đơn giản, căn giữa
    <div className="flex items-center justify-center py-20">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        
        <h1 className="text-3xl font-bold text-center text-gray-900">
          Đăng nhập
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Email */}
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
              placeholder="ban@email.com"
              required
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Mật khẩu */}
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
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="text-right text-sm">
            <Link 
              href="/forgot-password" 
              className="font-medium text-emerald-600 hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>

          {/* Hiển thị lỗi */}
          {error && (
            <p className="text-sm text-center text-red-600">{error}</p>
          )}

          {/* Nút Đăng nhập */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 font-semibold text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
            >
              {loading ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
          </div>
        </form>

        {/* Link tới trang Đăng ký */}
        <p className="text-sm text-center text-gray-600">
          Chưa có tài khoản?{' '}
          <Link href="/signup" className="font-semibold text-emerald-600 hover:underline">
            Đăng ký ngay
          </Link>
        </p>

      </div>
    </div>
  );
}
