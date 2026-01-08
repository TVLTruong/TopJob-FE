"use client";

import { useState, useEffect, Suspense } from "react";
import { ChevronDown, X, SlidersHorizontal, Briefcase, DollarSign, Clock, Layers, Award } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import HeroSearcher from "@/app/components/landing/searcher";
import Jobcard from "@/app/components/job/Jobcard";
import { Job } from "@/app/components/types/job.types";
import { getPublicJobs, JobFromAPI, PublicJobsFilters, getAllJobCategories, JobCategory } from "@/utils/api/job-api";
import { useSavedJobs } from "@/contexts/SavedJobsContext";
import Toast from "@/app/components/profile/Toast";

// Transform API job to Job type for Jobcard
function transformJobFromAPI(apiJob: JobFromAPI): Job {
  const employmentTypeMap: Record<string, string> = {
    'full_time': 'Full-time',
    'part_time': 'Part-time',
    'freelance': 'Freelance',
    'internship': 'Internship',
    'contract': 'Contract',
  };

  const experienceLevelMap: Record<string, string> = {
    'intern': 'Intern',
    'fresher': 'Fresher',
    'junior': 'Junior',
    'middle': 'Middle',
    'senior': 'Senior',
    'lead': 'Lead',
    'manager': 'Manager',
  };

  // Format salary
  let salaryText = 'Thỏa thuận';
  if (apiJob.isSalaryVisible && apiJob.salaryMin && apiJob.salaryMax) {
    const minInMillions = Math.round(apiJob.salaryMin / 1000000);
    const maxInMillions = Math.round(apiJob.salaryMax / 1000000);
    salaryText = `${minInMillions} - ${maxInMillions} triệu`;
  } else if (apiJob.isNegotiable) {
    salaryText = 'Thỏa thuận';
  }

  // Get first technology if available
  const firstTechnology = apiJob.jobTechnologies?.[0]?.technology?.name;

  // Get job categories
  const categoryNames = apiJob.jobCategories?.map(jc => jc.category.name) || [];

  // Combine tags: categories first, then technology
  const tags = [...categoryNames];
  if (firstTechnology) {
    tags.push(firstTechnology);
  }

  return {
    id: apiJob.id,
    title: apiJob.title,
    companyName: apiJob.employer?.companyName || 'Unknown Company',
    location: apiJob.location?.city || apiJob.location?.address || 'Remote',
    type: employmentTypeMap[apiJob.employmentType] || apiJob.employmentType,
    experience: apiJob.experienceLevel ? experienceLevelMap[apiJob.experienceLevel] : 'All levels',
    salary: salaryText,
    tags: tags,
    logoUrl: apiJob.employer?.logoUrl || '/placeholder-logo.png',
  };
}

const workTypeOptions = ["Full-time", "Part-time", "Freelance", "Internship", "Contract"];
const experienceOptions = ["Intern", "Fresher", "Junior", "Middle", "Senior", "Lead", "Manager"];
const levelOptions = ["Intern", "Fresher", "Junior", "Middle", "Senior", "Lead", "Manager"];

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

// Salary Range Filter
interface SalaryFilterProps {
  minSalary: number;
  maxSalary: number;
  tempMin: number;
  tempMax: number;
  onTempChange: (min: number, max: number) => void;
}

function SalaryFilter({ minSalary, maxSalary, tempMin, tempMax, onTempChange }: SalaryFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasValue = minSalary > 0 || maxSalary < 100;

  const handleReset = () => {
    onTempChange(0, 100);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2.5 bg-white border rounded-lg transition-all ${
          hasValue
            ? "border-emerald-500 bg-emerald-50"
            : "border-gray-300 hover:border-emerald-400"
        }`}
      >
        <DollarSign className="w-5 h-5 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Mức lương</span>
        {hasValue && (
          <span className="ml-1 text-xs text-emerald-700 font-medium">
            {minSalary}-{maxSalary}tr
          </span>
        )}
        <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-30">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Mức lương</h3>
                {(tempMin > 0 || tempMax < 100) && (
                  <button
                    onClick={handleReset}
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Đặt lại
                  </button>
                )}
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Tối thiểu: <span className="text-emerald-600">{tempMin} triệu</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={tempMin}
                    onChange={(e) => onTempChange(Number(e.target.value), tempMax)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Tối đa: <span className="text-emerald-600">{tempMax} triệu</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={tempMax}
                    onChange={(e) => onTempChange(tempMin, Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Main Component
function JobSearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isSaved, saveJobToFavorites, unsaveJobFromFavorites } = useSavedJobs();
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  const showToast = (message: string, type: 'error' | 'success' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };
  
  // Get search params from URL
  const searchQuery = searchParams.get('q') || '';
  const locationQuery = searchParams.get('location') || '';
  
  // Jobs data and pagination
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageLimit = 12;
  
  // Categories from API
  const [jobCategories, setJobCategories] = useState<JobCategory[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  
  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await getAllJobCategories();
        setJobCategories(categories);
        // Get root categories (no parent)
        const rootCategories = categories.filter(cat => !cat.parentId);
        setCategoryOptions(rootCategories.map(cat => cat.name));
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };
    loadCategories();
  }, []);
  
  // Applied filters (actual filters being used)
  const [selectedWorkTypes, setSelectedWorkTypes] = useState<string[]>([]);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [minSalary, setMinSalary] = useState(0);
  const [maxSalary, setMaxSalary] = useState(100);
  
  const handleJobClick = (jobId: string) => {
    router.push(`/jobpage/${jobId}`);
  };
  
  // Temporary filters (being edited)
  const [tempWorkTypes, setTempWorkTypes] = useState<string[]>([]);
  const [tempDomains, setTempDomains] = useState<string[]>([]);
  const [tempExperience, setTempExperience] = useState<string[]>([]);
  const [tempLevels, setTempLevels] = useState<string[]>([]);
  const [tempMinSalary, setTempMinSalary] = useState(0);
  const [tempMaxSalary, setTempMaxSalary] = useState(100);
  
  const [loadingSaveIds, setLoadingSaveIds] = useState<Set<string>>(new Set());

  const handleSaveJob = async (jobId: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        showToast('Vui lòng đăng nhập để lưu công việc', 'error');
        return;
      }
      setLoadingSaveIds(prev => new Set(prev).add(jobId));
      if (isSaved(jobId)) {
        await unsaveJobFromFavorites(jobId);
        showToast('Đã bỏ lưu công việc');
      } else {
        await saveJobToFavorites(jobId);
        showToast('Đã lưu công việc');
      }
    } catch (error: any) {
      console.error('Error toggling saved job:', error);
      showToast(error?.message || 'Không thể lưu công việc', 'error');
    } finally {
      setLoadingSaveIds(prev => {
        const updated = new Set(prev);
        updated.delete(jobId);
        return updated;
      });
    }
  };

  const handleApplyJob = (jobId: string) => {
    console.log("Applying for job:", jobId);
  };

  const handleTempSalaryChange = (min: number, max: number) => {
    setTempMinSalary(min);
    setTempMaxSalary(max);
  };

  const applyAllFilters = () => {
    setSelectedWorkTypes([...tempWorkTypes]);
    setSelectedDomains([...tempDomains]);
    setSelectedExperience([...tempExperience]);
    setSelectedLevels([...tempLevels]);
    setMinSalary(tempMinSalary);
    setMaxSalary(tempMaxSalary);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearAllFilters = () => {
    // Clear applied filters
    setSelectedWorkTypes([]);
    setSelectedDomains([]);
    setSelectedExperience([]);
    setSelectedLevels([]);
    setMinSalary(0);
    setMaxSalary(100);
    // Clear temp filters
    setTempWorkTypes([]);
    setTempDomains([]);
    setTempExperience([]);
    setTempLevels([]);
    setTempMinSalary(0);
    setTempMaxSalary(100);
    setCurrentPage(1); // Reset to first page
  };

  const totalFiltersCount = selectedWorkTypes.length + selectedDomains.length + 
    selectedExperience.length + selectedLevels.length + 
    (minSalary > 0 || maxSalary < 100 ? 1 : 0);

  const totalTempFiltersCount = tempWorkTypes.length + tempDomains.length + 
    tempExperience.length + tempLevels.length + 
    (tempMinSalary > 0 || tempMaxSalary < 100 ? 1 : 0);

  const hasUnappliedChanges = 
    JSON.stringify(tempWorkTypes) !== JSON.stringify(selectedWorkTypes) ||
    JSON.stringify(tempDomains) !== JSON.stringify(selectedDomains) ||
    JSON.stringify(tempExperience) !== JSON.stringify(selectedExperience) ||
    JSON.stringify(tempLevels) !== JSON.stringify(selectedLevels) ||
    tempMinSalary !== minSalary ||
    tempMaxSalary !== maxSalary;

  // Fetch jobs from API
  useEffect(() => {
    async function fetchJobs() {
      setIsLoading(true);
      try {
        const filters: PublicJobsFilters = {
          page: currentPage,
          limit: pageLimit,
          sort: 'newest',
        };

        // Add search query if provided
        if (searchQuery) {
          filters.keyword = searchQuery;
        }

        // Add location filter if provided
        if (locationQuery) {
          filters.location = locationQuery;
        }

        // Add salary filter (convert from triệu to VND)
        if (minSalary > 0) {
          filters.salaryMin = minSalary * 1000000;
        }
        if (maxSalary < 100) {
          filters.salaryMax = maxSalary * 1000000;
        }

        // Add employment type filter (send only first one - backend supports single value)
        if (selectedWorkTypes.length > 0) {
          const typeMap: Record<string, string> = {
            'Full-time': 'full_time',
            'Part-time': 'part_time',
            'Freelance': 'freelance',
            'Internship': 'internship',
            'Contract': 'contract',
          };
          filters.jobType = typeMap[selectedWorkTypes[0]] as any;
        }

        // Add experience level filter (send only first one - backend supports single value)
        if (selectedExperience.length > 0) {
          const expMap: Record<string, string> = {
            'Intern': 'intern',
            'Fresher': 'fresher',
            'Junior': 'junior',
            'Middle': 'middle',
            'Senior': 'senior',
            'Lead': 'lead',
            'Manager': 'manager',
          };
          filters.experienceLevel = expMap[selectedExperience[0]] as any;
        }

        // Add category filter (send only first one - backend supports single value)
        if (selectedDomains.length > 0) {
          const category = jobCategories.find(cat => cat.name === selectedDomains[0]);
          if (category) {
            filters.categoryId = category.id;
          }
        }

        const response = await getPublicJobs(filters);
        const transformedJobs = response.data.map(transformJobFromAPI);
        
        setJobs(transformedJobs);
        setTotalJobs(response.meta.total);
        setTotalPages(response.meta.totalPages);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchJobs();
  }, [currentPage, searchQuery, locationQuery, selectedWorkTypes, selectedDomains, selectedExperience, selectedLevels, minSalary, maxSalary]);

  return (
    <div className="min-h-screen">
      {/* Search Section */}
      <HeroSearcher />

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-[1400px] py-8 bg-gray-50">
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}
        {/* Horizontal Filters Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6 relative z-10">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 mr-2">
              <SlidersHorizontal className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-semibold text-gray-700">Bộ lọc:</span>
            </div>

            <HorizontalFilter
              label="Loại hình làm việc"
              icon={<Briefcase className="w-5 h-5 text-gray-600" />}
              options={workTypeOptions}
              selected={selectedWorkTypes}
              tempSelected={tempWorkTypes}
              onTempChange={setTempWorkTypes}
            />

            <SalaryFilter
              minSalary={minSalary}
              maxSalary={maxSalary}
              tempMin={tempMinSalary}
              tempMax={tempMaxSalary}
              onTempChange={handleTempSalaryChange}
            />

            <HorizontalFilter
              label="Kinh nghiệm"
              icon={<Clock className="w-5 h-5 text-gray-600" />}
              options={experienceOptions}
              selected={selectedExperience}
              tempSelected={tempExperience}
              onTempChange={setTempExperience}
            />

            <HorizontalFilter
              label="Cấp bậc"
              icon={<Award className="w-5 h-5 text-gray-600" />}
              options={levelOptions}
              selected={selectedLevels}
              tempSelected={tempLevels}
              onTempChange={setTempLevels}
            />

            <HorizontalFilter
              label="Lĩnh vực"
              icon={<Layers className="w-5 h-5 text-gray-600" />}
              options={categoryOptions}
              selected={selectedDomains}
              tempSelected={tempDomains}
              onTempChange={setTempDomains}
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

        {/* Job Results */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Tất cả công việc</h2>
            <p className="text-gray-600 mt-1">Tìm thấy {totalJobs} công việc phù hợp</p>
          </div>

          {isLoading ? (
            // Loading skeleton
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-5 border border-gray-100 animate-pulse w-full">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-md"></div>
                    <div className="flex-1 space-y-3 pt-1">
                      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="flex gap-2 mb-5">
                    <div className="h-5 bg-gray-200 rounded-full w-20"></div>
                    <div className="h-5 bg-gray-200 rounded-full w-24"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-9 bg-gray-200 rounded-lg w-28"></div>
                    <div className="h-9 w-9 bg-gray-200 rounded-lg"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            // No jobs found
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">Không tìm thấy công việc phù hợp.</p>
              <p className="text-gray-400 text-sm mt-2">Thử điều chỉnh bộ lọc để xem thêm kết quả.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
                {jobs.map((job) => (
                  <Jobcard
                    key={job.id}
                    job={job}
                    onApply={handleApplyJob}
                    onSave={handleSaveJob}
                    isSaved={isSaved(job.id)}
                    onClick={handleJobClick}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  {/* Previous button */}
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium ${
                      currentPage === 1
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    &lt;
                  </button>

                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium ${
                          currentPage === pageNum
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  {/* Show ellipsis and last page if needed */}
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <>
                      <span className="text-gray-500">...</span>
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}

                  {/* Next button */}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium ${
                      currentPage === totalPages
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    &gt;
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}> 
      <JobSearchContent />
    </Suspense>
  );
}