import { Job } from "@/app/components/types/job.types";
import Image from "next/image";
import { Heart } from "lucide-react";

interface JobcardProps {
  job: Job;
  onApply?: (jobId: string) => void;
  onSave?: (jobId: string) => void;
  isSaved?: boolean;
  onClick?: (jobId: string) => void;
}

export default function Jobcard({ job, onApply, onSave, isSaved = false, onClick }: JobcardProps) {
  
  // Hàm xử lý khi nhấn nút Lưu
  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Ngăn sự kiện click lan ra card cha (nếu card cha có link)
    if (onSave) {
      onSave(job.id);
    }
  };

  // Hàm xử lý khi nhấn nút Ứng tuyển
  const handleApplyClick = (e: React.MouseEvent) => {
     e.stopPropagation();
     if (onClick) {
       onClick(job.id);
     } else if (onApply) {
       onApply(job.id);
     } else {
       // Hành động mặc định nếu không có prop onApply (ví dụ: mở link job)
       console.log("Applying for job:", job.id);
     }
  };

  // Hàm xử lý khi nhấn vào card
  const handleCardClick = () => {
    if (onClick) {
      onClick(job.id);
    }
  };

  return (
    // Card cha: bo góc, bóng đổ, padding, nền trắng
    <div 
      className="bg-white rounded-lg shadow-md p-5 border border-gray-100 hover:shadow-lg transition-shadow duration-200 w-[325px]"
    >
      {/* Phần trên: Logo + Thông tin Job */}
      <div className="flex items-start space-x-4 mb-4">
        {/* Logo công ty */}
        <div className="flex-shrink-0 w-16 h-16 relative border rounded-md overflow-hidden">
          <Image
            // Dùng logoUrl từ prop job
            src={job.logoUrl || "/placeholder-logo.png"} // Thêm ảnh dự phòng
            alt={`${job.companyName} logo`}
            fill // Lấp đầy div chứa
            className="object-contain" // Giữ tỷ lệ ảnh
          />
        </div>

        {/* Thông tin Job */}
        <div className="flex-1 min-w-0"> {/* min-w-0 để text wrap đúng */}
          <p className="text-sm text-gray-500 truncate">{job.companyName}</p>
          <h3 
            onClick={handleCardClick}
            className="text-xl font-bold text-gray-900 truncate mt-1 hover:text-emerald-700 cursor-pointer"
          >
            {job.title}
          </h3>
          <p className="text-sm text-gray-600 font-medium mt-1">{job.salary}</p>
        </div>
      </div>

      {/* Phần tags (Full Time, TP.HCM) */}
      <div className="flex flex-wrap gap-2 mb-5">
        {/* Bạn có thể lặp qua job.tags hoặc hiển thị các trường cụ thể */}
        <span className="px-3 py-1 text-xs font-medium border border-jobcard-tag-border text-jobcard-tag-text rounded-full">
          {job.type} 
        </span>
        <span className="px-3 py-1 text-xs font-medium border border-jobcard-tag-border text-jobcard-tag-text rounded-full">
          {job.experience}
        </span>
        {/* Technology tag (nếu có) */}
        {job.tags && job.tags.length > 0 && (
          <span className="px-3 py-1 text-xs font-medium border border-emerald-500 text-emerald-700 bg-emerald-50 rounded-full">
            {job.tags[0]}
          </span>
        )}
      </div>

      {/* Phần dưới: Nút Ứng tuyển và Lưu */}
      <div className="flex items-center justify-between w-full gap-3">
        {/* Nút Ứng tuyển */}
        <button
          onClick={handleApplyClick}
          className="flex-1 px-4 py-2 bg-jobcard-button hover:bg-jobcard-button-hover text-white font-semibold rounded-lg transition-colors text-sm h-10"
        >
          Ứng tuyển
        </button>

        {/* Nút Lưu (trái tim) */}
        <button
          onClick={handleSaveClick}
          className={`aspect-square h-10 flex items-center justify-center border rounded-lg transition-colors ${
            isSaved
              ? "border-red-500 bg-red-100 text-red-600 hover:bg-red-200"
              : "border-jobcard-tag-border text-jobcard-tag-text hover:bg-emerald-50"
          }`}
          aria-label={isSaved ? "Bỏ lưu công việc" : "Lưu công việc"}
        >
          <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
        </button>
      </div>
    </div>
  );
}