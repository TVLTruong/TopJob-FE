// Sửa file: src/app/signup/page.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import GoogleSignInButton from "@/components/GoogleSignInButton";

export default function SignUpPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Mật khẩu và mật khẩu xác nhận không khớp!");
      return;
    }
    console.log({ fullName, email, password });
  };

  const handleGoogleSignIn = () => {
    console.log("Đăng ký với Google...");
  };

  return (
    <main className="flex flex-col flex-1 md:flex-row"> {/* Thẻ này là ngoài cùng */}
      
      {/* Cột trái (Ảnh) */}
      <div className="items-center justify-center flex-1 hidden p-12 md:flex">
        <Image
          src="/signup_login.png" // Đảm bảo tên file này đúng
          alt="JOBS Illustration"
          width={600}
          height={450}
          className="object-contain"
          priority
        />
      </div>

      {/* Cột phải (Form) */}
      <div className="flex items-center justify-center w-full p-8 md:w-2/5">
        <div className="w-full max-w-md space-y-5">
          
          <h1 className="text-3xl font-semibold text-gray-900 text-center md:text-left">
            Đăng ký tài khoản mới
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Họ tên */}
            <div>
              <label 
                htmlFor="fullName" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Họ tên <span className="text-red-600">*</span>
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nhập vào Họ tên"
                required
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Email */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email <span className="text-red-600">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập vào địa chỉ email"
                required
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Mật khẩu */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mật khẩu <span className="text-red-600">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                required
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Nhập lại mật khẩu */}
            <div>
              <label 
                htmlFor="confirmPassword" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nhập lại mật khẩu <span className="text-red-600">*</span>
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu"
                required
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 font-semibold text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              Tiếp tục
            </button>
          </form>

            <div className="flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-sm text-gray-500">
              Hoặc
            </span>
            <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <div className="w-full flex justify-center">
            <GoogleSignInButton 
              text="Đăng ký với Google" 
              onClick={handleGoogleSignIn} 
            />
            </div>

            <div className="text-sm text-center text-gray-600">
            Bạn đã có tài khoản?{" "}
            <Link href="/login" className="font-semibold text-emerald-600 hover:underline">
              Đăng nhập
            </Link>
            </div>

          {/* <p className="text-xs text-center text-gray-500">
            Bằng cách nhấp vào Tiếp tục, bạn xác nhận rằng bạn đã đọc và
            chấp nhận 
            <a href="/terms" className="text-emerald-600 hover:underline"> Điều khoản dịch vụ </a> 
            và 
            <a href="/policy" className="text-emerald-600 hover:underline"> Chính sách bảo mật</a>.
          </p> */}
        </div>
      </div>
      {/* </div> */}
    </main> 
  );
}