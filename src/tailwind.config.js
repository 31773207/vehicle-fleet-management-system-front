/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: '#FFD700',
        'gold-dim': 'rgba(255, 215, 0, 0.25)',
        'glass': 'rgba(0, 0, 0, 0.45)',
        'glass-light': 'rgba(255, 255, 255, 0.06)',
      },
      fontFamily: {
        'display': ['Rajdhani', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { width: '70px' },
          '100%': { width: '240px' },
        },
      },
        plugins: [require("tailwind-scrollbar")
],
    },
  },
  plugins: [],
}