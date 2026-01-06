'use client';
import React from 'react';
import { useEmployerProfile } from '@/app/(employer)/companyProfilePage/page';
import TechStack from './TechStack';
import OfficeLocations from './OfficeLocations';

export default function CompanyInfo() {
  const { profile, isLoading } = useEmployerProfile();

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-8 mb-6 shadow-sm">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-8 mb-3 shadow-sm">
      <h2 className="text-xl font-bold mb-6">Thông tin công ty</h2>
      <p className="text-gray-700 leading-relaxed mb-8">
        {profile?.description || 'Chưa có mô tả công ty'}
      </p>
      {/* <div className="border-t pt-8 mb-8">
        <TechStack />
      </div> */}
      <div className="border-t pt-8">
        <OfficeLocations />
      </div>
    </div>
  );
}
