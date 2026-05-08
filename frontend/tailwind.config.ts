import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1b1b1f",
        panel: "#ffffff",
        soft: "#f3f4f8",
        accent: "#7c3aed",
        accentDark: "#5b21b6",
      },
      boxShadow: {
        soft: "0 12px 30px rgba(16, 24, 40, 0.10)",
      },
    },
  },
  plugins: [],
};

export default config;
