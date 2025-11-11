'use client'

import React, { useState } from 'react'
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import { Building2, Users, Globe, LogOut, Settings, HelpCircle } from 'lucide-react'
import ConfirmModal from '@/app/components/companyProfile/ConfirmModal';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const navItems = [
    {
      href: '/companyProfilePage',
      icon: Building2,
      label: 'Hồ sơ công ty'
    },
    {
      href: '/AllApplicant',
      icon: Users,
      label: 'Tất cả ứng viên'
    },
    {
      href: '/JobList',
      icon: Globe,
      label: 'Danh sách công việc'
    }
  ];

  const settingItems = [
    {
      href: '/settings',
      icon: Settings,
      label: 'Cài đặt'
    },
    {
      href: '/company/support',
      icon: HelpCircle,
      label: 'Hỗ trợ'
    }
  ];

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <aside className="w-72 bg-white border-r h-screen overflow-y-auto flex flex-col sticky top-0">
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

        {/* Settings */}
        <div className="pt-6 border-t mb-6 mt-auto">
          <h3 className="text-xs font-semibold text-gray-500 mb-4">SETTINGS</h3>
          <nav className="space-y-2">
            {settingItems.map((item) => {
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
        </div>
      </div>

      {/* User Profile */}
      <div className="p-6 bg-white mt-auto mx-auto">
        <div className="flex items-center gap-3 px-4 mb-4">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div>
            <p className="font-semibold text-l">Nguyễn Quang Huy</p>
            <p className="text-xs text-gray-500">@huynqd.com</p>
          </div>
        </div>
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="flex items-center justify-center gap-3 px-4 py-2.5 text-red-600 bg-white hover:bg-red-50 rounded-lg w-full transition shadow-md border border-red-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Đăng xuất</span>
        </button>
      </div>

      {/* Confirm logout modal */}
      <ConfirmModal
        open={showLogoutConfirm}
        title="Xác nhận đăng xuất"
        message="Bạn có chắc muốn đăng xuất khỏi hệ thống?"
        confirmText="Đăng xuất"
        cancelText="Hủy"
        onCancel={() => setShowLogoutConfirm(false)}
        onConfirm={() => {
          setShowLogoutConfirm(false);
          // TODO: replace with real logout logic (clear tokens, call API, etc.)
          router.push('/');
        }}
      />
    </aside>
  );
}