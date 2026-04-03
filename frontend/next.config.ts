import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      {
        protocol: 'https',
        hostname: 'media.licdn.com',
      },
      {
        protocol: 'https',
        hostname: 'logo.clearbit.com',
      }
    ],
  },
  async redirects() {
    return [
      {
        source: '/b-ems',
        destination: 'http://localhost:3001',
        permanent: false,
      },
      {
         source: '/b-ems/:path*',
         destination: 'http://localhost:3001/:path*',
         permanent: false,
      }
    ];
  },
};

// reload
export default nextConfig;
