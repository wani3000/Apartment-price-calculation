/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      sans: ['Pretendard', 'sans-serif'],
    },
    extend: {
      colors: {
        'grey-100': '#212529',
        'grey-80': '#495057',
        'grey-70': '#868E96',
        'grey-60': '#ADB5BD',
        'grey-40': '#DEE2E6',
        'primary': '#000000',
      },
      animation: {
        'slide-left': 'slideLeft 15s linear infinite',
      },
      keyframes: {
        slideLeft: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
    },
  },
  plugins: [],
} 