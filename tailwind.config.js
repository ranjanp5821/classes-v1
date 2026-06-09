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
        serif: ["'Fraunces'", "Georgia", "serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      colors: {
        ink: {
          DEFAULT: "#0E0E10",
          2: "#33343A",
          3: "#6A6C75",
          4: "#A6A8B0",
        },
        page: "#FFFFFF",
        paper: "#FAFAFB",
        mist: "#F1F2F5",
        line: {
          DEFAULT: "#E7E8EC",
          2: "#D7D9E0",
        },
        panel: {
          DEFAULT: "#141418",
          2: "#1D1E24",
        },
        paint: {
          magenta: "#D6196F",
          mint: "#13B5A0",
          azure: "#2563EB",
          mauve: "#8E6FC4",
          violet: "#6D4AE0",
          grass: "#1CA363",
          gold: "#DFA21F",
          mandarin: "#F26A38",
        },
      },
      boxShadow: {
        card: "0 1px 4px 0 rgba(0,0,0,0.06), 0 1px 2px 0 rgba(0,0,0,0.04)",
        "card-hover": "0 8px 32px -4px rgba(0,0,0,0.10), 0 2px 8px -2px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};
