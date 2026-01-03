"use client";

import { Phone, Mail, MapPin, Clock } from "lucide-react";
import Image from "next/image";
import images from "@/app/utils/images";

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full text-white py-16">
        <Image
          src={images.searcherBG}
          alt="Background"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          className="absolute inset-0 z-[-1]"
        />
        <div className="container mx-auto px-4 max-w-6xl text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Liên hệ với chúng tôi
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy liên hệ với TopJob qua các kênh dưới đây!
          </p>
        </div>
      </div>

      {/* Contact Content */}
      <div className="container mx-auto px-4 max-w-6xl py-12 bg-gray-50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Contact Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Thông tin liên hệ</h2>
              
              {/* Văn phòng chính */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-emerald-600 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Văn phòng chính
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Tầng 8, Tòa nhà Innovation Hub<br />
                    123 Đường Nguyễn Huệ, Quận 1<br />
                    Thành phố Hồ Chí Minh, Việt Nam
                  </p>
                </div>

                {/* Hotline */}
                <div>
                  <h3 className="text-lg font-semibold text-emerald-600 mb-3 flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Hotline
                  </h3>
                  <a href="tel:+842873001234" className="text-gray-700 hover:text-emerald-600 transition-colors text-lg font-medium">
                    +84 28 7300 1234
                  </a>
                  <p className="text-sm text-gray-500 mt-1">Tư vấn tuyển dụng & Hỗ trợ nhà tuyển dụng</p>
                </div>

                {/* Email */}
                <div>
                  <h3 className="text-lg font-semibold text-emerald-600 mb-3 flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Email
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <a href="mailto:support@topjob.vn" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
                        support@topjob.vn
                      </a>
                      <p className="text-sm text-gray-500">Hỗ trợ ứng viên</p>
                    </div>
                    <div>
                      <a href="mailto:business@topjob.vn" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
                        business@topjob.vn
                      </a>
                      <p className="text-sm text-gray-500">Hợp tác doanh nghiệp</p>
                    </div>
                  </div>
                </div>

                {/* Giờ làm việc */}
                <div>
                  <h3 className="text-lg font-semibold text-emerald-600 mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Giờ làm việc
                  </h3>
                  <div className="text-gray-700 space-y-1">
                    <p><span className="font-medium">Thứ 2 - Thứ 6:</span> 8:00 - 18:00</p>
                    <p><span className="font-medium">Thứ 7:</span> 8:00 - 12:00</p>
                    <p><span className="font-medium">Chủ nhật:</span> Nghỉ</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Quick Info Cards */}
          <div className="space-y-6">
            {/* Dành cho Ứng viên */}
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg p-8 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">Dành cho Ứng viên</h3>
              <p className="text-white/90 mb-4">
                Tìm kiếm công việc IT mơ ước của bạn với hàng nghìn cơ hội từ các công ty hàng đầu.
              </p>
              <ul className="space-y-2 text-white/90">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-200 mt-1">✓</span>
                  <span>Tìm việc miễn phí 100%</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-200 mt-1">✓</span>
                  <span>Cập nhật việc làm mới hàng ngày</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-200 mt-1">✓</span>
                  <span>Hỗ trợ tư vấn nghề nghiệp</span>
                </li>
              </ul>
            </div>

            {/* Dành cho Nhà tuyển dụng */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-8 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">Dành cho Nhà tuyển dụng</h3>
              <p className="text-white/90 mb-4">
                Kết nối với hàng nghìn ứng viên IT tài năng và xây dựng đội ngũ chuyên nghiệp.
              </p>
              <ul className="space-y-2 text-white/90">
                <li className="flex items-start gap-2">
                  <span className="text-blue-200 mt-1">✓</span>
                  <span>Đăng tin tuyển dụng không giới hạn</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-200 mt-1">✓</span>
                  <span>Tiếp cận nguồn ứng viên chất lượng</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-200 mt-1">✓</span>
                  <span>Công cụ quản lý tuyển dụng hiện đại</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}