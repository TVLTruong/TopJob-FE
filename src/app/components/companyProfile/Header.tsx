'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import JobFormModal from '@/app/components/job/JobFormModal';
import Toast from '@/app/components/profile/Toast';
import type { JobDetailData } from '@/app/components/job/JobDetailContents';
import { createJob } from '@/utils/api/job-api';
import type { CreateJobPayload } from '@/utils/api/job-api';
import { jobCategoryApi } from '@/utils/api/categories-api';
import { technologyApi } from '@/utils/api/technology-api';

// Try to import the hook, but handle if not available
let useEmployerProfileHook: any = null;
try {
  const module = require('@/app/(employer)/companyProfilePage/page');
  useEmployerProfileHook = module.useEmployerProfile;
} catch (e) {
  // Context not available - this is ok
}

export default function Header() {
  const { user } = useAuth();
  
  // Try to use context if available
  let profile = null;
  let isLoading = false;
  if (useEmployerProfileHook) {
    try {
      const context = useEmployerProfileHook();
      profile = context.profile;
      isLoading = context.isLoading;
    } catch (error) {
      // Context not available - use fallback
    }
  }
  
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  // Show toast helper
  const showToast = (message: string, type: 'error' | 'success' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

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

  const handleCreateJob = async (jobData: JobDetailData) => {
    try {
      // Validate required fields
      if (!jobData.locationId) {
        showToast('Vui lòng chọn địa điểm làm việc', 'error');
        return;
      }

      if (!jobData.categories || jobData.categories.length === 0) {
        showToast('Vui lòng chọn ít nhất một danh mục', 'error');
        return;
      }

      if (!jobData.technologies || jobData.technologies.length === 0) {
        showToast('Vui lòng chọn ít nhất một công nghệ', 'error');
        return;
      }

      // Get all categories from API to map names to IDs
      let allCategories;
      try {
        allCategories = await jobCategoryApi.getList();
      } catch (error) {
        console.error('Error fetching categories:', error);
        showToast('Không thể tải danh mục. Vui lòng thử lại.', 'error');
        return;
      }
      
      const categoryIds: string[] = [];
      for (const catName of jobData.categories) {
        const category = allCategories.find(cat => cat.name === catName);
        if (category) {
          categoryIds.push(category.id);
        } else {
          showToast(`Không tìm thấy danh mục: ${catName}`, 'error');
          return;
        }
      }

      // Get all technologies from API to map names to IDs (if provided)
      let technologyIds: string[] | undefined;
      if (jobData.technologies && jobData.technologies.length > 0) {
        try {
          const allTechnologies = await technologyApi.getList();
          technologyIds = [];
          
          for (const techName of jobData.technologies) {
            const technology = allTechnologies.find(tech => tech.name === techName);
            if (technology) {
              technologyIds.push(technology.id);
            }
          }
        } catch (error) {
          console.error('Error fetching technologies:', error);
          // Technologies are optional, so we can continue without them
        }
      }

      // Convert expiredAt from dd/MM/yyyy to ISO date
      const [day, month, year] = jobData.expiredAt.split('/');
      const expiredAtISO = new Date(`${year}-${month}-${day}`).toISOString();

      // Build API payload
      const payload: CreateJobPayload = {
        categoryIds,
        technologyIds,
        locationId: jobData.locationId!,
        title: jobData.title,
        description: jobData.description,
        requirements: jobData.requirements,
        responsibilities: jobData.responsibilities,
        niceToHave: jobData.plusPoints,
        benefits: jobData.benefits,
        salaryMin: jobData.salaryMin,
        salaryMax: jobData.salaryMax,
        isNegotiable: jobData.isNegotiable,
        isSalaryVisible: jobData.isSalaryVisible,
        salaryCurrency: jobData.salaryCurrency,
        employmentType: jobData.employmentType,
        workMode: jobData.workMode,
        experienceLevel: jobData.experienceLevel,
        experienceYearsMin: jobData.experienceYearsMin,
        quantity: jobData.quantity,
        expiredAt: expiredAtISO,
        isHot: jobData.isHot,
        isUrgent: jobData.isUrgent,
      };

      console.log('Creating job with payload:', payload);
      
      const response = await createJob(payload);
      console.log('Job created successfully:', response);
      
      showToast('Tạo tin tuyển dụng thành công!');
      setIsCreateJobOpen(false);
    } catch (error: any) {
      console.error('Error creating job:', error);
      showToast(`Lỗi khi tạo tin tuyển dụng: ${error.response?.data?.message || error.message || 'Vui lòng thử lại'}`, 'error');
    }
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
        <div className="px-8 py-4 flex items-center justify-end">
          {/* <div className="flex items-center gap-3">
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
          </div> */}
          
          {/* Chỉ hiện nút "Đăng việc làm" cho RECRUITER */}
          {isRecruiter && (
            <button 
              onClick={() => setIsCreateJobOpen(true)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition"
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

      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </>
  );
}