/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      dropShadow: {
        '3xl': '0 45px 65px rgba(255, 255, 255, 0.8)'   
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}