/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#29cb69",
      },
      aspectRatio: {
        '16/9': '16 / 9',
      },
    },
  },
  

  plugins: [],
  
};

