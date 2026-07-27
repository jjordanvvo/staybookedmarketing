/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Matte cream / rich black / textured warm-white palette
        skyLight: '#F0EBE0',      // matte cream (primary background)
        skyAlt: '#F7F4EE',        // soft warm white (secondary surface)
        skyDeep: '#FBFAF6',       // elevated shiny white
        logoBlue: '#141414',      // rich black (accents / bold elements)
        textPrimary: '#141414',   // rich black
        textSecondary: '#3A3A3A', // soft charcoal
        footerDark: '#141414',    // near black
        border: '#C9C2B4',        // warm mid grey
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        serif: ['"DM Serif Display"', 'serif'],
        baloo: ['"Baloo 2"', 'sans-serif'],
        display: ['"Archivo"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
