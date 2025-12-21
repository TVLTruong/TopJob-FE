"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Users, Briefcase, ArrowRight } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();

  const handleRoleSelect = (role: 'candidate' | 'employer') => {
    router.push(`/signup/${role}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-12 px-4 bg-gradient-to-br from-emerald-50 to-blue-50">
      <div className="w-full max-w-4xl">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Tạo tài khoản TopJob
          </h1>
          <p className="text-lg text-gray-600">
            Chọn loại tài khoản bạn muốn đăng ký
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          
          {/* Card Ứng viên */}
          <button
            onClick={() => handleRoleSelect('candidate')}
            className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-emerald-500 text-left"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                <Users className="w-10 h-10 text-emerald-600 group-hover:text-white transition-colors" />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Ứng viên
                </h2>
                <p className="text-gray-600 mb-4">
                  Tìm kiếm và ứng tuyển công việc mơ ước của bạn
                </p>
              </div>

              <div className="flex items-center gap-2 text-emerald-600 font-semibold group-hover:gap-3 transition-all">
                Đăng ký ngay
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </button>

          {/* Card Nhà tuyển dụng */}
          <button
            onClick={() => handleRoleSelect('employer')}
            className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-500 text-left"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                <Briefcase className="w-10 h-10 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Nhà tuyển dụng
                </h2>
                <p className="text-gray-600 mb-4">
                  Đăng tin tuyển dụng và tìm kiếm ứng viên tài năng
                </p>
              </div>

              <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
                Đăng ký ngay
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </button>

        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Đã có tài khoản?{' '}
            <Link href="/login" className="font-semibold text-emerald-600 hover:underline">
              Đăng nhập ngay
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
