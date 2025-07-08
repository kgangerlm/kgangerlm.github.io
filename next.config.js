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
  // No basePath or assetPrefix needed for root domain deployment
  trailingSlash: true,
};

module.exports = nextConfig;
