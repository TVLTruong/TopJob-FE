import Header from '@/app/components/companyProfile/Header';
import CompanyHeader from '@/app/components/companyProfile/CompanyHeader';
import CompanyInfo from '@/app/components/companyProfile/CompanyInfo';
import Benefits from '@/app/components/companyProfile/Benefits';
import Contact from '@/app/components/companyProfile/Contact';
import JobListings from '@/app/components/companyProfile/JobListings';


export default function CompanyProfilePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="p-8">
        <CompanyHeader />
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <CompanyInfo />
            <Benefits benefitsText="" canEddit />
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