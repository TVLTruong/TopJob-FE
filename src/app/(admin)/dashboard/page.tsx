'use client'

import React from 'react';
<<<<<<< HEAD
import { Users, Briefcase, FileCheck, Clock, TrendingUp } from 'lucide-react';
=======
import { Users, Briefcase, AlertCircle } from 'lucide-react';
>>>>>>> a931796255441e7503347d473bceb04523c27092
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart } from 'recharts';

export default function AdminDashboard() {
  // Dữ liệu cho biểu đồ 3 tháng gần nhất - Người dùng
  const userGrowthData = [
    { month: 'Tháng 10', candidates: 89, employers: 24 },
    { month: 'Tháng 11', candidates: 105, employers: 31 },
    { month: 'Tháng 12', candidates: 78, employers: 22 },
  ];

  // Dữ liệu cho biểu đồ 3 tháng gần nhất - Tin đăng
  const jobPostingData = [
    { month: 'Tháng 10', pending: 35, active: 89 },
    { month: 'Tháng 11', pending: 42, active: 108 },
    { month: 'Tháng 12', pending: 28, active: 95 },
  ];

  const totalAccounts = 122 + 458; // employers + candidates
  const totalEmployers = 122;
  const pendingEmployers = 18;
  const totalJobPostings = 324;
  const pendingJobPostings = 24;

  const stats = [
    {
      title: 'Tin đăng mới',
      count: 156,
      icon: Briefcase,
      color: 'bg-blue-100 text-blue-600',
      description: 'PENDING & ACTIVE'
    },
    {
      title: 'Tổng hồ sơ NTD',
      count: 122,
      icon: Users,
      color: 'bg-purple-100 text-purple-600',
      description: 'Đã đăng ký'
    },
    {
      title: 'Hồ sơ NTD chờ duyệt',
      count: 18,
      icon: Clock,
      color: 'bg-orange-100 text-orange-600',
      href: '/employer-approval'
    },
    {
      title: 'Tin tuyển dụng chờ duyệt',
      count: 24,
      icon: FileCheck,
      color: 'bg-green-100 text-green-600',
      href: '/job-posting-approval'
    }
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const candidates = payload.find((p: any) => p.dataKey === 'candidates')?.value || 0;
      const employers = payload.find((p: any) => p.dataKey === 'employers')?.value || 0;
      const total = candidates + employers;
      
      return (
        <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg min-w-[140px]">
          <p className="font-semibold mb-3 text-center border-b border-gray-600 pb-2">
            {payload[0].payload.month}
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                <span className="text-sm">{candidates}</span>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-sm">{employers}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomJobTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const pending = payload.find((p: any) => p.dataKey === 'pending')?.value || 0;
      const activeJobs = payload.find((p: any) => p.dataKey === 'active')?.value || 0;
      
      return (
        <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg min-w-[140px]">
          <p className="font-semibold mb-3 text-center border-b border-gray-600 pb-2">
            {payload[0].payload.month}
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <span className="text-sm">{activeJobs}</span>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <span className="text-sm">{pending}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bảng điều khiển Admin</h1>
        <p className="text-gray-600">Tổng quan và thống kê hệ thống</p>
      </div>

      {/* User Growth Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Người dùng mới (3 tháng gần nhất)</h2>
            <p className="text-sm text-gray-600">Thống kê số lượng Ứng viên và Nhà tuyển dụng đăng ký mới</p>
          </div>
          
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={userGrowthData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={{ stroke: '#e5e7eb' }}
                label={{ value: 'Số lượng', angle: -90, position: 'insideLeft', style: { fill: '#6b7280' } }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
                payload={[
                  { value: 'Ứng viên', type: 'square', color: '#fb923c' },
                  { value: 'Nhà tuyển dụng', type: 'square', color: '#a855f7' },
                  { value: 'Tổng', type: 'line', color: '#3b82f6' }
                ]}
              />
              <Bar 
                dataKey="employers" 
                stackId="a"
                fill="#a855f7" 
                name="Nhà tuyển dụng"
                maxBarSize={80}
              />
              <Bar 
                dataKey="candidates" 
                stackId="a"
                fill="#fb923c" 
                name="Ứng viên"
                radius={[8, 8, 0, 0]}
                maxBarSize={80}
              />
              <Line 
                type="monotone" 
                dataKey={(data: any) => data.candidates + data.employers}
                stroke="#3b82f6" 
                strokeWidth={3}
                name="Tổng"
                dot={{ fill: '#3b82f6', r: 5, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7, strokeWidth: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Stats Cards for Users */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-2">Tổng số tài khoản</h3>
            <p className="text-3xl font-bold text-gray-900">{totalAccounts}</p>
            <p className="text-xs text-gray-500 mt-1">Tất cả người dùng</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
                <Briefcase className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-2">Tổng số nhà tuyển dụng</h3>
            <p className="text-3xl font-bold text-gray-900">{totalEmployers}</p>
            <p className="text-xs text-gray-500 mt-1">Đã đăng ký</p>
          </div>

          <Link href="/employer-approval">
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-orange-100 text-orange-600">
                  <Clock className="w-6 h-6" />
                </div>
                <TrendingUp className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-2">Hồ sơ chờ duyệt</h3>
              <p className="text-3xl font-bold text-gray-900">{pendingEmployers}</p>
              <p className="text-xs text-gray-500 mt-1">Cần xử lý</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Job Posting Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Tin đăng mới (3 tháng gần nhất)</h2>
            <p className="text-sm text-gray-600">Thống kê tin tuyển dụng mới theo trạng thái</p>
          </div>
          
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={jobPostingData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={{ stroke: '#e5e7eb' }}
                label={{ value: 'Số lượng', angle: -90, position: 'insideLeft', style: { fill: '#6b7280' } }}
              />
              <Tooltip content={<CustomJobTooltip />} cursor={{ fill: 'rgba(34, 197, 94, 0.1)' }} />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
                payload={[
                  { value: 'Active', type: 'square', color: '#22c55e' },
                  { value: 'Pending', type: 'square', color: '#eab308' },
                  { value: 'Tổng', type: 'line', color: '#3b82f6' }
                ]}
              />
              <Bar 
                dataKey="pending" 
                stackId="a"
                fill="#eab308" 
                name="Pending"
                maxBarSize={80}
              />
              <Bar 
                dataKey="active" 
                stackId="a"
                fill="#22c55e" 
                name="Active"
                radius={[8, 8, 0, 0]}
                maxBarSize={80}
              />
              <Line 
                type="monotone" 
                dataKey={(data: any) => data.pending + data.active}
                stroke="#3b82f6" 
                strokeWidth={3}
                name="Tổng"
                dot={{ fill: '#3b82f6', r: 5, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7, strokeWidth: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Stats Cards for Job Postings */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-green-100 text-green-600">
                <Briefcase className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-2">Tổng số tin tuyển dụng</h3>
            <p className="text-3xl font-bold text-gray-900">{totalJobPostings}</p>
            <p className="text-xs text-gray-500 mt-1">Tất cả tin đăng</p>
          </div>

          <Link href="/job-posting-approval">
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-yellow-100 text-yellow-600">
                  <FileCheck className="w-6 h-6" />
                </div>
                <TrendingUp className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-2">Tin tuyển dụng chờ duyệt</h3>
              <p className="text-3xl font-bold text-gray-900">{pendingJobPostings}</p>
              <p className="text-xs text-gray-500 mt-1">Cần xử lý</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
