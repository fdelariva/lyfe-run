/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: '#E8FF3A',
        alert: '#FF4D00',
        dark: '#0A0A0A',
      },
      fontFamily: {
        heading: ['Bebas Neue', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
