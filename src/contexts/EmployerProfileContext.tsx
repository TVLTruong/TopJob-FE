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
