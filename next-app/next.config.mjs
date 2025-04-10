/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // For Next.js 13.4.19, we use exportPathMap for static site generation
  output: 'export',
  images: {
    unoptimized: true,
    domains: ['res.cloudinary.com'],
  },
  // Added for GitHub Pages compatibility
  basePath: process.env.NODE_ENV === 'production' ? '/kgangerlm.github.io' : '',
  trailingSlash: true,
  
  // This is the exportPathMap for Next.js 13.4.19
  exportPathMap: async function() {
    return {
      '/': { page: '/' },
      // Dynamic routes will be added automatically during build
    };
  },
};

export default nextConfig;
