/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"] ,
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#6366F1",
          dark: "#4338CA",
          light: "#A5B4FC"
        },
      },
      boxShadow: {
        soft: "0 8px 24px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};
