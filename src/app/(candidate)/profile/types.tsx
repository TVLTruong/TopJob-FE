export interface Education {
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

export interface WorkExperience {
  jobTitle: string;
  company: string;
  fromMonth: string;
  fromYear: string;
  toMonth: string;
  toYear: string;
  currentlyWorking: boolean;
  description: string;
}

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
  education: Education[];
  workExperience: WorkExperience[];
}
