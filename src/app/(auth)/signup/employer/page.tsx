"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AuthApi } from "@/utils/api/auth-api";
import OtpModal from "@/app/components/common/OtpModal";
import Toast from "@/app/components/profile/Toast";

interface VerifyEmailResponse {
  verified: boolean;
  message: string;
  userId: string;
  email: string;
  access_token?: string;
  refresh_token?: string;
  success?: boolean;
}

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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
  // OTP states
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  
  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  // Show toast helper
  const showToast = (message: string, type: 'error' | 'success' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const router = useRouter();

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!fullName.trim()) {
      errors.fullName = "Họ và tên không được để trống";
    }

    if (!validateEmail(email)) {
      errors.email = "Email không hợp lệ";
    }

    if (!position.trim()) {
      errors.position = "Chức vụ không được để trống";
    }

    if (!validatePhoneNumber(phoneNumber)) {
      errors.phoneNumber = "Số điện thoại không hợp lệ (VD: 0912345678)";
    }

    if (!companyName.trim()) {
      errors.companyName = "Tên công ty không được để trống";
    }

    if (password.length < 8) {
      errors.password = "Mật khẩu phải có tối thiểu 8 ký tự";
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Gọi API register employer
      await AuthApi.registerEmployer({
        fullName: fullName.trim(),
        email: email.trim(),
        password: password,
        workTitle: position.trim(),
        contactPhone: phoneNumber.trim(),
        companyName: companyName.trim(),
      });

      // console.log('Đăng ký nhà tuyển dụng thành công!');
      
      // Lưu email và hiển thị OTP modal
      setRegisteredEmail(email.trim());
      setShowOtpModal(true);

    } catch (error: unknown) {
      // Xử lý lỗi từ API
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Đã có lỗi xảy ra, vui lòng thử lại.';
      
      // Kiểm tra nếu lỗi là email đã tồn tại
      if (errorMessage.includes('email') || errorMessage.includes('Email')) {
        setFieldErrors({ email: "Email này đã được sử dụng" });
      } else {
        setError(errorMessage);
      }
      
      console.error('Lỗi khi đăng ký:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (code: string): Promise<boolean> => {
    try {
      console.log('Verifying OTP for:', registeredEmail, 'code:', code);
      const response = await AuthApi.verifyEmail(registeredEmail, code) as VerifyEmailResponse;
      
      console.log('OTP Response:', response);
      
      // Backend trả về verified: true nhưng không có token
      // User cần đăng nhập để nhận token
      if (response.verified === true || response.success === true) {
        console.log('Email verified successfully! Redirecting to login...');
        
        // Hiển thị thông báo thành công
        showToast('Xác thực email thành công! Vui lòng đăng nhập để hoàn tất hồ sơ công ty.', 'success');
        
        // Chuyển hướng về trang đăng nhập với query param
        setTimeout(() => {
          router.push('/login?verified=true&email=' + encodeURIComponent(registeredEmail));
        }, 1500);
        return true;
      }
      
      // Fallback: nếu có access_token trực tiếp (cho tương lai)
      if (response.access_token) {
        localStorage.setItem('accessToken', response.access_token);
        if (response.refresh_token) {
          localStorage.setItem('refreshToken', response.refresh_token);
        }
        router.push('/completeProfile');
        return true;
      }
      
      console.warn('Unexpected response:', response);
      return false;
    } catch (error) {
      console.error('OTP verification failed:', error);
      return false;
    }
  };

  const handleResendOtp = async (): Promise<boolean> => {
    try {
      await AuthApi.resendVerificationEmail(registeredEmail);
      return true;
    } catch (error) {
      console.error('Failed to resend OTP:', error);
      return false;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex flex-col flex-1 md:flex-row">
        
        {/* Cột Trái (Ảnh) */}
        <div className="items-center justify-center flex-1 hidden p-12 md:flex bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="text-center">
            <Image
              src="/signup_login.png" 
              alt="Employer Illustration"
              width={500}
              height={400}
              className="object-contain mb-6"
              priority
            />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Tìm kiếm ứng viên tài năng
            </h2>
            <p className="text-gray-600">
              Đăng tin tuyển dụng và quản lý ứng viên hiệu quả
            </p>
          </div>
        </div>

        {/* Cột Phải (Form) */}
        <div className="flex items-center justify-center w-full px-8 py-12 md:w-2/5">
          <div className="w-full max-w-md space-y-6">
            
            <div>
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
                Tạo tài khoản để bắt đầu đăng tin tuyển dụng
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Họ tên & Số điện thoại */}
              <div className="grid grid-cols-2 gap-4">
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
                    className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 ${
                      fieldErrors.fullName 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {fieldErrors.fullName && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.fullName}</p>
                  )}
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
                    placeholder="0912345678"
                    required
                    className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 ${
                      fieldErrors.phoneNumber 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {fieldErrors.phoneNumber && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.phoneNumber}</p>
                  )}
                </div>
              </div>

              {/* Email & Chức vụ */}
              <div className="grid grid-cols-2 gap-4">
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
                    className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 ${
                      fieldErrors.email 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {fieldErrors.email && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
                  )}
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
                    placeholder="HR Manager, Trưởng phòng..."
                    required
                    className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 ${
                      fieldErrors.position 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {fieldErrors.position && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.position}</p>
                  )}
                </div>
              </div>

              {/* Tên công ty */}
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
                  className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 ${
                    fieldErrors.companyName 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {fieldErrors.companyName && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.companyName}</p>
                )}
              </div>

              {/* Mật khẩu & Xác nhận */}
              <div className="grid grid-cols-2 gap-4">
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
                    className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 ${
                      fieldErrors.password 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {fieldErrors.password && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
                  )}
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
                    className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 ${
                      fieldErrors.confirmPassword 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {fieldErrors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Thông báo lỗi chung */}
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
                  ⚠️ {error}
                </div>
              )}

              {/* Thông báo xét duyệt */}
              <div className="p-3 text-sm text-blue-600 bg-blue-50 rounded-lg border border-blue-200">
                ℹ️ Tài khoản nhà tuyển dụng cần được xét duyệt trước khi sử dụng
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Đang xử lý...' : 'Đăng ký'}
              </button>
            </form>

            <div className="text-sm text-center text-gray-600">
              Đã có tài khoản?{' '}
              <Link href="/login" className="font-semibold text-blue-600 hover:underline">
                Đăng nhập
              </Link>
            </div>

          </div>
        </div>
      </main>
      
      {/* OTP Modal */}
      <OtpModal
        open={showOtpModal}
        title="Xác thực Email"
        message={`Mã OTP đã được gửi đến email ${registeredEmail}. Vui lòng kiểm tra hộp thư và nhập mã để hoàn tất đăng ký.`}
        onClose={() => setShowOtpModal(false)}
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
        submitLabel="Xác nhận"
        resendLabel="Gửi lại mã"
        secondsBeforeResend={60}
      />
      
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}