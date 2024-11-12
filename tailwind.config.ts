import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Existing colors
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "var(--ae--primary-900)",
          foreground: "hsl(var(--primary-foreground))",
          50: "var(--ae--primary-50)",
          100: "var(--ae--primary-100)",
          200: "var(--ae--primary-200)",
          300: "var(--ae--primary-300)",
          400: "var(--ae--primary-400)",
          500: "var(--ae--primary-500)",
          600: "var(--ae--primary-600)",
          700: "var(--ae--primary-700)",
          800: "var(--ae--primary-800)",
          900: "var(--ae--primary-900)",
          950: "var(--ae--primary-950)",
        },
        secondary: {
          DEFAULT: "var(--ae--secondary-900)", 
          foreground: "hsl(var(--secondary-foreground))",
          50: "var(--ae--secondary-50)",
          100: "var(--ae--secondary-100)",
          200: "var(--ae--secondary-200)",
          300: "var(--ae--secondary-300)",
          400: "var(--ae--secondary-400)",
          500: "var(--ae--secondary-500)",
          600: "var(--ae--secondary-600)",
          700: "var(--ae--secondary-700)",
          800: "var(--ae--secondary-800)",
          900: "var(--ae--secondary-900)",
          950: "var(--ae--secondary-950)",
        },
        neutral: {
          50: "var(--ae--neutral-50)",
          100: "var(--ae--neutral-100)",
          200: "var(--ae--neutral-200)",
          300: "var(--ae--neutral-300)",
          400: "var(--ae--neutral-400)",
          500: "var(--ae--neutral-500)",
          600: "var(--ae--neutral-600)",
          700: "var(--ae--neutral-700)",
          800: "var(--ae--neutral-800)",
          900: "var(--ae--neutral-900)",
          950: "var(--ae--neutral-950)",
        },

        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "var(--ae--full-red-color)",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },

        // New colors

      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
