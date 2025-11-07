import { Company } from "@/app/components/types/company.types";
import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react"; // Chỉ cần icon MapPin

interface CompanyCardProps {
  company: Company;
}

export default function CompanyCard({ company }: CompanyCardProps) {
  // const companyLink = `/cong-ty/${company.id}-${company.name.toLowerCase().replace(/\s+/g, '-')}`;
  const companyLink = `/companyProfilePage`;

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
        className="flex flex-col items-center bg-white rounded-lg shadow-md p-10 border border-gray-100 hover:shadow-lg hover:border-emerald-200 transition-all duration-200 group h-[435px] w-[435px]"
        >
        {/* Logo (Căn giữa) */}
        <div className="w-40 h-40 relative border rounded-md overflow-hidden p-1 bg-white mb-4">
            <Image
            src={company.logoUrl || "/placeholder-logo.png"}
            alt={`${company.name} logo`}
            fill
            className="object-contain"
            />
        </div>

        {/* Tên công ty (Căn giữa) */}
        <h3 className="text-xl font-bold text-gray-900 text-center truncate group-hover:text-emerald-700 transition-colors mb-2 w-full">
            {company.name}
        </h3>

        {/* Tags công nghệ (Căn giữa, wrap) */}
        <div className="flex flex-wrap justify-center gap-2 mb-5 w-full">
            {company.technologies.slice(0, 6).map((tech) => (
            <span
                key={tech}
                className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-600 rounded-full"
            >
                {tech}
            </span>
            ))}
            {company.technologies.length > 5 && (
            <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                +{company.technologies.length - 5}
            </span>
            )}
        </div>

        {/* Phần dưới: Địa điểm & Số Job */}
        <div className="flex justify-between items-center w-full text-sm text-gray-600 mt-auto h-[40px] border-t border-gray-100">
            <div className="flex items-center min-w-0 pr-2">
            <MapPin size={15} className="mr-1.5 text-gray-400 flex-shrink-0" />
            <span className="truncate" title={company.locations.join(', ')}>
                {displayLocations()}
            </span>
            </div>

            {company.jobCount > 0 ? (
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-semibold rounded-full text-xs flex-shrink-0">
                {company.jobCount} việc làm
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