'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { X } from 'lucide-react';
import ConfirmModal from '@/app/components/companyProfile/ConfirmModal';
import Toast from '@/app/components/profile/Toast';
import type { JobDetailData } from '@/app/components/job/JobDetailContents';
import { JobCategory, jobCategoryApi } from '@/utils/api/categories-api';
import { useEmployerProfile } from '@/contexts/EmployerProfileContext';

interface JobFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (jobData: JobDetailData) => void;
  onSuccess?: (jobData: JobDetailData) => void;
  initialData?: JobDetailData | null;
  mode: 'create' | 'edit';
}

export default function JobFormModal({ 
  isOpen, 
  onClose, 
  onSave, 
  onSuccess,
  initialData = null,
  mode 
}: JobFormModalProps) {
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [savedJobData, setSavedJobData] = useState<JobDetailData | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categoriesFromApi, setCategoriesFromApi] = useState<JobCategory[]>([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const { profile: employerProfile } = useEmployerProfile();
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  // Show toast helper
  const showToast = (message: string, type: 'error' | 'success' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Lấy danh mục từ API khi component mount
  useEffect(() => {
    jobCategoryApi.getList()
      .then(data => setCategoriesFromApi(data))
      .catch(error => {
        console.error('Error fetching categories:', error);
        showToast('Không thể tải danh mục. Vui lòng thử lại.', 'error');
      });
  }, []);

  // Helpers
  const formatNumberWithDots = (value: string) => {
    if (!value) return '';
    const digits = value.replace(/\D/g, '');
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const formatDateDisplay = (d: Date) => {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const toInputDate = (d: Date) => {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  };

  const todayInput = useMemo(() => toInputDate(new Date()), []);

  // Initialize form state
  const getInitialFormState = useCallback(() => {
    if (mode === 'edit' && initialData) {
      const parts = initialData.expiredAt.split('/');
      const expiredAtInput = parts.length === 3 
        ? `${parts[2]}-${parts[1]}-${parts[0]}` 
        : todayInput;

      return {
        title: initialData.title,
        employmentType: initialData.employmentType,
        workMode: initialData.workMode,
        quantity: String(initialData.quantity),
        expiredAtInput,
        salaryMin: initialData.salaryMin,
        salaryMax: initialData.salaryMax,
        isNegotiable: initialData.isNegotiable ?? false,
        isSalaryVisible: initialData.isSalaryVisible ?? true,
        salaryCurrency: initialData.salaryCurrency ?? 'VND',
        experienceLevel: (initialData.experienceLevel ?? '') as string,
        experienceYearsMin: String(initialData.experienceYearsMin ?? ''),
        locationId: initialData.locationId ?? '',
        categories: initialData.categories,
        description: initialData.description,
        responsibilitiesText: initialData.responsibilities.join('\n'),
        requirementsText: initialData.requirements.join('\n'),
        plusPointsText: initialData.plusPoints.join('\n'),
        benefitsText: initialData.benefits?.join('\n') ?? '',
        benefitSource: 'custom' as 'company' | 'custom',
        isHot: initialData.isHot ?? false,
        isUrgent: initialData.isUrgent ?? false,
      };
    }

    // Default state for create mode
    return {
      title: '',
      employmentType: 'full_time' as JobDetailData['employmentType'],
      workMode: 'onsite' as JobDetailData['workMode'],
      quantity: '1',
      expiredAtInput: todayInput,
      salaryMin: null as number | null,
      salaryMax: null as number | null,
      isNegotiable: false,
      isSalaryVisible: true,
      salaryCurrency: 'VND',
      experienceLevel: '' as string,
      experienceYearsMin: '' as string,
      locationId: employerProfile?.locations?.[0]?.id || '',
      categories: [] as string[],
      description: '',
      responsibilitiesText: '',
      requirementsText: '',
      plusPointsText: '',
      benefitsText: '',
      benefitSource: 'company' as 'company' | 'custom',
      isHot: false,
      isUrgent: false,
    };
  }, [mode, initialData, todayInput]);

  const [form, setForm] = useState(getInitialFormState());

  // Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      setForm(getInitialFormState());
      setErrors({});
    }
  }, [isOpen, getInitialFormState]);

  // Lock page scroll when modal open
  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      const previous = document.body.style.overflow;
      const previousPadding = document.body.style.paddingRight;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      return () => {
        document.body.style.overflow = previous;
        document.body.style.paddingRight = previousPadding;
      };
    }
  }, [isOpen]);

  // const categoryOptions = [
  //   'Công nghệ thông tin',
  //   'Trò chơi',
  //   'Điện toán đám mây',
  //   'Thương mại điện tử',
  //   'Fintech',
  //   'AI/Machine Learning',
  //   'Marketing',
  //   'Design',
  //   'Sản phẩm',
  //   'Vận hành'
  // ];

  const positions = ['Fresher', 'Junior', 'Senior', 'Lead', 'Manager'];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.title.trim()) {
      newErrors.title = 'Vui lòng nhập tên công việc';
    }

    if (!form.quantity || Number(form.quantity) <= 0) {
      newErrors.quantity = 'Vui lòng nhập số lượng tuyển hợp lệ';
    }

    if (!form.isNegotiable && (form.salaryMin === null || form.salaryMin <= 0)) {
      newErrors.salaryMin = 'Vui lòng nhập mức lương tối thiểu hợp lệ';
    }
    if (!form.isNegotiable && (form.salaryMax === null || form.salaryMax <= 0)) {
      newErrors.salaryMax = 'Vui lòng nhập mức lương tối đa hợp lệ';
    }

    if (!form.locationId) {
      newErrors.locationId = 'Vui lòng chọn địa điểm làm việc';
    }

    if (form.categories.length === 0) {
      newErrors.categories = 'Vui lòng chọn ít nhất một danh mục';
    }

    if (!form.description.trim()) {
      newErrors.description = 'Vui lòng nhập mô tả công việc';
    }

    if (!form.responsibilitiesText.trim()) {
      newErrors.responsibilitiesText = 'Vui lòng nhập trách nhiệm';
    }

    if (!form.requirementsText.trim()) {
      newErrors.requirementsText = 'Vui lòng nhập yêu cầu';
    }

    if (!form.plusPointsText.trim()) {
      newErrors.plusPointsText = 'Vui lòng nhập điểm cộng';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    // Check if employer has any locations
    if (!employerProfile?.locations || employerProfile.locations.length === 0) {
      showToast('Vui lòng thêm địa điểm văn phòng trong hồ sơ công ty trước khi tạo công việc.', 'error');
      return;
    }

    if (!validateForm()) {
      return;
    }

    const quantity = Number(form.quantity || '1');
    const parts = form.expiredAtInput.split('-');
    const expiredAtDisplay = parts.length === 3 
      ? `${parts[2]}/${parts[1]}/${parts[0]}` 
      : formatDateDisplay(new Date());

    // Chia responsibilities, requirements, plusPoints, benefits theo dòng
    const responsibilities = form.responsibilitiesText
      .split(/\n+/)
      .map(s => s.trim())
      .filter(Boolean);

    const requirements = form.requirementsText
      .split(/\n+/)
      .map(s => s.trim())
      .filter(Boolean);

    const plusPoints = form.plusPointsText
      .split(/\n+/)
      .map(s => s.trim())
      .filter(Boolean);

    // Determine benefits based on source
    let benefits: string[];
    if (form.benefitSource === 'company') {
      benefits = employerProfile?.benefits || [];
    } else {
      benefits = form.benefitsText
        .split(/\n+/)
        .map(s => s.trim())
        .filter(Boolean);
    }

    // Build jobData
    const jobData: JobDetailData = {
      title: form.title.trim(),
      employmentType: form.employmentType,
      workMode: form.workMode,
      applicantsCount: initialData?.applicantsCount || 0,
      quantity,
      expiredAt: expiredAtDisplay,
      postedDate: initialData?.postedDate || formatDateDisplay(new Date()),
      salaryMin: form.isNegotiable ? null : form.salaryMin,
      salaryMax: form.isNegotiable ? null : form.salaryMax,
      isNegotiable: form.isNegotiable,
      isSalaryVisible: form.isSalaryVisible,
      salaryCurrency: form.salaryCurrency,
      experienceLevel: (form.experienceLevel || undefined) as JobDetailData['experienceLevel'],
      experienceYearsMin: form.experienceYearsMin ? Number(form.experienceYearsMin) : undefined,
      locationId: form.locationId,
      categories: form.categories,
      description: form.description,
      responsibilities,
      requirements,
      plusPoints,
      benefits,
      isHot: form.isHot,
      isUrgent: form.isUrgent,
    };

    onSave(jobData);
    setShowSaveConfirm(false);

    // Show success modal
    setSavedJobData(jobData);
    setShowSuccessModal(true);
  };


  const handleSalaryChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'salaryMin' | 'salaryMax'
  ) => {
    // Chỉ lấy số từ input
    const rawValue = e.target.value.replace(/\D/g, '');
    setForm({
      ...form,
      [field]: rawValue ? Number(rawValue) : null, // Lưu kiểu number hoặc null
    });
  };


  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl w-full mx-4 shadow-2xl max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="sticky top-0 z-10 bg-white border-b p-6 flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900">
              {mode === 'create' ? 'Thêm công việc mới' : 'Chỉnh sửa công việc'}
            </h3>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600" 
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên công việc <span className="text-red-500">*</span>
                </label>
                <input 
                  value={form.title} 
                  onChange={e => setForm({ ...form, title: e.target.value })} 
                  className={`w-full border rounded-lg px-3 py-2 ${errors.title ? 'border-red-500' : ''}`}
                  placeholder="Nhập tên công việc"
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cấp độ <span className="text-red-500">*</span>
                </label>
                <select 
                  value={form.experienceLevel || ''} 
                  onChange={e => setForm({ ...form, experienceLevel: e.target.value })} 
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">Chọn cấp độ</option>
                  <option value="intern">Thực tập</option>
                  <option value="fresher">Fresher</option>
                  <option value="junior">Junior</option>
                  <option value="middle">Middle</option>
                  <option value="senior">Senior</option>
                  <option value="lead">Lead</option>
                  <option value="manager">Manager</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số lượng tuyển <span className="text-red-500">*</span>
                </label>
                <input 
                  value={form.quantity} 
                  onChange={e => setForm({ ...form, quantity: e.target.value.replace(/\D/g, '') })} 
                  inputMode="numeric" 
                  className={`w-full border rounded-lg px-3 py-2 ${errors.quantity ? 'border-red-500' : ''}`}
                  placeholder="Số lượng tuyển dụng"
                />
                {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hạn chót <span className="text-red-500">*</span>
                </label>
                <input 
                  type="date" 
                  min={todayInput} 
                  value={form.expiredAtInput} 
                  onChange={e => setForm({ ...form, expiredAtInput: e.target.value })} 
                  className="w-full border rounded-lg px-3 py-2" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại hình công việc <span className="text-red-500">*</span>
                </label>
                <select 
                  value={form.employmentType} 
                  onChange={e => setForm({ ...form, employmentType: e.target.value as JobDetailData['employmentType'] })} 
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="full_time">Toàn thời gian</option>
                  <option value="part_time">Bán thời gian</option>
                  <option value="freelance">Freelance</option>
                  <option value="internship">Thực tập</option>
                  <option value="contract">Hợp đồng</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hình thức làm việc <span className="text-red-500">*</span>
                </label>
                <select 
                  value={form.workMode} 
                  onChange={e => setForm({ ...form, workMode: e.target.value as JobDetailData['workMode'] })} 
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="onsite">Tại văn phòng</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="remote">Remote</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kinh nghiệm tối thiểu (năm)
                </label>
                <input 
                  placeholder="Để trống = Không yêu cầu" 
                  value={form.experienceYearsMin} 
                  onChange={e => setForm({ ...form, experienceYearsMin: e.target.value.replace(/\D/g, '') })} 
                  inputMode="numeric" 
                  className="w-full border rounded-lg px-3 py-2" 
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mức lương (VND/tháng)
                </label>

                <div className="flex items-center gap-2 w-full">
                  <input
                    type="text"
                    value={form.salaryMin ?? ''}
                    onChange={(e) => handleSalaryChange(e, 'salaryMin')}
                    placeholder="Từ"
                    className={`flex-1 border rounded-lg px-3 py-2 ${errors.salaryMin ? 'border-red-500' : ''}`}
                    disabled={form.isNegotiable}
                  />
                  <span className="mx-1">-</span>
                  <input
                    type="text"
                    value={form.salaryMax ?? ''}
                    onChange={(e) => handleSalaryChange(e, 'salaryMax')}
                    placeholder="Đến"
                    className={`flex-1 border rounded-lg px-3 py-2 ${errors.salaryMax ? 'border-red-500' : ''}`}
                    disabled={form.isNegotiable}
                  />
                </div>

                <div className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    checked={form.isNegotiable}
                    onChange={(e) =>
                      setForm({ ...form, isNegotiable: e.target.checked, salaryMin: null, salaryMax: null })
                    }
                    className="mr-2"
                  />
                  <span>Thỏa thuận</span>
                </div>

                {(errors.salaryMin || errors.salaryMax) && (
                  <p className="text-red-500 text-xs mt-1">{errors.salaryMin || errors.salaryMax}</p>
                )}
              </div>

              {/* Location Selector */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa điểm làm việc <span className="text-red-500">*</span>
                </label>
                <select 
                  value={form.locationId} 
                  onChange={e => setForm({ ...form, locationId: e.target.value })} 
                  className={`w-full border rounded-lg px-3 py-2 ${errors.locationId ? 'border-red-500' : ''}`}
                >
                  <option value="">Chọn địa điểm</option>
                  {employerProfile?.locations?.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.isHeadquarters && '🏢 '}
                      {location.fullAddress || `${location.detailedAddress}, ${location.district}, ${location.province}`}
                    </option>
                  ))}
                </select>
                {errors.locationId && (
                  <p className="text-red-500 text-xs mt-1">{errors.locationId}</p>
                )}
                {(!employerProfile?.locations || employerProfile.locations.length === 0) && (
                  <p className="text-orange-600 text-xs mt-1">⚠️ Chưa có địa điểm văn phòng. Vui lòng thêm địa điểm trong hồ sơ công ty.</p>
                )}
              </div>


              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Danh mục <span className="text-red-500">*</span>
                </label>

                <div
                  className={`flex items-center gap-2 flex-wrap border rounded-lg p-2 relative ${
                    errors.categories ? 'border-red-500' : ''
                  }`}
                >
                  {/* Hiển thị categories đã chọn */}
                  {form.categories.map((c, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium flex items-center gap-2"
                    >
                      {c}
                      <button
                        type="button"
                        onClick={() =>
                          setForm({
                            ...form,
                            categories: form.categories.filter((_, idx) => idx !== i),
                          })
                        }
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}

                  {/* Button mở dropdown */}
                  <button
                    type="button"
                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                    className="ml-auto px-2 py-1 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-800"
                  >
                    +
                  </button>

                  {/* Dropdown */}
                  {isCategoryDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 border rounded-lg bg-white shadow-lg max-h-48 overflow-y-auto z-10">
                      {categoriesFromApi.map(opt => (
                        <div
                          key={opt.id}
                          className="py-2 px-3 cursor-pointer hover:bg-gray-50"
                          onClick={() => {
                            if (!form.categories.includes(opt.name)) {
                              setForm({
                                ...form,
                                categories: [...form.categories, opt.name],
                              });
                            }
                            setIsCategoryDropdownOpen(false);
                          }}
                        >
                          {opt.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {errors.categories && (
                  <p className="text-red-500 text-xs mt-1">{errors.categories}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả <span className="text-red-500">*</span>
                </label>
                <textarea 
                  value={form.description} 
                  onChange={e => setForm({ ...form, description: e.target.value })} 
                  rows={4} 
                  className={`w-full border rounded-lg px-3 py-2 ${errors.description ? 'border-red-500' : ''}`}
                  placeholder="Mô tả công việc..."
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trách nhiệm (mỗi dòng là một mục) <span className="text-red-500">*</span>
                </label>
                <textarea 
                  value={form.responsibilitiesText} 
                  onChange={e => setForm({ ...form, responsibilitiesText: e.target.value })} 
                  rows={5} 
                  className={`w-full border rounded-lg px-3 py-2 ${errors.responsibilitiesText ? 'border-red-500' : ''}`}
                  placeholder="Nhập các trách nhiệm, mỗi dòng một mục"
                />
                {errors.responsibilitiesText && <p className="text-red-500 text-xs mt-1">{errors.responsibilitiesText}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Yêu cầu (mỗi dòng là một mục) <span className="text-red-500">*</span>
                </label>
                <textarea 
                  value={form.requirementsText} 
                  onChange={e => setForm({ ...form, requirementsText: e.target.value })} 
                  rows={5} 
                  className={`w-full border rounded-lg px-3 py-2 ${errors.requirementsText ? 'border-red-500' : ''}`}
                  placeholder="Nhập các yêu cầu, mỗi dòng một mục"
                />
                {errors.requirementsText && <p className="text-red-500 text-xs mt-1">{errors.requirementsText}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Điểm cộng nếu có (mỗi dòng là một mục) {/* <span className="text-red-500">*</span> */}
                </label>
                <textarea 
                  value={form.plusPointsText} 
                  onChange={e => setForm({ ...form, plusPointsText: e.target.value })} 
                  rows={4} 
                  className={`w-full border rounded-lg px-3 py-2 ${errors.plusPointsText ? 'border-red-500' : ''}`}
                  placeholder="Nhập các điểm cộng, mỗi dòng một mục"
                />
                {errors.plusPointsText && <p className="text-red-500 text-xs mt-1">{errors.plusPointsText}</p>}
              </div>

              {/* Benefits Selection */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phúc lợi
                </label>
                
                {/* Radio buttons */}
                <div className="flex gap-6 mb-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="benefitSource"
                      value="company"
                      checked={form.benefitSource === 'company'}
                      onChange={e => setForm({ ...form, benefitSource: 'company' })}
                      className="w-4 h-4 text-teal-600"
                    />
                    <span className="text-sm text-gray-700">Sử dụng phúc lợi công ty</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="benefitSource"
                      value="custom"
                      checked={form.benefitSource === 'custom'}
                      onChange={e => setForm({ ...form, benefitSource: 'custom' })}
                      className="w-4 h-4 text-teal-600"
                    />
                    <span className="text-sm text-gray-700">Nhập riêng cho tin này</span>
                  </label>
                </div>

                {/* Display company benefits or custom textarea */}
                {form.benefitSource === 'company' ? (
                  <div className="border rounded-lg p-4 bg-gray-50 max-h-60 overflow-y-auto">
                    {employerProfile?.benefits && employerProfile.benefits.length > 0 ? (
                      <ul className="space-y-2">
                        {employerProfile.benefits.map((benefit: string, index: number) => (
                          <li key={index} className="flex gap-2 text-sm text-gray-700">
                            <span className="text-teal-600 mt-1 flex-shrink-0">✓</span>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500 italic">Chưa có phúc lợi công ty. Vui lòng cập nhật hồ sơ công ty hoặc chọn nhập riêng.</p>
                    )}
                  </div>
                ) : (
                  <textarea 
                    value={form.benefitsText} 
                    onChange={e => setForm({ ...form, benefitsText: e.target.value })} 
                    rows={5} 
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Nhập các phúc lợi riêng cho tin tuyển dụng này, mỗi dòng một mục&#10;Ví dụ:&#10;Bảo hiểm sức khỏe toàn diện&#10;Thưởng hiệu suất hàng quý&#10;Du lịch team building hàng năm"
                  />
                )}
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button 
                onClick={onClose} 
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                Hủy
              </button>
              <button 
                onClick={() => {
                  if (validateForm()) {
                    setShowSaveConfirm(true);
                  }
                }}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-sm font-medium"
              >
                {mode === 'create' ? 'Tạo công việc' : 'Lưu'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={showSaveConfirm}
        title={mode === 'create' ? 'Xác nhận tạo công việc' : 'Xác nhận lưu thay đổi'}
        message={
          mode === 'create' 
            ? 'Bạn có muốn tạo công việc này không?' 
            : 'Bạn có muốn lưu các thay đổi cho công việc này?'
        }
        confirmText={mode === 'create' ? 'Tạo' : 'Lưu'}
        cancelText="Hủy"
        onCancel={() => setShowSaveConfirm(false)}
        onConfirm={handleSave}
      />

      {/* Success Modal */}
      {showSuccessModal && savedJobData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {mode === 'create' ? 'Thêm công việc thành công!' : 'Cập nhật thành công!'}
              </h3>
              <p className="text-gray-600">
                {mode === 'create' 
                  ? `Công việc "${savedJobData.title}" đã được tạo thành công.`
                  : `Công việc "${savedJobData.title}" đã được cập nhật thành công.`}
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  setShowSuccessModal(false);
                  setSavedJobData(null);
                  onClose();
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                {mode === 'create' ? 'Bỏ qua' : 'Đóng'}
              </button>
              {mode === 'create' && (
                <button 
                  onClick={() => {
                    setShowSuccessModal(false);
                    setSavedJobData(null);
                    onClose();
                    if (onSuccess && savedJobData) {
                      onSuccess(savedJobData);
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium"
                >
                  Xem
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </>
  );
}