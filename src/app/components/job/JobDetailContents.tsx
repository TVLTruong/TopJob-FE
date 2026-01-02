'use client';
import React from 'react';
import Benefits from '@/app/components/companyProfile/Benefits';

export type JobDetailData = {
  id?: string;
  title: string;
  slug?: string;
  employmentType: 'full_time' | 'part_time' | 'freelance' | 'internship' | 'contract';
  workMode: 'onsite' | 'remote' | 'hybrid';
  status?: string;
  applicantsCount: number;
  quantity: number; // Số lượng tuyển
  expiredAt: string; // dd/MM/yyyy - Ngày hết hạn
  postedDate: string; // dd/MM/yyyy
  publishedAt?: string; // dd/MM/yyyy
  salaryMin: number | null;
  salaryMax: number | null;
  isNegotiable: boolean;
  isSalaryVisible: boolean;
  salaryCurrency: string;
  experienceLevel?: 'intern' | 'fresher' | 'junior' | 'middle' | 'senior' | 'lead' | 'manager';
  experienceYearsMin?: number; // Số năm kinh nghiệm tối thiểu
  locationId?: string; // ID của địa điểm văn phòng
  locationName?: string; // Tên địa điểm
  locationAddress?: string; // Địa chỉ chi tiết
  categories: string[]; // Hoặc categoryId nếu BE chỉ nhận 1 ID
  description: string;
  responsibilities: string[];
  requirements: string[];
  plusPoints: string[]; // nice_to_have
  benefits?: string[];
  isHot?: boolean;
  isUrgent?: boolean;
  viewCount?: number;
  saveCount?: number;
  companyName?: string;
  companyLogo?: string;
};

export default function JobDetailContent({ job }: { job: JobDetailData }) {
  const progress = job.quantity > 0 ? (job.applicantsCount / job.quantity) * 100 : 0;
  
  // Format số với dấu chấm mỗi 3 chữ số (ví dụ: 10000000 -> 10.000.000)
  const formatSalary = (num: number) => {
    // Chuyển sang số nguyên để loại bỏ phần thập phân .00
    const intValue = Math.round(num);
    return intValue.toLocaleString('vi-VN');
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-3">
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
        <Benefits benefitsText={job.benefits?.join('\n') || ''} />
      </div>

      {/* Sidebar */}
      <div className="space-y-3">
        {/* Job Info */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-xl text-gray-900 mb-4">Thông tin công việc</h3>
          
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">{job.applicantsCount} ứng viên</span>
              <span className="text-gray-900 font-medium">/ {job.quantity} chỉ tiêu</span>
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
              <span className="text-gray-900 text-sm font-medium">{job.expiredAt}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-gray-600 text-sm">Ngày đăng</span>
              <span className="text-gray-900 text-sm font-medium">{job.postedDate}</span>
            </div>
            {job.publishedAt && (
              <div className="flex justify-between items-start">
                <span className="text-gray-600 text-sm">Ngày duyệt</span>
                <span className="text-gray-900 text-sm font-medium">{job.publishedAt}</span>
              </div>
            )}
            <div className="flex justify-between items-start">
              <span className="text-gray-600 text-sm">Loại công việc</span>
              <span className="text-gray-900 text-sm font-medium">
                {job.employmentType === 'full_time' ? 'Toàn thời gian' :
                 job.employmentType === 'part_time' ? 'Bán thời gian' :
                 job.employmentType === 'freelance' ? 'Freelance' :
                 job.employmentType === 'internship' ? 'Thực tập' : 'Hợp đồng'}
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-gray-600 text-sm">Hình thức làm việc</span>
              <span className="text-gray-900 text-sm font-medium">
                {job.workMode === 'onsite' ? 'Tại văn phòng' :
                 job.workMode === 'remote' ? 'Từ xa' : 'Lai ghép'}
              </span>
            </div>
            {job.locationName && (
              <div className="flex justify-between items-start">
                <span className="text-gray-600 text-sm">Địa điểm</span>
                <span className="text-gray-900 text-sm font-medium text-right">{job.locationName}</span>
              </div>
            )}
            {job.isSalaryVisible && (
            <div className="flex justify-between items-start">
              <span className="text-gray-600 text-sm">Lương</span>
              <span className="text-gray-900 text-sm font-medium">
                {job.salaryMin && job.salaryMax 
                  ? `${formatSalary(job.salaryMin)} - ${formatSalary(job.salaryMax)} ${job.salaryCurrency}/tháng`
                  : job.isNegotiable ? "Thỏa thuận" : "Chưa công bố"}
              </span>
            </div>
            )}
            <div className="flex justify-between items-start">
              <span className="text-gray-600 text-sm">Kinh nghiệm tối thiểu</span>
              <span className="text-gray-900 text-sm font-medium">
                {!job.experienceYearsMin || job.experienceYearsMin === 0 ? "Không yêu cầu" : `${job.experienceYearsMin} năm`}
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-gray-600 text-sm">Cấp độ</span>
              <span className="text-gray-900 text-sm font-medium">
                {job.experienceLevel === 'intern' ? 'Thực tập' :
                 job.experienceLevel === 'fresher' ? 'Fresher' :
                 job.experienceLevel === 'junior' ? 'Junior' :
                 job.experienceLevel === 'middle' ? 'Middle' :
                 job.experienceLevel === 'senior' ? 'Senior' :
                 job.experienceLevel === 'lead' ? 'Lead' :
                 job.experienceLevel === 'manager' ? 'Manager' : 'Chưa xác định'}
              </span>
            </div>
          </div>

          {/* Statistics */}
          {(job.viewCount !== undefined || job.saveCount !== undefined) && (
          <div className="mt-6 pt-6 border-t">
            <h4 className="font-semibold text-gray-900 mb-3">Thống kê</h4>
            <div className="space-y-2">
              {job.viewCount !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Lượt xem</span>
                <span className="text-gray-900 text-sm font-medium">{job.viewCount.toLocaleString()}</span>
              </div>
              )}
              {job.saveCount !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Lượt lưu</span>
                <span className="text-gray-900 text-sm font-medium">{job.saveCount.toLocaleString()}</span>
              </div>
              )}
            </div>
          </div>
          )}
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