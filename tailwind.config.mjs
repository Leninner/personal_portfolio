/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        "yellow-primary": "#f9ef2e",
        "black-primary": "#1a1b1c",
        accent: "#2337ff",
      },
    },
  },
  plugins: [],
};
