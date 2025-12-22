"use client";

import { useState, useRef, ChangeEvent, useEffect } from "react";
import PersonalInfo from "../../components/profile/PersonalInfo";
import AboutSection from "../../components/profile/AboutSection";
import EducationSection from "../../components/profile/EducationSection";
import WorkExperienceSection from "../../components/profile/WorkExperienceSection";
import Toast from "../../components/profile/Toast";
import BasicInfoModal from "../../components/profile/BasicInfoModal";
import EducationModal from "../../components/profile/EducationModal";
import WorkExperienceModal from "../../components/profile/WorkExperienceModal";
import { CandidateApi } from "@/utils/api/candidate-api";
import type { 
  Education, 
  WorkExperience, 
  Profile,
  convertApiProfileToUIProfile,
  convertEducationToApiFormat,
  convertWorkExperienceToApiFormat,
} from "./types";

export default function CandidateProfilePage() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState<Profile>({
    name: "",
    title: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    province: "",
    district: "",
    address: "",
    personalLink: "",
    about: "",
    education: [] as Education[],
    workExperience: [] as WorkExperience[],
  });

  const [editingSections, setEditingSections] = useState<Record<string, boolean>>({
    about: false
  });

  const [showBasicInfoModal, setShowBasicInfoModal] = useState(false);
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [showWorkModal, setShowWorkModal] = useState(false);
  const [editingEducationIndex, setEditingEducationIndex] = useState<number | null>(null);
  const [editingWorkIndex, setEditingWorkIndex] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  const [tempBasicInfo, setTempBasicInfo] = useState({
    name: "",
    title: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    province: "",
    district: "",
    address: "",
    personalLink: ""
  });

  const [tempEducation, setTempEducation] = useState({
    school: "",
    degree: "",
    major: "",
    fromMonth: "",
    fromYear: "",
    toMonth: "",
    toYear: "",
    currentlyStudying: false,
    additionalDetails: ""
  });

  const [tempWork, setTempWork] = useState({
    jobTitle: "",
    company: "",
    fromMonth: "",
    fromYear: "",
    toMonth: "",
    toYear: "",
    currentlyWorking: false,
    description: ""
  });

  // Fetch profile on component mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        showToast('Vui lòng đăng nhập để xem hồ sơ', 'error');
        return;
      }

      const apiProfile = await CandidateApi.getMyProfile(token);
      const { convertApiProfileToUIProfile } = await import('./types');
      const uiProfile = convertApiProfileToUIProfile(apiProfile);
      
      setProfile(uiProfile);
      if (apiProfile.avatarUrl) {
        setAvatar(apiProfile.avatarUrl);
      }
      
      // Không cần hiển thị toast thành công khi load profile ban đầu
    } catch (error) {
      console.error('Error loading profile:', error);
      showToast(
        error instanceof Error ? error.message : 'Không thể tải hồ sơ',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('Kích thước ảnh không được vượt quá 5MB', 'error');
      return;
    }

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
      showToast('Chỉ chấp nhận file ảnh (jpg, png, gif, webp)', 'error');
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        showToast('Vui lòng đăng nhập để upload ảnh', 'error');
        return;
      }

      // Preview avatar locally first
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);

      // Upload to server
      const result = await CandidateApi.uploadAvatar(token, file);
      setAvatar(result.avatarUrl);
      
      // Dispatch event to notify Header component
      window.dispatchEvent(new CustomEvent('avatarUpdated', { 
        detail: { avatarUrl: result.avatarUrl } 
      }));
      
      showToast('Cập nhật ảnh đại diện thành công', 'success');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      showToast(
        error instanceof Error ? error.message : 'Không thể upload ảnh',
        'error'
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleEdit = (section: string) => {
    setEditingSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateProfile = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const openBasicInfoModal = () => {
    setTempBasicInfo({
      name: profile.name,
      title: profile.title,
      email: profile.email,
      phone: profile.phone,
      dateOfBirth: profile.dateOfBirth,
      gender: profile.gender,
      province: profile.province,
      district: profile.district,
      address: profile.address,
      personalLink: profile.personalLink
    });
    setShowBasicInfoModal(true);
  };

  const showToast = (message: string, type: 'error' | 'success' = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const validateBasicInfo = () => {
    if (!tempBasicInfo.email.trim()) {
      showToast("Email không được để trống");
      return false;
    }
    if (!tempBasicInfo.dateOfBirth) {
      showToast("Ngày sinh không được để trống");
      return false;
    }
    if (!tempBasicInfo.gender.trim()) {
      showToast("Giới tính không được để trống");
      return false;
    }
    return true;
  };

  const saveBasicInfo = async () => {
    if (!validateBasicInfo()) return;
    
    try {
      setSaving(true);
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        showToast('Vui lòng đăng nhập để cập nhật hồ sơ', 'error');
        return;
      }

      // Convert gender from Vietnamese to backend format
      const genderMap: Record<string, string> = {
        'Nam': 'male',
        'Nữ': 'female',
        'Khác': 'other'
      };
      const genderValue = tempBasicInfo.gender ? genderMap[tempBasicInfo.gender] : undefined;

      await CandidateApi.updateMyProfile(token, {
        phoneNumber: tempBasicInfo.phone || undefined,
        dateOfBirth: tempBasicInfo.dateOfBirth || undefined,
        gender: genderValue,
        addressCity: tempBasicInfo.province || undefined,
        addressDistrict: tempBasicInfo.district || undefined,
        addressStreet: tempBasicInfo.address || undefined,
        title: tempBasicInfo.title || undefined,
        personalUrl: tempBasicInfo.personalLink || undefined,
      });

      setProfile(prev => ({
        ...prev,
        name: tempBasicInfo.name,
        title: tempBasicInfo.title,
        email: tempBasicInfo.email,
        phone: tempBasicInfo.phone,
        dateOfBirth: tempBasicInfo.dateOfBirth,
        gender: tempBasicInfo.gender,
        province: tempBasicInfo.province,
        district: tempBasicInfo.district,
        address: tempBasicInfo.address,
        personalLink: tempBasicInfo.personalLink
      }));
      
      setShowBasicInfoModal(false);
      showToast('Cập nhật thông tin cơ bản thành công', 'success');
    } catch (error) {
      console.error('Error updating basic info:', error);
      showToast(
        error instanceof Error ? error.message : 'Không thể cập nhật thông tin',
        'error'
      );
    } finally {
      setSaving(false);
    }
  };

  const validateEducation = () => {
    const hasAnyField = 
      tempEducation.school.trim() ||
      tempEducation.degree ||
      tempEducation.major.trim() ||
      tempEducation.fromMonth ||
      tempEducation.fromYear ||
      tempEducation.toMonth ||
      tempEducation.toYear;
    
    if (!hasAnyField) {
      showToast("Vui lòng điền đầy đủ thông tin học vấn trước khi lưu");
      return false;
    }
    
    const requiredFields = [
      tempEducation.school.trim(),
      tempEducation.degree,
      tempEducation.major.trim(),
      tempEducation.fromMonth,
      tempEducation.fromYear,
      tempEducation.currentlyStudying ? true : (tempEducation.toMonth && tempEducation.toYear)
    ];
    
    if (requiredFields.some(field => !field)) {
      showToast("Nếu đã điền thông tin học vấn, vui lòng điền đầy đủ các trường bắt buộc (trừ chi tiết bổ sung)");
      return false;
    }
    
    return true;
  };

  const validateWorkExperience = () => {
    const hasAnyField = 
      tempWork.jobTitle.trim() ||
      tempWork.company.trim() ||
      tempWork.fromMonth ||
      tempWork.fromYear ||
      tempWork.toMonth ||
      tempWork.toYear ||
      tempWork.description.trim();
    
    if (!hasAnyField) {
      showToast("Vui lòng điền đầy đủ thông tin kinh nghiệm làm việc trước khi lưu");
      return false;
    }
    
    const requiredFields = [
      tempWork.jobTitle.trim(),
      tempWork.company.trim(),
      tempWork.fromMonth,
      tempWork.fromYear,
      tempWork.currentlyWorking ? true : (tempWork.toMonth && tempWork.toYear)
    ];
    
    if (requiredFields.some(field => !field)) {
      showToast("Nếu đã điền thông tin kinh nghiệm làm việc, vui lòng điền đầy đủ các trường bắt buộc");
      return false;
    }
    
    return true;
  };

  const saveAbout = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        showToast('Vui lòng đăng nhập để cập nhật hồ sơ', 'error');
        return;
      }

      await CandidateApi.updateMyProfile(token, {
        bio: profile.about || undefined,
      });

      setEditingSections(prev => ({ ...prev, about: false }));
      showToast('Cập nhật giới thiệu thành công', 'success');
    } catch (error) {
      console.error('Error updating about:', error);
      showToast(
        error instanceof Error ? error.message : 'Không thể cập nhật giới thiệu',
        'error'
      );
    } finally {
      setSaving(false);
    }
  };

  const openEducationModal = (index?: number | null) => {
    if (index !== null && index !== undefined) {
      setTempEducation(profile.education[index]);
      setEditingEducationIndex(index);
    } else {
      setTempEducation({
        school: "",
        degree: "",
        major: "",
        fromMonth: "",
        fromYear: "",
        toMonth: "",
        toYear: "",
        currentlyStudying: false,
        additionalDetails: ""
      });
      setEditingEducationIndex(null);
    }
    setShowEducationModal(true);
  };

  const saveEducation = async () => {
    if (!validateEducation()) return;
    
    try {
      setSaving(true);
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        showToast('Vui lòng đăng nhập để cập nhật hồ sơ', 'error');
        return;
      }

      let updatedEducation: Education[];
      if (editingEducationIndex !== null) {
        updatedEducation = [...profile.education];
        updatedEducation[editingEducationIndex] = tempEducation;
      } else {
        updatedEducation = [...profile.education, tempEducation];
      }

      // Convert to API format
      const { convertEducationToApiFormat } = await import('./types');
      const apiEducation = updatedEducation.map(convertEducationToApiFormat);

      await CandidateApi.updateMyProfile(token, {
        education: apiEducation,
      });

      setProfile(prev => ({ ...prev, education: updatedEducation }));
      setShowEducationModal(false);
      showToast('Cập nhật học vấn thành công', 'success');
    } catch (error) {
      console.error('Error updating education:', error);
      showToast(
        error instanceof Error ? error.message : 'Không thể cập nhật học vấn',
        'error'
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteEducation = async (index: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa học vấn này?')) return;
    
    try {
      setSaving(true);
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        showToast('Vui lòng đăng nhập lại', 'error');
        return;
      }

      const updatedEducation = profile.education.filter((_, i) => i !== index);

      // Convert to API format
      const { convertEducationToApiFormat } = await import('./types');
      const apiEducation = updatedEducation.map(convertEducationToApiFormat);

      await CandidateApi.updateMyProfile(token, {
        education: apiEducation,
      });

      setProfile(prev => ({ ...prev, education: updatedEducation }));
      showToast('Xóa học vấn thành công', 'success');
    } catch (error) {
      console.error('Error deleting education:', error);
      showToast(
        error instanceof Error ? error.message : 'Không thể xóa học vấn',
        'error'
      );
    } finally {
      setSaving(false);
    }
  };

  const openWorkModal = (index?: number | null) => {
    if (index !== null && index !== undefined) {
      setTempWork(profile.workExperience[index]);
      setEditingWorkIndex(index);
    } else {
      setTempWork({
        jobTitle: "",
        company: "",
        fromMonth: "",
        fromYear: "",
        toMonth: "",
        toYear: "",
        currentlyWorking: false,
        description: ""
      });
      setEditingWorkIndex(null);
    }
    setShowWorkModal(true);
  };

  const saveWork = async () => {
    if (!validateWorkExperience()) return;
    
    try {
      setSaving(true);
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        showToast('Vui lòng đăng nhập để cập nhật hồ sơ', 'error');
        return;
      }

      let updatedWork: WorkExperience[];
      if (editingWorkIndex !== null) {
        updatedWork = [...profile.workExperience];
        updatedWork[editingWorkIndex] = tempWork;
      } else {
        updatedWork = [...profile.workExperience, tempWork];
      }

      // Convert to API format
      const { convertWorkExperienceToApiFormat } = await import('./types');
      const apiWork = updatedWork.map(convertWorkExperienceToApiFormat);

      await CandidateApi.updateMyProfile(token, {
        workExperience: apiWork,
      });

      setProfile(prev => ({ ...prev, workExperience: updatedWork }));
      setShowWorkModal(false);
      showToast('Cập nhật kinh nghiệm làm việc thành công', 'success');
    } catch (error) {
      console.error('Error updating work experience:', error);
      showToast(
        error instanceof Error ? error.message : 'Không thể cập nhật kinh nghiệm',
        'error'
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteWork = async (index: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa kinh nghiệm làm việc này?')) return;
    
    try {
      setSaving(true);
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        showToast('Vui lòng đăng nhập lại', 'error');
        return;
      }

      const updatedWork = profile.workExperience.filter((_, i) => i !== index);

      // Convert to API format
      const { convertWorkExperienceToApiFormat } = await import('./types');
      const apiWork = updatedWork.map(convertWorkExperienceToApiFormat);

      await CandidateApi.updateMyProfile(token, {
        workExperience: apiWork,
      });

      setProfile(prev => ({ ...prev, workExperience: updatedWork }));
      showToast('Xóa kinh nghiệm làm việc thành công', 'success');
    } catch (error) {
      console.error('Error deleting work experience:', error);
      showToast(
        error instanceof Error ? error.message : 'Không thể xóa kinh nghiệm',
        'error'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Đang tải hồ sơ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* Loading Overlay */}
      {saving && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-gray-700">Đang lưu...</span>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header Card - Thông tin cơ bản */}
        <PersonalInfo
          avatar={avatar}
          fileInputRef={fileInputRef}
          handleAvatarClick={handleAvatarClick}
          handleAvatarChange={handleAvatarChange}
          profile={profile}
          openBasicInfoModal={openBasicInfoModal}
        />

        {/* About Me Section */}
        <AboutSection
          profile={profile}
          editingAbout={editingSections.about}
          toggleEdit={toggleEdit}
          updateProfile={updateProfile}
          saveAbout={saveAbout}
        />

        {/* Education Section */}
        <EducationSection 
          education={profile.education} 
          openEducationModal={openEducationModal}
          deleteEducation={deleteEducation}
        />

        {/* Work Experience Section */}
        <WorkExperienceSection 
          workExperience={profile.workExperience} 
          openWorkModal={openWorkModal}
          deleteWork={deleteWork}
        />

        {/* Modals */}
        <BasicInfoModal
          isOpen={showBasicInfoModal}
          basicInfo={tempBasicInfo}
          onClose={() => setShowBasicInfoModal(false)}
          onSave={saveBasicInfo}
          onChange={setTempBasicInfo}
        />

        <EducationModal
          isOpen={showEducationModal}
          education={tempEducation}
          onClose={() => setShowEducationModal(false)}
          onSave={saveEducation}
          onChange={setTempEducation}
        />

        <WorkExperienceModal
          isOpen={showWorkModal}
          workExperience={tempWork}
          onClose={() => setShowWorkModal(false)}
          onSave={saveWork}
          onChange={setTempWork}
        />
      </div>
    </div>
  );
}