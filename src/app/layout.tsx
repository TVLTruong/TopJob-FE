import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TopJob",
  description: "Dự án tìm việc làm",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      {/* CHUYỂN MÀU NỀN RA ĐÂY: 
        Áp dụng màu nền chung và font chữ cho toàn bộ trang 
      */}
      <body className={`${inter.className} bg-gray-50`}>
        
        <Header />
        
        <main> 
          {children}
        </main>

        <Footer />

      </body>
    </html>
  );
}