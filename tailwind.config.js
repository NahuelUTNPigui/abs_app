/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  darkMode: 'class',
  theme: {
    extend: {}
  },
  daisyui: {
    themes: ["light", "dark", "cupcake"]

  },
  plugins: [require('daisyui'),require("@tailwindcss/typography")]
};
