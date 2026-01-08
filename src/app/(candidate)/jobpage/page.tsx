"use client";

import { useState } from "react";
import { ChevronDown, X, SlidersHorizontal, Briefcase, DollarSign, Clock, Layers, Award } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import HeroSearcher from "@/app/components/landing/searcher";
import Jobcard from "@/app/components/job/Jobcard";
import LoginRequiredModal from "@/app/components/common/LoginRequiredModal";
import { Job } from "@/app/components/types/job.types";

// Mock data cho demo
const mockJobs: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    companyName: "Tech Corp",
    salary: "25 - 40 triệu",
    type: "Full-time",
    location: "TP.HCM",
    experience: "3+ năm",
    logoUrl: "/placeholder-logo.png",
    tags: []
  },
  {
    id: "2",
    title: "Backend Developer",
    companyName: "Digital Solutions",
    salary: "20 - 35 triệu",
    type: "Remote",
    location: "Hà Nội",
    experience: "2+ năm",
    logoUrl: "/placeholder-logo.png",
    tags: []
  },
  {
    id: "3",
    title: "Full Stack Developer",
    companyName: "Innovation Hub",
    salary: "30 - 50 triệu",
    type: "Hybrid",
    location: "Đà Nẵng",
    experience: "4+ năm",
    logoUrl: "/placeholder-logo.png",
    tags: []
  },
  {
    id: "4",
    title: "UI/UX Designer",
    companyName: "Creative Agency",
    salary: "15 - 25 triệu",
    type: "Part-time",
    location: "TP.HCM",
    experience: "1+ năm",
    logoUrl: "/placeholder-logo.png",
    tags: []
  },
  {
    id: "5",
    title: "DevOps Engineer",
    companyName: "Cloud Systems",
    salary: "35 - 60 triệu",
    type: "Full-time",
    location: "Hà Nội",
    experience: "5+ năm",
    logoUrl: "/placeholder-logo.png",
    tags: []
  },
  {
    id: "6",
    title: "Mobile Developer",
    companyName: "App Studio",
    salary: "22 - 38 triệu",
    type: "Remote",
    location: "TP.HCM",
    experience: "3+ năm",
    logoUrl: "/placeholder-logo.png",
    tags: []
  },
  {
  id: "7",
  title: "Data Scientist",
  companyName: "AI Analytics",
  salary: "40 - 70 triệu",
  type: "Full-time",
  location: "Hà Nội",
  experience: "3+ năm",
  logoUrl: "/placeholder-logo.png",
  tags: []
  },
  {
    id: "8",
    title: "Game Developer (Unity/Unreal)",
    companyName: "Pixel Studio",
    salary: "25 - 45 triệu",
    type: "Hybrid",
    location: "TP.HCM",
    experience: "2+ năm",
    logoUrl: "/placeholder-logo.png",
    tags: []
  },
  {
    id: "9",
    title: "AI Engineer",
    companyName: "DeepMind Asia",
    salary: "45 - 80 triệu",
    type: "Full-time",
    location: "Đà Nẵng",
    experience: "4+ năm",
    logoUrl: "/placeholder-logo.png",
    tags: []
  },
  {
    id: "10",
    title: "Project Manager",
    companyName: "NextGen Solutions",
    salary: "30 - 55 triệu",
    type: "Hybrid",
    location: "TP.HCM",
    experience: "5+ năm",
    logoUrl: "/placeholder-logo.png",
    tags: []
  },
  {
    id: "11",
    title: "QA Engineer",
    companyName: "Testify Co.",
    salary: "18 - 30 triệu",
    type: "Full-time",
    location: "Hà Nội",
    experience: "2+ năm",
    logoUrl: "/placeholder-logo.png",
    tags: []
  },
  {
    id: "12",
    title: "Product Designer",
    companyName: "Visionary Design",
    salary: "20 - 32 triệu",
    type: "Part-time",
    location: "TP.HCM",
    experience: "1+ năm",
    logoUrl: "/placeholder-logo.png",
    tags: []
  }
];

const workTypeOptions = ["Full-time", "Part-time", "Remote", "Hybrid"];
const jobDomainOptions = [
  "Frontend Development",
  "Backend Development",
  "Full Stack Development",
  "Mobile Development",
  "DevOps",
  "UI/UX Design",
  "Data Science",
  "Product Management",
  "QA/Testing",
  "Game Development"
];
const experienceOptions = ["Dưới 1 năm", "1-2 năm", "2-3 năm", "3-5 năm", "Trên 5 năm"];
const levelOptions = ["Intern", "Fresher", "Junior", "Senior", "Lead", "Manager"];

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
export default function JobSearchPage() {
  const router = useRouter();
  const { user } = useAuth();
  
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
  
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleSaveJob = (jobId: string) => {
    setSavedJobs(prev =>
      prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]
    );
  };

  const handleApplyJob = (jobId: string) => {
    console.log("Applying for job:", jobId);
  };
  
  const handleLoginRequired = () => {
    setShowLoginModal(true);
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

  return (
    <div className="min-h-screen">
      {/* Search Section */}
      <HeroSearcher />

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-[1400px] py-8 bg-gray-50">
        {/* Horizontal Filters Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
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
              options={jobDomainOptions}
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
            <p className="text-gray-600 mt-1">Tìm thấy {mockJobs.length} công việc phù hợp</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
            {mockJobs.map((job) => (
              <Jobcard
                key={job.id}
                job={job}
                onApply={handleApplyJob}
                onSave={handleSaveJob}
                isSaved={savedJobs.includes(job.id)}
                onClick={handleJobClick}
                isLoggedIn={!!user}
                onLoginRequired={handleLoginRequired}
              />
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
              30
            </button>
          </div>
        </div>
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