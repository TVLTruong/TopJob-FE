"use client"
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import ConfirmModal from './ConfirmModal'
import { Users, Globe, Edit, X, Plus } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useEmployerProfile } from '@/contexts/EmployerProfileContext'
import locationData from "@/app/assets/danh-sach-3321-xa-phuong.json";

interface LocationItem {
  "Tên": string;
  "Cấp": string;
  "Tỉnh / Thành Phố": string;
}

interface OfficeLocation {
  id: string;
  province: string;
  district: string;
  detailedAddress: string;
  isHeadquarters: boolean;
}

interface CompanyBasicInfo {
  companyName: string;
  website: string;
  locations: string[];
  fields: string[];
  province: string;
  district: string;
  streetAddress: string;
  foundingDay: string;
  foundingMonth: string;
  foundingYear: string;
  technologies: string[];
  description: string;
  benefits: string;
  contactEmail: string;
  facebookUrl: string;
  linkedinUrl: string;
  xUrl: string;
}

const fieldOptions = ['Công nghệ thông tin', 'Trò chơi', 'Điện toán đám mây', 'Thương mại điện tử', 'Fintech', 'AI/Machine Learning']
const techOptions = ['HTML 5', 'CSS 3', 'Javascript', 'React', 'Node.js', 'Python', 'Java', 'TypeScript', 'Vue.js', 'Angular']

export default function CompanyHeader() {
  const { user } = useAuth()
  const { profile, isLoading } = useEmployerProfile()
  const isRecruiter = user?.role === 'employer'
  const canEdit = isRecruiter
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [formData, setFormData] = useState<CompanyBasicInfo>({
    companyName: '',
    website: '',
    locations: [],
    fields: [],
    province: '',
    district: '',
    streetAddress: '',
    foundingDay: '',
    foundingMonth: '',
    foundingYear: '',
    technologies: [],
    description: '',
    benefits: '',
    contactEmail: '',
    facebookUrl: '',
    linkedinUrl: '',
    xUrl: ''
  })
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  
  const [provinces, setProvinces] = useState<string[]>([])
  
  const [showFieldDropdown, setShowFieldDropdown] = useState(false)
  const [showTechDropdown, setShowTechDropdown] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)

  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [scrollbarWidth, setScrollbarWidth] = useState(0)
  
  // New state for managing locations with headquarters
  const [locationsList, setLocationsList] = useState<OfficeLocation[]>([])
  
  const [tempAddress, setTempAddress] = useState({
    province: '',
    district: '',
    streetAddress: ''
  })
  const [tempDistricts, setTempDistricts] = useState<string[]>([])

  // Refs to close sub-windows on outside click
  const addressFormRef = useRef<HTMLDivElement | null>(null)
  const fieldDropdownRef = useRef<HTMLDivElement | null>(null)
  const techDropdownRef = useRef<HTMLDivElement | null>(null)

  // Handle logo file change
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (addressFormRef.current && !addressFormRef.current.contains(event.target as Node)) {
        setShowAddressForm(false)
      }
      if (fieldDropdownRef.current && !fieldDropdownRef.current.contains(event.target as Node)) {
        setShowFieldDropdown(false)
      }
      if (techDropdownRef.current && !techDropdownRef.current.contains(event.target as Node)) {
        setShowTechDropdown(false)
      }
    }

    if (showAddressForm || showFieldDropdown || showTechDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showAddressForm, showFieldDropdown, showTechDropdown])

  // Load data from profile into formData
  useEffect(() => {
    if (profile) {
      setFormData({
        companyName: profile.companyName || '',
        website: profile.website || '',
        locations: profile.locations?.map(loc => loc.province) || [],
        fields: profile.field ? [profile.field] : [],
        province: profile.locations?.[0]?.province || '',
        district: profile.locations?.[0]?.district || '',
        streetAddress: profile.locations?.[0]?.detailedAddress || '',
        foundingDay: '',
        foundingMonth: '',
        foundingYear: profile.foundedYear ? profile.foundedYear.toString() : '',
        technologies: profile.technologies || [],
        description: profile.description || '',
        benefits: profile.benefits?.join('\\n') || '',
        contactEmail: profile.contactEmail || '',
        facebookUrl: profile.facebookUrl || '',
        linkedinUrl: profile.linkedlnUrl || '',
        xUrl: profile.xUrl || ''
      });
      
      // Load locations into locationsList with isHeadquarters flag
      if (profile.locations && profile.locations.length > 0) {
        setLocationsList(profile.locations.map((loc, index) => ({
          id: `loc-${index}`,
          province: loc.province,
          district: loc.district || '',
          detailedAddress: loc.detailedAddress || '',
          isHeadquarters: index === 0 // First location is headquarters by default
        })));
      }
      
      setLogoPreview(profile.logoUrl || null);
    } else if (process.env.NODE_ENV === 'development') {
      // 🔥 DEV MODE: Mock data for UI development
      setFormData({
        companyName: 'VNG',
        website: 'https://www.vng.com.vn',
        locations: ['Hồ Chí Minh'],
        fields: ['Công nghệ thông tin', 'Trò chơi'],
        province: 'Hồ Chí Minh',
        district: 'Quận 1',
        streetAddress: '123 Nguyễn Huệ',
        foundingDay: '1',
        foundingMonth: 'January',
        foundingYear: '2004',
        technologies: ['React', 'Node.js', 'Python'],
        description: 'VNG là công ty công nghệ hàng đầu Việt Nam',
        benefits: 'Chế độ bảo hiểm sức khỏe mở rộng\\nNghỉ phép linh hoạt 12 ngày\\nLương tháng 13',
        contactEmail: 'contact@vng.com.vn',
        facebookUrl: 'https://facebook.com/vng',
        linkedinUrl: 'https://linkedin.com/company/vng',
        xUrl: 'https://x.com/vng'
      });
      
      setLocationsList([
        {
          id: 'loc-1',
          province: 'Hồ Chí Minh',
          district: 'Quận 1',
          detailedAddress: '123 Nguyễn Huệ',
          isHeadquarters: true
        }
      ]);
      
      setLogoPreview('/logo.svg');
    }
  }, [profile]);

  // Load danh sách tỉnh/thành phố từ JSON
  useEffect(() => {
    const data = locationData as LocationItem[]
    const provinceSet = new Set<string>()
    
    data.forEach((item) => {
      if (item["Tỉnh / Thành Phố"]) {
        provinceSet.add(item["Tỉnh / Thành Phố"])
      }
    })
    
    setProvinces(Array.from(provinceSet).sort())
  }, [])

  // Load danh sách phường/xã cho temp address
  useEffect(() => {
    if (!tempAddress.province) {
      setTempDistricts([])
      return
    }

    const data = locationData as LocationItem[]
    const districtList = data
      .filter((item) => item["Tỉnh / Thành Phố"] === tempAddress.province)
      .map((item) => item["Tên"])
      .sort()
    
    setTempDistricts(districtList)
  }, [tempAddress.province])

  useEffect(() => {
    // Calculate scrollbar width once
    const measureScrollbarWidth = () => {
      const scrollDiv = document.createElement('div')
      scrollDiv.style.width = '100px'
      scrollDiv.style.height = '100px'
      scrollDiv.style.overflow = 'scroll'
      scrollDiv.style.position = 'absolute'
      scrollDiv.style.top = '-9999px'
      document.body.appendChild(scrollDiv)
      const width = scrollDiv.offsetWidth - scrollDiv.clientWidth
      document.body.removeChild(scrollDiv)
      return width
    }
    setScrollbarWidth(measureScrollbarWidth())
  }, [])

  useEffect(() => {
    if (isPopupOpen) {
      document.body.style.overflow = 'hidden'
      // prevent layout shift when hiding scrollbar
      if (scrollbarWidth > 0) {
        const currentPadding = parseInt(getComputedStyle(document.body).paddingRight || '0', 10)
        document.body.style.paddingRight = `${currentPadding + scrollbarWidth}px`
      }
    } else {
      document.body.style.overflow = 'unset'
      document.body.style.paddingRight = ''
    }
    return () => {
      document.body.style.overflow = 'unset'
      document.body.style.paddingRight = ''
    }
  }, [isPopupOpen, scrollbarWidth])

  // Helper functions
  const removeItem = (field: keyof Pick<CompanyBasicInfo, 'locations' | 'fields' | 'technologies'>, value: string) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((item) => item !== value)
    })
  }

  const addItem = (field: keyof Pick<CompanyBasicInfo, 'fields' | 'technologies'>, value: string) => {
    if (!formData[field].includes(value)) {
      setFormData({
        ...formData,
        [field]: [...formData[field], value]
      })
    }
  }
  
  // Location management functions
  const handleRemoveLocation = (id: string) => {
    const newLocations = locationsList.filter((loc) => loc.id !== id)
    // If we removed the headquarters, make the first remaining location the headquarters
    if (newLocations.length > 0 && locationsList.find((l) => l.id === id)?.isHeadquarters) {
      newLocations[0].isHeadquarters = true
    }
    setLocationsList(newLocations)
    // Update formData.locations
    setFormData({
      ...formData,
      locations: newLocations.map(loc => loc.province)
    })
  }

  const handleSetHeadquarters = (id: string) => {
    setLocationsList(
      locationsList.map((loc) => ({
        ...loc,
        isHeadquarters: loc.id === id,
      }))
    )
  }

  const toggleDropdown = (type: 'address' | 'field' | 'tech') => {
    if (type === 'address') {
      setShowAddressForm(!showAddressForm)
      setShowFieldDropdown(false)
      setShowTechDropdown(false)
    } else if (type === 'field') {
      setShowFieldDropdown(!showFieldDropdown)
      setShowAddressForm(false)
      setShowTechDropdown(false)
    } else if (type === 'tech') {
      setShowTechDropdown(!showTechDropdown)
      setShowAddressForm(false)
      setShowFieldDropdown(false)
    }
  }

  const isAddressFormValid = tempAddress.province && tempAddress.district && tempAddress.streetAddress.trim() !== ''

  const handleAddAddress = () => {
    if (isAddressFormValid) {
      const newLocation: OfficeLocation = {
        id: Date.now().toString(),
        province: tempAddress.province,
        district: tempAddress.district,
        detailedAddress: tempAddress.streetAddress,
        isHeadquarters: locationsList.length === 0, // First location is automatically headquarters
      }
      
      setLocationsList([...locationsList, newLocation])
      
      // Update formData
      setFormData({
        ...formData,
        locations: [...formData.locations, tempAddress.province],
        province: locationsList.length === 0 ? tempAddress.province : formData.province,
        district: locationsList.length === 0 ? tempAddress.district : formData.district,
        streetAddress: locationsList.length === 0 ? tempAddress.streetAddress : formData.streetAddress
      })
      
      setTempAddress({ province: '', district: '', streetAddress: '' })
      setShowAddressForm(false)
    }
  }

  return (
    <>
      <div className="bg-white p-8 mb-3 shadow-sm">
        {isLoading ? (
          <div className="animate-pulse">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-gray-200 rounded-xl"></div>
              <div className="flex-1">
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="flex gap-8">
                  <div className="h-12 bg-gray-200 rounded w-24"></div>
                  <div className="h-12 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6">
              {logoPreview ? (
                <Image 
                  src={logoPreview} 
                  alt={formData.companyName} 
                  width={96} 
                  height={96}
                  className="w-24 h-24 rounded-xl object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-200 rounded-xl"></div>
              )}
              <div>
                <h1 className="text-3xl font-bold mb-2">{formData.companyName || 'Tên công ty'}</h1>
                {formData.website && (
                  <a href={formData.website} target="_blank" rel="noopener noreferrer" className="text-teal-600 text-sm hover:underline mb-4 block">
                    {formData.website}
                  </a>
                )}
                <div className="flex items-center gap-8 text-sm">
                  {formData.foundingYear && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-teal-600" />
                      <div>
                        <div className="text-xs text-gray-500">Thành lập</div>
                        <div className="font-semibold">{formData.foundingYear}</div>
                      </div>
                    </div>
                  )}
                  {formData.fields.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-teal-600" />
                      <div>
                        <div className="text-xs text-gray-500">Lĩnh vực</div>
                        <div className="font-semibold">{formData.fields.join(', ')}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {canEdit && (
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsPopupOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition text-sm"
                >
                  <Edit className="w-4 h-4" />
                  Chỉnh sửa
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Popup Overlay */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header - Fixed */}
            <div className="flex items-center justify-between p-6 border-b bg-white flex-shrink-0">
              <h2 className="text-xl font-semibold">Thông tin cơ bản</h2>
              <button 
                onClick={() => setIsPopupOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="overflow-y-auto flex-1 p-6">
              <p className="text-sm text-gray-500 mb-6">
                Đây là thông tin công ty mà bạn có thể cập nhật bất cứ lúc nào.
              </p>

              {/* Logo Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Logo của công ty</label>
                <p className="text-xs text-gray-500 mb-3">
                  Hình ảnh này sẽ được hiển thị trong trang thông tin cơ bản của công ty
                </p>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    id="logo-upload"
                    className="hidden"
                    accept=".svg,.png,.jpg,.gif"
                    onChange={handleLogoChange}
                  />
                  <label htmlFor="logo-upload" className="cursor-pointer">
                    {logoPreview ? (
                      <Image src={logoPreview} alt="Logo preview" width={128} height={128} className="mx-auto max-h-32 mb-2" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded mx-auto mb-2 flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <p className="text-sm text-teal-600">Click to replace or drag and drop</p>
                    <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF (max. 400 x 400px)</p>
                  </label>
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Tên Công ty</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Website</label>
                  <input
                    type="text"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Thông tin về công ty */}
              <div className="mb-6">
                <h3 className="text-base font-semibold mb-4">Thông tin của công ty</h3>
                <p className="text-xs text-gray-500 mb-4">
                  Giới thiệu thông tin chính xác của công ty của bạn đến người dùng một cách nhanh chóng và dễ dàng, giúp họ biết được công ty của bạn đang hoạt động ở lĩnh vực nào và những công nghệ nào được sử dụng.
                </p>

                {/* Văn phòng làm việc */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Văn phòng làm việc</label>
                  <p className="text-xs text-gray-500 mb-4">
                    Thêm các địa điểm văn phòng của công ty. Bạn có thể đánh dấu một địa điểm là trụ sở chính.
                  </p>
                  
                  {/* Locations List */}
                  <div className="space-y-3 mb-4">
                    {locationsList.map((location) => (
                      <div
                        key={location.id}
                        className="flex items-center justify-between p-4 border border-gray-300 rounded-lg bg-gray-50"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">
                              {location.detailedAddress}, {location.district}, {location.province}
                            </span>
                            {location.isHeadquarters && (
                              <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded">
                                Trụ sở chính
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!location.isHeadquarters && locationsList.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleSetHeadquarters(location.id)}
                              className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-100"
                            >
                              Đặt làm trụ sở
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveLocation(location.id)}
                            className="px-3 py-1.5 text-xs text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Add Location Form */}
                  {showAddressForm ? (
                    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">Thêm địa điểm mới</h3>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tỉnh/Thành phố <span className="text-red-600">*</span>
                          </label>
                          <select
                            value={tempAddress.province}
                            onChange={(e) => setTempAddress({ ...tempAddress, province: e.target.value, district: '' })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          >
                            <option value="">Chọn tỉnh/thành phố</option>
                            {provinces.map((prov) => (
                              <option key={prov} value={prov}>
                                {prov}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Quận/Huyện <span className="text-red-600">*</span>
                          </label>
                          <select
                            value={tempAddress.district}
                            onChange={(e) => setTempAddress({ ...tempAddress, district: e.target.value })}
                            disabled={!tempAddress.province}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100"
                          >
                            <option value="">Chọn quận/huyện</option>
                            {tempDistricts.map((dist) => (
                              <option key={dist} value={dist}>
                                {dist}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Địa chỉ chi tiết <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          value={tempAddress.streetAddress}
                          onChange={(e) => setTempAddress({ ...tempAddress, streetAddress: e.target.value })}
                          placeholder="Số nhà, tên đường"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div className="flex justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setTempAddress({ province: '', district: '', streetAddress: '' })
                            setShowAddressForm(false)
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition text-sm"
                        >
                          Hủy
                        </button>
                        <button
                          type="button"
                          onClick={handleAddAddress}
                          disabled={!isAddressFormValid}
                          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          Thêm địa chỉ
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(true)}
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg text-sm text-gray-600 flex items-center justify-center gap-2 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition"
                    >
                      <Plus className="w-4 h-4" />
                      + Thêm địa điểm
                    </button>
                  )}
                </div>

                {/* Lĩnh vực */}
                <div className="mb-4 relative">
                  <label className="block text-sm font-medium mb-2">Lĩnh vực</label>
                  <div className="relative">
                    <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-lg min-h-[42px]">
                      {formData.fields.map((field) => (
                        <span key={field} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded text-sm">
                          {field}
                          <button onClick={() => removeItem('fields', field)}>
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                      <button 
                        onClick={() => toggleDropdown('field')}
                        className="ml-auto text-gray-400 hover:text-gray-600"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    {showFieldDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {fieldOptions.filter(field => !formData.fields.includes(field)).map((field) => (
                          <div
                            key={field}
                            onClick={() => {
                              addItem('fields', field)
                              setShowFieldDropdown(false)
                            }}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                          >
                            {field}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Ngày thành lập */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Ngày thành lập</label>
                <div className="grid grid-cols-3 gap-2">
                  <select 
                    value={formData.foundingDay}
                    onChange={(e) => setFormData({...formData, foundingDay: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {[...Array(31)].map((_, i) => (
                      <option key={i + 1} value={String(i + 1)}>{i + 1}</option>
                    ))}
                  </select>
                  <select 
                    value={formData.foundingMonth}
                    onChange={(e) => setFormData({...formData, foundingMonth: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="January">January</option>
                    <option value="February">February</option>
                    <option value="March">March</option>
                    <option value="April">April</option>
                    <option value="May">May</option>
                    <option value="June">June</option>
                    <option value="July">July</option>
                    <option value="August">August</option>
                    <option value="September">September</option>
                    <option value="October">October</option>
                    <option value="November">November</option>
                    <option value="December">December</option>
                  </select>
                  <select 
                    value={formData.foundingYear}
                    onChange={(e) => setFormData({...formData, foundingYear: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {[...Array(50)].map((_, i) => {
                      const year = 2024 - i
                      return <option key={year} value={String(year)}>{year}</option>
                    })}
                  </select>
                </div>
              </div>

              {/* Công nghệ sử dụng */}
              <div className="mb-6 relative">
                <label className="block text-sm font-medium mb-2">Công nghệ sử dụng</label>
                <div className="relative">
                  <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-lg min-h-[42px]">
                    {formData.technologies.map((tech) => (
                      <span key={tech} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded text-sm">
                        {tech}
                        <button onClick={() => removeItem('technologies', tech)}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <button 
                      onClick={() => toggleDropdown('tech')}
                      className="ml-auto text-gray-400 hover:text-gray-600"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {showTechDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {techOptions.filter(tech => !formData.technologies.includes(tech)).map((tech) => (
                        <div
                          key={tech}
                          onClick={() => {
                            addItem('technologies', tech)
                            setShowTechDropdown(false)
                          }}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        >
                          {tech}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Giới thiệu về công ty */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Giới thiệu về công ty</label>
                <p className="text-xs text-gray-500 mb-3">
                  Mô tả ngắn gọn về công ty của bạn. URL này liên kết đến văn bản.
                </p>
                <div className="border border-gray-300 rounded-lg">
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full p-3 focus:outline-none resize-none rounded-lg"
                    rows={4}
                    placeholder="Description"
                  />
                  <div className="px-3 pb-2 text-right text-xs text-gray-400">
                    {formData.description.length} / 600
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1">Tối đa 600 ký tự</p>
              </div>

              {/* Phúc lợi & Đãi ngộ */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Phúc lợi & Đãi ngộ</label>
                <p className="text-xs text-gray-500 mb-3">
                  Mỗi dòng là một phúc lợi. Nhấn Enter để xuống dòng.
                </p>
                <textarea
                  value={formData.benefits}
                  onChange={(e) => setFormData({...formData, benefits: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  rows={6}
                  placeholder="Chế độ bảo hiểm sức khỏe&#10;Nghỉ phép linh hoạt&#10;Lương tháng 13..."
                />
              </div>

              {/* Liên hệ */}
              <div className="mb-6">
                <h3 className="text-base font-semibold mb-4">Thông tin liên hệ</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email liên hệ</label>
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                      placeholder="contact@company.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Facebook</label>
                    <input
                      type="url"
                      value={formData.facebookUrl}
                      onChange={(e) => setFormData({...formData, facebookUrl: e.target.value})}
                      placeholder="https://facebook.com/company"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">LinkedIn</label>
                    <input
                      type="url"
                      value={formData.linkedinUrl}
                      onChange={(e) => setFormData({...formData, linkedinUrl: e.target.value})}
                      placeholder="https://linkedin.com/company"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">X (Twitter)</label>
                    <input
                      type="url"
                      value={formData.xUrl}
                      onChange={(e) => setFormData({...formData, xUrl: e.target.value})}
                      placeholder="https://x.com/company"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer - Fixed */}
            <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 flex-shrink-0">
              <button
                onClick={() => setIsPopupOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition text-sm"
              >
                Hủy
              </button>
              <button
                onClick={() => setShowConfirmModal(true)}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-sm"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
      <ConfirmModal
        open={isPopupOpen && showConfirmModal}
        title="Xác nhận lưu thay đổi"
        message="Bạn có chắc muốn lưu các thay đổi vừa chỉnh sửa không?"
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={() => {
          // Update profile with form data
          const benefitsArray = formData.benefits.split('\n').filter(b => b.trim());
          const updatedProfile = {
            ...profile,
            companyName: formData.companyName,
            website: formData.website,
            field: formData.fields[0] || '',
            foundedYear: parseInt(formData.foundingYear) || undefined,
            technologies: formData.technologies,
            description: formData.description,
            benefits: benefitsArray,
            contactEmail: formData.contactEmail,
            facebookUrl: formData.facebookUrl,
            linkedlnUrl: formData.linkedinUrl,
            xUrl: formData.xUrl,
            // Use locationsList instead of formData.locations
            locations: locationsList.map(loc => ({
              province: loc.province,
              district: loc.district,
              detailedAddress: loc.detailedAddress,
              isHeadquarters: loc.isHeadquarters
            }))
          };
          
          // In dev mode, just update local state
          if (process.env.NODE_ENV === 'development') {
            // Trigger re-render by updating formData
            setFormData({...formData});
          }
          
          setShowConfirmModal(false);
          setShowSuccessModal(true);
        }}
      />
      {/* Success Modal */}
      {isPopupOpen && showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-lg w-full max-w-md overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-teal-700">Lưu thành công</h3>
            </div>
            <div className="p-6 text-sm text-gray-600">
              Thay đổi của bạn đã được lưu thành công.
            </div>
            <div className="p-6 border-t flex justify-end">
              <button
                onClick={() => {
                  setShowSuccessModal(false)
                  setIsPopupOpen(false)
                }}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}