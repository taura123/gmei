import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.gramedia.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.gramedia.com',
      },
      {
        protocol: 'https',
        hostname: '**.gramedia.com',
      },
      {
        protocol: 'https',
        hostname: '**.gramedia.id',
      },
      {
        protocol: 'https',
        hostname: 'siplahgramedia.id',
      },
      {
        protocol: 'https',
        hostname: '**.siplahgramedia.id',
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  compress: true, // Enable gzip compression
};

export default nextConfig;
