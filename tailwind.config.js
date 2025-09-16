/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],

  theme: {
    extend: {
      colors: {
        primary: "#e5aabc", // pink
        secondary: "#878787", // grey
        third: "#9fd6dd", // blue
        fourth: "#dec202", // gold
        black: "#222222", // Black
      },
      keyframes: {
        "float-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "float-slower": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-15px)" },
        },
        "float-slowest": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
      animation: {
        "float-slow": "float-slow 8s ease-in-out infinite",
        "float-slower": "float-slower 10s ease-in-out infinite",
        "float-slowest": "float-slowest 12s ease-in-out infinite",
      },
      fontFamily: {
        figtree: ["var(--font-figtree)"],
        playfair: ["var(--font-playfair)"],
      },
      typography: {
        button: {
          DEFAULT: {
            fontFamily: "var(--font-figtree)",
            fontSize: "1rem",
            fontWeight: "500",
            lineHeight: "1.5",
            letterSpacing: "0.025em",
          },
          sm: {
            fontSize: "0.875rem",
            lineHeight: "1.25",
          },
          lg: {
            fontSize: "1.125rem",
            lineHeight: "1.75",
          },
        },
      },
    },
  },
};
