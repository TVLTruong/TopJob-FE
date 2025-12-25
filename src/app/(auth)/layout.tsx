import type { Metadata } from "next";
import "@/app/globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import DevToolbar from "@/components/common/DevToolbar";

export const metadata: Metadata = {
  title: "TopJob - Đăng nhập/Đăng ký",
  description: "Đăng nhập hoặc đăng ký tài khoản TopJob",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      {/* Layout đơn giản cho auth - không có Header/Footer */}
      <main className="min-h-screen">
        {children}
      </main>
      <DevToolbar />
    </AuthProvider>
  );
}
