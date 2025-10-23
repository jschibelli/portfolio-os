/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Enhanced contrast colors for better accessibility
        slate: {
          850: '#1e293b',
        },
      },
    },
  },
  plugins: [],
}
