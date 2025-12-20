'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { X } from 'lucide-react';
import ConfirmModal from '@/app/components/companyProfile/ConfirmModal';
import type { JobDetailData } from '@/app/components/job/JobDetailContents';

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
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      const parts = initialData.deadline.split('/');
      const deadlineInput = parts.length === 3 
        ? `${parts[2]}-${parts[1]}-${parts[0]}` 
        : todayInput;

      return {
        title: initialData.title,
        position: initialData.position,
        jobType: initialData.jobType,
        targetCount: String(initialData.targetCount),
        deadlineInput,
        salaryRaw: initialData.salaryDisplay.replace(/\D/g, ''),
        experienceYears: initialData.experienceDisplay === 'Không' 
          ? '' 
          : initialData.experienceDisplay.replace(/\D/g, ''),
        categories: initialData.categories,
        newCategory: '',
        description: initialData.description,
        responsibilitiesText: initialData.responsibilities.join('\n'),
        requirementsText: initialData.requirements.join('\n'),
        plusPointsText: initialData.plusPoints.join('\n')
      };
    }

    // Default state for create mode
    return {
      title: '',
      position: 'Fresher',
      jobType: 'Full-Time' as JobDetailData['jobType'],
      targetCount: '',
      deadlineInput: todayInput,
      salaryRaw: '',
      experienceYears: '',
      categories: [] as string[],
      newCategory: '',
      description: '',
      responsibilitiesText: '',
      requirementsText: '',
      plusPointsText: ''
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

  const categoryOptions = [
    'Công nghệ thông tin',
    'Trò chơi',
    'Điện toán đám mây',
    'Thương mại điện tử',
    'Fintech',
    'AI/Machine Learning',
    'Marketing',
    'Design',
    'Sản phẩm',
    'Vận hành'
  ];

  const positions = ['Fresher', 'Junior', 'Senior', 'Lead', 'Manager'];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.title.trim()) {
      newErrors.title = 'Vui lòng nhập tên công việc';
    }

    if (!form.targetCount || Number(form.targetCount) <= 0) {
      newErrors.targetCount = 'Vui lòng nhập chỉ tiêu hợp lệ';
    }

    if (!form.salaryRaw || Number(form.salaryRaw) <= 0) {
      newErrors.salaryRaw = 'Vui lòng nhập mức lương hợp lệ';
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
    if (!validateForm()) {
      return;
    }

    const target = Number(form.targetCount || '0');
    const parts = form.deadlineInput.split('-');
    const deadlineDisplay = parts.length === 3 
      ? `${parts[2]}/${parts[1]}/${parts[0]}` 
      : formatDateDisplay(new Date());
    
    const salaryDisplay = form.salaryRaw 
      ? `${formatNumberWithDots(form.salaryRaw)} USD/tháng` 
      : '0 USD/tháng';
    
    const experienceDisplay = form.experienceYears 
      ? `${Number(form.experienceYears)} năm` 
      : 'Không';
    
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

    const jobData: JobDetailData = {
      title: form.title.trim(),
      position: form.position,
      jobType: form.jobType,
      applicantsCount: initialData?.applicantsCount || 0,
      targetCount: target,
      deadline: deadlineDisplay,
      postedDate: initialData?.postedDate || formatDateDisplay(new Date()),
      salaryDisplay,
      experienceDisplay,
      categories: form.categories,
      description: form.description,
      responsibilities,
      requirements,
      plusPoints
    };

    onSave(jobData);
    setShowSaveConfirm(false);
    
    // Show success modal for both create and edit modes
    setSavedJobData(jobData);
    setShowSuccessModal(true);
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Chỉ lấy số từ input
    const rawValue = e.target.value.replace(/\D/g, '');
    setForm({ ...form, salaryRaw: rawValue });
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
                  Chức vụ <span className="text-red-500">*</span>
                </label>
                <select 
                  value={form.position} 
                  onChange={e => setForm({ ...form, position: e.target.value })} 
                  className="w-full border rounded-lg px-3 py-2"
                >
                  {positions.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chỉ tiêu <span className="text-red-500">*</span>
                </label>
                <input 
                  value={form.targetCount} 
                  onChange={e => setForm({ ...form, targetCount: e.target.value.replace(/\D/g, '') })} 
                  inputMode="numeric" 
                  className={`w-full border rounded-lg px-3 py-2 ${errors.targetCount ? 'border-red-500' : ''}`}
                  placeholder="Số lượng tuyển dụng"
                />
                {errors.targetCount && <p className="text-red-500 text-xs mt-1">{errors.targetCount}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hạn chót <span className="text-red-500">*</span>
                </label>
                <input 
                  type="date" 
                  min={todayInput} 
                  value={form.deadlineInput} 
                  onChange={e => setForm({ ...form, deadlineInput: e.target.value })} 
                  className="w-full border rounded-lg px-3 py-2" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại công việc <span className="text-red-500">*</span>
                </label>
                <select 
                  value={form.jobType} 
                  onChange={e => setForm({ ...form, jobType: e.target.value as JobDetailData['jobType'] })} 
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lương (USD/tháng) <span className="text-red-500">*</span>
                </label>
                <input 
                  value={formatNumberWithDots(form.salaryRaw)} 
                  onChange={handleSalaryChange}
                  inputMode="numeric" 
                  className={`w-full border rounded-lg px-3 py-2 ${errors.salaryRaw ? 'border-red-500' : ''}`}
                  placeholder="Mức lương"
                />
                {errors.salaryRaw && <p className="text-red-500 text-xs mt-1">{errors.salaryRaw}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kinh nghiệm (năm)
                </label>
                <input 
                  placeholder="Để trống = Không yêu cầu" 
                  value={form.experienceYears} 
                  onChange={e => setForm({ ...form, experienceYears: e.target.value.replace(/\D/g, '') })} 
                  inputMode="numeric" 
                  className="w-full border rounded-lg px-3 py-2" 
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Danh mục <span className="text-red-500">*</span>
                </label>
                <div className={`flex items-center gap-2 flex-wrap border rounded-lg p-2 relative ${errors.categories ? 'border-red-500' : ''}`}>
                  {form.categories.map((c, i) => (
                    <span 
                      key={i} 
                      className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium flex items-center gap-2"
                    >
                      {c}
                      <button 
                        onClick={() => setForm({ 
                          ...form, 
                          categories: form.categories.filter((_, idx) => idx !== i) 
                        })} 
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <button 
                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)} 
                    className="ml-auto px-2 py-1 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-800"
                  >
                    +
                  </button>
                  
                  {isCategoryDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 border rounded-lg bg-white shadow-lg max-h-48 overflow-y-auto z-10">
                      {categoryOptions.map(opt => (
                        <div 
                          key={opt} 
                          className="py-2 px-3 cursor-pointer hover:bg-gray-50" 
                          onClick={() => {
                            if (!form.categories.includes(opt)) {
                              setForm({ ...form, categories: [...form.categories, opt] });
                            }
                            setIsCategoryDropdownOpen(false);
                          }}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {errors.categories && <p className="text-red-500 text-xs mt-1">{errors.categories}</p>}
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
                  Điểm cộng nếu có (mỗi dòng là một mục) <span className="text-red-500">*</span>
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
    </>
  );
}