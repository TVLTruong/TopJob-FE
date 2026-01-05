'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getMyEmployerProfile } from '@/utils/api/employer-api';

// 🔥 MOCK DATA FOR DEVELOPMENT
const MOCK_EMPLOYER_PROFILE = {
  "id": "2",
  "userId": "3",
  "fullName": "Trần Võ Lâm Trường",
  "workTitle": "HR manager",
  "email": "tvlamtruong@gmail.com",
  "companyName": "Công ty Cổ phần Tập đoàn VNG",
  "description": "hương châm \"Đón nhận thách thức\" đã gắn liền với VNG ngay từ những ngày đầu thành lập. Để biến giấc mơ thành hiện thực, chúng tôi kiên định xây dựng một văn hóa mà ở đó thách thức luôn được đón nhận như những cơ hội để mọi người cùng rèn luyện và phát triển. Chính lòng dũng cảm dám mơ ước những điều vĩ đại đã giúp VNG vượt qua mọi trở ngại và đạt được những thành tựu như ngày hôm nay.",
  "website": "https://vng.com.vn/",
  "logoUrl": "https://res.cloudinary.com/dn6vdrulf/image/upload/v1766906616/topjob/logos/file_f71vgw.jpg",
  "foundedDate": "2004-09-09T00:00:00.000Z",
  "employerCategory": [
    "Công nghệ thông tin",
    "Phần mềm",
    "Game",
    "AI/Machine Learning",
    "Trò chơi"
  ],
  "contactEmail": "vngcorporation@vng.com.vn",
  "contactPhone": "0914177448",
  "linkedlnUrl": "https://www.linkedin.com/company/vng-corporation/?originalSubdomain=vn",
  "facebookUrl": "https://www.facebook.com/VNGGroup.Official/",
  "xUrl": "https://x.com/VNGCorporation",
  "isApproved": true,
  "status": "active",
  "profileStatus": "approved",
  "benefits": [
    "Chăm sóc sức khỏe, bảo hiểm: Ngoài việc thực hiện đầy đủ chính sách bảo hiểm y tế theo chính sách Nhà nước, VNG còn hỗ trợ nhân viên các gói bảo hiểm công tác, bảo hiểm tai nạn và khám sức khỏe định kỳ.",
    "Khuyến khích các hoạt động thể thao: VNG trang bị các phòng tập thể thao tại các văn phòng, mở các lớp học chuyên nghiệp, sự kiện thể thao đa dạng cho nhân viên tham gia để rèn luyện sức khỏe thể chất.",
    "Không gian làm việc sáng tạo: VNG mang đến không gian làm việc hiện đại, rộng rãi và tiện nghi để Starter thỏa sức sáng tạo và nâng cao hiệu suất làm việc.",
    "Nỗ lực để bảo vệ sức khỏe nhân viên: VNG tận dụng mọi khả năng nhằm ưu tiên bảo vệ sức khỏe và an toàn của Starter lên hàng đầu bằng nhiều chương trình phúc lợi.",
    "Tham gia sự kiện văn hóa công ty: Công ty thường xuyên tổ chức các hoạt động gắn kết, chương trình giải trí và tặng quà, lì xì cho nhân viên trong các dịp Lễ/Tết và các sự kiện đặc biệt của công ty.",
    "Trợ cấp ăn trưa và công tác: Công ty hỗ trợ tiền ăn trưa hằng tháng cho toàn bộ nhân viên làm việc tại văn phòng và trợ cấp di chuyển, công tác đầy đủ."
  ],
  "locations": [
    {
      "id": "2",
      "isHeadquarters": true,
      "province": "Thành phố Hồ Chí Minh",
      "district": "Phường Tân Thuận",
      "detailedAddress": "Z06 Đường số 13",
      "fullAddress": "Z06 Đường số 13, Phường Tân Thuận, Thành phố Hồ Chí Minh"
    }
  ],
  "companyAge": 21,
  "headquarters": {
    "id": "2",
    "isHeadquarters": true,
    "province": "Thành phố Hồ Chí Minh",
    "district": "Phường Tân Thuận",
    "detailedAddress": "Z06 Đường số 13",
    "fullAddress": "Z06 Đường số 13, Phường Tân Thuận, Thành phố Hồ Chí Minh"
  },
  "hasCompleteProfile": true,
  "createdAt": "2025-12-28T07:16:37.115Z",
  "updatedAt": "2025-12-30T09:53:31.288Z"
};

export interface EmployerLocation {
  id: string;
  isHeadquarters: boolean;
  province: string;
  district: string;
  detailedAddress: string;
  fullAddress?: string;
}

export interface EmployerProfile {
  id: string;
  userId: string;
  // Contact Person Info
  fullName: string;
  workTitle?: string;
  email?: string;
  // Company Info
  companyName: string;
  description?: string | null;
  website?: string | null;
  // Company Media
  logoUrl?: string | null;
  // Company Details
  foundedDate?: Date | null;
  // Contact Info
  contactEmail?: string | null;
  contactPhone?: string | null;
  // Social Media
  linkedlnUrl?: string | null;
  facebookUrl?: string | null;
  xUrl?: string | null;
  // Status Fields
  isApproved: boolean;
  status: string;
  profileStatus: string;
  categories?: Array<{ id: string; name: string; slug: string }>;
  // Benefits
  benefits?: string[];
  // Locations
  locations?: EmployerLocation[];
  // Computed fields
  companyAge?: number | null;
  headquarters?: EmployerLocation;
  hasCompleteProfile?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface EmployerProfileContextType {
  profile: EmployerProfile | null;
  isLoading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: Partial<EmployerProfile>) => void;
}

const EmployerProfileContext = createContext<EmployerProfileContextType | undefined>(undefined);

export function EmployerProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<EmployerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 🔥 MOCK DATA DISABLED - Always fetch real data
      // if (process.env.NODE_ENV === 'development') {
      //   console.log('🔥 DEV MODE: Using mock employer profile');
      //   setProfile(MOCK_EMPLOYER_PROFILE as any);
      //   setIsLoading(false);
      //   return;
      // }
      
      const data = await getMyEmployerProfile();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
      console.error('Error loading employer profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Auto-load profile on mount
    refreshProfile();
  }, []);

  const updateProfile = (data: Partial<EmployerProfile>) => {
    if (profile) {
      setProfile({ ...profile, ...data });
    }
  };

  return (
    <EmployerProfileContext.Provider 
      value={{ profile, isLoading, error, refreshProfile, updateProfile }}
    >
      {children}
    </EmployerProfileContext.Provider>
  );
}

export function useEmployerProfile() {
  const context = useContext(EmployerProfileContext);
  if (context === undefined) {
    throw new Error('useEmployerProfile must be used within an EmployerProfileProvider');
  }
  return context;
}
