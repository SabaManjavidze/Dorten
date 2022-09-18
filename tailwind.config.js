/** @type {import('tailwindcss').Config} */
const withOpacity = (varName) => {
  return ({ opacityValue }) => {
    if (opacityValue) return `rgba(var(${varName}),${opacityValue})`;
    return `rgba(var(${varName}))`;
  };
};
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: withOpacity("--color-palette-primary"),
        secondary: withOpacity("--color-palette-secondary"),
        danger: withOpacity("--color-palette-danger"),
        disable: withOpacity("--color-palette-disable"),
      },
      textColor: {
        skin: {
          base: withOpacity("--color-text-base"),
          like: withOpacity("--color-palette-primary"),
          dislike: withOpacity("--color-palette-danger"),
          "button-accent": withOpacity("--color-palette-primary"),
          "submit-btn": withOpacity("--color-palette-light-primary"),
        },
      },
      backgroundColor: {
        skin: {
          main: withOpacity("--color-background-main"),
          "post-card": withOpacity("--color-background-secondary"),
          "input-field": withOpacity("--color-background-secondary"),
          navbar: withOpacity("--color-background-secondary"),
          secondary: withOpacity("--color-background-secondary"),
          "submit-btn": withOpacity("--color-palette-primary"),
          "attach-btn": withOpacity("--color-palette-secondary"),
        },
      },
      borderColor: {
        skin: {
          "input-field": withOpacity("--color-palette-primary"),
          button: withOpacity("--color-palette-primary"),
          "submit-btn": withOpacity("--color-palette-primary"),
          "attach-btn": withOpacity("--color-palette-secondary"),
        },
      },
      fontFamily: {
        sans: ["Virgil"],
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
