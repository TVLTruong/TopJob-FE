'use client';

import { useEffect, useState, createContext, useContext } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

import CompanyHeader from '@/app/components/companyProfile/CompanyHeader';
import CompanyInfo from '@/app/components/companyProfile/CompanyInfo';
import Benefits from '@/app/components/companyProfile/Benefits';
import Contact from '@/app/components/companyProfile/Contact';
import JobListings from '@/app/components/companyProfile/JobListings';
import { getMyEmployerProfile, getPublicEmployerProfile, updateMyEmployerProfile } from '@/utils/api/employer-api';
import Toast from '@/app/components/profile/Toast';

// Create a local context for this page to provide profile to child components
const EmployerProfileContext = createContext<any>(undefined);

// Export the hook so child components can use it
export function useEmployerProfile() {
  const context = useContext(EmployerProfileContext);
  if (context === undefined) {
    throw new Error('useEmployerProfile must be used within CompanyProfilePage');
  }
  return context;
}

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
  const isGuest = !user; // User not logged in
  const isViewingOwnProfile = isRecruiter && !employerId;

  // Show toast helper
  const showToast = (message: string, type: 'error' | 'success' = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const checkAccess = async () => {
      // Wait for auth to load
      if (authLoading) return;

      // Candidate or Guest viewing company profile - allow access
      if ((isCandidate || isGuest) && employerId) {
        setChecking(false);
        return;
      }

      // Guest without employerId - redirect to login
      if (isGuest && !employerId) {
        router.push('/login');
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
          // If profile not found, might need to complete profile
          router.push('/completeProfile');
        }
      } else {
        setChecking(false);
      }
    };

    checkAccess();
  }, [user, authLoading, router, isCandidate, isRecruiter, isGuest, employerId]);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (checking) return;

      try {
        setLoadingProfile(true);
        let data;
        
        if (employerId) {
          // Fetch public profile for viewing another company
          data = await getPublicEmployerProfile(employerId);
        } else if (isRecruiter) {
          // Fetch own profile directly
          data = await getMyEmployerProfile();
        }
        
        setProfile(data);
      } catch (error) {
        showToast('Không thể tải thông tin công ty', 'error');
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [checking, employerId, isRecruiter]);

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
      const updatedProfile = await getMyEmployerProfile();
      setProfile(updatedProfile);
      
      showToast('Lưu phúc lợi thành công!', 'success');
    } catch (error) {
      showToast('Có lỗi khi lưu phúc lợi. Vui lòng thử lại.', 'error');
    }
  };

  const canEdit = isViewingOwnProfile;

  // Create a refreshProfile function for context
  const refreshProfile = async () => {
    try {
      const data = employerId 
        ? await getPublicEmployerProfile(employerId)
        : await getMyEmployerProfile();
      setProfile(data);
    } catch (error) {
      console.error('Error refreshing profile:', error);
      throw error;
    }
  };

  // Provide profile context to all child components
  const contextValue = {
    profile,
    isLoading: loadingProfile,
    error: null,
    refreshProfile,
    updateProfile: (data: any) => setProfile({ ...profile, ...data })
  };

  return (
    <EmployerProfileContext.Provider value={contextValue}>
      <div className="min-h-screen bg-gray-50">
        <div>
          <CompanyHeader />
          <div className="grid grid-cols-[2fr_1fr]">
            <div>
              <CompanyInfo />
              <Benefits benefitsText={benefitsText} canEddit={canEdit} onSave={handleSaveBenefits} />
              <Contact canEdit={canEdit} />
            </div>
            <div>
              <JobListings 
                employerId={profile?.id || employerId || ''} 
                companySlug={profile?.companyName ? profile.companyName.toLowerCase().replace(/\s+/g, '-') : undefined}
              />
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
    </EmployerProfileContext.Provider>
  );
}