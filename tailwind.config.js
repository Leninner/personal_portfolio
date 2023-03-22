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
      keyframes: {
        upAndDown: {
          '0%, 100%': { transform: 'translateY(5px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        upAndDown: 'upAndDown 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
