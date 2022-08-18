/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      primary: "#9900E5",
      background: "#0f172a",
    },
    fontFamily: {
      sans: ["Inter var", "sans-serif"],
      serif: ["Inter var", "serif"],
      cursive: ["Inter var", "cursive"],
    },
  },
  darkMode: "media",
  plugins: [],
};
