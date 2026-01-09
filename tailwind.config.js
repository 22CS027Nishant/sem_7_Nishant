/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F3F4F6',
        'dark-background': '#1F2937',
      }
    }
  },
  darkMode: 'class'
}