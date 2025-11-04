/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ee',
          100: '#fdecd3',
          200: '#fad6a5',
          300: '#f7ba6d',
          400: '#f39333',
          500: '#f0760b',
          600: '#e15a06',
          700: '#ba4208',
          800: '#94350e',
          900: '#772d0f',
          950: '#401405',
        },
      },
    },
  },
  plugins: [],
}
