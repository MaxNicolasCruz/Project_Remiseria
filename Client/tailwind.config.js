/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
    colors:{
      yellowPrimary: '#f1f100'
    }},
  },
  plugins: [
    require('tailwindcss-animated')
  ],
}

