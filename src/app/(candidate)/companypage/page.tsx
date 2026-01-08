"use client";

import { useState, useEffect } from "react";
import CompanySearcher from "@/app/components/company/CompanySearcher";
import CompanyCard from "@/app/components/company/CompanyCard";
import { Company } from "@/app/components/types/company.types";
import { 
  getPublicCompanies, 
  FeaturedCompany, 
  PublicCompaniesFilters 
} from "@/utils/api/employer-api";

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

// Main Component
export default function CompanyPage() {
  // Search term and location
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [locationFilter, setLocationFilter] = useState<string | undefined>(undefined);
  
  // API state
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCompanies, setTotalCompanies] = useState(0);
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
        filters.keyword = searchTerm.trim(); // Search in company name
      }

      // Add location filter if provided
      if (locationFilter) {
        filters.city = locationFilter;
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

  // Fetch companies when searchTerm, location or page changes
  useEffect(() => {
    fetchCompanies();
  }, [currentPage, searchTerm, locationFilter]);

  const handleSearch = (search: string, location?: string) => {
    setSearchTerm(search);
    setLocationFilter(location);
    setCurrentPage(1); // Reset to first page when searching
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
                onClick={() => handleSearch("")}
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