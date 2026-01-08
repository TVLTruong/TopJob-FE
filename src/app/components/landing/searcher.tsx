"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, Check, ChevronsUpDown } from "lucide-react";
import Image from "next/image";
import images from "@/app/utils/images";
import { Combobox, Transition } from '@headlessui/react';
import { allOption, locationsWithAll } from '@/app/utils/vietnamLocations';
import { getRandomJobCategories, JobCategory } from "@/utils/api/job-api";
import { useRouter } from "next/navigation";

export default function HeroSearcher() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<{ id: string; name: string } | null>(allOption);
  const [locationQuery, setLocationQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  // Load random categories on mount
  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        const categories = await getRandomJobCategories();
        if (categories && categories.length > 0) {
          setSuggestions(categories.map(cat => cat.name));
        } else {
          // Fallback nếu API chưa sẵn sàng
          setSuggestions(['Java', 'Python', 'React', 'Node.js', 'DevOps']);
        }
      } catch (error) {
        console.error('Failed to load suggestions:', error);
        // Fallback nếu có lỗi
        setSuggestions(['Java', 'Python', 'React', 'Node.js', 'DevOps']);
      }
    };
    loadSuggestions();
  }, []);
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build query params
    const params = new URLSearchParams();
    if (searchTerm.trim()) {
      params.set('q', searchTerm.trim());
    }
    if (selectedLocation && selectedLocation.id !== 'all') {
      params.set('location', selectedLocation.id);
    }
    
    // Navigate to jobpage with search params
    const queryString = params.toString();
    router.push(`/jobpage${queryString ? `?${queryString}` : ''}`);
  };
  
  const handleSuggestionClick = (term: string) => { 
    setSearchTerm(term); 
  };
  const filteredLocations =
    locationQuery === ''
      ? locationsWithAll
      : locationsWithAll.filter((location) =>
          location.name.toLowerCase().replace(/\s+/g, '')
            .includes(locationQuery.toLowerCase().replace(/\s+/g, ''))
        );


  return (
    <section className="relative w-full text-white py-5 md:py-8 px-4">
      <Image
        src={images.searcherBG}
        alt="Background"
        layout="fill"
        objectFit="cover"
        objectPosition="center"
        className="absolute inset-0 z-[-1]"
      />
      {/* <div className="absolute inset-0 bg-black/25"></div> */}

      <div className="relative container mx-auto max-w-5xl flex flex-col items-center space-y-5 rounded-lg p-4 md:p-6"> 
        {/* Tiêu đề */}
        <h3 className="text-2xl md:text-4xl font-bold text-center mt-0 mb-2">
          Có được công việc mơ ước của bạn với TopJob
        </h3>

        <h3 className="text-1xl md:text-1xl text-center">
          Cơ hội không tự tìm đến – hãy chủ động nắm bắt sự nghiệp của bạn!
        </h3>

        {/* Form tìm kiếm */}
        <form
          onSubmit={handleSearch}
          className="w-full flex flex-col md:flex-row gap-2 bg-white rounded-lg p-2 shadow-lg"
        >
          {/* Dropdown Địa điểm */}
          <Combobox value={selectedLocation} onChange={setSelectedLocation} as="div" className="relative w-full md:w-52 flex-shrink-0"> 
            {/* Thêm as="div", md:w-52, flex-shrink-0 */}
            <div className="relative flex items-center h-full"> 
              <MapPin className="w-5 h-5 text-gray-400 absolute left-3 z-10" /> 
              <Combobox.Input
                className="w-full h-12 appearance-none bg-transparent outline-none p-3 pl-10 text-gray-700 cursor-pointer border-none focus:ring-0 rounded-l-md md:rounded-l-none" // Thêm h-12, sửa bo góc
                displayValue={(location: { id: string; name: string } | null) => location?.name ?? ''}
                onChange={(event) => setLocationQuery(event.target.value)}
                placeholder="Chọn thành phố..."
              />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronsUpDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </Combobox.Button>
            </div>
            {/* Dropdown Options */}
            <Transition
              as="div" 
              leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0"
              afterLeave={() => setLocationQuery('')}
              className="absolute left-0 right-0 md:w-full" // Đảm bảo options chiếm đúng chỗ
            >
              <Combobox.Options className="mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-20"> 
                {/* ... (Code options giữ nguyên) ... */}
                 {filteredLocations.length === 0 && locationQuery !== '' ? (
                   <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                     Không tìm thấy.
                   </div>
                 ) : (
                   filteredLocations.map((location) => (
                     <Combobox.Option
                       key={location.id}
                       className={({ active }) =>
                         `relative cursor-default select-none py-2 pl-10 pr-4 ${
                           active ? 'bg-emerald-600 text-white' : 'text-gray-900'
                         }`
                       }
                       value={location}
                     >
                       {({ selected, active }) => (
                         <>
                           <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                             {location.name}
                           </span>
                           {selected ? (
                             <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-emerald-600'}`}>
                               <Check className="h-5 w-5" aria-hidden="true" />
                             </span>
                           ) : null}
                         </>
                       )}
                     </Combobox.Option>
                   ))
                 )}
              </Combobox.Options>
            </Transition>
          </Combobox>

          {/* Input Từ khóa */}
          <div className="relative flex items-center flex-1 md:border-l md:border-r border-gray-200">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nhập từ khóa kỹ năng (Java, iOS...), chức danh, công ty..."
              className="w-full h-full outline-none p-3 pl-3 md:pl-6 text-gray-900 placeholder:text-gray-500"
            />
          </div>

          {/* Nút tìm kiếm */}
          <button
            type="submit"
            className="flex items-center justify-center p-3 h-full w-full md:w-32 bg-[#319158] rounded-md hover:bg-[#2a7a4a] transition-colors"
          >
            <Search className="w-5 h-5 text-white mr-2" />
            <span className="font-semibold">Tìm kiếm</span>
          </button>
        </form>

        {/* Gợi ý */}
        <div className="w-full flex flex-wrap items-center justify-center gap-3 pt-4">
          <span className="text-white/90 text-sm font-bold">Đề xuất:</span>
          {suggestions.map((item) => (
            <button
              key={item}
              onClick={() => handleSuggestionClick(item)}
              className="px-4 py-1.5 text-sm bg-white/20 rounded-full hover:bg-white/30 border border-white/30 transition-colors"
            >
              {item}
            </button>
          ))}
        </div>

      </div>
      
      
    </section>
  );
}