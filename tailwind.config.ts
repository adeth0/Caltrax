import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

// Caltrax design tokens.
// Every color below resolves to a CSS custom property (defined in
// globals.css) rather than a raw hex value, so light and dark mode are
// both first-class — not "dark mode + an afterthought .light override"
// like the previous glass system, where most component-level color
// classes were hardcoded rgba(255,255,255,...) values that only worked
// against a dark background. Never hardcode a hex value in a component —
// reference these tokens, and update the CSS variables in globals.css if
// the palette itself ever needs to change.
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: "var(--bg)",
        },
        surface: {
          DEFAULT: "var(--surface)",
          raised: "var(--surface-raised)",
        },
        border: {
          DEFAULT: "var(--border)",
          strong: "var(--border-strong)",
        },
        rule: "var(--rule)",
        brand: {
          DEFAULT: "var(--brand)",
          foreground: "var(--brand-foreground)",
        },
        // Semantic accents — meaning is fixed, never reassign
        accent: {
          info: "var(--accent-info)",
          success: "var(--accent-success)",
          warning: "var(--accent-warning)",
          danger: "var(--accent-danger)",
        },
        // Macro-specific hues (distinct from semantic accents so a chart
        // showing "carbs" never gets confused with a "warning" state)
        macro: {
          protein: "var(--macro-protein)",
          carbs: "var(--macro-carbs)",
          fat: "var(--macro-fat)",
          fibre: "var(--macro-fibre)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
        },
      },
      borderRadius: {
        card: "14px",
        pill: "999px",
        control: "10px",
      },
      fontFamily: {
        display: ["var(--font-display-family)", "system-ui", "sans-serif"],
        body: ["var(--font-body-family)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        // Flat design per the new direction — no glow/blur shadows. Kept as
        // a single functional shadow for genuinely floating elements
        // (popovers, the elevated nav FAB), not decoration.
        raised: "0 1px 2px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.10)",
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
        rise: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        rise: "rise 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
