import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext"; // <-- 1. IMPORT

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
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
      <body className={`${inter.className} bg-gray-50`}>
        <AuthProvider> {/* <-- 2. BỌC Ở NGOÀI */}
          <Header />
          <main className="mt-0">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}