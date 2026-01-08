"use client";

import { useState, useEffect } from "react";
import CompanyCard from "@/app/components/company/CompanyCard";
import { Company } from "@/app/components/types/company.types";
import { getFeaturedCompanies, FeaturedCompany } from "@/utils/api/employer-api";

// Transform API company to Company type for CompanyCard
function transformCompanyFromAPI(apiCompany: FeaturedCompany): Company {
  return {
    id: apiCompany.id,
    companyName: apiCompany.companyName,
    logoUrl: apiCompany.logoUrl,
    categories: apiCompany.categories,
    locations: apiCompany.locations,
    jobCount: apiCompany.jobCount,
  };
}

export default function FeaturedCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCompanies() {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch featured companies from API (top 6 by job count)
        const featuredCompanies = await getFeaturedCompanies();
        const transformedCompanies = featuredCompanies.map(transformCompanyFromAPI);
        setCompanies(transformedCompanies);
      } catch (error) {
        console.error("Lỗi khi tải công ty nổi bật:", error);
        // Show empty state instead of error - API might be temporarily unavailable
        setCompanies([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadCompanies();
  }, []);

  return (
    <div className="w-full py-3 md:py-3">
      <div className="mx-auto px-1">
        {/* Header Section */}
        <div className="w-full mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
            Công ty nổi bật
          </h2>
        </div>

        {/* Grid hiển thị Companies */}
        {isLoading ? (
          // --- SKELETON (Có thể chỉnh sửa cho giống CompanyCard hơn) ---
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-100 animate-pulse flex flex-col items-center h-[280px]">
                <div className="w-20 h-20 bg-gray-200 rounded-md mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 mb-5"></div>
                <div className="w-full border-t border-gray-100 my-4"></div>
                <div className="flex justify-between w-full mt-auto">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          // Hiển thị lỗi
          <div className="text-center py-10">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        ) : companies.length === 0 ? (
          // --- THAY ĐỔI TEXT ---
          <p className="text-center text-gray-500 py-10">
            Hiện chưa có công ty nổi bật nào.
          </p>
        ) : (
          // --- HIỂN THỊ DANH SÁCH COMPANY ---
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {companies.slice(0, 6).map((company) => (
              <CompanyCard key={company.id} company={company} source="landing" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}