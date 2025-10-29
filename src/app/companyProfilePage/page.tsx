import Sidebar from '@/app/components/companyProfile/Sidebar';
import Header from '@/app/components/companyProfile/Header';
import CompanyHeader from '@/app/components/companyProfile/CompanyHeader';
import CompanyInfo from '@/app/components/companyProfile/CompanyInfo';
import Benefits from '@/app/components/companyProfile/Benefits';
import Contact from '@/app/components/companyProfile/Contact';
import JobListings from '@/app/components/companyProfile/JobListings';


export default function CompanyProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex max-w-7xl mx-auto">
        <Sidebar />
        <main className="flex-1">
          <Header />
          <div className="p-8">
            <CompanyHeader />
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2">
                <CompanyInfo />
                <Benefits />
                <Contact />
              </div>
              <div className="col-span-1">
                <JobListings />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
