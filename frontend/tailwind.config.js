/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#eb8f34',
        'primary-dark': '#d17a1e',
        'primary-light': '#f5a55a',
        secondary: '#6c757d',
        dark: '#2c3e50',
        light: '#f8f9fa',
        info: '#17a2b8',
        success: '#28a745',
        warning: '#ffc107',
        danger: '#dc3545',
      },
      fontFamily: {
        'primary': ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
    screens: {
      'xl': {'max': '1200px'},
      'lg': {'max': '1080px'},
      'md-lg': {'max': '991px'},
      'md': {'max': '768px'},
      'sm': {'max': '576px'},
      'xs': {'max': '480px'},
      '2xs': {'max': '340px'},
    }
  },
  plugins: [],
}