import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          brown: {
            50: "#faf6f0",
            100: "#f3ede3",
            200: "#e6d7c4",
            300: "#d3bea1",
            400: "#bca17e",
            500: "#a3845f",
            600: "#866746",
            700: "#6a4f35",
            800: "#4f3925",
            900: "#362618",
            950: "#22160d",
          },
          green: {
            50: "#f4f7f4",
            100: "#e5ede6",
            200: "#cbddce",
            300: "#a6c4aa",
            400: "#7da683",
            500: "#5c8763",
            600: "#44694a",
            700: "#35513a",
            800: "#283e2c",
            900: "#1d2d20",
            950: "#111b13",
          },
          cream: {
            50: "#fcfbf8",
            100: "#f8f5ee",
            200: "#f1ebe0",
            300: "#e6dcce",
            400: "#d7c8b5",
            500: "#c4b19b",
          },
          accent: {
            50: "#fbf6f2",
            100: "#f6ebe3",
            200: "#eed5c5",
            300: "#e0b79e",
            400: "#cf9374",
            500: "#bd7350",
            600: "#a65839",
            700: "#864128",
          },
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "sans-serif"],
        editorial: ["var(--font-editorial)", "Newsreader", "Lora", "serif"],
      },
      letterSpacing: {
        editorial: "0.08em",
        wide: "0.15em",
      },
      boxShadow: {
        editorial: "0 2px 14px -3px rgba(34, 22, 13, 0.05), 0 4px 6px -2px rgba(34, 22, 13, 0.03)",
        "editorial-lg": "0 10px 25px -4px rgba(34, 22, 13, 0.08), 0 6px 12px -3px rgba(34, 22, 13, 0.04)",
      },
      borderRadius: {
        editorial: "3px",
      },
    },
  },
  plugins: [],
};

export default config;
