"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthApi } from "@/utils/api/auth-api";
import OtpModal from "@/app/components/common/OtpModal";

export default function ForgotPasswordPage() {
  const router = useRouter();

  // Step 1: Email input
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Step 2: OTP verification
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [verifiedOtp, setVerifiedOtp] = useState("");

  // Step 3: Password reset
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resettingPassword, setResettingPassword] = useState(false);

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle forgot password request
  const handleForgotPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Vui lòng nhập email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email không hợp lệ");
      return;
    }

    try {
      setLoading(true);
      const response = await AuthApi.forgotPassword(email) as { message: string; expiresAt?: Date };
      setSuccess(response.message);
      setEmailSent(true);
      setShowOtpModal(true);
    } catch (error: any) {
      setError(error.message || "Không thể gửi OTP. Vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  // Handle reset password with OTP
  const handleResetPassword = async (code: string): Promise<boolean> => {
    setError("");

    if (!code) {
      setError("Vui lòng nhập mã OTP");
      return false;
    }

    try {
      // Mark OTP as verified
      setVerifiedOtp(code);
      setOtpVerified(true);
      setShowOtpModal(false);
      setSuccess("Mã OTP xác thực thành công! Vui lòng nhập mật khẩu mới.");
      return true;
    } catch (error: any) {
      setError(error.message || "Không thể xác thực mã OTP");
      return false;
    }
  };

  // Handle confirm password reset
  const handleConfirmPasswordReset = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!newPassword.trim()) {
      setError("Vui lòng nhập mật khẩu mới");
      return;
    }

    if (newPassword.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự");
      return;
    }

    if (!/(?=.*[a-z])/.test(newPassword)) {
      setError("Mật khẩu phải chứa chữ thường");
      return;
    }

    if (!/(?=.*[A-Z])/.test(newPassword)) {
      setError("Mật khẩu phải chứa chữ hoa");
      return;
    }

    if (!/(?=.*\d)/.test(newPassword)) {
      setError("Mật khẩu phải chứa số");
      return;
    }

    if (!/(?=.*[@$!%*?&])/.test(newPassword)) {
      setError("Mật khẩu phải chứa ký tự đặc biệt (@$!%*?&)");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      setResettingPassword(true);
      const response = await AuthApi.resetPassword(
        email,
        verifiedOtp,
        newPassword,
        confirmPassword
      );
      setSuccess(response.message);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: any) {
      setError(error.message || "Không thể đặt lại mật khẩu");
    } finally {
      setResettingPassword(false);
    }
  };

  // Handle resend OTP
  const handleResendOtp = async (): Promise<boolean> => {
    try {
      const response = await AuthApi.resendOtp(email) as { message: string };
      setSuccess(response.message || "Mã OTP mới đã được gửi");
      return true;
    } catch (error: any) {
      setError(error.message || "Không thể gửi lại OTP");
      return false;
    }
  };

  if (emailSent && otpVerified) {
    // Step 3: Password reset form
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Nhập mật khẩu mới
              </h1>
              <p className="text-gray-600">
                Đã xác thực OTP. Vui lòng nhập mật khẩu mới cho tài khoản {email}
              </p>
            </div>

            {/* Alert Messages */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <p className="text-emerald-700 text-sm font-medium">{success}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleConfirmPasswordReset} className="space-y-6">
              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Xác nhận mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={resettingPassword}
                className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resettingPassword ? "Đang xử lý..." : "Đặt lại mật khẩu"}
              </button>
            </form>

            {/* Back Link */}
            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Quay lại đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (emailSent && otpVerified) {
    // Step 3: Password reset form
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Đặt lại mật khẩu
              </h1>
              <p className="text-gray-600">
                Nhập mật khẩu mới của bạn
              </p>
            </div>

            {/* Alert Messages */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <p className="text-emerald-700 text-sm font-medium">{success}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleConfirmPasswordReset} className="space-y-6">
              {/* New Password */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    disabled={resettingPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? "Ẩn" : "Hiện"}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                    placeholder="Xác nhận mật khẩu"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    disabled={resettingPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? "Ẩn" : "Hiện"}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={resettingPassword}
                className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resettingPassword ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
              </button>
            </form>

            {/* Back Link */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setEmailSent(false);
                  setOtpVerified(false);
                  setEmail("");
                  setNewPassword("");
                  setConfirmPassword("");
                  setError("");
                  setSuccess("");
                }}
                className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
              >
                Quay lại
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (emailSent) {
    // Step 2: OTP verification
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Xác thực OTP
              </h1>
              <p className="text-gray-600">
                Mã OTP đã được gửi đến {email}
              </p>
            </div>

            {/* Alert Messages */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <p className="text-emerald-700 text-sm font-medium">{success}</p>
              </div>
            )}

            {/* OTP Modal */}
            <OtpModal
              open={showOtpModal}
              title="Nhập mã OTP"
              message={`Mã OTP đã được gửi đến ${email}. Vui lòng kiểm tra hộp thư của bạn.`}
              onClose={() => {
                // Only close the modal, don't reset email/emailSent
                // This allows the flow to continue to password reset form
                setShowOtpModal(false);
              }}
              onVerify={handleResetPassword}
              onResend={handleResendOtp}
              resendLabel="Gửi lại mã"
              submitLabel="Xác nhận"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Quên mật khẩu?
            </h1>
            <p className="text-gray-600">
              Nhập email của bạn để nhận mã OTP đặt lại mật khẩu
            </p>
          </div>

          {/* Alert Messages */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <p className="text-emerald-700 text-sm font-medium">{success}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleForgotPassword} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                disabled={loading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Đang gửi..." : "Gửi mã OTP"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Hoặc</span>
            </div>
          </div>

          {/* Footer Links */}
          <div className="space-y-3">
            <Link
              href="/login"
              className="block text-center text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Quay lại đăng nhập
            </Link>
            <Link
              href="/signup"
              className="block text-center text-gray-600 hover:text-gray-700 font-medium"
            >
              Tạo tài khoản mới
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
