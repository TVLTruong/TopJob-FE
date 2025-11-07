'use client';
import React, { useState } from 'react';
import JobFormModal from '@/app/components/job/JobFormModal';
import type { JobDetailData } from '@/app/components/job/JobDetailContents';

export default function Header() {
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);

  const handleCreateJob = (jobData: JobDetailData) => {
    // Here you would typically send the data to your API
    console.log('Creating new job:', jobData);
    // You can add API call here, show success message, redirect, etc.
  };

  const handleViewJob = (jobData: JobDetailData) => {
    // TODO: Navigate to job detail page
    console.log('Navigate to job:', jobData);
    // Example: router.push(`/jobs/${jobId}`);
  };

  return (
    <>
      <header className="bg-white border-b">
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
            <div>
              <div className="font-semibold">Company</div>
              <div className="text-sm font-semibold text-gray-600">VNG</div>
            </div>
          </div>
          <button 
            onClick={() => setIsCreateJobOpen(true)}
            className="bg-teal-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition"
          >
            + Đăng việc làm
          </button>
        </div>
      </header>

      <JobFormModal
        isOpen={isCreateJobOpen}
        onClose={() => setIsCreateJobOpen(false)}
        onSave={handleCreateJob}
        onSuccess={handleViewJob}
        mode="create"
      />
    </>
  );
}