'use client';
import React from 'react';

export default function JobListings() {
  const jobs = [
    { title: 'Social Media Assistant', type: 'Full-Time', tags: ['Marketing', 'Design'] },
    { title: 'Brand Designer', type: 'Full-Time', tags: ['Marketing', 'Design'] },
    { title: 'Interactive Developer', type: 'Full-Time', tags: ['Marketing', 'Design'] },
    { title: 'HR Manager', type: 'Full-Time', tags: ['Marketing', 'Design'] },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Các vị trí tuyển dụng</h2>
        <button className="text-teal-600 hover:bg-teal-50 px-3 py-1 rounded text-sm font-medium transition">
          Xem tất cả →
        </button>
      </div>

      <div className="space-y-3">
        {jobs.map((job, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg hover:border-teal-300 transition cursor-pointer"
          >
            <h3 className="font-semibold text-gray-900 text-sm mb-2">{job.title}</h3>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                {job.type}
              </span>
              {job.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
