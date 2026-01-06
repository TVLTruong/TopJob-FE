"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown, X, SlidersHorizontal, MapPin, Layers } from "lucide-react";
import HeroSearcher from "@/app/components/landing/searcher";
import CompanyCard from "@/app/components/company/CompanyCard";
import { Company } from "@/app/components/types/company.types";
import { getPublicCompanies } from "@/utils/api/company-api";

const locationOptions = ["TP.HCM", "Hà Nội", "Đà Nẵng", "Cần Thơ", "Quy Nhơn", "Hải Phòng"];
const technologyOptions = [
  "Java",
  "Python",
  "JavaScript",
  "React",
  "NodeJS",
  "Go",
  "C#",
  ".NET",
  "Angular",
  "Vue.js",
  "AWS",
  "Docker",
  "Kubernetes",
  "MySQL",
  "MongoDB",
  "PostgreSQL"
];

// Horizontal Filter Dropdown Component
interface HorizontalFilterProps {
  label: string;
  icon: React.ReactNode;
  options: string[];
  selected: string[];
  tempSelected: string[];
  onTempChange: (selected: string[]) => void;
}

function HorizontalFilter({ label, icon, options, selected, tempSelected, onTempChange }: HorizontalFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (option: string) => {
    const newSelected = tempSelected.includes(option) 
      ? tempSelected.filter(i => i !== option) 
      : [...tempSelected, option];
    onTempChange(newSelected);
  };

  const handleClearAll = () => {
    onTempChange([]);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2.5 bg-white border rounded-lg transition-all ${
          selected.length > 0
            ? "border-emerald-500 bg-emerald-50"
            : "border-gray-300 hover:border-emerald-400"
        }`}
      >
        {icon}
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {selected.length > 0 && (
          <span className="ml-1 px-2 py-0.5 text-xs bg-emerald-600 text-white rounded-full">
            {selected.length}
          </span>
        )}
        <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-xl z-30">
            <div className="p-4 max-h-80 overflow-y-auto">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{label}</h3>
                {tempSelected.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Xóa hết
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {options.map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={tempSelected.includes(option)}
                      onChange={() => handleToggle(option)}
                      className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Main Component
export default function CompanyPage() {
  // State for companies data
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Applied filters
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  
  // Temporary filters
  const [tempLocations, setTempLocations] = useState<string[]>([]);
  const [tempTechnologies, setTempTechnologies] = useState<string[]>([]);

  const searchParams = useSearchParams();

  // Fetch companies from API
  useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const keyword = searchParams.get('keyword') || undefined;
        const city = searchParams.get('location') || undefined;

        const response = await getPublicCompanies({
          page: 1,
          limit: 100, // Lấy nhiều công ty
          keyword,
          city,
        });
        
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
      } catch (err) {
        console.error('Error fetching companies:', err);
        setError('Không thể tải danh sách công ty. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCompanies();
  }, [searchParams]);

  const applyAllFilters = () => {
    setSelectedLocations([...tempLocations]);
    setSelectedTechnologies([...tempTechnologies]);
  };

  const clearAllFilters = () => {
    // Clear applied filters
    setSelectedLocations([]);
    setSelectedTechnologies([]);
    // Clear temp filters
    setTempLocations([]);
    setTempTechnologies([]);
  };

  const totalFiltersCount = selectedLocations.length + selectedTechnologies.length;
  const totalTempFiltersCount = tempLocations.length + tempTechnologies.length;

  const hasUnappliedChanges = 
    JSON.stringify(tempLocations) !== JSON.stringify(selectedLocations) ||
    JSON.stringify(tempTechnologies) !== JSON.stringify(selectedTechnologies);

  const keyword = searchParams.get('keyword') || '';
  const locationQuery = searchParams.get('location') || '';

  return (
    <div className="min-h-screen">
      {/* Search Section */}
      <HeroSearcher />

      {/* Search context info (optional) */}
      {(keyword || locationQuery) && (
        <div className="container mx-auto px-4 max-w-[1400px] mt-4">
          <div className="text-sm text-gray-600">
            Đang tìm kiếm công ty{keyword ? ` với từ khóa "${keyword}"` : ''}{locationQuery ? ` tại ${locationQuery}` : ''}.
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-[1400px] py-8 bg-gray-50">
        {/* Horizontal Filters Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 mr-2">
              <SlidersHorizontal className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-semibold text-gray-700">Bộ lọc:</span>
            </div>

            <HorizontalFilter
              label="Địa điểm"
              icon={<MapPin className="w-5 h-5 text-gray-600" />}
              options={locationOptions}
              selected={selectedLocations}
              tempSelected={tempLocations}
              onTempChange={setTempLocations}
            />

            <HorizontalFilter
              label="Công nghệ"
              icon={<Layers className="w-5 h-5 text-gray-600" />}
              options={technologyOptions}
              selected={selectedTechnologies}
              tempSelected={tempTechnologies}
              onTempChange={setTempTechnologies}
            />

            <div className="ml-auto flex items-center gap-3">
              {hasUnappliedChanges && (
                <button
                  onClick={applyAllFilters}
                  className="flex items-center gap-2 px-6 py-2.5 text-sm text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors font-semibold shadow-sm"
                >
                  Áp dụng bộ lọc
                </button>
              )}
              
              {(totalFiltersCount > 0 || totalTempFiltersCount > 0) && (
                <button
                  onClick={clearAllFilters}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors font-medium"
                >
                  <X className="w-4 h-4" />
                  Xóa tất cả ({Math.max(totalFiltersCount, totalTempFiltersCount)})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Company Results */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Tất cả công ty IT</h2>
            {isLoading ? (
              <p className="text-gray-600 mt-1">Đang tải...</p>
            ) : error ? (
              <p className="text-red-600 mt-1">{error}</p>
            ) : (
              <p className="text-gray-600 mt-1">Tìm thấy {companies.length} công ty phù hợp</p>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {[...Array(8)].map((_, index) => (
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
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Không tìm thấy công ty phù hợp.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {companies.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>
          )}

          {/* Pagination - Giữ lại để sau này implement */}
          {companies.length > 0 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button className="w-10 h-10 flex items-center justify-center bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium">
                1
              </button>
              <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                2
              </button>
              <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                3
              </button>
              <span className="text-gray-500">...</span>
              <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                15
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}