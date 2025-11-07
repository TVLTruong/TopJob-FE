import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Sidebar from '@/app/components/companyProfile/Sidebar';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TopJob",
  description: "Dự án tìm việc làm",
};

export default function CompanyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.className} bg-gray-50`}>
        <AuthProvider>
          <div className="flex max-w-7xl mx-auto">
            <Sidebar />
            <main className="flex-1">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}