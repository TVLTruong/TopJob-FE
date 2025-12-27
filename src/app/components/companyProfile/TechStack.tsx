'use client';
import React from 'react';
import { useEmployerProfile } from '@/contexts/EmployerProfileContext';

export default function TechStack() {
  const { profile, isLoading } = useEmployerProfile();

  const techColors = [
    'bg-orange-500',
    'bg-blue-500',
    'bg-yellow-500',
    'bg-cyan-400',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-teal-500',
  ];

  const technologies = profile?.technologies || [];

  if (isLoading) {
    return (
      <div>
        <h3 className="text-xl font-bold mb-4">Công nghệ</h3>
        <div className="grid grid-cols-2 gap-3 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-gray-200"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (technologies.length === 0) {
    return (
      <div>
        <h3 className="text-xl font-bold mb-4">Công nghệ</h3>
        <p className="text-gray-500 text-sm">Chưa có thông tin công nghệ</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Công nghệ</h3>
      <div className="grid grid-cols-2 gap-3">
        {technologies.map((tech, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${techColors[index % techColors.length]}`}></div>
            <span className="text-gray-700">{tech}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
