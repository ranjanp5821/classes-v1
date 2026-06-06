/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Bricolage Grotesque'", "sans-serif"],
        sans: ["'DM Sans'", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 4px 0 rgba(0,0,0,0.06), 0 1px 2px 0 rgba(0,0,0,0.04)",
        "card-hover": "0 8px 32px -4px rgba(0,0,0,0.10), 0 2px 8px -2px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};
