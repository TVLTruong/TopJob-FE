// app/layout.tsx
'use client';

import { Inter } from "next/font/google";
import "@/app/globals.css";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Sidebar from '@/app/components/companyProfile/Sidebar';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ["latin"] });

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  const isRecruiter = user?.role === 'EMPLOYER';
  const isCandidate = user?.role === 'CANDIDATE';
  
  // Pages that should not have sidebar (profile completion flow)
  const isProfileCompletionPage = pathname?.includes('/completeProfile') || pathname?.includes('/profile-completion-success');

  // Layout cho CANDIDATE: Header + Content + Footer
  if (isCandidate) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    );
  }

  // Layout cho RECRUITER: Sidebar + Content (except profile completion pages)
  if (isRecruiter && !isProfileCompletionPage) {
    return (
      <div className="flex max-w-7xl mx-auto">
        <Sidebar />
        <main className="flex-1">
          {children}
        </main>
      </div>
    );
  }

  // Profile completion pages or chưa login: chỉ content
  return <div className="w-full">{children}</div>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.className} bg-gray-50`}>
        <AuthProvider>
          <LayoutContent>{children}</LayoutContent>
        </AuthProvider>
      </body>
    </html>
  );
}