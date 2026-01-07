// app/layout.tsx
'use client';

import "@/app/globals.css";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { EmployerProfileProvider } from "@/contexts/EmployerProfileContext";
import Sidebar from '@/app/components/companyProfile/Sidebar';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import DevToolbar from '@/components/common/DevToolbar';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading, mockEmployer } = useAuth();
  const pathname = usePathname();
  
  // Check if viewing company profile page
  const isViewingCompanyProfile = pathname?.includes('/companyProfilePage');
  
  // 🔥 DEV MODE: Auto mock employer role if not set (only once)
  // BUT DON'T auto-mock when guest is viewing company profile
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && !isLoading && !user) {
      // Kiểm tra xem đã có token trong localStorage chưa
      const hasToken = localStorage.getItem('accessToken');
      // Don't auto-mock if guest is viewing company profile
      if (!hasToken && !isViewingCompanyProfile) {
        console.log('🔥 DEV MODE: Auto mocking employer role');
        mockEmployer();
      }
    }
  }, [isLoading, isViewingCompanyProfile]); // Chỉ chạy khi isLoading thay đổi
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  const isRecruiter = user?.role === 'employer';
  const isCandidate = user?.role === 'candidate';
  const isGuest = !user;
  
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

  // Layout cho GUEST viewing company profile: Header + Content + Footer (like candidate)
  if (isGuest && isViewingCompanyProfile) {
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
      <EmployerProfileProvider>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </EmployerProfileProvider>
    );
  }

  // Profile completion pages or other guest pages: chỉ content
  return <div className="w-full">{children}</div>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <LayoutContent>{children}</LayoutContent>
      <DevToolbar />
    </AuthProvider>
  );
}