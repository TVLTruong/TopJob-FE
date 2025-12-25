'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/app/components/companyProfile/Header';
import CompanyHeader from '@/app/components/companyProfile/CompanyHeader';
import CompanyInfo from '@/app/components/companyProfile/CompanyInfo';
import Benefits from '@/app/components/companyProfile/Benefits';
import Contact from '@/app/components/companyProfile/Contact';
import JobListings from '@/app/components/companyProfile/JobListings';
import { getMyEmployerProfile } from '@/utils/api/employer-api';

export default function CompanyProfilePage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [checking, setChecking] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      // Wait for auth to load
      if (authLoading) return;

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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyEmployerProfile();
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoadingProfile(false);
      }
    };

    if (!checking && user) {
      fetchProfile();
    }
  }, [checking, user]);

  if (authLoading || checking || loadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // Format benefits: API trả về array, Benefits component cần string format "/n" separated
  const benefitsText = profile?.benefits?.join('/n') || '';

  return (
    <div className="min-h-screen">
      <Header />
      <div className="p-8">
        <CompanyHeader />
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <CompanyInfo />
            <Benefits benefitsText={benefitsText} canEddit />
            <Contact canEdit={true} />
          </div>
          <div className="col-span-1">
            <JobListings />
          </div>
        </div>
      </div>
    </div>
  );
}