"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Images from "next/image";
import { useRouter } from "next/navigation";
import Jobcard from "@/app/components/job/Jobcard"; // Import Jobcard
import { Job } from "@/app/components/types/job.types"; // Import kiểu Job
import { ArrowRight } from "lucide-react"; // Import icon mũi tên

// Hàm giả lập fetch API (bạn sẽ thay bằng API thật)
async function fetchFeaturedJobs(): Promise<Job[]> {
  console.log("Fetching featured jobs...");
  // Giả lập gọi API backend (ví dụ: /jobs?featured=true&limit=6)
  await new Promise(resolve => setTimeout(resolve, 500)); // Giả lập độ trễ mạng

  // --- DỮ LIỆU GIẢ LẬP ---
  const mockJobs: Job[] = [
    { id: 'uuid-1', title: "Project Manager", companyName: "Gameloft", location: "TP.HCM", type: "Full Time", experience: "Senior", salary: "40 - 50 triệu / tháng", tags: ["Gaming", "Management"], logoUrl: "/placeholder-logo.png" }, // Nhớ đặt ảnh vào /public/images/
    { id: 'uuid-2', title: "Frontend Developer", companyName: "Viggle", location: "Đà Nẵng", type: "Remote", experience: "Junior", salary: "Thoả thuận", tags: ["React", "TypeScript"], logoUrl: "/placeholder-logo.png" },
    { id: 'uuid-3', title: "Backend Engineer", companyName: "Base.vn", location: "Hà Nội", type: "Full Time", experience: "Fresher", salary: "15 - 25 triệu", tags: ["NodeJS", "PHP"], logoUrl: "/placeholder-logo.png" },
    { id: 'uuid-4', title: "UI/UX Designer", companyName: "Eureka", location: "TP.HCM", type: "Part Time", experience: "Junior", salary: "Thoả thuận", tags: ["Figma", "Design"], logoUrl: "/placeholder-logo.png" },
    { id: 'uuid-5', title: "DevOps Engineer", companyName: "DXC Technology", location: "TP.HCM", type: "Full Time", experience: "Senior", salary: "Verry High", tags: ["AWS", "CI/CD"], logoUrl: "/placeholder-logo.png" },
    { id: 'uuid-6', title: "QA Tester", companyName: "Corsair", location: "Hà Nội", type: "Full Time", experience: "Fresher", salary: "Thoả thuận", tags: ["Testing", "Manual"], logoUrl: "/placeholder-logo.png" },
    { id: 'uuid-7', title: "Data Scientist", companyName: "Shopee", location: "TP.HCM", type: "Full Time", experience: "Senior", salary: "2500 USD+", tags: ["Python", "Machine Learning"], logoUrl: "/placeholder-logo.png" },
    { id: 'uuid-8', title: "Mobile Developer (iOS)", companyName: "Zalo", location: "TP.HCM", type: "Full Time", experience: "Junior", salary: "1800 - 2200 USD", tags: ["Swift", "iOS"], logoUrl: "/placeholder-logo.png" },
  ];
  // -------------------------

  return mockJobs;
}


export default function FeaturedJobs() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleJobClick = (jobId: string) => {
    router.push("/JobList/JobDetail");
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
        <div className="w-full flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
            Việc làm nổi bật
          </h2>
          {/* Nút Xem tất cả */}
          <Link
            href="/itjob" // Link trực tiếp
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
        ) : jobs.length === 0 ? (
          // Hiển thị khi không có job
          <p className="text-center text-gray-500 py-10">
            Hiện chưa có việc làm nào.
          </p>
        ) : (
          // Hiển thị danh sách job
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {jobs.map((job) => (
              <Jobcard key={job.id} job={job} onClick={handleJobClick} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}