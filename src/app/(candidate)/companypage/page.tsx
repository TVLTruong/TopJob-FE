"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Layers, SlidersHorizontal } from "lucide-react";
import CompanySearcher from "@/app/components/company/CompanySearcher";
import CompanyCard from "@/app/components/company/CompanyCard";
import { Company } from "@/app/components/types/company.types";
import { 
  getPublicCompanies, 
  FeaturedCompany, 
  PublicCompaniesFilters 
} from "@/utils/api/employer-api";
import { employerCategoryApi, EmployerCategory } from "@/utils/api/categories-api";

// Transform API company to Company type
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

// Category Filter Component
interface CategoryFilterProps {
  options: string[];
  selected: string[];
  tempSelected: string[];
  onTempChange: (selected: string[]) => void;
}

function CategoryFilter({ options, selected, tempSelected, onTempChange }: CategoryFilterProps) {
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
        <Layers className="w-5 h-5 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Lĩnh vực</span>
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
                <h3 className="font-semibold text-gray-900">Lĩnh vực</h3>
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
  // Search term and location
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [locationFilter, setLocationFilter] = useState<string | undefined>(undefined);
  
  // Applied filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // API state
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [categories, setCategories] = useState<EmployerCategory[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const limit = 12;

  // Fetch companies from API
  const fetchCompanies = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const filters: PublicCompaniesFilters = {
        page: currentPage,
        limit,
      };

      // Add search filter if provided (search in company name only)
      if (searchTerm.trim()) {
        filters.keyword = searchTerm.trim();
      }

      // Add location filter if provided
      if (locationFilter) {
        filters.city = locationFilter;
      }

      // Add category filter if provided (use industry param)
      if (selectedCategories.length > 0) {
        // Backend only supports single category, use first one
        filters.industry = selectedCategories[0];
      }

      const response = await getPublicCompanies(filters);
      const transformedCompanies = response.data.map(transformCompanyFromAPI);
      
      setCompanies(transformedCompanies);
      setTotalCompanies(response.meta.total);
      setTotalPages(response.meta.totalPages);
    } catch (err) {
      console.error('Error fetching companies:', err);
      setError('Không thể tải danh sách công ty. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch companies when filters change
  useEffect(() => {
    fetchCompanies();
  }, [currentPage, searchTerm, locationFilter, selectedCategories]);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await employerCategoryApi.getList();
        setCategories(data);
        setCategoryOptions(data.map(cat => cat.name));
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = (search: string, location?: string) => {
    setSearchTerm(search);
    setLocationFilter(location);
    setCurrentPage(1);
  };

  const handleCategoriesChange = (categories: string[]) => {
    setSelectedCategories(categories);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setLocationFilter(undefined);
    setSelectedCategories([]);
    setCurrentPage(1);
  };

  const handleRemoveCategory = (category: string) => {
    const newCategories = selectedCategories.filter(c => c !== category);
    setSelectedCategories(newCategories);
    setCurrentPage(1);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="min-h-screen">
      {/* Search Section */}
      <CompanySearcher onSearch={handleSearch} initialSearchTerm={searchTerm} />

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-[1400px] py-8 bg-gray-50">
        {/* Filter Bar */}
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            {/* Filter Title */}
            <div className="flex items-center gap-2 pr-4 border-r border-gray-200">
              <SlidersHorizontal className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-semibold text-gray-900">Bộ lọc</span>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <CategoryFilter 
                options={categoryOptions}
                selected={selectedCategories}
                tempSelected={selectedCategories}
                onTempChange={handleCategoriesChange}
              />

              {/* Reset Filters */}
              {(searchTerm || locationFilter || selectedCategories.length > 0) && (
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  ✕ Xóa bộ lọc
                </button>
              )}
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchTerm || locationFilter || selectedCategories.length > 0) && (
            <div className="pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {searchTerm && (
                  <span className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm border border-emerald-200">
                    <span>Tìm: <strong>{searchTerm}</strong></span>
                    <button 
                      onClick={() => {
                        setSearchTerm("");
                        setCurrentPage(1);
                      }} 
                      className="hover:text-emerald-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                {locationFilter && (
                  <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-200">
                    <span>Địa điểm: <strong>{locationFilter}</strong></span>
                    <button 
                      onClick={() => {
                        setLocationFilter(undefined);
                        setCurrentPage(1);
                      }} 
                      className="hover:text-blue-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedCategories.map((category) => (
                  <span key={category} className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm border border-purple-200">
                    <span>Lĩnh vực: <strong>{category}</strong></span>
                    <button 
                      onClick={() => handleRemoveCategory(category)} 
                      className="hover:text-purple-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Company Results */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Tất cả công ty IT</h2>
            <p className="text-gray-600 mt-1">
              {loading ? 'Đang tải...' : `Tìm thấy ${totalCompanies} công ty phù hợp`}
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchCompanies}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Thử lại
              </button>
            </div>
          )}

          {/* Companies Grid */}
          {!loading && !error && companies.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {companies.map((company) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  {/* Previous Button */}
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Trước
                  </button>

                  {/* Page Numbers */}
                  {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                      <span key={`ellipsis-${index}`} className="text-gray-500 px-2">
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page as number)}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium ${
                          currentPage === page
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  ))}

                  {/* Next Button */}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Sau
                  </button>
                </div>
              )}
            </>
          )}

          {/* Empty State */}
          {!loading && !error && companies.length === 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
              <p className="text-gray-600 text-lg mb-4">Không tìm thấy công ty nào phù hợp</p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Xóa tìm kiếm
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}