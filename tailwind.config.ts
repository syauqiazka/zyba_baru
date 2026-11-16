import type { Config } from "tailwindcss";

// Token resmi Palet Botani Segar (Habitdo Botanical Sanctuary) sesuai konfirmasi user
const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Kanvas Segar Botani
        cream: "#F5F8F5",
        "canvas-botanical": "#F5F8F5",

        // Teks Charcoal Jernih (Bebas kusam/lumpur)
        "brown-900": "#1B241E",
        "brown-700": "#526056",
        charcoal: {
          950: "#111813",
          900: "#1B241E",
          800: "#2D3830",
          700: "#526056",
          600: "#708075",
          400: "#98A89D",
          200: "#D3DCD5",
          100: "#E9EFEA",
          50: "#F5F8F5",
        },

        // Hijau Botani Primer (Habitdo Active Pill, CTA Utama, Checklist)
        botanical: {
          700: "#28583B",
          600: "#346B48",
          500: "#3E7B54",
          400: "#58986F",
          300: "#80B693",
          200: "#B8D9C3",
          100: "#EAF4EC",
          50: "#F4F9F5",
        },
        "green-500": "#3E7B54",
        "green-600": "#346B48",
        "green-100": "#EAF4EC",

        // Aksen Peach / Terracotta Lembut (Kehangatan, Mood, Sorotan Sekunder)
        peach: {
          600: "#D96C4D",
          500: "#F28C6E",
          400: "#F5A38B",
          200: "#FAD3C7",
          100: "#FDF1EB",
          50: "#FEF8F5",
        },
        "orange-500": "#F28C6E",
        "orange-600": "#D96C4D",
        "orange-100": "#FDF1EB",

        // Kartu Pastel Sejuk
        pastel: {
          mint: "#EAF4EC",
          mintBorder: "#C8E4CD",
          peach: "#FDF1EB",
          peachBorder: "#F9D5C5",
          sky: "#EDF4F8",
          skyBorder: "#CDE0EC",
          butter: "#FBF6EA",
          butterBorder: "#F2E4BE",
          lavender: "#F3EFF8",
          lavenderBorder: "#DDD2EA",
        },

        // Token Emosi
        mood: {
          depressed: "#A99BE0",
          sad: "#F28C6E",
          neutral: "#708075",
          happy: "#E8C24A",
          overjoyed: "#3E7B54",
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
        serif: ["var(--font-manrope)", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
