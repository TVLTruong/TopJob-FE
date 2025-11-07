"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import locationData from "@/app/assets/danh-sach-3321-xa-phuong.json";

interface LocationItem {
  "Tên": string;
  "Cấp": string;
  "Tỉnh / Thành Phố": string;
}

export default function EmployerSignUpPage() {
  const [fullName, setFullName] = useState("");
  const [workTitle, setWorkTitle] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  
  const [provinces, setProvinces] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);

  // Load danh sách tỉnh/thành phố từ JSON
  useEffect(() => {
    const data = locationData as LocationItem[];
    const provinceSet = new Set<string>();
    
    data.forEach((item) => {
      if (item["Tỉnh / Thành Phố"]) {
        provinceSet.add(item["Tỉnh / Thành Phố"]);
      }
    });
    
    setProvinces(Array.from(provinceSet).sort());
  }, []);

  // Load danh sách phường/xã khi chọn tỉnh/thành
  useEffect(() => {
    if (!province) {
      setDistricts([]);
      setDistrict("");
      return;
    }

    const data = locationData as LocationItem[];
    const districtList = data
      .filter((item) => item["Tỉnh / Thành Phố"] === province)
      .map((item) => item["Tên"])
      .sort();
    
    setDistricts(districtList);
    setDistrict("");
  }, [province]);

  // Kiểm tra form có hợp lệ không
  useEffect(() => {
    const valid = 
      fullName.trim() !== "" &&
      workTitle.trim() !== "" &&
      workEmail.trim() !== "" &&
      phoneNumber.trim() !== "" &&
      companyName.trim() !== "" &&
      province !== "" &&
      district !== "" &&
      streetAddress.trim() !== "" &&
      websiteUrl.trim() !== "";
    
    setIsFormValid(valid);
  }, [fullName, workTitle, workEmail, phoneNumber, companyName, province, district, streetAddress, websiteUrl]);

  const handleSubmit = async () => {
    setError(null);

    if (!isFormValid) {
      setError("Vui lòng điền đầy đủ các trường bắt buộc!");
      return;
    }

    setLoading(true);

    try {
      const registerData = {
        fullName,
        workTitle,
        workEmail,
        phoneNumber,
        companyName,
        province,
        district,
        streetAddress,
        websiteUrl,
      };

      const response = await fetch('http://localhost:3001/employer/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Đăng ký thất bại, vui lòng thử lại.');
      }

      console.log('Đăng ký thành công!');
      alert('Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn sớm.');
      
      setFullName("");
      setWorkTitle("");
      setWorkEmail("");
      setPhoneNumber("");
      setCompanyName("");
      setProvince("");
      setDistrict("");
      setStreetAddress("");
      setWebsiteUrl("");

    } catch (error: any) {
      setError(error.message);
      console.error('Lỗi khi đăng ký:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex flex-col flex-1 md:flex-row">
        
        {/* Cột Trái - Ảnh */}
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

        {/* Cột Phải - Form */}
        <div className="flex items-start md:items-center justify-center w-full px-8 pt-2 pb-8 md:pt-8 md:w-2/5">
          <div className="w-full max-w-md space-y-5">
            
            <h1 className="text-2xl font-bold text-gray-900">
              Thông tin liên hệ
            </h1>

            <div className="space-y-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    Chức vụ <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={workTitle}
                    onChange={(e) => setWorkTitle(e.target.value)}
                    placeholder="Quản lý nhân sự"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email công việc <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    value={workEmail}
                    onChange={(e) => setWorkEmail(e.target.value)}
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
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-6">
                Thông tin công ty
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên công ty <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Công ty TNHH ABC"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tỉnh / Thành phố <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%23666' d='M8 11L3 6h10z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 1rem center',
                      color: province === "" ? '#9CA3AF' : '#111827'
                    }}
                  >
                    <option value="" disabled></option>
                    {provinces.map((prov) => (
                      <option key={prov} value={prov}>
                        {prov}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phường / Xã <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    disabled={!province}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%23666' d='M8 11L3 6h10z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 1rem center',
                      color: district === "" ? '#9CA3AF' : '#111827'
                    }}
                  >
                    <option value="" disabled></option>
                    {districts.map((dist) => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số nhà, tên đường <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="123 Nguyễn Huệ"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website URL <span className="text-red-600">*</span>
                </label>
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  URL bao gồm giao thức "https", e.g: https://topjob.com
                </p>
              </div>

              {error && (
                <p className="text-sm text-center text-red-600">{error}</p>
              )}

              <div className="text-sm text-center text-gray-600 pt-4">
                Bạn đã có tài khoản nhà tuyển dụng?{" "}
                <a href="/login" className="text-emerald-600 hover:underline font-semibold">
                  Đăng nhập
                </a>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleSubmit}
                  disabled={loading || !isFormValid}
                  className={`w-full py-3 font-semibold text-white rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isFormValid && !loading
                      ? 'bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-500'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  {loading ? 'Đang xử lý...' : 'Liên hệ chúng tôi'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}