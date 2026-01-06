'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useEmployerProfile } from '@/contexts/EmployerProfileContext';
import Header from '@/app/components/companyProfile/Header';
import CompanyProfileDisplay from '@/app/components/companyProfile/CompanyProfileDisplay';
import { getMyEmployerProfile, updateMyEmployerProfile } from '@/utils/api/employer-api';
import Toast from '@/app/components/profile/Toast';

/**
 * Employer Company Profile Page
 * This page is for employers to view and edit their company profile
 * Role is always employer (no role checking needed)
 */
export default function CompanyProfilePage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading, refreshProfile } = useEmployerProfile();
  const [checking, setChecking] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  // Show toast helper
  const showToast = (message: string, type: 'error' | 'success' = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Check access - Employer only, must be ACTIVE
  useEffect(() => {
    const checkAccess = async () => {
      // Wait for auth to load
      if (authLoading) return;

      // Check if user is logged in and is employer
      if (!user) {
        router.push('/login');
        return;
      }

      // Check role (backend returns uppercase EMPLOYER/CANDIDATE)
      if (user.role !== 'EMPLOYER') {
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

  // Handler to save benefits to API (employer only)
  const handleSaveBenefits = async (newBenefitsText: string) => {
    try {
      // Convert newline separated string back to array
      const benefitsArray = newBenefitsText
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      
      await updateMyEmployerProfile({ benefits: benefitsArray });
      
      // Refresh profile to get updated data
      await refreshProfile();
      showToast('Lưu phúc lợi thành công!', 'success');
    } catch (error) {
      console.error('Error saving benefits:', error);
      showToast('Có lỗi khi lưu phúc lợi. Vui lòng thử lại.', 'error');
    }
  };

  if (authLoading || checking || profileLoading) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div>
        {/* Display company profile in edit mode (canEdit = true) */}
        <CompanyProfileDisplay 
          benefitsText={benefitsText} 
          canEdit={true}
          onSaveBenefits={handleSaveBenefits}
        />
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
  );
}
