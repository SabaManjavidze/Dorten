/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#a315ea",
        secondary: "#1f2a44",
        background: "#0f172a",
      },
      fontFamily: {
        sans: ["Virgil"],
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
