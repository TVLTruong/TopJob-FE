"use client";

import { useState, useRef, ChangeEvent } from "react";
import PersonalInfo from "../../components/profile/PersonalInfo";
import AboutSection from "../../components/profile/AboutSection";
import EducationSection from "../../components/profile/EducationSection";
import WorkExperienceSection from "../../components/profile/WorkExperienceSection";
import Toast from "../../components/profile/Toast";
import BasicInfoModal from "../../components/profile/BasicInfoModal";
import EducationModal from "../../components/profile/EducationModal";
import WorkExperienceModal from "../../components/profile/WorkExperienceModal";
import type { Education, WorkExperience, Profile } from "./types";

export default function CandidateProfilePage() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<Profile>({
    name: "Toàn Nguyễn",
    title: "",
    email: "toannguyen0911v1@gm...",
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
    name: "Toàn Nguyễn",
    title: "",
    email: "toannguyen0911v1@gm...",
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

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
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

  const saveBasicInfo = () => {
    if (!validateBasicInfo()) return;
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

  const saveAbout = () => {
    setEditingSections(prev => ({ ...prev, about: false }));
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

  const saveEducation = () => {
    if (!validateEducation()) return;
    
    if (editingEducationIndex !== null) {
      const updated = [...profile.education];
      updated[editingEducationIndex] = tempEducation;
      setProfile(prev => ({ ...prev, education: updated }));
    } else {
      setProfile(prev => ({ ...prev, education: [...prev.education, tempEducation] }));
    }
    setShowEducationModal(false);
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

  const saveWork = () => {
    if (!validateWorkExperience()) return;
    
    if (editingWorkIndex !== null) {
      const updated = [...profile.workExperience];
      updated[editingWorkIndex] = tempWork;
      setProfile(prev => ({ ...prev, workExperience: updated }));
    } else {
      setProfile(prev => ({ ...prev, workExperience: [...prev.workExperience, tempWork] }));
    }
    setShowWorkModal(false);
  };

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
        />

        {/* Work Experience Section */}
        <WorkExperienceSection 
          workExperience={profile.workExperience} 
          openWorkModal={openWorkModal} 
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