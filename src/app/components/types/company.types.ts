export interface Company {
  id: string;
  companyName: string;
  logoUrl: string | null;
  categories?: string[];
  locations: string[];
  jobCount: number;
}