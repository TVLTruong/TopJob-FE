import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    // Dùng màu 'footer-bg' đã định nghĩa trong tailwind.config.ts
    <footer className="w-full bg-footer-bg text-white pt-16 pb-8">
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
              <li><Link href="/viec-lam" className="hover:underline">Việc làm</Link></li>
              <li><Link href="/cong-ty-it" className="hover:underline">Công ty IT</Link></li>
              <li><Link href="/ho-so-cv" className="hover:underline">Hồ sơ & CV</Link></li>
              {/* <li><Link href="/blog-it" className="hover:underline">Blog IT</Link></li> */}
            </ul>
          </div>

          {/* Cột 3: Trợ giúp */}
          <div className="space-y-3">
            <h5 className="font-bold text-lg">Trợ giúp</h5>
            <ul className="space-y-2 text-sm">
              <li><Link href="/ho-tro" className="hover:underline">Hỗ trợ khách hàng</Link></li>
              <li><Link href="/lien-he" className="hover:underline">Liên hệ chúng tôi</Link></li>
              <li><Link href="/dieu-khoan" className="hover:underline">Điều khoản & Điều kiện</Link></li>
              <li><Link href="/chinh-sach" className="hover:underline">Chính sách bảo mật</Link></li>
            </ul>
          </div>

          {/* Cột 4: Xây dựng sự nghiệp */}
          <div className="space-y-3">
            <h5 className="font-bold text-lg">Xây dựng sự nghiệp</h5>
            <ul className="space-y-2 text-sm">
              <li><Link href="/viec-lam-tot-nhat" className="hover:underline">Việc làm tốt nhất</Link></li>
              <li><Link href="/viec-lam-luong-cao" className="hover:underline">Việc làm lương cao</Link></li>
              <li><Link href="/viec-lam-senior" className="hover:underline">Việc làm Senior</Link></li>
              <li><Link href="/viec-lam-ban-thoi-gian" className="hover:underline">Việc làm bán thời gian</Link></li>
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
    </footer>
  );
}