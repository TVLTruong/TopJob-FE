"use client";

import { useState } from "react";
import { ChevronDown, X, SlidersHorizontal, MapPin, Users, Layers } from "lucide-react";
import HeroSearcher from "@/app/components/landing/searcher";
import CompanyCard from "@/app/components/company/CompanyCard";
import { Company } from "@/app/components/types/company.types";

// Mock data cho demo
const mockCompanies: Company[] = [
  {
    id: "1",
    name: "FPT Software",
    logoUrl: "/placeholder-logo.png",
    technologies: ["Java", "React", "NodeJS", "AWS", "Docker", "Python"],
    locations: ["TP.HCM", "Hà Nội", "Đà Nẵng"],
    jobCount: 45
  },
  {
    id: "2",
    name: "VNG Corporation",
    logoUrl: "/placeholder-logo.png",
    technologies: ["Java", "Golang", "React", "MySQL", "Redis"],
    locations: ["TP.HCM"],
    jobCount: 32
  },
  {
    id: "3",
    name: "Tiki",
    logoUrl: "/placeholder-logo.png",
    technologies: ["Python", "React", "Kubernetes", "MongoDB", "Kafka"],
    locations: ["TP.HCM", "Hà Nội"],
    jobCount: 28
  },
  {
    id: "4",
    name: "Shopee Vietnam",
    logoUrl: "/placeholder-logo.png",
    technologies: ["Java", "Go", "React", "Docker", "Kubernetes", "AWS"],
    locations: ["TP.HCM"],
    jobCount: 56
  },
  {
    id: "5",
    name: "Grab Vietnam",
    logoUrl: "/placeholder-logo.png",
    technologies: ["Go", "React Native", "AWS", "PostgreSQL", "Redis"],
    locations: ["TP.HCM", "Hà Nội"],
    jobCount: 38
  },
  {
    id: "6",
    name: "Momo",
    logoUrl: "/placeholder-logo.png",
    technologies: ["Java", "Kotlin", "Swift", "React", "MySQL"],
    locations: ["TP.HCM"],
    jobCount: 24
  },
  {
    id: "7",
    name: "VinID",
    logoUrl: "/placeholder-logo.png",
    technologies: ["C#", ".NET", "Angular", "SQL Server", "Azure"],
    locations: ["Hà Nội", "TP.HCM"],
    jobCount: 19
  },
  {
    id: "8",
    name: "ZaloPay",
    logoUrl: "/placeholder-logo.png",
    technologies: ["Java", "React", "NodeJS", "MongoDB", "Redis"],
    locations: ["TP.HCM"],
    jobCount: 22
  },
  {
    id: "9",
    name: "Viettel Solutions",
    logoUrl: "/placeholder-logo.png",
    technologies: ["Java", "Python", "React", "Oracle", "Docker"],
    locations: ["Hà Nội", "TP.HCM", "Đà Nẵng", "Cần Thơ"],
    jobCount: 67
  },
  {
    id: "10",
    name: "ELCA Vietnam",
    logoUrl: "/placeholder-logo.png",
    technologies: ["Java", "Angular", "PostgreSQL", "Docker", "Kubernetes"],
    locations: ["TP.HCM", "Hà Nội"],
    jobCount: 15
  },
  {
    id: "11",
    name: "TMA Solutions",
    logoUrl: "/placeholder-logo.png",
    technologies: ["C++", "Java", "React", "MySQL", "AWS"],
    locations: ["TP.HCM", "Hà Nội", "Quy Nhơn"],
    jobCount: 41
  },
  {
    id: "12",
    name: "NashTech Vietnam",
    logoUrl: "/placeholder-logo.png",
    technologies: [".NET", "React", "Azure", "SQL Server", "Docker"],
    locations: ["TP.HCM", "Hà Nội", "Đà Nẵng"],
    jobCount: 33
  }
];

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
const companySizeOptions = ["1-50", "51-200", "201-500", "501-1000", "1000+"];

// Horizontal Filter Dropdown Component
interface HorizontalFilterProps {
  label: string;
  icon: React.ReactNode;
  options: string[];
  selected: string[];
  onToggle: (option: string) => void;
}

function HorizontalFilter({ label, icon, options, selected, onToggle }: HorizontalFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

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
          <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-xl z-30 max-h-96 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{label}</h3>
                {selected.length > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      selected.forEach(item => onToggle(item));
                    }}
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
                      checked={selected.includes(option)}
                      onChange={() => onToggle(option)}
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
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  const [selectedCompanySizes, setSelectedCompanySizes] = useState<string[]>([]);

  const toggleSelection = (array: string[], setArray: (arr: string[]) => void, item: string) => {
    setArray(array.includes(item) ? array.filter(i => i !== item) : [...array, item]);
  };

  const clearAllFilters = () => {
    setSelectedLocations([]);
    setSelectedTechnologies([]);
    setSelectedCompanySizes([]);
  };

  const totalFiltersCount = selectedLocations.length + selectedTechnologies.length + selectedCompanySizes.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Section - với background và tiêu đề */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <HeroSearcher />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-[1400px] py-8">
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
              onToggle={(item) => toggleSelection(selectedLocations, setSelectedLocations, item)}
            />

            <HorizontalFilter
              label="Công nghệ"
              icon={<Layers className="w-5 h-5 text-gray-600" />}
              options={technologyOptions}
              selected={selectedTechnologies}
              onToggle={(item) => toggleSelection(selectedTechnologies, setSelectedTechnologies, item)}
            />

            <HorizontalFilter
              label="Quy mô"
              icon={<Users className="w-5 h-5 text-gray-600" />}
              options={companySizeOptions}
              selected={selectedCompanySizes}
              onToggle={(item) => toggleSelection(selectedCompanySizes, setSelectedCompanySizes, item)}
            />

            {totalFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="ml-auto flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors font-medium"
              >
                <X className="w-4 h-4" />
                Xóa tất cả ({totalFiltersCount})
              </button>
            )}
          </div>
        </div>

        {/* Company Results */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Tất cả công ty IT</h2>
            <p className="text-gray-600 mt-1">Tìm thấy {mockCompanies.length} công ty phù hợp</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {mockCompanies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>

          {/* Pagination */}
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
        </div>
      </div>
    </div>
  );
}