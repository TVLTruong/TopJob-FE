'use client';
import React from 'react';
import TechStack from './TechStack';
import OfficeLocations from './OfficeLocations';

export default function CompanyInfo() {
  return (
    <div className="bg-white rounded-xl p-8 mb-6 shadow-sm">
      <h2 className="text-xl font-bold mb-6">Thông tin công ty</h2>
      <p className="text-gray-700 leading-relaxed mb-6">
        VNG là công ty công nghệ hàng đầu tại Việt Nam, nổi tiếng với các sản phẩm như Zalo, Zing MP3, ZingNews...
      </p>
      <div className="border-t pt-6 mb-6">
        <TechStack />
      </div>
      <div className="border-t pt-6">
        <OfficeLocations />
      </div>
    </div>
  );
}
