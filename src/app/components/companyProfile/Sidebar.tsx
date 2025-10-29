import React from 'react'
import Image from "next/image";
import Link from "next/link";
import { Building2, Users, Globe, LogOut, Settings, HelpCircle, Edit, Eye } from 'lucide-react'

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r h-screen overflow-y-auto flex flex-col sticky top-0">
      <div className="p-6 flex-1">
        {/* Logo */}
        <div className="mb-8">
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="TopJob Logo"
              width={150}
              height={60}
              priority
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 mb-6">
          <a 
            href="#" 
            className="flex items-center gap-3 px-4 py-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
          >
            <Building2 className="w-5 h-5" />
            <span>Hồ sơ công ty</span>
          </a>
          <a 
            href="#" 
            className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            <Users className="w-5 h-5" />
            <span>Tài cả ứng viên</span>
          </a>
          <a 
            href="#" 
            className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            <Globe className="w-5 h-5" />
            <span>Danh sách công việc</span>
          </a>
        </nav>

        {/* Settings */}
        <div className="pt-6 border-t mb-6">
          <h3 className="text-xs font-semibold text-gray-500 mb-4">SETTINGS</h3>
          <nav className="space-y-2">
            <a 
              href="#" 
              className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <Settings className="w-5 h-5" />
              <span>Cài đặt</span>
            </a>
            <a 
              href="#" 
              className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <HelpCircle className="w-5 h-5" />
              <span>Hỗ trợ</span>
            </a>
          </nav>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-6 border-t bg-white mt-auto">
        <div className="flex items-center gap-3 px-4 mb-4">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div>
            <p className="font-medium text-sm">Nguyễn Quang Huy</p>
            <p className="text-xs text-gray-500">@huynqd.com</p>
          </div>
        </div>
        <button className="flex items-center justify-center gap-3 px-4 py-2.5 text-red-600 bg-white hover:bg-red-50 rounded-lg w-full transition shadow-md border border-red-200">
          <LogOut className="w-5 h-5" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}
