import { Company } from "@/app/components/types/company.types";
import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react"; // Chỉ cần icon MapPin

interface CompanyCardProps {
  company: Company;
  source?: string; // Tracking source: 'landing', 'companypage', etc.
}

export default function CompanyCard({ company, source }: CompanyCardProps) {
  // Link to public company profile page for candidates/guests
  const companyLink = source 
    ? `/companypage/companyProfilePage?id=${company.id}&from=${source}`
    : `/companypage/companyProfilePage?id=${company.id}`;

  // Logic xử lý hiển thị địa điểm
  const displayLocations = (): string => {
    if (!company.locations || company.locations.length === 0) {
      return "Chưa cập nhật"; // Hoặc một thông báo khác
    }
    if (company.locations.length <= 2) {
      return company.locations.join(', '); // Hiển thị 1 hoặc 2 TP
    } else {
      return `${company.locations.slice(0, 2).join(', ')}, +${company.locations.length - 2} khác`; // Hiển thị 2 TP + "...khác"
    }
  };

  return (
    // Card cha: bo góc, bóng đổ, nền trắng, hover effect, flex column
    <Link
        href={companyLink}
        className="flex flex-col items-center bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg hover:border-emerald-200 transition-all duration-200 group h-[280px] w-full"
        >
        {/* Logo (Căn giữa) */}
        <div className="w-20 h-20 relative border rounded-md overflow-hidden p-1 bg-white mb-3">
            <Image
            src={company.logoUrl || "/placeholder-logo.png"}
            alt={`${company.companyName} logo`}
            fill
            className="object-contain"
            />
        </div>

        {/* Tên công ty (Căn giữa) */}
        <h3 className="text-lg font-bold text-gray-900 text-center truncate group-hover:text-emerald-700 transition-colors mb-2 w-full">
            {company.companyName}
        </h3>

        {/* Categories (Lĩnh vực) */}
        {company.categories && company.categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1.5 mb-3 w-full">
            {company.categories.slice(0, 3).map((category, index) => (
              <span
                key={index}
                className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full"
              >
                {category}
              </span>
            ))}
            {company.categories.length > 3 && (
              <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                +{company.categories.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Phần dưới: Địa điểm & Số Job */}
        <div className="flex justify-between items-center w-full text-xs text-gray-600 mt-auto h-[32px] border-t border-gray-100 pt-2">
            <div className="flex items-center min-w-0 pr-2">
            <MapPin size={13} className="mr-1 text-gray-400 flex-shrink-0" />
            <span className="truncate" title={company.locations.join(', ')}>
                {displayLocations()}
            </span>
            </div>

            {company.jobCount > 0 ? (
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-semibold rounded-full text-xs flex-shrink-0">
                {company.jobCount} việc
            </span>
            ) : (
            <span className="text-xs text-emerald-600 font-medium hover:underline flex-shrink-0">
                Xem công ty
            </span>
            )}
        </div>
        </Link>

  );
}