import FeatureCompanies from "@/app/components/landing/FeatureCompanies";
import HeroSearcher from "@/app/components/landing/searcher";
import FeaturedJobs from "@/app/components/landing/FeaturedJobs";


export default function Home() {
  return (
    <div className="bg-[#0000] flex flex-col items-center justify-center space-y-4">
      <HeroSearcher />
      <section id="itjob">
        <FeaturedJobs />
      </section>
      <section id="itcompany">
        <FeatureCompanies />
      </section>
    </div>
  );
}
