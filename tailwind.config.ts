import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

// Caltrax design tokens.
// Palette, radii and blur values are the single source of truth for the
// "Apple Health / Apple Wallet" glass aesthetic. Never hardcode a hex value
// in a component — reference these tokens so the whole app stays coherent.
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Base surfaces
        base: {
          DEFAULT: "#090909", // near-black primary background
          raised: "#141414", // surface / raised panel background
          light: "#F5F6F8", // light mode background
        },
        glass: {
          DEFAULT: "rgba(255,255,255,0.08)", // card fill, dark mode
          border: "rgba(255,255,255,0.10)",
          light: "rgba(255,255,255,0.55)", // card fill, light mode
          lightBorder: "rgba(20,20,25,0.08)",
        },
        // Semantic accents — meaning is fixed, never reassign
        accent: {
          info: "#0A84FF", // blue — information
          success: "#30D158", // green — success / on target
          warning: "#FF9F0A", // orange — warning / approaching limit
          danger: "#FF453A", // red — exceeded target
        },
        // Macro-specific hues (distinct from semantic accents so a chart
        // showing "carbs" never gets confused with a "warning" state)
        macro: {
          protein: "#60A5FA",
          carbs: "#FBBF24",
          fat: "#F472B6",
          fibre: "#4ADE80",
        },
        text: {
          primary: "rgba(255,255,255,0.92)",
          secondary: "rgba(255,255,255,0.60)",
          tertiary: "rgba(255,255,255,0.38)",
        },
      },
      borderRadius: {
        card: "22px",
        pill: "999px",
        control: "14px",
      },
      backdropBlur: {
        glass: "24px",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.09)",
        "glass-sm": "0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.07)",
        "glow-info": "0 0 0 1px rgba(10,132,255,0.4), 0 0 24px rgba(10,132,255,0.35)",
        "glow-sm": "0 0 16px rgba(255,255,255,0.12)",
      },
      backdropSaturate: {
        glass: "180%",
      },
      transitionTimingFunction: {
        apple: "cubic-bezier(0.22, 1, 0.36, 1)",
        "apple-spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
      keyframes: {
        "ambient-drift": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(3%, -4%) scale(1.05)" },
          "66%": { transform: "translate(-2%, 3%) scale(0.98)" },
        },
      },
      animation: {
        "ambient-drift": "ambient-drift 24s ease-in-out infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
