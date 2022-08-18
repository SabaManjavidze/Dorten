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
        background: "#0f172a",
      },
      fontFamily: {
        sans: ["Proxima Nova", "cursive"],
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
