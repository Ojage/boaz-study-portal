/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Nunito Sans"', "system-ui", '"Segoe UI"', "Roboto", "sans-serif"],
        heading: ['"Nunito Sans"', "system-ui", '"Segoe UI"', "Roboto", "sans-serif"],
      },
      fontSize: {
        header: ["32px", { lineHeight: "1", letterSpacing: "-0.11px" }],
        body: ["14px", { lineHeight: "1", letterSpacing: "0px" }],
        label: ["12px", { lineHeight: "1", letterSpacing: "0px" }],
      },
      colors: {
        bg: "var(--bg)",
        card: "var(--card)",
        cardBorder: "var(--card-border)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        tertiary: "var(--tertiary)",
        text: "var(--text)",
        muted: "var(--text-muted)",
        border: "var(--border)",
      },
      boxShadow: {
        soft: "var(--shadow)",
        card: "var(--card-shadow)",
      },
    },
  },
  plugins: [],
};
