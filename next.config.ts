import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ['@neondatabase/serverless'],
  images: {
    domains: ['localhost'],
  },
  // Reduce file watching frequency to prevent excessive restarts
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000, // Check for changes every second instead of continuously
        aggregateTimeout: 300, // Wait 300ms before rebuilding
      };
    }
    return config;
  },
};

// PWA configuration

const withPWAConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: true, // Disable PWA for now to prevent reloads
  buildExcludes: [/middleware-manifest\.json$/],
  cacheOnFrontEndNav: false, // Prevent cache operations on navigation
  reloadOnOnline: false, // Prevent auto-reloads when online
  disableDevLogs: true, // Disable PWA development logs
  fallbacks: {
    document: '/offline.html',
    image: "",
    audio: "",
    video: "",
    font: ""
  },
  // Use custom service worker to reduce spam
  sw: 'sw-custom.js',
  swDest: 'public/sw.js',
});

// PWA is temporarily disabled due to type compatibility issues
export default nextConfig;