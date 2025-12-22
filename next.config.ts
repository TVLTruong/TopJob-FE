import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Cấu hình images cho logo Google và Cloudinary
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  // Thêm các cấu hình khác của bạn ở đây nếu có
};

export default nextConfig;