import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Cấu hình images cho logo Google
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  // Thêm các cấu hình khác của bạn ở đây nếu có
};

export default nextConfig;