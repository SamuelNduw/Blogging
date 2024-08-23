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
      animation:{
        blob: "blob 9s infinite",
        blob2: "blob2 8s infinite",
        blob3: "blob3 7s infinite"
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.2)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.8)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
        blob2: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "20%": {
            transform: "translate(40px, -60px) scale(1.1)",
          },
          "40%": {
            transform: "translate(-30px, 30px) scale(1.4)",
          },
          "60%": {
            transform: "translate(20px, -40px) scale(0.9)",
          },
          "80%": {
            transform: "translate(-10px, 50px) scale(1.2)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
        blob3: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "50%": {
            transform: "translate(-80px, 100px) scale(1.5) rotate(15deg)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1) rotate(-15deg)",
          },
        }
      }
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

