'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { JobDetailData } from '@/app/components/job/JobDetailContents';

interface JobDetailHeaderProps {
  job: JobDetailData;
}

/**
 * Shared component for displaying job detail header
 * Used by both candidate and employer pages
 */
export default function JobDetailHeader({ job }: JobDetailHeaderProps) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-xl p-6 mb-3 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()} 
            className="text-gray-700 hover:text-gray-900 text-2xl font-bold rounded-full hover:bg-gray-100 hover:shadow-md"
          >
            ←
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <p className="text-gray-600 text-sm">
              {job.experienceLevel ? job.experienceLevel.charAt(0).toUpperCase() + job.experienceLevel.slice(1) : 'N/A'} • {job.employmentType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} • {job.experienceYearsMin ? `${job.experienceYearsMin} năm` : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
