"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CompanyCard from "@/app/components/company/CompanyCard";
import { Company } from "@/app/components/types/company.types";
import { ArrowRight } from "lucide-react";
import { getFeaturedCompanies } from "@/utils/api/company-api";

export default function FeaturedCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCompanies() {
      setIsLoading(true);
      try {
        // Gọi API để lấy 6 công ty nổi bật (có nhiều job nhất)
        const response = await getFeaturedCompanies(6);
        
        // Convert CompanyFromAPI to Company type
        const convertedCompanies = response.data.map((company: any) => ({
          id: company.id,
          name: company.companyName,
          locations: company.locations?.map((loc: any) => loc.province) || [],
          technologies: company.employerCategories?.map((ec: any) => ec.category.name) || [],
          jobCount: company.jobCount || 0,
          logoUrl: company.logoUrl || '/placeholder-logo.png',
        })) as Company[];
        
        setCompanies(convertedCompanies);
      } catch (error) {
        console.error("Lỗi khi tải công ty nổi bật:", error);
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
        <div className="w-full flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
            Công ty nổi bật
          </h2>
          <Link
            href="/companypage" // Link tới trang danh sách công ty
            className="px-5 py-2 bg-jobcard-button text-white rounded-lg space-x-2 flex items-center hover:bg-jobcard-button-hover transition-all transform hover:scale-105 text-sm font-medium"
          >
            <span>Xem tất cả</span>
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Grid hiển thị Companies */}
        {isLoading ? (
          // --- SKELETON (Có thể chỉnh sửa cho giống CompanyCard hơn) ---
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-100 animate-pulse flex flex-col items-center h-[280px]">
                <div className="w-20 h-20 bg-gray-200 rounded-md mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="flex gap-2 mb-5 w-full justify-center">
                  <div className="h-5 bg-gray-200 rounded-full w-16"></div>
                  <div className="h-5 bg-gray-200 rounded-full w-20"></div>
                </div>
                <div className="w-full border-t border-gray-100 my-4"></div>
                <div className="flex justify-between w-full mt-auto">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                </div>
              </div>
            ))}
          </div>
        ) : companies.length === 0 ? (
          // --- THAY ĐỔI TEXT ---
          <p className="text-center text-gray-500 py-10">
            Hiện chưa có nhà tuyển dụng nào.
          </p>
        ) : (
          // --- HIỂN THỊ DANH SÁCH COMPANY ---
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {companies.slice(0, 6).map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}