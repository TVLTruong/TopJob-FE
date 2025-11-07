'use client';
import React from 'react';
import Benefits from '@/app/components/companyProfile/Benefits';

export type JobDetailData = {
  title: string;
  position: string;
  jobType: 'Full-Time' | 'Part-Time' | 'Freelance';
  applicantsCount: number;
  targetCount: number;
  deadline: string; // dd/MM/yyyy
  postedDate: string; // dd/MM/yyyy
  salaryDisplay: string; // e.g. "10.000 USD/tháng"
  experienceDisplay: string; // e.g. "Không" | "1 năm" | "2 năm"
  categories: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
  plusPoints: string[];
};

export default function JobDetailContent({ job }: { job: JobDetailData }) {
  const progress = job.targetCount > 0 ? (job.applicantsCount / job.targetCount) * 100 : 0;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Job Description */}
        <div className="bg-white rounded-xl p-8 shadow-sm">

          
          <h2 className="text-xl font-bold mb-4">Mô tả</h2>
          <p className="text-gray-800 leading-relaxed mb-6 font-medium">
            {job.description}
          </p>

          <h3 className="font-bold text-xl text-gray-900 mb-3">Trách nhiệm</h3>
          <ul className="pl-6 space-y-1 text-gray-800">
            {job.responsibilities.map((item, index) => (
              <li key={index} className="flex gap-2 font-medium">
                <span className="text-teal-600 mt-1 flex-shrink-0">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <h3 className="font-bold text-xl text-gray-900 mb-3 mt-6">Yêu cầu</h3>
          <ul className="pl-6 space-y-1 text-gray-800">
            {job.requirements.map((item, index) => (
              <li key={index} className="flex gap-2 font-medium">
                <span className="text-teal-600 mt-1 flex-shrink-0">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <h3 className="font-bold text-xl text-gray-900 mb-3 mt-6">Điểm cộng nếu có</h3>
          <ul className="pl-6 space-y-1 text-gray-800">
            {job.plusPoints.map((item, index) => (
              <li key={index} className="flex gap-2 font-medium">
                <span className="text-teal-600 mt-1 flex-shrink-0">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Benefits */}
        <Benefits benefitsText="" />
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Job Info */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-xl text-gray-900 mb-4">Mô tả công việc</h3>
          
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">{job.applicantsCount} ứng viên</span>
              <span className="text-gray-900 font-medium">/ {job.targetCount} chi tiêu</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <span className="text-gray-600 text-sm">Hạn chót</span>
              <span className="text-gray-900 text-sm font-medium">{job.deadline}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-gray-600 text-sm">Ngày đăng</span>
              <span className="text-gray-900 text-sm font-medium">{job.postedDate}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-gray-600 text-sm">Loại công việc</span>
              <span className="text-gray-900 text-sm font-medium">{job.jobType}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-gray-600 text-sm">Lương</span>
              <span className="text-gray-900 text-sm font-medium">{job.salaryDisplay}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-gray-600 text-sm">Kinh nghiệm</span>
              <span className="text-gray-900 text-sm font-medium">{job.experienceDisplay}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-gray-600 text-sm">Chức vụ</span>
              <span className="text-gray-900 text-sm font-medium">{job.position}</span>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-xl text-gray-900 mb-4">Danh mục</h3>
          <div className="flex flex-wrap gap-2">
            {job.categories.map((category, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}