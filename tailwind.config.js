/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        twitter: '#1DA1F2',
        instagram: {
          pink: '#E4405F',
          orange: '#FFDC80',
        },
      },
    },
  },
  plugins: [],
}