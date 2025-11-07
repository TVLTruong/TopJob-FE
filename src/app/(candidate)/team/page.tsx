"use client";

import { Users, Award, Target, Heart } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  position: string;
  avatar: string;
}

const leadershipTeam: TeamMember[] = [
  {
    id: "1",
    name: "Nguyễn Minh Tuấn",
    position: "CEO & Founder",
    avatar: "/team/avatar-1.jpg"
  },
  {
    id: "2",
    name: "Trần Thu Hà",
    position: "CTO",
    avatar: "/team/avatar-2.jpg"
  },
  {
    id: "3",
    name: "Lê Hoàng Nam",
    position: "CFO",
    avatar: "/team/avatar-3.jpg"
  }
];

const coreTeam: TeamMember[] = [
  {
    id: "4",
    name: "Phạm Thị Lan",
    position: "Head of Product",
    avatar: "/team/avatar-4.jpg"
  },
  {
    id: "5",
    name: "Võ Quang Huy",
    position: "Lead Developer",
    avatar: "/team/avatar-5.jpg"
  },
  {
    id: "6",
    name: "Đặng Mai Anh",
    position: "Head of Marketing",
    avatar: "/team/avatar-6.jpg"
  },
  {
    id: "7",
    name: "Hoàng Văn Đức",
    position: "Lead Designer",
    avatar: "/team/avatar-7.jpg"
  },
  {
    id: "8",
    name: "Bùi Thanh Tú",
    position: "HR Manager",
    avatar: "/team/avatar-8.jpg"
  },
  {
    id: "9",
    name: "Phan Minh Khang",
    position: "Customer Success",
    avatar: "/team/avatar-9.jpg"
  }
];

function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <div className="group">
      <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
        {/* Avatar */}
        <div className="relative w-32 h-32 mx-auto mb-4">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 p-1">
            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {/* Placeholder cho avatar */}
              <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            </div>
          </div>
          {/* Status badge */}
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white"></div>
        </div>

        {/* Info */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">
            {member.name}
          </h3>
          <p className="text-emerald-600 font-medium text-sm">
            {member.position}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 py-16">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <div className="inline-block p-3 bg-white/20 rounded-full mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Đội ngũ của chúng tôi
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto">
            Những con người tài năng và nhiệt huyết đang xây dựng nền tảng tuyển dụng IT hàng đầu Việt Nam
          </p>
        </div>
      </div>

      {/* Values Section */}
      <div className="container mx-auto px-4 max-w-6xl py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Sứ mệnh</h3>
            <p className="text-gray-600 text-sm">
              Kết nối nhân tài IT với cơ hội nghề nghiệp tốt nhất
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Tầm nhìn</h3>
            <p className="text-gray-600 text-sm">
              Trở thành nền tảng tuyển dụng IT số 1 Việt Nam
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Giá trị cốt lõi</h3>
            <p className="text-gray-600 text-sm">
              Chất lượng, Minh bạch, Đổi mới, Con người là trung tâm
            </p>
          </div>
        </div>

        {/* Leadership Team */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Ban Lãnh đạo
            </h2>
            <p className="text-gray-600 text-lg">
              Những người dẫn dắt TopJob đến thành công
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {leadershipTeam.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        </div>

        {/* Core Team */}
        <div className="mb-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Đội ngũ Chuyên môn
            </h2>
            <p className="text-gray-600 text-lg">
              Những chuyên gia tận tâm trong từng lĩnh vực
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreTeam.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-emerald-600 mb-2">50+</div>
            <div className="text-gray-600">Thành viên</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-emerald-600 mb-2">5+</div>
            <div className="text-gray-600">Năm kinh nghiệm</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-emerald-600 mb-2">10K+</div>
            <div className="text-gray-600">Công việc đã kết nối</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-emerald-600 mb-2">98%</div>
            <div className="text-gray-600">Khách hàng hài lòng</div>
          </div>
        </div>
      </div>
    </div>
  );
}