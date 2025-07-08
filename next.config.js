/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  reactStrictMode: true,
  output: 'export', // Modern static export option for Next.js 14
  images: {
    unoptimized: true, // For static exports
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  // Added for GitHub Pages compatibility
  basePath: basePath,
  assetPrefix: basePath, // Critical for loading assets from the correct path
  trailingSlash: true,
};

module.exports = nextConfig;
