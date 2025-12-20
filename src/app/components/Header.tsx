"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { ChevronDown } from "lucide-react"; // Import ChevronDown icon

function UserDropdown({ onLogout }: { onLogout: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const avatarPath = "/avatar-default-svgrepo-com.svg";

  return (
    <div className="relative">

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-2 py-1 bg-[#8FD9C4] bg-emerald-500 rounded-full hover:bg-emerald-600 transition-colors"
      >
        {/* Avatar Image */}
        <div className="w-8 h-8 rounded-full overflow-hidden">
          <Image
            src={avatarPath}
            alt="User Avatar"
            width={32} 
            height={32}
          />
        </div>
        {/* Chevron Down Icon */}
        <ChevronDown size={16} className="text-gray-600" />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50"
          onMouseLeave={() => setIsOpen(false)} // Auto-close on mouse leave
        >
          {user && (
            <div className="px-4 py-2 border-b mb-2">
              <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
            </div>
          )}
          <Link href="/cv" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Quản lý CV</Link>
          <Link href="/favoritesjob" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Việc làm yêu thích</Link>
          <Link href="/listjobpage" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Công việc đã ứng tuyển</Link>
          <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Hồ sơ của tôi</Link>
          <Link href="/setting" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Cài đặt</Link>
          <hr className="my-2" />
          <button
            onClick={() => { onLogout(); setIsOpen(false); }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const { user, logout, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-3"> 

        {/* Logo and Nav Links */}
        <div className="flex items-center space-x-10 justify-start">
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="TopJob Logo"
              width={150}
              height={60}
              priority
            />
          </Link>
          <nav className="hidden md:flex">
             <ul className="flex space-x-6">
               <li><Link href="/jobpage" className="font-medium text-gray-600 hover:text-emerald-500">Việc làm</Link></li>
               <li><Link href="/companypage" className="font-medium text-gray-600 hover:text-emerald-500">Công ty IT</Link></li>
               <li><Link href="/team" className="font-medium text-gray-600 hover:text-emerald-500">Đội ngũ</Link></li>
               <li><Link href="/contact" className="font-medium text-gray-600 hover:text-emerald-500">Liên hệ</Link></li>
             </ul>
          </nav>
        </div>

        {/* Auth Section */}
        <div className="flex items-center space-x-3">
          {isLoading ? (
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
          ) : !user ? (
            <>
              <Link
                href="/login"
                className="px-5 py-2 font-medium text-white bg-emerald-500 rounded-full hover:bg-emerald-600 transition-colors"
              >
                Đăng nhập
              </Link>
              <Link
                href="/signup"
                className="hidden sm:block px-5 py-2 font-medium text-emerald-700 bg-emerald-100 rounded-full hover:bg-emerald-200 transition-colors"
              >
                Đăng ký
              </Link>
            </>
          ) : (
            <UserDropdown onLogout={logout} />
          )}
        </div>
      </div>
    </header>
  );
}