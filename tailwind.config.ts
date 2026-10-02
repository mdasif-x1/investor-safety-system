import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        "surface-elevated": "var(--surface-elevated)",
        "surface-muted": "var(--surface-muted)",
        border: "var(--border)",
        "border-subtle": "var(--border-subtle)",
        
        // Text tokens
        primary: "var(--text-primary)",
        secondary: "var(--text-secondary)",
        muted: "var(--text-muted)",
        
        // Brand & Public-Interest Tokens
        brand: {
          DEFAULT: "var(--brand-primary)",
          hover: "var(--brand-hover)",
          light: "var(--brand-light)",
        },
        accent: {
          DEFAULT: "var(--accent-saffron)",
          light: "var(--accent-saffron-light)",
        },
        
        // Semantic Risk & Evidence Status
        status: {
          success: "var(--status-success)",
          "success-bg": "var(--status-success-bg)",
          warning: "var(--status-warning)",
          "warning-bg": "var(--status-warning-bg)",
          danger: "var(--status-danger)",
          "danger-bg": "var(--status-danger-bg)",
          info: "var(--status-info)",
          "info-bg": "var(--status-info-bg)",
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)",
        card: "0 4px 6px -1px rgba(15, 23, 42, 0.04), 0 2px 4px -2px rgba(15, 23, 42, 0.04)",
        elevated: "0 10px 15px -3px rgba(15, 23, 42, 0.06), 0 4px 6px -4px rgba(15, 23, 42, 0.04)",
      },
      borderRadius: {
        DEFAULT: "0.375rem",
      }
    },
  },
  plugins: [],
};
export default config;
