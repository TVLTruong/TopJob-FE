"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AuthApi } from "@/utils/api/auth-api";
import OtpModal from "@/app/components/common/OtpModal";

export default function CandidateSignUpPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  
  const router = useRouter();

  const validatePassword = (password: string): boolean => {
    if (password.length < 8) return false;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    return passwordRegex.test(password);
  };

  const handleVerifyOtp = async (code: string): Promise<boolean> => {
    try {
      const response = await AuthApi.verifyOtp(email, code);
      console.log('Xác thực OTP thành công!', response);
      router.push('/login?verified=true');
      return true;
    } catch (error) {
      console.error('Lỗi xác thực OTP:', error);
      return false;
    }
  };

  const handleResendOtp = async (): Promise<boolean> => {
    try {
      await AuthApi.resendOtp(email);
      console.log('Đã gửi lại mã OTP');
      return true;
    } catch (error) {
      console.error('Lỗi gửi lại OTP:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validatePassword(password)) {
      setError("Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu và mật khẩu xác nhận không khớp!");
      return;
    }

    setLoading(true);

    try {
      await AuthApi.registerCandidate({
        email: email,
        password: password,
        fullName: fullName,
      });

      console.log('Đăng ký thành công! Vui lòng xác thực OTP');
      
      // Hiển thị modal OTP
      setShowOtpModal(true);

    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Đã có lỗi xảy ra');
      console.error('Lỗi khi đăng ký:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex flex-col flex-1 md:flex-row">
        
        {/* Cột Trái (Ảnh) */}
        <div className="items-center justify-center flex-1 hidden p-12 md:flex bg-gradient-to-br from-emerald-50 to-emerald-100">
          <div className="text-center">
            <Image
              src="/signup_login.png" 
              alt="Jobs Illustration"
              width={500}
              height={400}
              className="object-contain mb-6"
              priority
            />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Tìm việc làm mơ ước của bạn
            </h2>
            <p className="text-gray-600">
              Hàng nghìn cơ hội đang chờ đón bạn
            </p>
          </div>
        </div>

        {/* Cột Phải (Form) */}
        <div className="flex items-center justify-center w-full px-8 py-12 md:w-2/5">
          <div className="w-full max-w-md space-y-6">
            
            <div>
              <Link 
                href="/signup" 
                className="text-sm text-gray-600 hover:text-emerald-600 flex items-center gap-1 mb-4"
              >
                ← Quay lại chọn loại tài khoản
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">
                Đăng ký Ứng viên
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Tạo tài khoản để bắt đầu tìm kiếm việc làm
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
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
                  placeholder="email@example.com"
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
                  minLength={8}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt (@$!%*?&)
                </p>
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
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 font-semibold text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Đang xử lý...' : 'Đăng ký'}
              </button>
            </form>

            <div className="text-sm text-center text-gray-600">
              Đã có tài khoản?{' '}
              <Link href="/login" className="font-semibold text-emerald-600 hover:underline">
                Đăng nhập
              </Link>
            </div>

          </div>
        </div>
      </main>

      <OtpModal
        open={showOtpModal}
        title="Xác thực tài khoản"
        message={`Mã OTP đã được gửi đến email ${email}. Vui lòng kiểm tra hộp thư của bạn.`}
        onClose={() => setShowOtpModal(false)}
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
        resendLabel="Gửi lại mã"
        submitLabel="Xác nhận"
      />
    </div>
  );
}
