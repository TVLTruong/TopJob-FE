"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Jobcard from "@/app/components/job/Jobcard"; // Import Jobcard
import { Job } from "@/app/components/types/job.types"; // Import kiểu Job
import { ArrowRight } from "lucide-react"; // Import icon mũi tên
import { getHotJobs, JobFromAPI } from "@/utils/api/job-api";
import { useSavedJobs } from "@/contexts/SavedJobsContext";

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

export default function FeaturedJobs() {
  const router = useRouter();
  const { isSaved, saveJobToFavorites } = useSavedJobs();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingSaveIds, setLoadingSaveIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const handleJobClick = (jobId: string) => {
    router.push(`/jobpage/${jobId}`);
  };

  const handleSaveJob = async (jobId: string) => {
    // Only allow saving, not unsaving
    if (isSaved(jobId)) {
      return; // Already saved, do nothing
    }
    
    try {
      setLoadingSaveIds(prev => new Set(prev).add(jobId));
      await saveJobToFavorites(jobId);
    } catch (error) {
      console.error('Error saving job:', error);
    } finally {
      setLoadingSaveIds(prev => {
        const updated = new Set(prev);
        updated.delete(jobId);
        return updated;
      });
    }
  };

  useEffect(() => {
    async function loadJobs() {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch hot jobs from API (isHot = true)
        const response = await getHotJobs(8); // Get 8 hot jobs
        const transformedJobs = response.data.map(transformJobFromAPI);
        setJobs(transformedJobs);
      } catch (error) {
        console.error("Lỗi khi tải việc làm nổi bật:", error);
        // Show empty state instead of error - API might be temporarily unavailable
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadJobs();
  }, []);

  return (
    <div className="w-full py-3 md:py-3">
      <div className=" mx-auto px-1">
        {/* Header Section */}
        <div className="w-full flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
            Việc làm nổi bật
          </h2>
          {/* Nút Xem tất cả */}
          <Link
            href="/jobpage" // Link trực tiếp
            className="px-5 py-2 bg-jobcard-button text-white rounded-lg space-x-2 flex items-center hover:bg-jobcard-button-hover transition-all transform hover:scale-105 text-sm font-medium"
          >
            <span>Xem tất cả</span>
            <ArrowRight size={18} /> {/* Icon mũi tên */}
          </Link>
        </div>

        {/* Grid hiển thị Jobs */}
        {isLoading ? (
          // Hiển thị skeleton loading
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"> {/* Thay đổi lg:grid-cols-3 -> 4 */}
            {[...Array(8)].map((_, index) => ( // Thay đổi 6 -> 8
              <div key={index} className="bg-white rounded-lg shadow-md p-5 border border-gray-100 animate-pulse">
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
        ) : jobs.length === 0 ? (
          // Hiển thị khi không có job
          <p className="text-center text-gray-500 py-10">
            Hiện chưa có việc làm nổi bật nào.
          </p>
        ) : (
          // Hiển thị danh sách job
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {jobs.map((job) => (
              <Jobcard 
                key={job.id} 
                job={job} 
                onClick={handleJobClick}
                onSave={!loadingSaveIds.has(job.id) ? handleSaveJob : undefined}
                isSaved={isSaved(job.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}