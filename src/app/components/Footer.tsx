"use client";
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import ComingSoonModal from '@/app/components/common/ComingSoonModal';

export default function Footer() {
  const [showComingSoon, setShowComingSoon] = useState(false);
  const openComingSoon = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setShowComingSoon(true);
  };

  return (
    // Dùng màu 'footer-bg' đã định nghĩa trong tailwind.config.ts
    <footer className="w-full bg-jobcard-button text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        
        {/* Phần nội dung chính (chia 5 cột trên desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Cột 1: Logo & Liên hệ */}
          <div className="md:col-span-2 space-y-4">
            {/* Logo (dùng nền trắng) */}
            <div className="bg-white rounded-lg p-4 w-48">
              <Image
                src="/logo.svg" // Lấy từ /public/logo.svg
                alt="TopJob Logo"
                width={150}
                height={45}
              />
            </div>
            <div className="space-y-2 text-sm">
              <h4 className="font-bold text-lg mb-2">Liên hệ</h4>
              <p>Hotline: (+84)123456789 (Giờ hành chính)</p>
              <p>Email: hihi@topjob.vn</p>
            </div>
            {/* Chỗ này có thể thêm icon bóng đèn sau */}
          </div>

          {/* Cột 2: Về TopJob */}
          <div className="space-y-3">
            <h5 className="font-bold text-lg">Về TopJob</h5>
            <ul className="space-y-2 text-sm">
              {/* Map tới trang hiện có */}
              <li><Link href="/jobpage" className="hover:underline">Việc làm</Link></li>
              <li><Link href="/companypage" className="hover:underline">Công ty IT</Link></li>
              <li><Link href="/cv" className="hover:underline">Hồ sơ & CV</Link></li>
              {/* Chưa có: Blog IT */}
              {/* <li><Link href="/blog-it" className="hover:underline">Blog IT</Link></li> */}
            </ul>
          </div>

          {/* Cột 3: Trợ giúp */}
          <div className="space-y-3">
            <h5 className="font-bold text-lg">Trợ giúp</h5>
            <ul className="space-y-2 text-sm">
              {/* Liên hệ đã có */}
              <li><Link href="/contact" className="hover:underline">Liên hệ chúng tôi</Link></li>
              {/* Các mục chưa có: mở modal Coming Soon */}
              <li><a href="#" onClick={openComingSoon} className="hover:underline">Hỗ trợ khách hàng</a></li>
              <li><a href="#" onClick={openComingSoon} className="hover:underline">Điều khoản & Điều kiện</a></li>
              <li><a href="#" onClick={openComingSoon} className="hover:underline">Chính sách bảo mật</a></li>
            </ul>
          </div>

          {/* Cột 4: Xây dựng sự nghiệp */}
          <div className="space-y-3">
            <h5 className="font-bold text-lg">Xây dựng sự nghiệp</h5>
            <ul className="space-y-2 text-sm">
              {/* Nếu có filter ở trang jobpage, có thể dùng query sau khi triển khai */}
              <li><a href="#" onClick={openComingSoon} className="hover:underline">Việc làm tốt nhất</a></li>
              <li><a href="#" onClick={openComingSoon} className="hover:underline">Việc làm lương cao</a></li>
              <li><a href="#" onClick={openComingSoon} className="hover:underline">Việc làm Senior</a></li>
              <li><a href="#" onClick={openComingSoon} className="hover:underline">Việc làm bán thời gian</a></li>
            </ul>
          </div>

          {/* Cột 5: Chỗ này để icon máy bay giấy */}
        </div>

        {/* Dường kẻ ngang & Copyright */}
        <hr className="border-t border-white/30 my-8" />

        <div className="flex flex-col md:flex-row justify-center items-center text-sm text-center">
          <p className="mb-4 md:mb-0">
            ©2025, All Rights Reserved by TopJob
          </p>
          {/* <div className="flex space-x-4">
            <a href="https_facebook.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
              <FaFacebookF size={20} />
            </a>
            <a href="https_twitter.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
              <FaTwitter size={20} />
            </a>
            <a href="https_instagram.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
              <FaInstagram size={20} />
            </a>
            <a href="https_github.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
              <FaGithub size={20} />
            </a>
          </div> */}
        </div>
      </div>
      {/* Coming Soon Modal */}
      <ComingSoonModal
        isOpen={showComingSoon}
        onClose={() => setShowComingSoon(false)}
        title="Trang đang phát triển"
        message="Một số liên kết chưa khả dụng. Vui lòng khám phá các trang hiện có hoặc quay lại sau."
      />
    </footer>
  );
}