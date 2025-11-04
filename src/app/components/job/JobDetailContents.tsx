'use client';
import React from 'react';
import Benefits from '@/app/components/companyProfile/Benefits';

export default function JobDetailContent() {
  const jobData = {
    title: 'Social Media Assistant',
    position: 'Fresher',
    type: 'Full-Time',
    posted: 'Đã tuyển: 4 / 11',
    applicants: '4 ứng viên / 11 chi tiêu',
    deadline: '28/05/2025',
    postedDate: '28/04/2025',
    jobType: 'Full-Time',
    salary: '575k-885k USD',
    experience: '1 năm',
    categories: ['Marketing', 'Design'],
    responsibilities: [
      'Sự tham gia của cộng đồng để đảm bảo hỗ trợ và đối diện tích cực trực tuyến',
      'Tạo lược nội dung thiết yếu xuất bản nội dung truyền thông xã hội xa hơi',
      'Hỗ trợ tiếp thị và chiến lược',
      'Luôn cập nhật xu hướng trên các nền tảng truyền thông xã hội và đề xuất ý tưởng nội dung cho nhóm',
      'Tham gia vào cộng đồng trực tuyến'
    ],
    requirements: [
      'Bạn cảm thấy có thêm năng lượng khi làm việc với một người và xây dựng một môi trường làm việc lý tưởng',
      'Bạn có gợi thấm my với không gian tiếp vụ trải nghiệm văn phòng tốt',
      'Bạn là một người quản lý văn phòng tự tin, sẵn sàng đón nhận thêm trách nhiệm mới',
      'Bạn tự tin và sáng tạo',
      'Bạn là một marketer theo định hướng tăng trưởng, biết cách triển khai các chiến dịch hiệu quả'
    ],
    plusPoints: [
      'Giao tiếp thành thạo tiếng Anh',
      'Kỹ năng biên tập nội dung',
      'Kỹ năng quản lý dự án'
    ]
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Job Description */}
        <div className="bg-white rounded-xl p-8 shadow-sm">

          
          <h2 className="text-xl font-bold mb-4">Mô tả</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            Chúng tôi đang tìm kiếm chuyên gia Tiếp thị truyền thông xã hội để giúp quản lý các mạng lưới trực tuyến của chúng tôi. Bạn sẽ chịu trách nhiệm giám sát các cách truyền thông xã hội của chúng tôi, đảm bảo nội dung, tìm cách hiệu quả đến thu hút cộng đồng và khuyến khích người dùng tham gia vào các kênh của chúng tôi.
          </p>

          <h3 className="font-bold text-xl text-gray-900 mb-3">Trách nhiệm</h3>
          <ul className="space-y-2 mb-6">
            {jobData.responsibilities.map((item, index) => (
              <li key={index} className="flex gap-2 text-gray-600 text-sm">
                <span className="text-green-600 mt-1">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <h3 className="font-bold text-xl text-gray-900 mb-3">Yêu cầu</h3>
          <ul className="space-y-2 mb-6">
            {jobData.requirements.map((item, index) => (
              <li key={index} className="flex gap-2 text-gray-600 text-sm">
                <span className="text-green-600 mt-1">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <h3 className="font-bold text-xl text-gray-900 mb-3">Điểm cộng nếu có</h3>
          <ul className="space-y-2">
            {jobData.plusPoints.map((item, index) => (
              <li key={index} className="flex gap-2 text-gray-600 text-sm">
                <span className="text-green-600 mt-1">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Benefits */}
        <Benefits />
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Job Info */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-xl text-gray-900 mb-4">Mô tả công việc</h3>
          
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">4 ứng viên</span>
              <span className="text-gray-900 font-medium">/ 11 chi tiêu</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${(4/11) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <span className="text-gray-600 text-sm">Hạn chót</span>
              <span className="text-gray-900 text-sm font-medium">{jobData.deadline}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-gray-600 text-sm">Ngày đăng</span>
              <span className="text-gray-900 text-sm font-medium">{jobData.postedDate}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-gray-600 text-sm">Loại công việc</span>
              <span className="text-gray-900 text-sm font-medium">{jobData.jobType}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-gray-600 text-sm">Lương</span>
              <span className="text-gray-900 text-sm font-medium">{jobData.salary}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-gray-600 text-sm">Kinh nghiệm</span>
              <span className="text-gray-900 text-sm font-medium">{jobData.experience}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-gray-600 text-sm">Chức vụ</span>
              <span className="text-gray-900 text-sm font-medium">{jobData.position}</span>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-xl text-gray-900 mb-4">Danh mục</h3>
          <div className="flex flex-wrap gap-2">
            {jobData.categories.map((category, index) => (
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