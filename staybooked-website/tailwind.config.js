/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        skyLight: '#EDF5FB',
        skyAlt: '#D8ECF7',
        skyDeep: '#C5E1F2',
        logoBlue: '#6B9FD4',
        textPrimary: '#1C2B3A',
        textSecondary: '#4A6478',
        footerDark: '#1C2B3A',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        serif: ['"DM Serif Display"', 'serif'],
        baloo: ['"Baloo 2"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
