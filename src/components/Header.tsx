import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    // 'sticky top-0 z-50' để header luôn dính ở trên cùng khi cuộn
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-6 py-1">
        
        {/* Logo và Nav Links */}
        <div className="flex items-center space-x-10 justify-start -ml-7">
          {/* Logo */}
          <Link href="/">
            <Image
              src="/logo.svg" // Lấy từ /public/logo.svg
              alt="TopJob Logo"
              width={150} // Phóng to logo một chút cho header
              height={102}
              priority
            />
          </Link>

          {/* Nav Links (ẩn trên mobile) */}
          <nav className="hidden md:flex">
            <ul className="flex space-x-6">
              <li>
                <Link href="/viec-lam" className="font-medium text-gray-600 hover:text-emerald-500">
                  Việc làm
                </Link>
              </li>
              <li>
                <Link href="/cong-ty-it" className="font-medium text-gray-600 hover:text-emerald-500">
                  Công ty IT
                </Link>
              </li>
              <li>
                <Link href="/doi-ngu" className="font-medium text-gray-600 hover:text-emerald-500">
                  Đội ngũ
                </Link>
              </li>
              <li>
                <Link href="/lien-he" className="font-medium text-gray-600 hover:text-emerald-500">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Nút Đăng nhập / Đăng ký */}
        <div className="flex items-center space-x-3">
          <Link 
            href="/login" 
            // Nút "Đăng nhập" (theo ảnh: nền xanh, chữ trắng)
            className="px-5 py-2 font-medium text-white bg-emerald-500 rounded-full hover:bg-emerald-600 transition-colors"
          >
            Đăng nhập
          </Link>
          <Link 
            href="/signup" 
            // Nút "Đăng ký" (theo ảnh: nền xanh nhạt, chữ đậm)
            className="hidden sm:block px-5 py-2 font-medium text-emerald-700 bg-emerald-100 rounded-full hover:bg-emerald-200 transition-colors"
          >
            Đăng ký
          </Link>
        </div>
        
        {/* TODO: Thêm nút Menu cho Mobile ở đây */}

      </div>
    </header>
  );
}