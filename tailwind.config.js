/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: ["./**/*.html"],
  theme: {
    extend: {
      colors: {
        customBlue: '#00202E',
        customDark: '#1F2937',
        borderBlue: '#338BD7',
      },
    },
  },
  plugins: [],
}

