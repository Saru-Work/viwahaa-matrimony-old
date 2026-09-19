import flowbitePlugin from "flowbite/plugin";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5c0f1b",
        accent: "#D4AF37",
        "background-light": "#f8f6f6",
        "background-dark": "#201214",
      },
      fontFamily: {
        tangerine: ["Tangerine"],
        cinzel: ["Cinzel"],
        Lavish: ["sans-serif"],
        CretinaBold: ["CretinaBold"],
        CretinaRegular: ["CretinaRegular"],
        DMSerifDisplay: ["DMSerifDisplay"],
        grandHotel: ["GrandHotel", "cursive"],
        workSans: ["Work Sans", "sans-serif"],
        Sacremento: ["Sacramento"],
        display: ["Manrope", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "1rem",
        xl: "1.5rem",
        full: "9999px",
      },
      animation: {
        heartbeat: "heartbeat 1.3s ease-in-out infinite",
      },
      keyframes: {
        heartbeat: {
          "0%, 100%": { transform: "scale(1)" },
          "14%": { transform: "scale(1.3)" },
          "28%": { transform: "scale(1)" },
          "42%": { transform: "scale(1.3)" },
          "70%": { transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [flowbitePlugin],
};
