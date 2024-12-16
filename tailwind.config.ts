import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
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
          "50": "hsl(var(--ae--primary-50))",
          "100": "hsl(var(--ae--primary-100))",
          "200": "hsl(var(--ae--primary-200))",
          "300": "hsl(var(--ae--primary-300))",
          "400": "hsl(var(--ae--primary-400))",
          "500": "hsl(var(--ae--primary-500))",
          "600": "hsl(var(--ae--primary-600))",
          "700": "hsl(var(--ae--primary-700))",
          "800": "hsl(var(--ae--primary-800))",
          "900": "hsl(var(--ae--primary-900))",
          "950": "hsl(var(--ae--primary-950))",
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          "50": "hsl(var(--ae--secondary-50))",
          "100": "hsl(var(--ae--secondary-100))",
          "200": "hsl(var(--ae--secondary-200))",
          "300": "hsl(var(--ae--secondary-300))",
          "400": "hsl(var(--ae--secondary-400))",
          "500": "hsl(var(--ae--secondary-500))",
          "600": "hsl(var(--ae--secondary-600))",
          "700": "hsl(var(--ae--secondary-700))",
          "800": "hsl(var(--ae--secondary-800))",
          "900": "hsl(var(--ae--secondary-900))",
          "950": "hsl(var(--ae--secondary-950))",
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        neutral: {
          "50": "hsl(var(--ae--neutral-50))",
          "100": "hsl(var(--ae--neutral-100))",
          "200": "hsl(var(--ae--neutral-200))",
          "300": "hsl(var(--ae--neutral-300))",
          "400": "hsl(var(--ae--neutral-400))",
          "500": "hsl(var(--ae--neutral-500))",
          "600": "hsl(var(--ae--neutral-600))",
          "700": "hsl(var(--ae--neutral-700))",
          "800": "hsl(var(--ae--neutral-800))",
          "900": "hsl(var(--ae--neutral-900))",
          "950": "hsl(var(--ae--neutral-950))",
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
          DEFAULT: "hsl(var(--ae--full-red-color))",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
