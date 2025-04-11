/**
 * Theme utility for consistent color and style variables across the application
 */

export const themeColors = {
  primary: '#007bff',
  primaryDark: '#0056b3',
  secondary: '#6c757d',
  secondaryDark: '#545b62',
  success: '#28a745',
  info: '#17a2b8',
  warning: '#ffc107',
  danger: '#dc3545',
  light: '#f8f9fa',
  dark: '#343a40',
};

export const themeBreakpoints = {
  xs: '0px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  xxl: '1400px',
};

/**
 * Helper function to get a CSS variable or fallback color
 */
export const getThemeColor = (colorName: keyof typeof themeColors): string => {
  return `var(--${colorName}, ${themeColors[colorName]})`;
};

/**
 * Helper function for media queries
 */
export const media = {
  up: (breakpoint: keyof typeof themeBreakpoints) => 
    `@media (min-width: ${themeBreakpoints[breakpoint]})`,
  down: (breakpoint: keyof typeof themeBreakpoints) => 
    `@media (max-width: ${themeBreakpoints[breakpoint]})`,
};
