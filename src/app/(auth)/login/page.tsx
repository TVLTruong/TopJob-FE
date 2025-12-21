"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
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
    const message = searchParams.get('message');
    if (verified === 'true' && message) {
      setSuccessMessage(decodeURIComponent(message));
      // Clear URL params after showing message
      router.replace('/login', { scroll: false });
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Mock API call - chỉ để test UI
    setTimeout(() => {
      try {
        // Mock: Giả lập login thành công
        // Kiểm tra nếu là email đã đăng ký (có trong localStorage)
        const registeredEmails = JSON.parse(localStorage.getItem('registeredEmails') || '[]');
        const isRegistered = registeredEmails.includes(email);

        if (!isRegistered && email && password) {
          // Lưu email đã đăng ký để test
          registeredEmails.push(email);
          localStorage.setItem('registeredEmails', JSON.stringify(registeredEmails));
        }

        console.log('🔐 Mock: Đăng nhập thành công!', { email });

        // Mock: Tạo fake JWT token với status
        // Nếu là email mới đăng ký → status = "CHỜ_HOÀN_THIỆN_HỒ_SƠ"
        // Nếu là email cũ → status = "ĐANG_HOẠT_ĐỘNG"
        const userStatus = isRegistered ? 'CHỜ_HOÀN_THIỆN_HỒ_SƠ' : 'CHỜ_HOÀN_THIỆN_HỒ_SƠ';
        
        // Tạo fake token (base64 encoded JSON)
        const fakeTokenPayload = {
          sub: `employer-${Date.now()}`,
          email: email,
          role: 'EMPLOYER',
          status: userStatus,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 86400, // 24h
        };
        
        // Encode thành base64 (giả lập JWT)
        const fakeToken = btoa(JSON.stringify(fakeTokenPayload));
        
        // Lưu status vào localStorage để check redirect
        localStorage.setItem('userStatus', userStatus);
        
        login(fakeToken);
        
        // UC-AUTH-01: Redirect đến completeProfile nếu status = "CHỜ_HOÀN_THIỆN_HỒ_SƠ"
        if (userStatus === 'CHỜ_HOÀN_THIỆN_HỒ_SƠ') {
          console.log('📋 Redirect đến trang hoàn thiện hồ sơ');
          router.push('/completeProfile');
        } else {
          // Chuyển hướng về trang chủ hoặc dashboard
          router.push('/');
        }

        // TODO: Khi có BE, uncomment code dưới:
        /*
        const response = await fetch('http://localhost:3001/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Đăng nhập thất bại');
        }

        const data = await response.json();
        login(data.accessToken);
        
        // Check user status từ response hoặc decode token
        const userStatus = data.user?.status || 'ĐANG_HOẠT_ĐỘNG';
        if (userStatus === 'CHỜ_HOÀN_THIỆN_HỒ_SƠ') {
          router.push('/completeProfile');
        } else {
          router.push('/');
        }
        */

      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : 'Đã có lỗi xảy ra');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, 800); // Delay giống API thật
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
