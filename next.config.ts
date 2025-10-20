import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ['@neondatabase/serverless'],
  
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Compression
  compress: true,
  
  // Reduce file watching frequency to prevent excessive restarts
  eslint: { ignoreDuringBuilds: true },
  webpack: (config) => {
    config.output = { ...config.output, globalObject: 'globalThis' };
    return config;
  },
};

export default nextConfig;