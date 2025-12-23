import React from 'react';
import { Users, Briefcase, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const stats = [
    {
      title: 'Hồ sơ NTD chờ duyệt',
      count: 4,
      icon: Users,
      color: 'bg-orange-100 text-orange-600',
      href: '/employer-approval'
    },
    {
      title: 'Tin tuyển dụng chờ duyệt',
      count: 4,
      icon: Briefcase,
      color: 'bg-blue-100 text-blue-600',
      href: '/job-posting-approval'
    },
    {
      title: 'Hồ sơ NTD bị từ chối',
      count: 0,
      icon: AlertCircle,
      color: 'bg-red-100 text-red-600',
      href: '/employer-approval?status=rejected'
    }
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bảng điều khiển Admin</h1>
        <p className="text-gray-600">Quản lý duyệt hồ sơ và tin tuyển dụng</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.href} href={stat.href}>
              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition cursor-pointer h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-2">{stat.title}</h3>
                <p className="text-3xl font-bold text-gray-900">{stat.count}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Hoạt động gần đây</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">Tech Solutions Vietnam - Duyệt hồ sơ</p>
              <p className="text-xs text-gray-500 mt-1">Vừa xong - 10 phút trước</p>
            </div>
            <span className="text-xs px-3 py-1 bg-green-100 text-green-600 rounded-full">Đã duyệt</span>
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">Digital Innovations - Từ chối hồ sơ</p>
              <p className="text-xs text-gray-500 mt-1">Vừa xong - 25 phút trước</p>
            </div>
            <span className="text-xs px-3 py-1 bg-red-100 text-red-600 rounded-full">Từ chối</span>
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">Smart Business Solutions - Chỉnh sửa hồ sơ</p>
              <p className="text-xs text-gray-500 mt-1">Chờ duyệt - 2 giờ trước</p>
            </div>
            <span className="text-xs px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full">Chờ xử lý</span>
          </div>
        </div>
      </div>
    </div>
  );
}
