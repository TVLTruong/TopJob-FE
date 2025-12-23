"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { AuthApi } from "@/utils/api/auth-api";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  sub: string;
  email: string;
  role: string;
  status?: string;
  exp: number;
}

interface LoginResponse {
  access_token?: string;
  token?: string;
  accessToken?: string;
  data?: {
    access_token?: string;
    token?: string;
    accessToken?: string;
  };
}

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check for verification success message (UC-REG-03)
  useEffect(() => {
    const verified = searchParams.get('verified');
    const emailParam = searchParams.get('email');
    
    if (verified === 'true') {
      setSuccessMessage('✅ Email đã được xác thực thành công! Vui lòng đăng nhập để hoàn tất hồ sơ công ty.');
      
      // Pre-fill email nếu có
      if (emailParam) {
        setEmail(decodeURIComponent(emailParam));
      }
    }
    
    const message = searchParams.get('message');
    if (message) {
      setSuccessMessage(decodeURIComponent(message));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Clear old token BEFORE login
      const oldToken = localStorage.getItem('accessToken');
      if (oldToken) {
        localStorage.clear();
        sessionStorage.clear();
      }
      
      // Gọi API login
      const response = await AuthApi.login(email, password) as LoginResponse;
      
      // Kiểm tra nhiều trường hợp token field
      const token = response.access_token || response.token || response.accessToken || 
                    response.data?.access_token || response.data?.token || response.data?.accessToken;
      
      if (!token) {
        throw new Error('Đăng nhập thất bại: Không nhận được token từ server');
      }

      // Decode token để lấy thông tin user
      const decoded = jwtDecode<DecodedToken>(token);
      
      // Verify token content matches login email (security check)
      if (decoded.email !== email) {
        console.error('⚠️ Token email mismatch');
        throw new Error('Token không khớp với email đăng nhập. Vui lòng thử lại.');
      }

      // Lưu token vào context (sẽ tự động lưu vào localStorage)
      login(token);

      // Normalize role để so sánh (case-insensitive)
      const userRole = (decoded.role || '').toString().toUpperCase();

      // UC-ADMIN: Kiểm tra role ADMIN và redirect đến admin dashboard
      if (userRole === 'ADMIN') {
        router.push('/admin/dashboard');
      }
      // UC-EMP-01: Kiểm tra status và redirect
      else if (userRole === 'EMPLOYER') {
        const userStatus = (decoded.status || '').toString().toUpperCase();
        
        if (userStatus === 'PENDING_PROFILE_COMPLETION') {
          router.push('/completeProfile');
        } else if (userStatus === 'PENDING_APPROVAL') {
          router.push('/pending-approval');
        } else if (userStatus === 'ACTIVE') {
          router.push('/employer/dashboard');
        } else {
          router.push('/');
        }
      } else if (userRole === 'CANDIDATE') {
        router.push('/');
      } else {
        router.push('/');
      }

    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.';
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-12 px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Đăng nhập
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Chào mừng trở lại với TopJob
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          
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

          {successMessage && (
            <div className="p-3 text-sm text-center text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-200">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="p-3 text-sm text-center text-red-600 bg-red-50 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-semibold text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">hoặc</span>
          </div>
        </div>

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

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
