/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f4ff",
          100: "#dbe4fe",
          500: "#4f46e5",
          600: "#4338ca",
          700: "#3730a3",
          900: "#1e1b4b"
        },
        surface: {
          800: "#1e293b",
          900: "#0f172a",
          950: "#090d16"
        }
      }
    }
  },
  plugins: []
};
