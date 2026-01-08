"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CompanyCard from "@/app/components/company/CompanyCard";
import { Company } from "@/app/components/types/company.types";
// -------------------------
import { ArrowRight } from "lucide-react";

async function fetchFeaturedCompanies(): Promise<Company[]> {
  console.log("Fetching featured companies...");
  await new Promise(resolve => setTimeout(resolve, 500));

  // --- DỮ LIỆU GIẢ LẬP (COMPANY) ---
  const mockCompanies: Company[] = [
    { id: '1', name: "Gameloft", locations: ["TP.HCM", "Đà Nẵng"], technologies: ["Unity", "C++", "Game"], jobCount: 15, logoUrl: "/placeholder-logo.png" },
    { id: '2', name: "Viggle", locations: ["Đà Nẵng", "Remote"], technologies: ["AI", "Machine Learning", "Python"], jobCount: 8, logoUrl: "/placeholder-logo.png" },
    { id: '3', name: "Base.vn", locations: ["Hà Nội", "TP.HCM"], technologies: ["PHP", "ReactJS", "NodeJS", "SaaS"], jobCount: 22, logoUrl: "/placeholder-logo.png" },
    { id: '4', name: "Eureka", locations: ["TP.HCM"], technologies: ["Software Outsourcing", ".NET", "Java", "Cloud", "Security", "NLP", "LLM"], jobCount: 5, logoUrl: "/placeholder-logo.png" },
    { id: '5', name: "DXC Technology", locations: ["TP.HCM", "Hà Nội", "Đà Nẵng", "Cần Thơ"], technologies: ["Cloud", "Security", "Consulting", "Java"], jobCount: 30, logoUrl: "/placeholder-logo.png" },
    { id: '6', name: "Corsair", locations: ["Hà Nội", "Đài Loan"], technologies: ["Gaming Gear", "Hardware", "Firmware"], jobCount: 3, logoUrl: "/placeholder-logo.png" },
    { id: '7', name: "Shopee", locations: ["TP.HCM", "Hà Nội"], technologies: ["E-commerce", "Go", "Python", "React"], jobCount: 40, logoUrl: "/placeholder-logo.png" },
    { id: '8', name: "Zalo", locations: ["TP.HCM", "Hà Nội"], technologies: ["Messaging", "AI", "Mobile", "Zing MP3"], jobCount: 0, logoUrl: "/placeholder-logo.png" }, // Ví dụ công ty không có job
  ];

  return mockCompanies;
}


export default function FeaturedCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCompanies() {
      setIsLoading(true);
      try {
        const featuredCompanies = await fetchFeaturedCompanies();
        setCompanies(featuredCompanies);
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
        <div className="w-full mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
            Nhà tuyển dụng nổi bật
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