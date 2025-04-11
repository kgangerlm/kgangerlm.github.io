/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        'primary-dark': 'var(--primary-dark)',
        secondary: 'var(--secondary)',
        light: 'var(--light)',
        accent: 'var(--accent)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger: 'var(--danger)',
        'gray-light': 'var(--gray-light)',
        gray: 'var(--gray)',
        'light-blue': 'var(--light-blue)',
        'light-yellow': 'var(--light-yellow)',
      },
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
        quote: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
  // Keep the original CSS classes and don't purge them
  safelist: [
    {
      pattern: /^(container|itinerary-card|card-header|header-content|card-content|card-.+|day-.+|section-.+|activity-.+|quote-box|daily-summary|drive-info|map-container|resources-grid|resource-card|site-header|site-footer|hotsprings-.+|badge|notes-.+|tip-box|mobile-nav-.+|.*-section)/,
    },
  ],
};
