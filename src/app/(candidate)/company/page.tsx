'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/app/components/companyProfile/Header';
import CompanyProfileDisplay from '@/app/components/companyProfile/CompanyProfileDisplay';
import { getPublicEmployerProfile } from '@/utils/api/employer-api';
import Toast from '@/app/components/profile/Toast';

/**
 * Candidate Company Profile Page
 * This page is for candidates to view company profiles
 * Uses public employer APIs only - no editing capabilities
 */
function CompanyProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const employerId = searchParams.get('id');
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  // Show toast helper
  const showToast = (message: string, type: 'error' | 'success' = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!employerId) {
        setError('Không tìm thấy ID công ty');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Fetch public employer profile
        const data = await getPublicEmployerProfile(employerId);
        setProfile(data);
      } catch (err: any) {
        console.error('Error fetching employer profile:', err);
        setError(err.message || 'Không thể tải thông tin công ty');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [employerId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Không tìm thấy thông tin công ty'}</p>
          <button
            onClick={() => router.push('/companypage')}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Quay lại danh sách công ty
          </button>
        </div>
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
        {/* Display company profile in read-only mode (canEdit = false) */}
        <CompanyProfileDisplay 
          benefitsText={benefitsText} 
          canEdit={false} 
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

export default function CompanyProfilePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    }>
      <CompanyProfileContent />
    </Suspense>
  );
}
