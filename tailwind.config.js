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
          50:  '#eff4fe',
          100: '#e2eafd',
          200: '#cad7fb',
          300: '#a8bdf6',
          400: '#8898f0',
          500: '#6c70e8',
          600: '#5950bb',
          700: '#4341c1',
          800: '#363698',
          900: '#33347c',
          950: '#1c1e48',
        },
        // Accent Color (Map Markers/Action items)
        'grenadier': {
          50:  '#ffe5ce',
          100: '#f6e0d7',
          200: '#facccc',
          300: '#f7a97a',
          400: '#f37544',
          500: '#f0581f',
          600: '#dc3e15',
          700: '#bb2d14',
          800: '#ba2d14',
          900: '#942618',
          950: '#692116',
        },
        // Neutral Scale (Text/Borders/Backgrounds) — matches Tailwind Zinc
        'zinc': {
          50:  '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
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