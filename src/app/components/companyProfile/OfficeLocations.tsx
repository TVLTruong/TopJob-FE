'use client';
import React from 'react';

export default function OfficeLocations() {
  const offices = [
    { country: 'Việt Nam', city: 'TP.HCM - Trụ sở chính', flag: '🇻🇳' },
    { country: 'Singapore', city: '', flag: '🇸🇬' },
    { country: 'Philippines', city: '', flag: '🇵🇭' },
    { country: 'Myanmar', city: '', flag: '🇲🇲' },
    { country: 'Thái Lan', city: '', flag: '🇹🇭' },
  ];

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Văn phòng làm việc</h3>
      <div className="space-y-2">
        {offices.map((office, index) => (
          <div key={index} className="flex items-center gap-3">
            <span className="text-2xl">{office.flag}</span>
            <div>
              <span className="font-medium text-gray-900">{office.country}</span>
              {office.city && <span className="text-gray-600 text-sm ml-2">({office.city})</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
