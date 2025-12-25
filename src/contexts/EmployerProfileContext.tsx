'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getMyEmployerProfile } from '@/utils/api/employer-api';

export interface EmployerLocation {
  id: string;
  isHeadquarters: boolean;
  province: string;
  district: string;
  detailedAddress: string;
  fullAddress?: string;
}

export interface EmployerProfile {
  id: number;
  companyName: string;
  logoUrl?: string;  // Backend trả về logoUrl, không phải companyLogo
  coverImageUrl?: string;
  website?: string;
  description?: string;
  benefits?: string[];
  foundedYear?: number;
  companySize?: string;
  taxCode?: string;
  field?: string;
  technologies?: string[];
  locations?: EmployerLocation[];
  facebookUrl?: string;
  linkedlnUrl?: string;
  xUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  status?: string;
  profileStatus?: string;
}

interface EmployerProfileContextType {
  profile: EmployerProfile | null;
  isLoading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: Partial<EmployerProfile>) => void;
}

const EmployerProfileContext = createContext<EmployerProfileContextType | undefined>(undefined);

export function EmployerProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<EmployerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProfile = async () => {
    // 🔥 DEV MODE: Skip API call
    if (process.env.NODE_ENV === 'development') {
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      const data = await getMyEmployerProfile();
      console.log('📦 Employer Profile Data:', data);
      console.log('🖼️ Logo URL:', data?.logoUrl);
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
      console.error('Error loading employer profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // 🔥 DEV MODE: Skip auto-load and use mock data
    if (process.env.NODE_ENV === 'development') {
      setProfile({
        id: 'dev-employer-1',
        companyName: 'VNG',
        website: 'https://www.vng.com.vn',
        locations: [
          { province: 'Hồ Chí Minh', district: 'Quận 1', detailedAddress: '123 Nguyễn Huệ' },
          { province: 'Hà Nội', district: 'Quận Ba Đình', detailedAddress: '456 Kim Mã' }
        ],
        field: 'Công nghệ thông tin',
        foundedYear: 2004,
        technologies: ['React', 'Node.js', 'Python', 'Java'],
        description: 'VNG là công ty công nghệ hàng đầu Việt Nam, với hơn 3000 nhân viên và các sản phẩm công nghệ được sử dụng rộng rãi.',
        benefits: ['Chế độ bảo hiểm sức khỏe mở rộng', 'Nghỉ phép linh hoạt 12 ngày', 'Lương tháng 13 và thưởng hiệu suất'],
        contactEmail: 'contact@vng.com.vn',
        facebookUrl: 'https://facebook.com/vng',
        linkedlnUrl: 'https://linkedin.com/company/vng',
        xUrl: 'https://x.com/vng',
        logoUrl: '/logo.svg',
        status: 'ACTIVE'
      } as any);
      setIsLoading(false);
      return;
    }
    // Auto-load profile on mount
    refreshProfile();
  }, []);

  const updateProfile = (data: Partial<EmployerProfile>) => {
    if (profile) {
      setProfile({ ...profile, ...data });
    }
  };

  return (
    <EmployerProfileContext.Provider 
      value={{ profile, isLoading, error, refreshProfile, updateProfile }}
    >
      {children}
    </EmployerProfileContext.Provider>
  );
}

export function useEmployerProfile() {
  const context = useContext(EmployerProfileContext);
  if (context === undefined) {
    throw new Error('useEmployerProfile must be used within an EmployerProfileProvider');
  }
  return context;
}
