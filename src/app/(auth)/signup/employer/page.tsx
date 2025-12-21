"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import OtpModal from "@/app/components/companyProfile/OtpModal";

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
  
  // OTP Verification state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [otpSessionId, setOtpSessionId] = useState<string | null>(null);
  
  const router = useRouter();

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!fullName.trim()) {
      errors.fullName = "Vui lòng nhập Họ tên";
    }

    if (!email.trim()) {
      errors.email = "Vui lòng nhập Email công ty";
    } else if (!validateEmail(email)) {
      errors.email = "Email không đúng định dạng";
    }

    if (!position.trim()) {
      errors.position = "Vui lòng nhập Chức vụ";
    }

    if (!phoneNumber.trim()) {
      errors.phoneNumber = "Vui lòng nhập Số điện thoại";
    }

    if (!companyName.trim()) {
      errors.companyName = "Vui lòng nhập Tên công ty";
    }

    if (!password) {
      errors.password = "Vui lòng nhập Mật khẩu";
    } else if (password.length < 6) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Vui lòng nhập Xác nhận mật khẩu";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    // Validation (A1)
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Mock API call - chỉ để test UI
    setTimeout(() => {
      try {
        // Mock: Kiểm tra email đã tồn tại (E1)
        const registeredEmails = JSON.parse(localStorage.getItem('registeredEmails') || '[]');
        if (registeredEmails.includes(email)) {
          setFieldErrors({ email: "Email này đã được sử dụng" });
          setLoading(false);
          return;
        }

        console.log('📝 Mock: Đăng ký thành công!', {
          email,
          fullName,
          position,
          phoneNumber,
          companyName,
        });

        // UC-REG-02: Step 9 - Bắt đầu UC-REG-03 (Xác thực Email)
        // Mock: Giả lập tạo sessionId
        setRegisteredEmail(email);
        setOtpSessionId(`mock-session-${Date.now()}`);
        setShowOtpModal(true);
        setLoading(false);

        // TODO: Khi có BE, uncomment code dưới:
        /*
        const registerData = {
          email: email,
          password: password,
          fullName: fullName,
          position: position,
          phoneNumber: phoneNumber,
          companyName: companyName,
        };

        const response = await fetch('http://localhost:3001/auth/register/employer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(registerData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 409 || errorData.message?.includes('email')) {
            setFieldErrors({ email: "Email này đã được sử dụng" });
          } else {
            setError(errorData.message || 'Đăng ký thất bại, vui lòng thử lại.');
          }
          setLoading(false);
          return;
        }

        const data = await response.json();
        setRegisteredEmail(email);
        setOtpSessionId(data.sessionId || data.otpSessionId || null);
        setShowOtpModal(true);
        setLoading(false);
        */

      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : 'Đã có lỗi xảy ra');
        console.error('Lỗi khi đăng ký:', error);
        setLoading(false);
      }
    }, 1000); // Delay 1s để giống API thật
  };

  const handleOtpVerify = async (code: string): Promise<boolean> => {
    try {
      console.log('🔍 Debug handleOtpVerify:', { code, registeredEmail, otpSessionId });
      
      // Mock: Chấp nhận mã OTP "123456" để test thành công
      // Hoặc bất kỳ mã nào có 6 chữ số để test
      await new Promise(resolve => setTimeout(resolve, 500)); // Delay giống API thật

      if (!code || code.length !== 6) {
        console.log('❌ Mock: OTP phải có 6 chữ số', { code, length: code?.length });
        return false;
      }

      // Chấp nhận mã "123456" hoặc bất kỳ mã 6 chữ số nào
      const isValidOtp = code === '123456' || /^\d{6}$/.test(code);
      
      if (isValidOtp) {
        console.log('✅ Mock: OTP xác thực thành công!', { code, email: registeredEmail });
        
        // Lưu email đã đăng ký để login sau này biết status
        try {
          const registeredEmails = JSON.parse(localStorage.getItem('registeredEmails') || '[]');
          if (registeredEmail && !registeredEmails.includes(registeredEmail)) {
            registeredEmails.push(registeredEmail);
            localStorage.setItem('registeredEmails', JSON.stringify(registeredEmails));
          }
        } catch (e) {
          console.warn('Lỗi khi lưu registeredEmails:', e);
        }
        
        // UC-REG-03: Step 4 - Tự động login luôn (convenient cho test)
        // Mock login ngay sau khi verify OTP
        const emailToUse = registeredEmail || 'employer@test.com';
        const fakeTokenPayload = {
          sub: `employer-${Date.now()}`,
          email: emailToUse,
          role: 'EMPLOYER',
          status: 'CHỜ_HOÀN_THIỆN_HỒ_SƠ',
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 86400,
        };
        
        // Tạo fake token - lưu trực tiếp JSON string (AuthContext sẽ xử lý)
        // Đơn giản và tránh lỗi với btoa/atob
        localStorage.setItem('accessToken', JSON.stringify(fakeTokenPayload));
        localStorage.setItem('userStatus', 'CHỜ_HOÀN_THIỆN_HỒ_SƠ');
        
        console.log('✅ Đã lưu token và status vào localStorage');
        
        // Return true trước, sau đó redirect
        // OtpModal sẽ đóng modal trước khi redirect
        setTimeout(() => {
          console.log('🔄 Redirect đến /completeProfile');
          window.location.href = '/completeProfile';
        }, 300);
        
        return true;
      }

      console.log('❌ Mock: OTP không hợp lệ', { code });
      return false;
    } catch (error) {
      console.error('Lỗi trong handleOtpVerify:', error);
      return false;
    }

    // TODO: Khi có BE, uncomment code dưới:
    /*
    try {
      const response = await fetch('http://localhost:3001/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: registeredEmail,
          code: code,
          sessionId: otpSessionId,
        }),
      });

      if (!response.ok) {
        return false;
      }

      const verifyResponse = await fetch('http://localhost:3001/auth/verify-email/employer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: registeredEmail,
          verified: true,
        }),
      });

      if (!verifyResponse.ok) {
        console.error('Failed to update user status');
        return false;
      }

      router.push('/login?verified=true&message=Xác thực thành công! Vui lòng đăng nhập để hoàn thiện hồ sơ công ty.');
      return true;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return false;
    }
    */
  };

  const handleResendOtp = async () => {
    // Mock: Luôn thành công
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('📧 Mock: Đã gửi lại OTP đến', registeredEmail);
    return true;

    // TODO: Khi có BE, uncomment code dưới:
    /*
    try {
      const response = await fetch('http://localhost:3001/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: registeredEmail,
          sessionId: otpSessionId,
        }),
      });

      if (response.ok) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error resending OTP:', error);
      return false;
    }
    */
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
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (fieldErrors.fullName) {
                      setFieldErrors({ ...fieldErrors, fullName: "" });
                    }
                  }}
                  placeholder="Nguyễn Văn A"
                  required
                  className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    fieldErrors.fullName ? 'border-red-500' : 'border-gray-300'
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
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    if (fieldErrors.phoneNumber) {
                      setFieldErrors({ ...fieldErrors, phoneNumber: "" });
                    }
                  }}
                  placeholder="0901234567"
                  required
                  className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    fieldErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {fieldErrors.phoneNumber && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.phoneNumber}</p>
                )}
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
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) {
                      setFieldErrors({ ...fieldErrors, email: "" });
                    }
                  }}
                  placeholder="hr@company.com"
                  required
                  className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    fieldErrors.email ? 'border-red-500' : 'border-gray-300'
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
                  onChange={(e) => {
                    setPosition(e.target.value);
                    if (fieldErrors.position) {
                      setFieldErrors({ ...fieldErrors, position: "" });
                    }
                  }}
                  placeholder="HR Manager, Trưởng phòng nhân sự..."
                  required
                  className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    fieldErrors.position ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {fieldErrors.position && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.position}</p>
                )}
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
                onChange={(e) => {
                  setCompanyName(e.target.value);
                  if (fieldErrors.companyName) {
                    setFieldErrors({ ...fieldErrors, companyName: "" });
                  }
                }}
                placeholder="Công ty TNHH ABC"
                required
                className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  fieldErrors.companyName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {fieldErrors.companyName && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.companyName}</p>
              )}
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
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) {
                      setFieldErrors({ ...fieldErrors, password: "" });
                    }
                  }}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    fieldErrors.password ? 'border-red-500' : 'border-gray-300'
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
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (fieldErrors.confirmPassword) {
                      setFieldErrors({ ...fieldErrors, confirmPassword: "" });
                    }
                  }}
                  placeholder="••••••••"
                  required
                  className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    fieldErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {fieldErrors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.confirmPassword}</p>
                )}
              </div>

            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Lưu ý:</strong> Sau khi đăng ký, bạn sẽ nhận được mã OTP qua email để xác thực tài khoản. 
                Sau khi xác thực, bạn cần hoàn thiện hồ sơ công ty để được duyệt.
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
              {loading ? 'Đang xử lý...' : 'Đăng ký'}
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

      {/* OTP Verification Modal - UC-REG-03 */}
      <OtpModal
        open={showOtpModal}
        title="Xác thực Email"
        message={`Nhập mã OTP đã được gửi đến email ${registeredEmail}. (Mock: Nhập "123456" để test thành công)`}
        onClose={() => {
          setShowOtpModal(false);
          // E1: Xác thực thất bại - có thể cho phép đóng và thử lại sau
        }}
        onVerify={handleOtpVerify}
        onResend={handleResendOtp}
        resendLabel="Gửi lại mã"
        submitLabel="Xác nhận"
        secondsBeforeResend={60}
      />
    </div>
  );
}
