/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line filenames/match-regex
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'yellow-primary': '#f9ef2e',
        'black-primary': '#1a1b1c',
      },
    },
  },
  plugins: [],
}
