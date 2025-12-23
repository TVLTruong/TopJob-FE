import type { Metadata } from "next";
import "@/app/globals.css";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext"; // <-- 1. IMPORT

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
      <body className="bg-gray-50">
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