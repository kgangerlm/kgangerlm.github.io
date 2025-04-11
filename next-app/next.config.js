/** @type {import('next').NextConfig} */
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
  basePath: process.env.NODE_ENV === 'production' ? '/kgangerlm.github.io' : '',
  trailingSlash: true,
};

module.exports = nextConfig;
