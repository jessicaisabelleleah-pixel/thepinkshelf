/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#4A3B52",
        blush: "#FFF6FA",
        rose: "#FF8FAB",
        dusty: "#F6DCE8",
        lilac: "#D8C7FF",
        mint: "#BFF0DC",
        butter: "#FFE9A8",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        accent: ["var(--font-accent)", "cursive"],
      },
      borderRadius: {
        blob: "42% 58% 61% 39% / 45% 41% 59% 55%",
      },
    },
  },
  plugins: [],
};
