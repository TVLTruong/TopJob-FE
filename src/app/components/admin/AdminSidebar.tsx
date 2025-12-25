'use client'

import React, { useState } from 'react'
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from 'next/navigation';
import { BarChart3, FileCheck, Briefcase, LogOut } from 'lucide-react'
import LogoutModal from '../common/LogoutModal'

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navItems = [
    {
      href: '/dashboard',
      icon: BarChart3,
      label: 'Tổng quan'
    },
    {
      href: '/employer-approval',
      icon: FileCheck,
      label: 'Duyệt Hồ sơ NTD'
    },
    {
      href: '/job-posting-approval',
      icon: Briefcase,
      label: 'Duyệt tin tuyển dụng'
    }
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href);

  const handleLogout = () => {
    setShowLogoutModal(false);
    // Clear all storage
    localStorage.clear();
    sessionStorage.clear();
    // Redirect to login
    router.push('/login');
  };

  return (
    <aside className="w-72 bg-white border-r h-screen overflow-y-auto flex flex-col sticky top-0">
      <div className="p-6 flex flex-col h-full">
        {/* Logo */}
        <div className="mb-8 cursor-pointer" onClick={() => router.push('/admin/dashboard')}>
          <Image
            src="/logo.svg"
            alt="TopJob Logo"
            width={150}
            height={60}
            priority
            className="hover:opacity-80 transition"
          />
        </div>

        {/* Navigation */}
        <nav className="space-y-2 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${
                  active
                    ? 'text-white bg-blue-600 hover:bg-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <button 
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center justify-center gap-3 px-4 py-2.5 text-red-600 bg-white hover:bg-red-50 rounded-lg w-full transition shadow-md border border-red-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Đăng xuất</span>
        </button>

        {/* Logout Confirmation Modal */}
        <LogoutModal
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
        />
      </div>
    </aside>
  );
}
