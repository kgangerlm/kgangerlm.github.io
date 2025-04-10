/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  // For Next.js 12, use these settings for static export
  images: {
    loader: 'imgix', 
    path: '',
    disableStaticImages: true,
    domains: ['res.cloudinary.com'],
  },
  // Added for GitHub Pages compatibility
  basePath: process.env.NODE_ENV === 'production' ? '/kgangerlm.github.io' : '',
  trailingSlash: true,
  
  // Export configuration for Next.js 12
  exportPathMap: async function() {
    return {
      '/': { page: '/' },
      // Dynamic routes will need to be added explicitly with getStaticPaths
    };
  },
};
