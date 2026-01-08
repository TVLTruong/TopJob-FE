'use client';
import React from 'react';
import { useEmployerProfile } from '@/contexts/EmployerProfileContext';
import { MapPin } from 'lucide-react';

export default function OfficeLocations() {
  const { profile } = useEmployerProfile();

  // Use profile locations if available, otherwise show empty state
  const offices = profile?.locations || [];

  if (offices.length === 0) {
    return (
      <div>
        <h3 className="text-xl font-bold mb-4">Văn phòng làm việc</h3>
        <p className="text-gray-500 text-sm">Chưa có thông tin văn phòng</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Văn phòng làm việc</h3>
      <div className="space-y-2">
        {offices.map((office, index) => {
          const isHeadquarters = index === 0; // First location is headquarters
          const fullAddress = [
            office.detailedAddress,
            office.district,
            office.province
          ].filter(Boolean).join(', ');
          
          return (
            <div key={index} className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <span className="text-gray-700">{fullAddress}</span>
                {isHeadquarters && (
                  <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded">
                    Trụ sở chính
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
