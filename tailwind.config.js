/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gliss-red': '#FF0000', // You can adjust this to match your exact GlissColors.Red
      },
    },
  },
  plugins: [],
}