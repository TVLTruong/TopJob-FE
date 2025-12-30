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
  id: string;
  userId: string;
  // Contact Person Info
  fullName: string;
  workTitle?: string;
  email?: string;
  // Company Info
  companyName: string;
  description?: string | null;
  website?: string | null;
  // Company Media
  logoUrl?: string | null;
  // Company Details
  foundedDate?: Date | null;
  // Contact Info
  contactEmail?: string | null;
  contactPhone?: string | null;
  // Social Media
  linkedlnUrl?: string | null;
  facebookUrl?: string | null;
  xUrl?: string | null;
  // Status Fields
  isApproved: boolean;
  status: string;
  profileStatus: string;
  employerCategory?: string[];
  // Benefits & Technologies
  benefits?: string[];
  technologies?: string[];
  // Locations
  locations?: EmployerLocation[];
  // Computed fields
  companyAge?: number | null;
  headquarters?: EmployerLocation;
  hasCompleteProfile?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
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
