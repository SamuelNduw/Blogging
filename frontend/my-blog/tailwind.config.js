/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter':['inter'],
        'archivo':['archivo'],
        'source-sans-3': ['source sans 3']
      },
    },
    screens: {
      'xs':'320px',
      'sm':'576px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
      },
  plugins: [],
}

