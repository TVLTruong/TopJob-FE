'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useEmployerProfile } from '@/contexts/EmployerProfileContext';
import Header from '@/app/components/companyProfile/Header';
import CompanyHeader from '@/app/components/companyProfile/CompanyHeader';
import CompanyInfo from '@/app/components/companyProfile/CompanyInfo';
import Benefits from '@/app/components/companyProfile/Benefits';
import Contact from '@/app/components/companyProfile/Contact';
import JobListings from '@/app/components/companyProfile/JobListings';
import { getMyEmployerProfile, getPublicEmployerProfile, updateMyEmployerProfile } from '@/utils/api/employer-api';
import Toast from '@/app/components/profile/Toast';

export default function CompanyProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const employerId = searchParams.get('id'); // Get employerId from URL if viewing another company
  const { user, isLoading: authLoading } = useAuth();
  const [checking, setChecking] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const isRecruiter = user?.role === 'employer';
  const isCandidate = user?.role === 'candidate';
  const isViewingOwnProfile = isRecruiter && !employerId;

  // Only use EmployerProfileContext if viewing own profile as employer
  let employerContext: any = null;
  try {
    if (isViewingOwnProfile) {
      employerContext = useEmployerProfile();
    }
  } catch (error) {
    // Context not available - will fetch manually
  }

  // Show toast helper
  const showToast = (message: string, type: 'error' | 'success' = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const checkAccess = async () => {
      // Wait for auth to load
      if (authLoading) return;

      // Candidate viewing company profile - allow access
      if (isCandidate && employerId) {
        setChecking(false);
        return;
      }

      // Check if user is logged in and is employer
      if (!user) {
        router.push('/login');
        return;
      }

      // Employer viewing their own profile
      if (isRecruiter && !employerId) {
        // Check user status
        try {
          const profile = await getMyEmployerProfile();
          
          // Normalize status to uppercase for comparison
          const profileStatus = (profile.status || '').toString().toUpperCase();
          
          // If status is PENDING_APPROVAL, redirect to pending page
          if (profileStatus === 'PENDING_APPROVAL') {
            router.push('/pending-approval');
            return;
          }

          // If status is not ACTIVE, something is wrong
          if (profileStatus !== 'ACTIVE') {
            router.push('/login?message=' + encodeURIComponent('Tài khoản chưa được kích hoạt'));
            return;
          }

          setChecking(false);
        } catch (error) {
          console.error('Error checking profile:', error);
          // If profile not found, might need to complete profile
          router.push('/completeProfile');
        }
      } else {
        setChecking(false);
      }
    };

    checkAccess();
  }, [user, authLoading, router, isCandidate, isRecruiter, employerId]);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (checking) return;

      try {
        setLoadingProfile(true);
        let data;
        
        if (isViewingOwnProfile && employerContext) {
          // Use context for employer viewing own profile
          await employerContext.refreshProfile();
          data = employerContext.profile;
        } else if (employerId) {
          // Fetch public profile for viewing another company
          data = await getPublicEmployerProfile(employerId);
        } else if (isRecruiter) {
          // Fallback: fetch own profile directly
          data = await getMyEmployerProfile();
        }
        
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        showToast('Không thể tải thông tin công ty', 'error');
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [checking, employerId, isViewingOwnProfile, isRecruiter]);

  if (authLoading || checking || loadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // Format benefits: API trả về string hoặc array, Benefits component cần string format newline separated
  const benefitsText = Array.isArray(profile?.benefits) 
    ? profile.benefits.join('\n') 
    : (profile?.benefits || '');

  // Handler to save benefits to API
  const handleSaveBenefits = async (newBenefitsText: string) => {
    // Only allow editing own profile
    if (!isViewingOwnProfile) {
      showToast('Bạn không có quyền chỉnh sửa trang này', 'error');
      return;
    }

    try {
      // Convert newline separated string back to array
      const benefitsArray = newBenefitsText
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      
      await updateMyEmployerProfile({ benefits: benefitsArray });
      
      // Refresh profile to get updated data
      if (employerContext) {
        await employerContext.refreshProfile();
        setProfile(employerContext.profile);
      } else {
        const updatedProfile = await getMyEmployerProfile();
        setProfile(updatedProfile);
      }
      
      showToast('Lưu phúc lợi thành công!', 'success');
    } catch (error) {
      console.error('Error saving benefits:', error);
      showToast('Có lỗi khi lưu phúc lợi. Vui lòng thử lại.', 'error');
    }
  };

  const canEdit = isViewingOwnProfile;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div>
        <CompanyHeader />
        <div className="grid grid-cols-[2fr_1fr]">
          <div>
            <CompanyInfo />
            <Benefits benefitsText={benefitsText} canEddit={canEdit} onSave={handleSaveBenefits} />
            <Contact canEdit={canEdit} />
          </div>
          <div>
            <JobListings />
          </div>
        </div>

      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
      </div>
    </div>
  );
}