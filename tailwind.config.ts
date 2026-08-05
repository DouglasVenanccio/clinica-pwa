import type { Config } from "tailwindcss";

/**
 * Configuracao do Tailwind CSS com design tokens do projeto.
 * Cores, fontes e espacamento baseados na especificacao tecnica.
 */
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Paleta de cores do projeto
      colors: {
        // Cores principais
        creme: {
          DEFAULT: "#F5F0E8",
          50: "#FDFCFA",
          100: "#FAF8F4",
          200: "#F5F0E8",
          300: "#E8DFD0",
          400: "#D4C9B5",
          500: "#C0B39A",
        },
        dourado: {
          DEFAULT: "#C9A96E",
          50: "#F5F0E3",
          100: "#EDE4CC",
          200: "#E0D0A8",
          300: "#D4BC84",
          400: "#C9A96E",
          500: "#B8944D",
          600: "#A8893E",
          700: "#8A6F32",
          800: "#6B5627",
          900: "#4D3D1B",
        },
        marrom: {
          DEFAULT: "#5C4A3A",
          50: "#F0ECE8",
          100: "#D9D0C7",
          200: "#B3A190",
          300: "#8D7260",
          400: "#5C4A3A",
          500: "#4A3B2E",
          600: "#382C23",
          700: "#261D17",
          800: "#140F0C",
          900: "#0A0705",
        },
        sidebar: {
          DEFAULT: "#2C2C2C",
          50: "#F5F5F5",
          100: "#E0E0E0",
          200: "#BDBDBD",
          300: "#9E9E9E",
          400: "#757575",
          500: "#616161",
          600: "#424242",
          700: "#2C2C2C",
          800: "#1E1E1E",
          900: "#111111",
        },
        // Cores de status
        sucesso: "#4CAF50",
        alerta: "#FF9800",
        erro: "#E53935",
        info: "#2196F3",
      },

      // Fontes do projeto
      fontFamily: {
        titulo: ["Playfair Display", "serif"],
        corpo: ["Inter", "sans-serif"],
      },

      // Tamanhos de fonte
      fontSize: {
        h1: ["3rem", { lineHeight: "1.2", fontWeight: "700" }],
        h2: ["2.25rem", { lineHeight: "1.3", fontWeight: "600" }],
        h3: ["1.5rem", { lineHeight: "1.4", fontWeight: "600" }],
        h4: ["1.25rem", { lineHeight: "1.5", fontWeight: "600" }],
        corpo: ["1rem", { lineHeight: "1.6", fontWeight: "400" }],
        pequeno: ["0.875rem", { lineHeight: "1.5", fontWeight: "400" }],
        mini: ["0.75rem", { lineHeight: "1.4", fontWeight: "400" }],
      },

      // Espacamento
      spacing: {
        "1": "4px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "5": "20px",
        "6": "24px",
        "8": "32px",
        "10": "40px",
        "12": "48px",
        "16": "64px",
      },

      // Raios de borda
      borderRadius: {
        card: "12px",
        button: "8px",
        input: "8px",
        badge: "16px",
      },

      // Sombras
      boxShadow: {
        leve: "0 1px 3px rgba(0,0,0,0.1)",
        media: "0 4px 6px rgba(0,0,0,0.1)",
        forte: "0 10px 15px rgba(0,0,0,0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
