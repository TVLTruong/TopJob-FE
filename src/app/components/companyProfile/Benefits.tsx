'use client';
import React from 'react';

export default function Benefits() {
  const benefits = [
    {
      icon: '🏥',
      title: 'Bảo hiểm sức khỏe',
      description: 'Phụng tối xây dựng đội ngũ công khỏe mạnh, hạnh phúc từ sự chăm sóc sức khỏe toàn diện.',
    },
    {
      icon: '🏖️',
      title: 'Nghỉ phép linh hoạt',
      description: 'Uưỡn thưa việc theo thời gian linh hoạt cần bằng giữa công việc và cuộc sống cá nhân.',
    },
    {
      icon: '📹',
      title: 'Phát triển kỹ năng',
      description: 'Uưỡn học hỏi, tái và nâng cao năng lực thông qua hội thao hoặc khóa học online.',
    },
    {
      icon: '⛺',
      title: 'Hội nghị nhóm',
      description: 'Ca lẻ thăng, ca nhóm cùng hợp mật, vui chơi và làm kế hoạch cho quý tiếp theo.',
    },
    {
      icon: '☕',
      title: 'Làm việc từ xa',
      description: 'Làm việc ở nơi bạn cảm thấy hiệu quả nhất: tại nhà, quán cà phê, v.v.',
    },
    {
      icon: '🛏️',
      title: 'Hỗ trợ đi lại',
      description: 'Hỗ trợ chi phí đi chuyển cho nhân viên đến văn phòng mỗi ngày.',
    },
    {
      icon: '🏆',
      title: 'Chúng tôi cùng đóng góp',
      description: 'Chúng tôi sẽ đồng góp tương ứng với số tiền bạn quyên góp cho các tổ chức từ thiện (tối đa 600 USD/ năm).',
    },
  ];

  return (
    <div className="bg-white rounded-xl p-8 mb-6 shadow-sm">
      <h2 className="text-xl font-bold mb-4">Phúc lợi & Đãi ngộ</h2>
      <p className="text-gray-600 text-sm mb-6">
        Công việc này đi kèm với nhiều phúc lợi và đãi ngộ hấp dẫn
      </p>
      <div className="space-y-4">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0">
            <div className="text-3xl">{benefit.icon}</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
              <p className="text-gray-600 text-sm">{benefit.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
