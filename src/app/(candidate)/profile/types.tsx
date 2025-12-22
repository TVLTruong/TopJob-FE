// Import types from API
import type {
  CandidateProfile,
  CandidateEducation,
  CandidateWorkExperience,
  CandidateCV,
} from '@/utils/api/candidate-api';

// Re-export API types
export type { CandidateProfile, CandidateEducation, CandidateWorkExperience, CandidateCV };

// UI-specific types for form state (matches the form fields in modals)
export interface EducationFormData {
  school: string;
  degree: string;
  major: string;
  fromMonth: string;
  fromYear: string;
  toMonth: string;
  toYear: string;
  currentlyStudying: boolean;
  additionalDetails: string;
}

export interface WorkExperienceFormData {
  jobTitle: string;
  company: string;
  fromMonth: string;
  fromYear: string;
  toMonth: string;
  toYear: string;
  currentlyWorking: boolean;
  description: string;
}

// Legacy aliases for backward compatibility with existing UI components
export type Education = EducationFormData;
export type WorkExperience = WorkExperienceFormData;

// UI-specific profile type (combines API data with form state)
export interface Profile {
  name: string;
  title: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  province: string;
  district: string;
  address: string;
  personalLink: string;
  about: string;
  avatarUrl?: string;
  education: Education[];
  workExperience: WorkExperience[];
}

// Helper functions to convert between API and UI formats
export const convertEducationToFormData = (
  education: CandidateEducation
): EducationFormData => {
  const startDate = education.startDate ? new Date(education.startDate) : null;
  const endDate = education.endDate ? new Date(education.endDate) : null;

  return {
    school: education.school,
    degree: education.degree,
    major: education.major,
    fromMonth: startDate ? (startDate.getMonth() + 1).toString() : '',
    fromYear: startDate ? startDate.getFullYear().toString() : '',
    toMonth: endDate && !education.currentlyStudying ? (endDate.getMonth() + 1).toString() : '',
    toYear: endDate && !education.currentlyStudying ? endDate.getFullYear().toString() : '',
    currentlyStudying: education.currentlyStudying,
    additionalDetails: education.additionalDetails || '',
  };
};

export const convertEducationToApiFormat = (
  education: EducationFormData
): CandidateEducation => {
  const startDate = new Date(
    parseInt(education.fromYear),
    parseInt(education.fromMonth) - 1,
    1
  );

  let endDate: string | undefined;
  if (!education.currentlyStudying && education.toYear && education.toMonth) {
    endDate = new Date(
      parseInt(education.toYear),
      parseInt(education.toMonth) - 1,
      1
    ).toISOString();
  }

  return {
    school: education.school,
    degree: education.degree,
    major: education.major,
    startDate: startDate.toISOString(),
    endDate,
    currentlyStudying: education.currentlyStudying,
    additionalDetails: education.additionalDetails || undefined,
  };
};

export const convertWorkExperienceToFormData = (
  work: CandidateWorkExperience
): WorkExperienceFormData => {
  const startDate = work.startDate ? new Date(work.startDate) : null;
  const endDate = work.endDate ? new Date(work.endDate) : null;

  return {
    jobTitle: work.jobTitle,
    company: work.company,
    fromMonth: startDate ? (startDate.getMonth() + 1).toString() : '',
    fromYear: startDate ? startDate.getFullYear().toString() : '',
    toMonth: endDate && !work.currentlyWorking ? (endDate.getMonth() + 1).toString() : '',
    toYear: endDate && !work.currentlyWorking ? endDate.getFullYear().toString() : '',
    currentlyWorking: work.currentlyWorking,
    description: work.description || '',
  };
};

export const convertWorkExperienceToApiFormat = (
  work: WorkExperienceFormData
): CandidateWorkExperience => {
  const startDate = new Date(
    parseInt(work.fromYear),
    parseInt(work.fromMonth) - 1,
    1
  );

  let endDate: string | undefined;
  if (!work.currentlyWorking && work.toYear && work.toMonth) {
    endDate = new Date(
      parseInt(work.toYear),
      parseInt(work.toMonth) - 1,
      1
    ).toISOString();
  }

  return {
    jobTitle: work.jobTitle,
    company: work.company,
    startDate: startDate.toISOString(),
    endDate,
    currentlyWorking: work.currentlyWorking,
    description: work.description || undefined,
  };
};

export const convertApiProfileToUIProfile = (
  apiProfile: CandidateProfile
): Profile => {
  const dateOfBirth = apiProfile.dateOfBirth
    ? new Date(apiProfile.dateOfBirth).toISOString().split('T')[0]
    : '';

  // Convert gender from backend format ('male', 'female', 'other') to display format
  let genderDisplay = '';
  if (apiProfile.gender) {
    const genderMap: Record<string, string> = {
      'male': 'Nam',
      'female': 'Nữ',
      'other': 'Khác'
    };
    genderDisplay = genderMap[apiProfile.gender.toLowerCase()] || apiProfile.gender;
  }

  return {
    name: apiProfile.fullName,
    title: apiProfile.title || '',
    email: apiProfile.email,
    phone: apiProfile.phoneNumber || '',
    dateOfBirth,
    gender: genderDisplay,
    province: apiProfile.addressCity || '',
    district: apiProfile.addressDistrict || '',
    address: apiProfile.addressStreet || '',
    personalLink: apiProfile.personalUrl || '',
    about: apiProfile.bio || '',
    avatarUrl: apiProfile.avatarUrl,
    education: apiProfile.education?.map(convertEducationToFormData) || [],
    workExperience: apiProfile.workExperience?.map(convertWorkExperienceToFormData) || [],
  };
};
