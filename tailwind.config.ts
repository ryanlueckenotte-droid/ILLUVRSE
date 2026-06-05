import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#080b12",
        panel: "#111827",
        line: "#273142",
        violet: "#8b5cf6",
        mint: "#42f58d"
      },
      boxShadow: {
        glow: "0 0 32px rgba(139, 92, 246, 0.22)"
      }
    }
  },
  plugins: []
};

export default config;
