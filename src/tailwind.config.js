/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
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
      colors: {
        alert: 'var(--QLD-alert)',
        altBackground: 'var(--QLD-color-alt-background)',
        altBackgroundShade: 'var(--QLD-color-alt-background-shade)',
        altBorder: 'var(--QLD-color-alt-border)',
        altButton: 'var(--QLD-color-alt-button)',
        altButtonHover: 'var(--QLD-color-alt-button-hover)',
        background: 'var(--QLD-color-background)',
        backgroundShade: 'var(--QLD-color-background-shade)',
        border: 'var(--QLD-color-border)',
        brand: "hsl(var(--brand))",
        button: 'var(--QLD-color-button)',
        buttonHover: 'var(--QLD-color-button-hover)',
        buttonText: 'var(--QLD-color-button-text)',
        darkAltButton: 'var(--QLD-color-dark-alt-button)',
        darkbackground: 'var(--QLD-color-dark-background)',
        designAccent: 'var(--QLD-color-designAccent)',
        error: 'var(--QLD-error)',
        focus: 'var(--QLD-color-focus)',
        foreground: "hsl(var(--foreground))",
        heading: 'var(--QLD-color-heading)',
        hoverUnderline: 'var(--QLD-color-hover-underline)',
        hoverVisitedUnderline: 'var(--QLD-color-hover-visited-underline)',
        information: 'var(--QLD-information)',
        input: "hsl(var(--input))",
        link: 'var(--QLD-color-link)',
        linkVisited: 'var(--QLD-color-link-visited)',
        ring: "hsl(var(--ring))",
        siteTitle: 'var(--QLD-color-siteTitle)',
        success: 'var(--QLD-success)',
        text: 'var(--QLD-color-text)',
        textMuted: 'var(--QLD-color-text-muted)',
        underline: 'var(--QLD-color-underline)',
        visitedUnderline: 'var(--QLD-color-visited-underline)',
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
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        sans: ["Noto Sans", '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'],
      },
      fontSize: {
        'xs': '.6rem',
        'sm': '.8rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.3rem',
        '3xl': '1.5rem',
      },
      fontweight: {
        "light": "300",
        "normal": "400",
        "semibold": "600",
        "bold": "700",
      },
      transitionTimingFunction: {
        'custom-ease': 'cubic-bezier(0.87, 0, 0.13, 1)',
      },
      }
    },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};