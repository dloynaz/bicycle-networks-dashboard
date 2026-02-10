/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        // Main Brand Color (Sidebar/Buttons)
        'torea-bay': {
          700: '#4341c1',
          800: '#363698',
        },
        // Accent Color (Map Markers/Action items)
        'grenadier': {
          500: '#f0581f',
        },
        // Neutral Scale (Text/Borders/Backgrounds)
        'zinc': {
          50:  '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          500: '#71717a',
          950: '#09090b',
        },
        // Legacy color names for backward compatibility
        primary: '#363698',
        secondary: '#4341c1',
        accent: '#f0581f',
        neutral: '#09090b',
        background: '#fafafa',
        'sidebar-bg': '#ffffff',
      },
      spacing: {
        '8': '8px',
      },
      borderRadius: {
        'pill': '24px',
        'base': '8px',
      },
    },
  },
  plugins: [],
};