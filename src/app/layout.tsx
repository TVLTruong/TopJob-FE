import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TopJob - Job Portal',
  description: 'Find and post jobs on TopJob',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
