'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useEmployerProfile } from '@/contexts/EmployerProfileContext';
import JobFormModal from '@/app/components/job/JobFormModal';
import type { JobDetailData } from '@/app/components/job/JobDetailContents';

export default function Header() {
  const { user } = useAuth();
  const { profile, isLoading } = useEmployerProfile();
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);

  // Debug: Log profile data
  useEffect(() => {
    if (profile) {
      console.log('🏢 Header - Profile loaded:', {
        companyName: profile.companyName,
        logoUrl: profile.logoUrl,
        hasLogo: !!profile.logoUrl
      });
    }
  }, [profile]);

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

  const isRecruiter = user?.role === 'employer';

  return (
    <>
      <header className="bg-white border-b">
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {profile?.logoUrl ? (
              <Image 
                src={profile.logoUrl} 
                alt={profile.companyName || 'Company'} 
                width={40} 
                height={40}
                className="rounded-lg object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-xs">Logo</div>
            )}
            <div>
    
              <div className="text-sm font-semibold text-gray-600">
                {profile?.companyName || 'Loading...'}
              </div>
            </div>
          </div>
          
          {/* Chỉ hiện nút "Đăng việc làm" cho RECRUITER */}
          {isRecruiter && (
            <button 
              onClick={() => setIsCreateJobOpen(true)}
              className="bg-teal-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition"
            >
              + Đăng việc làm
            </button>
          )}
        </div>
      </header>

      {isRecruiter && (
        <JobFormModal
          isOpen={isCreateJobOpen}
          onClose={() => setIsCreateJobOpen(false)}
          onSave={handleCreateJob}
          onSuccess={handleViewJob}
          mode="create"
        />
      )}
    </>
  );
}