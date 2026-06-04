import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      screens: {
        xs: "400px", // extra-small — between 375px and sm (640px)
      },
      colors: {
        // KSQ Brand Tokens
        ksq: {
          green: "#1a4a2e",
          "green-hover": "#256038",
          "green-accent": "#3a7d52",
          gold: "#c9973a",
          "gold-hover": "#e8b85a",
          cream: "#faf7f2",
          white: "#ffffff",
          dark: "#0f2318",
          mid: "#4a6558",
          light: "#e8f0ec",
        },
        // shadcn/ui semantic tokens (mapped to KSQ palette)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        heading: ["var(--font-cormorant)", ...fontFamily.serif],
        body: ["var(--font-outfit)", ...fontFamily.sans],
        sans: ["var(--font-outfit)", ...fontFamily.sans],
        serif: ["var(--font-cormorant)", ...fontFamily.serif],
      },
      fontSize: {
        "display-xl": ["clamp(2.6rem, 6vw, 5rem)", { lineHeight: "1.1", fontWeight: "700" }],
        "display-lg": ["clamp(1.9rem, 4vw, 3rem)", { lineHeight: "1.2", fontWeight: "600" }],
        "display-md": ["clamp(1.4rem, 2.5vw, 2rem)", { lineHeight: "1.3", fontWeight: "600" }],
        "body-base": ["clamp(0.9rem, 1.5vw, 1rem)", { lineHeight: "1.7" }],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(28px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.6s ease-out forwards",
        "fade-in": "fade-in 0.4s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
