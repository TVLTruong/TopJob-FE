"use client";

import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import locationData from "@/app/assets/danh-sach-3321-xa-phuong.json";
import { AuthApi } from "@/utils/api/auth-api";

interface LocationItem {
  "Tên": string;
  "Cấp": string;
  "Tỉnh / Thành Phố": string;
}

interface OfficeLocation {
  id: string;
  province: string;
  district: string;
  detailedAddress: string;
  isHeadquarters: boolean;
}

type Step = 1 | 2 | 3 | 4;

export default function CompleteProfilePage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Check authentication và redirect nếu cần
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
        return;
      }
      
      // Normalize role để so sánh (case-insensitive)
      const userRole = (user.role || '').toString().toUpperCase();
      
      if (userRole !== 'EMPLOYER') {
        router.push('/login');
        return;
      }
      
      // Check status: chỉ cho phép PENDING_PROFILE_COMPLETION
      const userStatus = (user.status || localStorage.getItem('userStatus') || '').toString().toUpperCase();
      
      if (userStatus === 'PENDING_APPROVAL') {
        setStep(4);
      } else if (userStatus === 'ACTIVE') {
        router.push('/');
      } else if (userStatus === 'REJECTED') {
        // Có thể hiển thị thông báo hoặc chuyển đến trang thông báo
      }
    }
  }, [user, isLoading, router]);

  // Step 1: Basic Info
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [benefits, setBenefits] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Step 2: Locations
  const [locations, setLocations] = useState<OfficeLocation[]>([]);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [tempLocation, setTempLocation] = useState({
    province: "",
    district: "",
    detailedAddress: "",
  });
  const [provinces, setProvinces] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);

  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [stepContainerHeight, setStepContainerHeight] = useState<number | null>(null);

  // Load provinces
  useLayoutEffect(() => {
    const data = locationData as LocationItem[];
    const provinceSet = new Set<string>();
    data.forEach((item) => {
      if (item["Tỉnh / Thành Phố"]) {
        provinceSet.add(item["Tỉnh / Thành Phố"]);
      }
    });
    setProvinces(Array.from(provinceSet).sort());
  }, []);

  // Load districts when province changes
  useLayoutEffect(() => {
    if (!tempLocation.province) {
      setDistricts([]);
      return;
    }
    const data = locationData as LocationItem[];
    const districtList = data
      .filter((item) => item["Tỉnh / Thành Phố"] === tempLocation.province)
      .map((item) => item["Tên"])
      .sort();
    setDistricts(districtList);
  }, [tempLocation.province]);

  // Dynamic height for step container
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

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddLocation = () => {
    if (tempLocation.province && tempLocation.district && tempLocation.detailedAddress) {
      const newLocation: OfficeLocation = {
        id: Date.now().toString(),
        province: tempLocation.province,
        district: tempLocation.district,
        detailedAddress: tempLocation.detailedAddress,
        isHeadquarters: locations.length === 0, // First location is automatically headquarters
      };
      setLocations([...locations, newLocation]);
      setTempLocation({ province: "", district: "", address: "" });
      setShowLocationForm(false);
    }
  };

  const handleRemoveLocation = (id: string) => {
    const newLocations = locations.filter((loc) => loc.id !== id);
    // If we removed the headquarters, make the first remaining location the headquarters
    if (newLocations.length > 0 && locations.find((l) => l.id === id)?.isHeadquarters) {
      newLocations[0].isHeadquarters = true;
    }
    setLocations(newLocations);
  };

  const handleSetHeadquarters = (id: string) => {
    setLocations(
      locations.map((loc) => ({
        ...loc,
        isHeadquarters: loc.id === id,
      }))
    );
  };

  const validateStep1 = (): boolean => {
    if (!logoFile && !logoPreview) {
      setValidationError("Vui lòng tải lên Logo công ty.");
      return false;
    }
    if (!companyName.trim()) {
      setValidationError("Vui lòng nhập Tên công ty.");
      return false;
    }
    if (!website.trim()) {
      setValidationError("Vui lòng nhập Website.");
      return false;
    }
    if (!description.trim()) {
      setValidationError("Vui lòng nhập Giới thiệu công ty.");
      return false;
    }
    if (!benefits.trim()) {
      setValidationError("Vui lòng nhập Phúc lợi.");
      return false;
    }
    setValidationError(null);
    return true;
  };

  const validateStep2 = (): boolean => {
    if (locations.length === 0) {
      setValidationError("Bạn phải thêm ít nhất 1 địa điểm văn phòng.");
      return false;
    }
    setValidationError(null);
    return true;
  };

  const handleNext = () => {
    setValidationError(null);
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      }
    } else if (step === 2) {
      if (validateStep2()) {
        setStep(3);
      }
    }
  };

  const handleBack = () => {
    setValidationError(null);
    setShowSuccessModal(false);
    setSubmitting(false);
    if (step > 1) {
      setStep((step - 1) as Step);
    }
  };

  const handleSubmit = async () => {
    // Validate all steps before submitting
    if (!validateStep1() || !validateStep2()) {
      if (!validateStep1()) {
        setStep(1);
      } else if (!validateStep2()) {
        setStep(2);
      }
      return;
    }

    setSubmitting(true);
    setValidationError(null);
    setShowSuccessModal(false);

    try {
      // Lấy token từ localStorage
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
      }

      // Step 1: Upload logo nếu có
      let logoUrl = "";
      if (logoFile) {
        setValidationError("Đang tải lên logo...");
        const uploadResult = await AuthApi.uploadCompanyLogo(token, logoFile);
        logoUrl = uploadResult.url;
      }

      // Step 2: Submit profile với logoUrl
      setValidationError("Đang gửi hồ sơ...");
      await AuthApi.completeEmployerProfile(token, {
        companyName: companyName.trim(),
        website: website.trim(),
        description: description.trim(),
        benefits: benefits.trim().split('\n').filter(b => b.trim()),
        logoUrl: logoUrl,
        locations: locations.map(loc => ({
          province: loc.province,
          district: loc.district,
          detailedAddress: loc.detailedAddress,
          isHeadquarters: loc.isHeadquarters,
        })),
      });

      // Chuyển sang Step 4 (Chờ duyệt)
      setStep(4 as Step);
      setSubmitting(false);
      setValidationError(null);

      // Cập nhật status trong localStorage
      localStorage.setItem('userStatus', 'PENDING_APPROVAL');
      
      // UC-EMP-01: Tự động đăng xuất sau 3 giây để user đọc thông báo
      setTimeout(() => {
        logout();
        router.push('/login?message=' + encodeURIComponent('Hồ sơ đã được gửi thành công! Chúng tôi sẽ xem xét và thông báo kết quả qua email.'));
      }, 3000);

    } catch (error) {
      setValidationError(
        error instanceof Error 
          ? error.message 
          : "Có lỗi xảy ra khi gửi hồ sơ. Vui lòng thử lại."
      );
      setSubmitting(false);
      // Quay lại bước xác nhận nếu có lỗi
      setStep(3);
    }
  };

  const handleSuccessGoHome = () => {
    setShowSuccessModal(false);
    logout();
    router.push("/");
  };

  const stepTitles: Record<Step, string> = {
    1: "Thông tin cơ bản",
    2: "Quản lý Địa điểm",
    3: "Xác nhận",
    4: "Chờ duyệt",
  };

  const stepLabels: Record<Step, string> = {
    1: "Thông tin",
    2: "Địa điểm",
    3: "Xác nhận",
    4: "Chờ duyệt",
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-4xl">
          {/* Welcome Message */}
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 whitespace-nowrap">
              Chào mừng! Vui lòng hoàn thiện hồ sơ để chúng tôi duyệt tài khoản.
            </h1>
            <p className="text-gray-600">
              Điền đầy đủ thông tin để chúng tôi có thể xem xét và phê duyệt tài khoản của bạn.
            </p>
          </div>

          {/* Step Progress Bar */}
          <div className="mb-6">
            <div className="relative max-w-2xl mx-auto px-8">
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200" style={{ left: '4rem', right: '4rem' }} />
              <div
                className="absolute top-5 left-0 h-0.5 bg-emerald-500 transition-all duration-500 ease-in-out"
                style={{
                  left: '4rem',
                  width: `calc(${((step - 1) / 3) * 100}% - ${((step - 1) / 3) * 4}rem + ${((4 - step) / 3) * 4}rem)`
                }}
              />
              <div className="relative flex items-center justify-between">
                {[1, 2, 3, 4].map((s) => (
                  <div key={s} className="flex flex-col items-center">
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
                    <span className={`text-xs font-medium mt-2 transition-colors duration-300 ${
                      step >= s ? "text-emerald-600" : "text-gray-500"
                    }`}>
                      {stepLabels[s as Step]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div
            className="relative overflow-hidden bg-white rounded-xl shadow-sm border border-gray-100 transition-[height] duration-500 ease-in-out"
            style={{ height: stepContainerHeight ? `${stepContainerHeight}px` : undefined }}
          >
            <div
              className="flex items-start transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${(step - 1) * 100}%)` }}
            >
              {/* Step 1: Basic Info */}
              <div
                className="w-full flex-shrink-0"
                ref={(el) => {
                  stepRefs.current[0] = el;
                }}
              >
                <div className="p-6 space-y-5">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{stepTitles[1]}</h2>

                  {/* Logo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo công ty <span className="text-red-600">*</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <input
                        type="file"
                        id="logo-upload"
                        className="hidden"
                        accept=".svg,.png,.jpg,.gif,.jpeg"
                        onChange={handleLogoChange}
                      />
                      <label htmlFor="logo-upload" className="cursor-pointer">
                        {logoPreview ? (
                          <div className="relative w-32 h-32 mx-auto mb-2">
                            <Image src={logoPreview} alt="Logo preview" fill className="object-contain" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded mx-auto mb-2 flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        <p className="text-sm text-emerald-600">Click để tải lên hoặc kéo thả</p>
                        <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG hoặc GIF (tối đa 5MB)</p>
                      </label>
                    </div>
                  </div>

                  {/* Company Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên công ty <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Nhập tên công ty"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Tax Code */}
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mã số thuế <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={taxCode}
                      onChange={(e) => setTaxCode(e.target.value)}
                      placeholder="Nhập mã số thuế"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div> */}

                  {/* Website */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giới thiệu công ty <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Mô tả về công ty của bạn"
                      rows={4}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                    />
                    <p className="text-xs text-gray-400 mt-1">Tối đa 600 ký tự</p>
                  </div>

                  {/* Benefits */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phúc lợi <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      value={benefits}
                      onChange={(e) => { setBenefits(e.target.value); setValidationError(null); }}
                      placeholder="Mỗi phúc lợi trên một dòng"
                      rows={4}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                    />
                    <p className="text-xs text-gray-400 mt-1">Mỗi dòng là một phúc lợi</p>
                  </div>

                  {validationError && step === 1 && (
                    <p className="text-sm text-red-600">{validationError}</p>
                  )}
                </div>
                <div className="px-6 pb-6 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-5 py-2.5 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600"
                  >
                    Tiếp tục
                  </button>
                </div>
              </div>

              {/* Step 2: Locations */}
              <div
                className="w-full flex-shrink-0"
                ref={(el) => {
                  stepRefs.current[1] = el;
                }}
              >
                <div className="p-6 space-y-5">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{stepTitles[2]}</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Thêm các địa điểm văn phòng của công ty. Bạn có thể đánh dấu một địa điểm là trụ sở chính.
                  </p>

                  {/* Locations List */}
                  <div className="space-y-3 mb-4">
                    {locations.map((location) => (
                      <div
                        key={location.id}
                        className="flex items-center justify-between p-4 border border-gray-300 rounded-lg bg-gray-50"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">
                              {location.detailedAddress}, {location.district}, {location.province}
                            </span>
                            {location.isHeadquarters && (
                              <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded">
                                Trụ sở chính
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!location.isHeadquarters && (
                            <button
                              type="button"
                              onClick={() => handleSetHeadquarters(location.id)}
                              className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-100"
                            >
                              Đặt làm trụ sở
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveLocation(location.id)}
                            className="px-3 py-1.5 text-xs text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Location Form */}
                  {showLocationForm ? (
                    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">Thêm địa điểm mới</h3>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tỉnh/Thành phố <span className="text-red-600">*</span>
                          </label>
                          <select
                            value={tempLocation.province}
                            onChange={(e) => setTempLocation({ ...tempLocation, province: e.target.value, district: "" })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          >
                            <option value="">Chọn tỉnh/thành phố</option>
                            {provinces.map((prov) => (
                              <option key={prov} value={prov}>
                                {prov}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Quận/Huyện <span className="text-red-600">*</span>
                          </label>
                          <select
                            value={tempLocation.district}
                            onChange={(e) => setTempLocation({ ...tempLocation, district: e.target.value })}
                            disabled={!tempLocation.province}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100"
                          >
                            <option value="">Chọn quận/huyện</option>
                            {districts.map((dist) => (
                              <option key={dist} value={dist}>
                                {dist}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Địa chỉ chi tiết <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          value={tempLocation.detailedAddress}
                          onChange={(e) => setTempLocation({ ...tempLocation, detailedAddress: e.target.value })}
                          placeholder="Số nhà, tên đường"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setShowLocationForm(false);
                            setTempLocation({ province: "", district: "", detailedAddress: "" });
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-sm"
                        >
                          Hủy
                        </button>
                        <button
                          type="button"
                          onClick={handleAddLocation}
                          disabled={!tempLocation.province || !tempLocation.district || !tempLocation.detailedAddress}
                          className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          Lưu địa điểm
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowLocationForm(true)}
                      className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-emerald-600 hover:border-emerald-500 hover:bg-emerald-50 transition text-sm font-medium"
                    >
                      + Thêm địa điểm
                    </button>
                  )}

                  {validationError && step === 2 && (
                    <p className="text-sm text-red-600">{validationError}</p>
                  )}
                </div>
                <div className="px-6 pb-6 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50"
                  >
                    Quay lại
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-5 py-2.5 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600"
                  >
                    Tiếp tục
                  </button>
                </div>
              </div>

              {/* Step 3: Confirmation */}
              <div
                className="w-full flex-shrink-0"
                ref={(el) => {
                  stepRefs.current[2] = el;
                }}
              >
                <div className="p-6 space-y-5">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{stepTitles[3]}</h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Vui lòng rà soát lại thông tin trước khi gửi hồ sơ để duyệt.
                  </p>

                  {/* Review Section */}
                  <div className="space-y-6">
                    {/* Basic Info Review */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Thông tin cơ bản</h3>
                      <div className="space-y-2 text-sm">
                        {logoPreview && (
                          <div className="mb-3">
                            <p className="text-gray-600 mb-1">Logo:</p>
                            <div className="relative w-16 h-16">
                              <Image src={logoPreview} alt="Logo" fill className="object-contain" />
                            </div>
                          </div>
                        )}
                        <div>
                          <span className="text-gray-600">Tên công ty:</span>{" "}
                          <span className="font-medium">{companyName}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Website:</span>{" "}
                          <span className="font-medium">{website}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Giới thiệu:</span>{" "}
                          <span className="font-medium">{description.substring(0, 100)}...</span>
                        </div>
                        {benefits && (
                          <div>
                            <span className="text-gray-600 mb-2 block">Phúc lợi:</span>
                            <ul className="list-disc list-inside space-y-1 ml-2">
                              {benefits
                                .split("\n")
                                .filter((b) => b.trim().length > 0)
                                .map((benefit, index) => (
                                  <li key={index} className="text-gray-800">
                                    {benefit.trim()}
                                  </li>
                                ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Locations Review */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Địa điểm văn phòng</h3>
                      <div className="space-y-2">
                        {locations.map((location) => (
                          <div key={location.id} className="text-sm">
                            <span className="text-gray-600">
                              {location.detailedAddress}, {location.district}, {location.province}
                            </span>
                            {location.isHeadquarters && (
                              <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded">
                                Trụ sở chính
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {showSuccessModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                      <div className="absolute inset-0 bg-black opacity-40" onClick={() => setShowSuccessModal(false)} />
                      <div role="dialog" aria-modal="true" className="bg-white rounded-lg p-6 shadow-lg z-10 max-w-md w-full">
                        <div className="flex items-start gap-3">
                          <svg className="w-6 h-6 text-emerald-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <div>
                            <p className="font-semibold text-lg">Đăng kí thành công!</p>
                            <p className="text-sm text-gray-600 mt-1">Vui lòng chờ duyệt hồ sơ. Chúng tôi sẽ liên hệ với bạn qua email.</p>
                          </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                          <button type="button" onClick={handleSuccessGoHome} className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm">Về trang chủ</button>
                        </div>
                      </div>
                    </div>
                  )}

                  {validationError && (
                    <p className="text-sm text-red-600">{validationError}</p>
                  )}
                </div>
                <div className="px-6 pb-6 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50"
                  >
                    Quay lại
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="px-5 py-2.5 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Đang gửi..." : "Gửi hồ sơ để duyệt"}
                  </button>
                </div>
              </div>

              {/* Step 4: Waiting for Approval */}
              <div
                className="w-full flex-shrink-0"
                ref={(el) => {
                  stepRefs.current[3] = el;
                }}
              >
                <div className="p-6 flex flex-col items-center justify-center py-20 px-6">
                  <div className="mb-6">
                    <svg className="w-20 h-20 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">Hồ sơ của bạn đã được gửi!</h2>
                  <p className="text-gray-600 text-center max-w-md mb-8">
                    Cảm ơn bạn đã gửi hồ sơ. Chúng tôi sẽ xem xét thông tin của bạn trong vòng 24-48 giờ và sẽ liên hệ qua email.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 w-full max-w-md">
                    <p className="text-sm text-blue-900 text-center">
                      <span className="font-semibold">Trạng thái:</span> Chờ duyệt
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSuccessGoHome}
                    className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition"
                  >
                    Về trang chủ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

