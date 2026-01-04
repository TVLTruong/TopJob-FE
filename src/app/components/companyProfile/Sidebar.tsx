'use client'

import React, { useState } from 'react'
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from 'next/navigation';
import { Building2, Users, Globe, LogOut, Settings, HelpCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext';
import { useEmployerProfile } from '@/contexts/EmployerProfileContext';
import LogoutModal from '../common/LogoutModal'

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const { profile, isLoading } = useEmployerProfile();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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
      href: '/contact',
      icon: HelpCircle,
      label: 'Hỗ trợ'
    }
  ];

  const isActive = (href: string) => pathname.startsWith(href);

  const handleLogout = () => {
    setShowLogoutModal(false);
    // Logout logic here
    router.push('/login');
  };

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
                    ? 'text-white bg-green-600 hover:bg-green-700'
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
          <h3 className="text-xs font-semibold text-gray-500 mb-4">CÀI ĐẶT</h3>
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
                      ? 'text-white bg-green-600 hover:bg-green-700'
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
          {isLoading ? (
            <>
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
              </div>
            </>
          ) : (
            <>
              {profile?.logoUrl ? (
                <Image 
                  src={profile.logoUrl} 
                  alt={profile.companyName || 'Company'} 
                  width={40} 
                  height={40}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-xs">
                  Logo
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm truncate">
                  {user?.email || 'Loading...'}
                </p>
              </div>
            </>
          )}
        </div>
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
