'use client';

import React from 'react';
import CompanyHeader from '@/app/components/companyProfile/CompanyHeader';
import CompanyInfo from '@/app/components/companyProfile/CompanyInfo';
import Benefits from '@/app/components/companyProfile/Benefits';
import Contact from '@/app/components/companyProfile/Contact';
import JobListings from '@/app/components/companyProfile/JobListings';

interface CompanyProfileDisplayProps {
  benefitsText: string;
  canEdit?: boolean;
  onSaveBenefits?: (benefits: string) => Promise<void>;
}

/**
 * Shared component for displaying company profile
 * Used by both candidate and employer pages
 * @param benefitsText - Benefits text (newline separated)
 * @param canEdit - Whether the profile can be edited (employer only)
 * @param onSaveBenefits - Callback for saving benefits (employer only)
 */
export default function CompanyProfileDisplay({ 
  benefitsText, 
  canEdit = false,
  onSaveBenefits 
}: CompanyProfileDisplayProps) {
  return (
    <>
      <CompanyHeader />
      <div className="grid grid-cols-[2fr_1fr]">
        <div>
          <CompanyInfo />
          <Benefits 
            benefitsText={benefitsText} 
            canEddit={canEdit} 
            onSave={onSaveBenefits} 
          />
          <Contact canEdit={canEdit} />
        </div>
        <div>
          <JobListings />
        </div>
      </div>
    </>
  );
}
