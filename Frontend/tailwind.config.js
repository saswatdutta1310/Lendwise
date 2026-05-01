/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* === Peaceful Financial Sanctuary — Stitch Design Tokens === */
        surface: {
          DEFAULT: "#f9faf5",
          dim: "#d9dad6",
          bright: "#f9faf5",
          container: {
            DEFAULT: "#edeeea",
            low: "#f3f4f0",
            high: "#e7e9e4",
            highest: "#e2e3df",
            lowest: "#ffffff",
          },
          tint: "#3a684d",
          variant: "#e2e3df",
        },
        primary: {
          DEFAULT: "#37654b",
          container: "#507e62",
          fixed: { DEFAULT: "#bceecc", dim: "#a0d2b1" },
        },
        secondary: {
          DEFAULT: "#5f5e5b",
          container: "#e5e2dd",
          fixed: { DEFAULT: "#e5e2dd", dim: "#c8c6c2" },
        },
        tertiary: {
          DEFAULT: "#3b5e84",
          container: "#54779e",
          fixed: { DEFAULT: "#d1e4ff", dim: "#a6c9f5" },
        },
        error: {
          DEFAULT: "#ba1a1a",
          container: "#ffdad6",
        },
        outline: { DEFAULT: "#717972", variant: "#c1c9c0" },
        "on-surface": { DEFAULT: "#1a1c1a", variant: "#414943" },
        "on-primary": { DEFAULT: "#ffffff", container: "#f6fff5" },
        "on-secondary": { DEFAULT: "#ffffff", container: "#656461" },
        "on-tertiary": { DEFAULT: "#ffffff", container: "#fdfcff" },
        "on-error": { DEFAULT: "#ffffff", container: "#93000a" },
        "on-background": "#1a1c1a",
        background: "#f9faf5",
        "inverse-surface": "#2e312e",
        "inverse-on-surface": "#f0f1ed",
        "inverse-primary": "#a0d2b1",
        /* Warm accent extras */
        oat: "#F8F5F0",
        sage: "#5C8B6E",
        peach: "#FFB5A7",
        slate: "#7B9EC7",
      },
      borderRadius: {
        DEFAULT: "1rem",
        lg: "2rem",
        xl: "3rem",
        "2xl": "2rem",
        full: "9999px",
      },
      spacing: {
        gutter: "16px",
        unit: "6px",
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "40px",
        "container-max": "1200px",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        h1: ["28px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" }],
        h2: ["22px", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" }],
        h3: ["18px", { lineHeight: "1.4", fontWeight: "600" }],
        "body-lg": ["15px", { lineHeight: "1.6", fontWeight: "400" }],
        "body-md": ["14px", { lineHeight: "1.6", fontWeight: "400" }],
        "label-caps": ["11px", { lineHeight: "1.2", letterSpacing: "0.05em", fontWeight: "700" }],
      },
      boxShadow: {
        glass: "0 20px 50px rgba(55, 101, 75, 0.05)",
        "glass-hover": "0 25px 60px rgba(55, 101, 75, 0.1)",
        ambient: "0 30px 60px rgba(55, 101, 75, 0.08)",
        sage: "0 0 20px rgba(55, 101, 75, 0.4)",
        "sage-lg": "0 0 30px rgba(55, 101, 75, 0.6)",
      },
      backdropBlur: {
        glass: "16px",
        "glass-lg": "24px",
      },
      animation: {
        "flow-dot": "flowDot 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "pulse-soft": "pulseSoft 4s ease-in-out infinite",
        "fade-up": "fadeUp 0.6s ease-out forwards",
      },
      keyframes: {
        flowDot: {
          "0%": { offsetDistance: "0%" },
          "100%": { offsetDistance: "100%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
}
