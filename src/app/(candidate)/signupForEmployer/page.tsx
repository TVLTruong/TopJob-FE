"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import CompanyBasicInfoForm, { CompanyBasicInfo } from "@/app/components/companyProfile/CompanyBasicInfoForm";

type Step = 1 | 2 | 3 | 4;

export default function EmployerSignUpPage() {
  // Step control
  const [step, setStep] = useState<Step>(1);

  // Step 1: Tài khoản
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step1Error, setStep1Error] = useState<string | null>(null);

  // Step 2: OTP
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);

  // Step 3: Thông tin công ty (tái sử dụng form CompanyHeader)
  const [companyInfo, setCompanyInfo] = useState<CompanyBasicInfo>({
    companyName: "",
    website: "",
    locations: [],
    fields: [],
    province: "",
    district: "",
    streetAddress: "",
    foundingDay: "1",
    foundingMonth: "January",
    foundingYear: "2024",
    technologies: [],
    description: "",
  });
  const [step3Error, setStep3Error] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [stepContainerHeight, setStepContainerHeight] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined" || !("ResizeObserver" in window)) return;
    const target = stepRefs.current[step - 1];
    if (!target) return;
    setStepContainerHeight(target.offsetHeight);
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setStepContainerHeight(entry.contentRect.height);
      }
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, [step]);

  const canGoNextFromStep1 = () => {
    if (!fullName.trim() || !email.trim() || !phoneNumber.trim() || !username.trim() || !password.trim() || !confirmPassword.trim()) {
      setStep1Error("Vui lòng điền đầy đủ các trường bắt buộc.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStep1Error("Email không hợp lệ.");
      return false;
    }
    if (password.length < 6) {
      setStep1Error("Mật khẩu phải có ít nhất 6 ký tự.");
      return false;
    }
    if (password !== confirmPassword) {
      setStep1Error("Mật khẩu xác nhận không khớp.");
      return false;
    }
    setStep1Error(null);
    return true;
  };

  const handleVerifyOtp = () => {
    setOtpError(null);
    if (otp.length !== 6) {
      setOtpError("Vui lòng nhập đủ 6 ký tự OTP.");
      return;
    }
    // Mock verify: chấp nhận 123456
    if (otp !== "123456") {
      setOtpError("Mã OTP không đúng. Vui lòng thử lại (gợi ý: 123456).");
      return;
    }
    setStep(3);
  };

  const canGoNextFromStep3 = () => {
    if (!companyInfo.companyName.trim()) {
      setStep3Error("Vui lòng nhập Tên công ty.");
      return false;
    }
    if (!companyInfo.website.trim()) {
      setStep3Error("Vui lòng nhập Website.");
      return false;
    }
    if (companyInfo.locations.length === 0) {
      setStep3Error("Vui lòng chọn ít nhất một địa điểm.");
      return false;
    }
    if (companyInfo.fields.length === 0) {
      setStep3Error("Vui lòng chọn ít nhất một lĩnh vực.");
      return false;
    }
    if (!companyInfo.province.trim()) {
      setStep3Error("Vui lòng chọn Tỉnh/Thành phố.");
      return false;
    }
    if (!companyInfo.district.trim()) {
      setStep3Error("Vui lòng chọn Quận/Huyện.");
      return false;
    }
    if (!companyInfo.streetAddress.trim()) {
      setStep3Error("Vui lòng nhập Địa chỉ cụ thể.");
      return false;
    }
    if (!companyInfo.description.trim()) {
      setStep3Error("Vui lòng nhập Mô tả công ty.");
      return false;
    }
    setStep3Error(null);
    return true;
  };

  const handleSubmitAll = async () => {
    if (!canGoNextFromStep3()) return;
    setSubmitting(true);

    // Fake API call
    setTimeout(() => {
      console.log("Signup employer:", {
        account: { fullName, email, phoneNumber, username },
        companyInfo,
      });
      setSubmitting(false);
      setStep(4);
    }, 1200);
  };

  const stepTitles: Record<Step, string> = {
    1: "Thông tin tài khoản",
    2: "Xác thực tài khoản",
    3: "Thông tin công ty",
    4: "Chờ duyệt",
  };

  const stepLabels: Record<Step, string> = {
    1: "Tài khoản",
    2: "Xác thực",
    3: "Công ty",
    4: "Hoàn tất",
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-3xl">
            {/* Step indicator */}
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">
                {stepTitles[step]}
              </h1>
              
              {/* Step Progress Bar */}
              <div className="relative max-w-2xl mx-auto px-8">
                {/* Background line */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200" style={{ left: '4rem', right: '4rem' }} />
                
                {/* Progress line */}
                <div 
                  className="absolute top-5 left-0 h-0.5 bg-emerald-500 transition-all duration-500 ease-in-out"
                  style={{ 
                    left: '4rem',
                    width: `calc(${((step - 1) / 3) * 100}% - ${((step - 1) / 3) * 4}rem + ${((4 - step) / 3) * 4}rem)`
                  }}
                />
                
                {/* Steps */}
                <div className="relative flex items-center justify-between">
                  {[1, 2, 3, 4].map((s) => (
                    <div key={s} className="flex flex-col items-center">
                      {/* Circle */}
                      <div
                        className={`w-10 h-10 flex items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-300 bg-white relative
                          ${step === s 
                            ? "border-emerald-500 bg-emerald-500 text-white shadow-lg scale-110" 
                            : step > s 
                            ? "border-emerald-500 bg-emerald-100 text-emerald-600" 
                            : "border-gray-300 text-gray-400"
                          }`}
                      >
                        {step > s ? (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          s
                        )}
                      </div>
                      
                      {/* Label */}
                      <span className={`text-xs font-medium mt-2 transition-colors duration-300 ${
                        step >= s ? "text-emerald-600" : "text-gray-500"
                      }`}>
                        {stepLabels[s as Step]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Steps wrapper with horizontal slide animation */}
              <div
                className="relative overflow-hidden bg-white rounded-xl shadow-sm border border-gray-100 transition-[height] duration-500 ease-in-out"
                style={{ height: stepContainerHeight ? `${stepContainerHeight}px` : undefined }}
              >
                <div
                  className="flex items-start transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${(step - 1) * 100}%)` }}
                >
                  {/* Step 1 */}
                  <div 
                    className="w-full flex-shrink-0"
                    ref={(el) => {
                      stepRefs.current[0] = el
                    }}
                  >
                    <div className="p-6 space-y-5">
                      <p className="text-sm text-gray-500">
                        Vui lòng nhập thông tin tài khoản để bắt đầu sử dụng hệ thống dành cho nhà tuyển dụng.
                      </p>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Họ tên <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Nguyễn Văn A"
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="nguyen.vana@company.com"
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Số điện thoại <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="0901234567"
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tài khoản <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="ten_tai_khoan"
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mật khẩu <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Tối thiểu 6 ký tự"
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Xác nhận mật khẩu <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Nhập lại mật khẩu"
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>

                        {step1Error && (
                          <p className="text-sm text-red-600">{step1Error}</p>
                        )}
                      </div>
                    </div>
                    <div className="px-6 pb-6 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          if (canGoNextFromStep1()) setStep(2);
                        }}
                        className="px-5 py-2.5 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600"
                      >
                        Tiếp tục
                      </button>
                    </div>
                  </div>

                  {/* Step 2: OTP */}
                  <div 
                    className="w-full flex-shrink-0"
                    ref={(el) => {
                      stepRefs.current[1] = el
                    }}
                  >
                    <div className="p-6 space-y-5">
                      <p className="text-sm text-gray-500">
                        Chúng tôi đã gửi mã OTP đến email hoặc số điện thoại của bạn. Vui lòng nhập mã để xác thực tài khoản.
                      </p>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mã OTP (6 ký tự)
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          value={otp}
                          onChange={(e) => {
                            const next = e.target.value.replace(/\D/g, "").slice(0, 6);
                            setOtp(next);
                            setOtpError(null);
                          }}
                          placeholder="Nhập mã OTP"
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        {otpError && (
                          <p className="text-sm text-red-600 mt-1">{otpError}</p>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          ← Quay lại
                        </button>
                        <button
                          type="button"
                          className="text-emerald-600 hover:underline"
                        >
                          Gửi lại mã
                        </button>
                      </div>
                    </div>
                    <div className="px-6 pb-6 flex justify-end">
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        className="px-5 py-2.5 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600"
                      >
                        Xác nhận
                      </button>
                    </div>
                  </div>

                  {/* Step 3: Thông tin công ty */}
                  <div 
                    className="w-full flex-shrink-0"
                    ref={(el) => {
                      stepRefs.current[2] = el
                    }}
                  >
                    <div className="p-6 space-y-4">
                      <p className="text-sm text-gray-500">
                        Cung cấp chi tiết về công ty để ứng viên hiểu rõ hơn về môi trường làm việc của bạn.
                      </p>

                      <CompanyBasicInfoForm value={companyInfo} onChange={setCompanyInfo} />

                      {step3Error && (
                        <p className="text-sm text-red-600">{step3Error}</p>
                      )}
                    </div>
                    <div className="px-6 pb-6 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={handleSubmitAll}
                        disabled={submitting}
                        className="px-5 py-2.5 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {submitting ? "Đang gửi..." : "Hoàn tất đăng ký"}
                      </button>
                    </div>
                  </div>

                  {/* Step 4: Chờ duyệt */}
                  <div 
                    className="w-full flex-shrink-0"
                    ref={(el) => {
                      stepRefs.current[3] = el
                    }}
                  >
                    <div className="p-6 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="mb-2 flex justify-center">
                      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-10 h-10 text-emerald-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Đăng ký thành công!
                    </h2>
                    <p className="text-gray-600 text-sm max-w-sm">
                      Tài khoản của bạn đang được quản trị viên kiểm duyệt. Vui lòng chờ phê duyệt trong vòng 24-48 giờ. 
                      Chúng tôi sẽ gửi thông báo qua email sau khi tài khoản được kích hoạt.
                    </p>
                    <Link
                      href="/"
                      className="mt-2 inline-flex px-5 py-2.5 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600"
                    >
                      Về trang chủ
                    </Link>
                    </div>
                  </div>
                </div>
            </div>

            <div className="mt-4 text-sm text-center text-gray-600">
              Bạn đã có tài khoản nhà tuyển dụng?{" "}
              <a
                href="/login"
                className="text-emerald-600 hover:underline font-semibold"
              >
                Đăng nhập
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}