/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx}", // Include all component files
    "./app/**/*.{js,ts,jsx,tsx}", // Include all page files
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5c0087",
        secondary: "#ffc11e",
      },
    },
    colors: {
      primary: "#5c0087",
      secondary: "#ffc11e",
    },
  },
};
