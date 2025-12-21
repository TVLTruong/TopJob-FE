"use client"
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import ConfirmModal from './ConfirmModal'
import { Users, Globe, Edit, X, Plus } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import locationData from "@/app/assets/danh-sach-3321-xa-phuong.json";

interface LocationItem {
  "Tên": string;
  "Cấp": string;
  "Tỉnh / Thành Phố": string;
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
}

const fieldOptions = ['Công nghệ thông tin', 'Trò chơi', 'Điện toán đám mây', 'Thương mại điện tử', 'Fintech', 'AI/Machine Learning']
const techOptions = ['HTML 5', 'CSS 3', 'Javascript', 'React', 'Node.js', 'Python', 'Java', 'TypeScript', 'Vue.js', 'Angular']

export default function CompanyHeader() {
  const { user } = useAuth()
  const isRecruiter = user?.role === 'EMPLOYER'
  const canEdit = isRecruiter
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [formData, setFormData] = useState<CompanyBasicInfo>({
    companyName: 'VNG',
    website: 'https://www.vng.com.vn',
    locations: ['Hồ Chí Minh'],
    fields: ['Công nghệ thông tin', 'Trò chơi'],
    province: 'Hồ Chí Minh',
    district: 'Phường Bến Nghé',
    streetAddress: '182 Lê Đại Hành, Phường 15',
    foundingDay: '15',
    foundingMonth: 'July',
    foundingYear: '2004',
    technologies: ['HTML 5', 'CSS 3', 'Javascript'],
    description: 'VNG là công ty công nghệ hàng đầu Việt Nam, chuyên phát triển các sản phẩm và dịch vụ về trò chơi trực tuyến, điện toán đám mây, thanh toán điện tử và mạng xã hội. Được thành lập từ năm 2004, VNG đã khẳng định vị thế của mình trong ngành công nghiệp game và công nghệ.'
  })
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  
  const [provinces, setProvinces] = useState<string[]>([])
  
  const [showFieldDropdown, setShowFieldDropdown] = useState(false)
  const [showTechDropdown, setShowTechDropdown] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)

  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [scrollbarWidth, setScrollbarWidth] = useState(0)
  
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
      const fullAddress = `${tempAddress.province}`
      if (!formData.locations.includes(fullAddress)) {
        setFormData({
          ...formData,
          locations: [...formData.locations, fullAddress],
          province: tempAddress.province,
          district: tempAddress.district,
          streetAddress: tempAddress.streetAddress
        })
      }
      setTempAddress({ province: '', district: '', streetAddress: '' })
      setShowAddressForm(false)
    }
  }

  return (
    <>
      <div className="bg-white rounded-xl p-8 mb-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-gray-200 rounded-xl"></div>
            <div>
              <h1 className="text-3xl font-bold mb-2">VNG</h1>
              <a href="https://www.vng.com.vn" className="text-teal-600 text-sm hover:underline mb-4 block">
                https://www.vng.com.vn
              </a>
              <div className="flex items-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-teal-600" />
                  <div>
                    <div className="text-xs text-gray-500">Thành lập</div>
                    <div className="font-semibold">2004</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-teal-600" />
                  <div>
                    <div className="text-xs text-gray-500">Lĩnh vực</div>
                    <div className="font-semibold">Trò chơi, Điện toán đám mây</div>
                  </div>
                </div>
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

                {/* Vị trí */}
                <div className="mb-4 relative">
                  <label className="block text-sm font-medium mb-2">Văn phòng làm việc</label>
                  <div className="relative">
                    <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-lg min-h-[42px]">
                      {formData.locations.map((location) => (
                        <span key={location} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded text-sm">
                          {location}
                          <button onClick={() => removeItem('locations', location)}>
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                      <button 
                        onClick={() => toggleDropdown('address')}
                        className="ml-auto text-gray-400 hover:text-gray-600"
                        title="Thêm địa chỉ chi tiết"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    {showAddressForm && (
                      <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Tỉnh / Thành phố</label>
                            <select
                              value={tempAddress.province}
                              onChange={(e) => setTempAddress({...tempAddress, province: e.target.value, district: ''})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none"
                              style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%23666' d='M8 11L3 6h10z'/%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 0.75rem center'
                              }}
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
                            <label className="block text-sm font-medium mb-2">Phường / Xã</label>
                            <select
                              value={tempAddress.district}
                              onChange={(e) => setTempAddress({...tempAddress, district: e.target.value})}
                              disabled={!tempAddress.province}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none disabled:bg-gray-100"
                              style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%23666' d='M8 11L3 6h10z'/%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 0.75rem center',
                                color: tempAddress.district === "" ? '#9CA3AF' : '#111827'
                              }}
                            >
                              <option value="">Chọn phường/xã</option>
                              {tempDistricts.map((dist) => (
                                <option key={dist} value={dist}>
                                  {dist}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-medium mb-2">Địa chỉ</label>
                          <input
                            type="text"
                            value={tempAddress.streetAddress}
                            onChange={(e) => setTempAddress({...tempAddress, streetAddress: e.target.value})}
                            placeholder="Số nhà, tên đường"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                        </div>

                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => {
                              setTempAddress({ province: '', district: '', streetAddress: '' })
                              setShowAddressForm(false)
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition text-sm"
                          >
                            Hủy
                          </button>
                          <button
                            onClick={handleAddAddress}
                            disabled={!isAddressFormValid}
                            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
                          >
                            Thêm địa chỉ
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
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
          setShowConfirmModal(false)
          setShowSuccessModal(true)
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