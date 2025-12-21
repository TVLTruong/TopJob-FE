"use client"

import { useEffect, useRef, useState } from 'react'
import { Plus, X } from 'lucide-react'
import locationData from "@/app/assets/danh-sach-3321-xa-phuong.json";
import Image from 'next/image'

interface LocationItem {
  "Tên": string;
  "Cấp": string;
  "Tỉnh / Thành Phố": string;
}

export type CompanyBasicInfo = {
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

type CompanyBasicInfoFormProps = {
  value: CompanyBasicInfo;
  onChange: (next: CompanyBasicInfo) => void;
}

export default function CompanyBasicInfoForm({ value, onChange }: CompanyBasicInfoFormProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const [provinces, setProvinces] = useState<string[]>([])
  const [districts, setDistricts] = useState<string[]>([])

  const [showFieldDropdown, setShowFieldDropdown] = useState(false)
  const [showTechDropdown, setShowTechDropdown] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)

  const [tempAddress, setTempAddress] = useState({
    province: '',
    district: '',
    streetAddress: ''
  })
  const [tempDistricts, setTempDistricts] = useState<string[]>([])

  const addressFormRef = useRef<HTMLDivElement | null>(null)
  const fieldDropdownRef = useRef<HTMLDivElement | null>(null)
  const techDropdownRef = useRef<HTMLDivElement | null>(null)

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

  // Load danh sách phường/xã khi chọn tỉnh/thành
  useEffect(() => {
    if (!value.province) {
      setDistricts([])
      return
    }

    const data = locationData as LocationItem[]
    const districtList = data
      .filter((item) => item["Tỉnh / Thành Phố"] === value.province)
      .map((item) => item["Tên"])
      .sort()

    setDistricts(districtList)
  }, [value.province])

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

  // Close sub-windows if clicking outside of them
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const clickedInsideAddress = addressFormRef.current?.contains(target)
      const clickedInsideField = fieldDropdownRef.current?.contains(target)
      const clickedInsideTech = techDropdownRef.current?.contains(target)
      if (!clickedInsideAddress && !clickedInsideField && !clickedInsideTech) {
        setShowAddressForm(false)
        setShowFieldDropdown(false)
        setShowTechDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const updateValue = (patch: Partial<CompanyBasicInfo>) => {
    onChange({
      ...value,
      ...patch,
    })
  }

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

  const removeItem = (field: 'locations' | 'fields' | 'technologies', item: string) => {
    updateValue({
      [field]: value[field].filter((i: string) => i !== item)
    } as Partial<CompanyBasicInfo>)
  }

  const addItem = (field: 'locations' | 'fields' | 'technologies', v: string) => {
    if (v && !value[field].includes(v)) {
      updateValue({
        [field]: [...value[field], v]
      } as Partial<CompanyBasicInfo>)
    }
  }

  const toggleDropdown = (dropdown: 'field' | 'tech' | 'address') => {
    if (dropdown === 'field') {
      setShowFieldDropdown(!showFieldDropdown)
      setShowTechDropdown(false)
      setShowAddressForm(false)
    } else if (dropdown === 'tech') {
      setShowTechDropdown(!showTechDropdown)
      setShowFieldDropdown(false)
      setShowAddressForm(false)
    } else if (dropdown === 'address') {
      setShowAddressForm(!showAddressForm)
      setShowFieldDropdown(false)
      setShowTechDropdown(false)
      if (!showAddressForm) {
        setTempAddress({ province: '', district: '', streetAddress: '' })
      }
    }
  }

  const handleAddAddress = () => {
    if (tempAddress.province && tempAddress.district && tempAddress.streetAddress) {
      const fullAddress = `${tempAddress.streetAddress}, ${tempAddress.district}, ${tempAddress.province}`
      if (!value.locations.includes(fullAddress)) {
        updateValue({
          locations: [...value.locations, fullAddress]
        })
      }
      setTempAddress({ province: '', district: '', streetAddress: '' })
      setShowAddressForm(false)
    }
  }

  const isAddressFormValid = tempAddress.province && tempAddress.district && tempAddress.streetAddress

  return (
    <div>
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
              <Image src={logoPreview} alt="Logo preview" className="mx-auto max-h-32 mb-2" />
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
            value={value.companyName}
            onChange={(e) => updateValue({ companyName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Website</label>
          <input
            type="text"
            value={value.website}
            onChange={(e) => updateValue({ website: e.target.value })}
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
        <div className="mb-4 relative" ref={addressFormRef}>
          <label className="block text-sm font-medium mb-2">Văn phòng làm việc</label>
          <div className="relative">
            <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-lg min-h-[42px]">
              {value.locations.map((location) => (
                <span key={location} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded text-sm">
                  {location}
                  <button type="button" onClick={() => removeItem('locations', location)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <button
                type="button"
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
                      onChange={(e) => setTempAddress({ ...tempAddress, province: e.target.value, district: '' })}
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
                      onChange={(e) => setTempAddress({ ...tempAddress, district: e.target.value })}
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
                    onChange={(e) => setTempAddress({ ...tempAddress, streetAddress: e.target.value })}
                    placeholder="Số nhà, tên đường"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
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
            )}
          </div>
        </div>

        {/* Lĩnh vực */}
        <div className="mb-4 relative" ref={fieldDropdownRef}>
          <label className="block text-sm font-medium mb-2">Lĩnh vực</label>
          <div className="relative">
            <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-lg min-h-[42px]">
              {value.fields.map((field) => (
                <span key={field} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded text-sm">
                  {field}
                  <button type="button" onClick={() => removeItem('fields', field)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <button
                type="button"
                onClick={() => toggleDropdown('field')}
                className="ml-auto text-gray-400 hover:text-gray-600"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {showFieldDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {fieldOptions.filter(field => !value.fields.includes(field)).map((field) => (
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
            value={value.foundingDay}
            onChange={(e) => updateValue({ foundingDay: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {[...Array(31)].map((_, i) => (
              <option key={i + 1} value={String(i + 1)}>{i + 1}</option>
            ))}
          </select>
          <select
            value={value.foundingMonth}
            onChange={(e) => updateValue({ foundingMonth: e.target.value })}
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
            value={value.foundingYear}
            onChange={(e) => updateValue({ foundingYear: e.target.value })}
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
      <div className="mb-6 relative" ref={techDropdownRef}>
        <label className="block text-sm font-medium mb-2">Công nghệ sử dụng</label>
        <div className="relative">
          <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-lg min-h-[42px]">
            {value.technologies.map((tech) => (
              <span key={tech} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded text-sm">
                {tech}
                <button type="button" onClick={() => removeItem('technologies', tech)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={() => toggleDropdown('tech')}
              className="ml-auto text-gray-400 hover:text-gray-600"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {showTechDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {techOptions.filter(tech => !value.technologies.includes(tech)).map((tech) => (
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
            value={value.description}
            onChange={(e) => updateValue({ description: e.target.value })}
            className="w-full p-3 focus:outline-none resize-none rounded-lg"
            rows={4}
            placeholder="Description"
          />
          <div className="px-3 pb-2 text-right text-xs text-gray-400">
            {value.description.length} / 600
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-1">Tối đa 600 ký tự</p>
      </div>
    </div>
  )
}


