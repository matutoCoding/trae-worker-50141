/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        forest: {
          50: "#f0f6ef",
          100: "#dbeed8",
          200: "#b8ddb2",
          300: "#8bc582",
          400: "#5ca652",
          500: "#3d8a33",
          600: "#2D5A27",
          700: "#264921",
          800: "#203b1d",
          900: "#1b3119",
        },
        earth: {
          50: "#fbf8f1",
          100: "#f4ecd8",
          200: "#e8d6af",
          300: "#d9bb7e",
          400: "#cb9e54",
          500: "#c0873d",
          600: "#8B6914",
          700: "#745010",
          800: "#5f4012",
          900: "#4f3613",
        },
        warm: {
          50: "#fef7ee",
          100: "#fcecd8",
          200: "#f8d4b0",
          300: "#f3b67e",
          400: "#ed8f4b",
          500: "#E8833A",
          600: "#d96a1a",
          700: "#b45216",
          800: "#904219",
          900: "#753817",
        },
        cream: {
          50: "#fdfbf6",
          100: "#FAF7F0",
          200: "#F5F2EB",
          300: "#ece6d8",
          400: "#ddd3bc",
        },
      },
      fontFamily: {
        serif: ['"Source Han Serif SC"', '"Noto Serif SC"', 'Georgia', 'serif'],
        sans: ['"Source Han Sans SC"', '"Noto Sans SC"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      boxShadow: {
        'card': '0 2px 8px rgba(45, 90, 39, 0.06), 0 1px 3px rgba(45, 90, 39, 0.04)',
        'card-hover': '0 8px 24px rgba(45, 90, 39, 0.10), 0 4px 8px rgba(45, 90, 39, 0.06)',
        'inner-soft': 'inset 0 2px 4px rgba(0, 0, 0, 0.03)',
      },
    },
  },
  plugins: [],
};
