'use client';

import { useEffect, useState, createContext, useContext } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import CompanyHeader from '@/app/components/companyProfile/CompanyHeader';
import CompanyInfo from '@/app/components/companyProfile/CompanyInfo';
import Benefits from '@/app/components/companyProfile/Benefits';
import Contact from '@/app/components/companyProfile/Contact';
import JobListings from '@/app/components/companyProfile/JobListings';
import { getPublicEmployerProfile } from '@/utils/api/employer-api';

// Create a context for company profile (read-only for candidates/guests)
const EmployerProfileContext = createContext<any>(undefined);

// Export the hook so child components can use it
export function useEmployerProfile() {
  const context = useContext(EmployerProfileContext);
  if (context === undefined) {
    throw new Error('useEmployerProfile must be used within CompanyProfilePage');
  }
  return context;
}

export default function PublicCompanyProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const employerId = searchParams.get('id');
  
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch public company profile
  useEffect(() => {
    const fetchProfile = async () => {
      // Must have employerId to view company
      if (!employerId) {
        setError('Không tìm thấy thông tin công ty');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getPublicEmployerProfile(employerId);
        setProfile(data);
      } catch (err: any) {
        console.error('Error fetching company profile:', err);
        setError(err.message || 'Không thể tải thông tin công ty');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [employerId]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin công ty...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Không tìm thấy công ty'}</p>
          <button
            onClick={() => router.push('/companypage')}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Quay lại danh sách công ty
          </button>
        </div>
      </div>
    );
  }

  // Format benefits: API trả về string hoặc array
  const benefitsText = Array.isArray(profile?.benefits) 
    ? profile.benefits.join('\n') 
    : (profile?.benefits || '');

  // Mock refresh function (read-only, no actual refresh needed)
  const refreshProfile = async () => {
    try {
      const data = await getPublicEmployerProfile(employerId!);
      setProfile(data);
    } catch (error) {
      console.error('Error refreshing profile:', error);
      throw error;
    }
  };

  // Provide profile context to all child components (read-only)
  const contextValue = {
    profile,
    isLoading: loading,
    error,
    refreshProfile,
    updateProfile: () => {} // No-op for read-only
  };

  return (
    <EmployerProfileContext.Provider value={contextValue}>
      <div className="min-h-screen bg-gray-50">
        <div>
          <CompanyHeader />
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 px-4 max-w-[1400px] mx-auto py-6">
            <div className="space-y-4">
              <CompanyInfo />
              <Benefits benefitsText={benefitsText} canEddit={false} onSave={() => {}} />
              <Contact canEdit={false} />
            </div>
            <div>
              <JobListings 
                employerId={profile?.id || employerId || ''} 
                companySlug={profile?.companyName ? profile.companyName.toLowerCase().replace(/\s+/g, '-') : undefined}
              />
            </div>
          </div>
        </div>
      </div>
    </EmployerProfileContext.Provider>
  );
}
