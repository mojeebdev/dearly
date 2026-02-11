import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
      colors: {
        guardian: {
          cream: "#FFF8F0",
          warmWhite: "#FFFDF9",
          gold: "#C8956C",
          goldLight: "#E8C9A8",
          rose: "#D4707A",
          roseSoft: "#F2D1D5",
          deep: "#2C1810",
          muted: "#6B5B50",
          sage: "#A8B5A0",
        },
      },
      animation: {
        "fade-up": "fadeUp 0.8s ease-out forwards",
        "fade-in": "fadeIn 1.2s ease-out forwards",
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(200, 149, 108, 0.2)" },
          "100%": { boxShadow: "0 0 40px rgba(200, 149, 108, 0.4)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;