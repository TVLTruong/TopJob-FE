'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCompanyActiveJobs, JobFromAPI, ExperienceLevelReverseMap, EmploymentTypeReverseMap } from '@/utils/api/job-api';

interface JobListingsProps {
  employerId: string;
}

export default function JobListings({ employerId }: JobListingsProps) {
  const [jobs, setJobs] = useState<JobFromAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!employerId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getCompanyActiveJobs(employerId);
        setJobs(data);
      } catch (err) {
        console.error('Error fetching company jobs:', err);
        setError('Không thể tải danh sách công việc');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [employerId]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-8 mb-3 ml-3 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Các vị trí đang tuyển</h2>
        <div className="text-center text-gray-500 py-8">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl p-8 mb-3 ml-3 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Các vị trí đang tuyển</h2>
        <div className="text-center text-red-500 py-8">{error}</div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 mb-3 ml-3 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Các vị trí đang tuyển</h2>
        <div className="text-center text-gray-500 py-8">Hiện không có vị trí tuyển dụng</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-8 mb-3 ml-3 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Các vị trí đang tuyển</h2>
        <Link href="/JobList" className="text-teal-600 hover:bg-teal-50 px-3 py-1 rounded text-sm font-medium transition">
          Tất cả →
        </Link>
      </div>

      <div className="space-y-3">
        {jobs.map((job) => {
          // Get first category name if exists
          const categoryName = job.jobCategories && job.jobCategories.length > 0 
            ? job.jobCategories[0].category?.name 
            : null;

          return (
            <Link
              key={job.id}
              href={`/JobList/JobDetail?id=${job.id}`}
              className="block p-4 border rounded-lg hover:border-teal-300 transition cursor-pointer"
            >
              <h3 className="font-semibold text-gray-900 text-sm mb-2">{job.title}</h3>
              <div className="flex flex-wrap gap-2">
                {/* Employment Type */}
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  {EmploymentTypeReverseMap[job.employmentType] || job.employmentType}
                </span>
                
                {/* Experience Level */}
                {job.experienceLevel && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {ExperienceLevelReverseMap[job.experienceLevel]}
                  </span>
                )}

                {/* Category */}
                {categoryName && (
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                    {categoryName}
                  </span>
                )}

                {/* Urgent tag */}
                {job.isUrgent && (
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                    Gấp
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
