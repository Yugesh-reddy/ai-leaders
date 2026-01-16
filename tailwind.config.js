/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Defining custom blacks/grays if needed, though standard Tailwind colors might suffice
        primary: "#ffffff",
        secondary: "#a0a0a0",
        background: "#000000",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
