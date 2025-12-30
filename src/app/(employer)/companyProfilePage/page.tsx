'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useEmployerProfile } from '@/contexts/EmployerProfileContext';
import Header from '@/app/components/companyProfile/Header';
import CompanyHeader from '@/app/components/companyProfile/CompanyHeader';
import CompanyInfo from '@/app/components/companyProfile/CompanyInfo';
import Benefits from '@/app/components/companyProfile/Benefits';
import Contact from '@/app/components/companyProfile/Contact';
import JobListings from '@/app/components/companyProfile/JobListings';
import { getMyEmployerProfile, updateMyEmployerProfile } from '@/utils/api/employer-api';

export default function CompanyProfilePage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { profile, isLoading : profileLoading, refreshProfile } = useEmployerProfile();
  const [checking, setChecking] = useState(true);
  // const [profile, setProfile] = useState<any>(null);
  // const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      // Wait for auth to load
      if (authLoading) return;

      // 🔥 DEV MODE: Skip all checks and load profile
      if (process.env.NODE_ENV === 'development') {
        setChecking(false);
        return;
      }

      // Check if user is logged in and is employer
      if (!user) {
        router.push('/login');
        return;
      }

      // Check role directly (backend returns lowercase)
      if (user.role !== 'employer') {
        router.push('/login');
        return;
      }

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
    };

    checkAccess();
  }, [user, authLoading, router]);

  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     try {
  //       const data = await getMyEmployerProfile();
  //       setProfile(data);
  //     } catch (error) {
  //       console.error('Error fetching profile:', error);
  //     } finally {
  //       setLoadingProfile(false);
  //     }
  //   };

  //   if (!checking && user) {
  //     fetchProfile();
  //   }
  // }, [checking, user]);

  // if (authLoading || checking || loadingProfile) {
  if (authLoading || checking || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // Format benefits: API trả về string hoặc array, Benefits component cần string format "\\n" separated
  const benefitsText = Array.isArray(profile?.benefits) 
    ? profile.benefits.join('\\n') 
    : (profile?.benefits || '');

  // Handler to save benefits to API
  const handleSaveBenefits = async (newBenefitsText: string) => {
    try {
      // Convert "\\n" separated string back to array
      const benefitsArray = newBenefitsText
        .split('\\n')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      
      await updateMyEmployerProfile({ benefits: benefitsArray });
      
      // Refresh profile to get updated data
      await refreshProfile();
    } catch (error) {
      console.error('Error saving benefits:', error);
      alert('Có lỗi khi lưu phúc lợi. Vui lòng thử lại.');
    }
  };

  return (
    // <EmployerProfileProvider>
    //   <div className="min-h-screen bg-gray-50">
    //     <Header />
    //     <div>
    //       <CompanyHeader />
    //       <div className="grid grid-cols-[2fr_1fr]">
    //         <div>
    //           <CompanyInfo />
    //           <Benefits benefitsText={benefitsText} canEddit />
    //           <Contact canEdit={true} />
    //         </div>
    //         <div>
    //           <JobListings />
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </EmployerProfileProvider>
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div>
        <CompanyHeader />
        <div className="grid grid-cols-[2fr_1fr]">
          <div>
            <CompanyInfo />
            <Benefits benefitsText={benefitsText} canEddit onSave={handleSaveBenefits} />
            <Contact canEdit={true} />
          </div>
          <div>
            <JobListings />
          </div>
        </div>
      </div>
    </div>
  );
}