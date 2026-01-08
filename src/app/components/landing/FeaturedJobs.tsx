"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Jobcard from "@/app/components/job/Jobcard"; // Import Jobcard
import LoginRequiredModal from "@/app/components/common/LoginRequiredModal";
import { Job } from "@/app/components/types/job.types"; // Import kiểu Job
import { ArrowRight } from "lucide-react"; // Import icon mũi tên

// Hàm giả lập fetch API (bạn sẽ thay bằng API thật)
async function fetchFeaturedJobs(): Promise<Job[]> {
  console.log("Fetching featured jobs...");
  // Giả lập gọi API backend (ví dụ: /jobs?featured=true&limit=6)
  await new Promise(resolve => setTimeout(resolve, 500)); // Giả lập độ trễ mạng

  // --- DỮ LIỆU GIẢ LẬP ---
  const mockJobs: Job[] = [
    { id: '1', title: "Project Manager", companyName: "Gameloft", location: "TP.HCM", type: "Full Time", experience: "Senior", salary: "40 - 50 triệu / tháng", tags: ["Gaming", "Management"], logoUrl: "/placeholder-logo.png" }, // Nhớ đặt ảnh vào /public/images/
    { id: '2', title: "Frontend Developer", companyName: "Viggle", location: "Đà Nẵng", type: "Remote", experience: "Junior", salary: "Thoả thuận", tags: ["React", "TypeScript"], logoUrl: "/placeholder-logo.png" },
    { id: '3', title: "Backend Engineer", companyName: "Base.vn", location: "Hà Nội", type: "Full Time", experience: "Fresher", salary: "15 - 25 triệu", tags: ["NodeJS", "PHP"], logoUrl: "/placeholder-logo.png" },
    { id: '4', title: "UI/UX Designer", companyName: "Eureka", location: "TP.HCM", type: "Part Time", experience: "Junior", salary: "Thoả thuận", tags: ["Figma", "Design"], logoUrl: "/placeholder-logo.png" },
    { id: '5', title: "DevOps Engineer", companyName: "DXC Technology", location: "TP.HCM", type: "Full Time", experience: "Senior", salary: "Verry High", tags: ["AWS", "CI/CD"], logoUrl: "/placeholder-logo.png" },
    { id: '6', title: "QA Tester", companyName: "Corsair", location: "Hà Nội", type: "Full Time", experience: "Fresher", salary: "Thoả thuận", tags: ["Testing", "Manual"], logoUrl: "/placeholder-logo.png" },
    { id: '7', title: "Data Scientist", companyName: "Shopee", location: "TP.HCM", type: "Full Time", experience: "Senior", salary: "2500 USD+", tags: ["Python", "Machine Learning"], logoUrl: "/placeholder-logo.png" },
    { id: '8', title: "Mobile Developer (iOS)", companyName: "Zalo", location: "TP.HCM", type: "Full Time", experience: "Junior", salary: "1800 - 2200 USD", tags: ["Swift", "iOS"], logoUrl: "/placeholder-logo.png" },
  ];
  // -------------------------

  return mockJobs;
}


export default function FeaturedJobs() {
  const router = useRouter();
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleJobClick = (jobId: string) => {
    router.push(`/jobpage/${jobId}?from=landing`);
  };

  const handleSaveJob = (jobId: string) => {
    setSavedJobs(prev =>
      prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]
    );
  };
  
  const handleLoginRequired = () => {
    setShowLoginModal(true);
  };

  useEffect(() => {
    async function loadJobs() {
      setIsLoading(true);
      try {
        const featuredJobs = await fetchFeaturedJobs();
        setJobs(featuredJobs);
      } catch (error) {
        console.error("Lỗi khi tải việc làm nổi bật:", error);
        // Có thể thêm state lỗi để hiển thị thông báo
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
        <div className="w-full mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
            Việc làm nổi bật
          </h2>
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
        ) : jobs.length === 0 ? (
          // Hiển thị khi không có job
          <p className="text-center text-gray-500 py-10">
            Hiện chưa có việc làm nào.
          </p>
        ) : (
          // Hiển thị danh sách job
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {jobs.map((job) => (
              <Jobcard 
                key={job.id} 
                job={job} 
                onClick={handleJobClick}
                onSave={handleSaveJob}
                isSaved={savedJobs.includes(job.id)}
                isLoggedIn={!!user}
                onLoginRequired={handleLoginRequired}
                source="landing"
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Login Required Modal */}
      <LoginRequiredModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        message="Bạn cần đăng nhập để ứng tuyển hoặc lưu công việc yêu thích"
      />
    </div>
  );
}