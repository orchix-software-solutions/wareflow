import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1A4A8F",
          50: "#EEF3FB",
          100: "#D9E5F5",
          200: "#ACCCE8",
          300: "#78AEDB",
          400: "#4588CB",
          500: "#2568B8",
          600: "#1A4A8F",
          700: "#112E66",
          800: "#0A1E46",
          900: "#081632",
          950: "#040D1F",
        },
        charcoal: {
          DEFAULT: "#0f172a",
          100: "#1e293b",
          200: "#334155",
          300: "#475569",
          400: "#64748b",
        },
        warm: {
          white: "#ffffff",
          muted: "#64748b",
        },
        sidebar: {
          bg: "#081632",
          hover: "#0D1E42",
          active: "#1A2F55",
          border: "#1A2B4A",
          text: "#F1F5F9",
          "text-muted": "#94A3B8",
          accent: "#1A4A8F",
          "accent-dark": "#112E66",
        },
      },
      fontFamily: {
        sans: ["var(--font-bricolage)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
