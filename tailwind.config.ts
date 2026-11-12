import type { Config } from "tailwindcss";

// Token terkunci dari DESIGN.md & PALETTE_LOCK.md
const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F7F2E7",
        "brown-900": "#3B2A20",
        "brown-700": "#5A4636",
        "green-500": "#8FAE5D",
        "green-100": "#E4EED2",
        "orange-500": "#F2884B",
        "orange-100": "#FCE3D3",
        mood: {
          depressed: "#A99BE0",
          sad: "#EE8A5E",
          neutral: "#6B5645",
          happy: "#E8C24A",
          overjoyed: "#8FAE5D",
        },
        danger: "#D9534F",
      },
      borderRadius: {
        dock: "28px",
        "card-anchor": "24px",
        "card-content": "20px",
        subcard: "16px",
        input: "12px",
        badge: "8px",
        pill: "9999px",
      },
      fontFamily: {
        display: ["var(--font-manrope)", "sans-serif"],
        body: ["var(--font-dm-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;

