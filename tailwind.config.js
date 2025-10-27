// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Core brand palette (white / blue / yellow + supporting accents)
        primary: {
          DEFAULT: '#0b63d6', // strong blue
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#0b63d6',
          600: '#0a4eb0',
          700: '#083d8a',
        },
        accent: {
          DEFAULT: '#FFD166', // bright warm yellow
          50: '#fff7e6',
          100: '#fff3d1',
          200: '#ffe8a8',
          300: '#ffd166',
          400: '#ffbf3b',
          500: '#f2a900',
        },
        cyan: {
          DEFAULT: '#06b6d4',
          100: '#ecfeff',
          200: '#cffafe',
          300: '#a5f3fc',
          400: '#67e8f9',
          500: '#06b6d4'
        },
        turquoise: {
          DEFAULT: '#2dd4bf'
        },
        pastelOrange: {
          DEFAULT: '#ffb085',
          50: '#fff6ef'
        },
        neutralGray: {
          50: '#FAFAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280'
        }
      },
      boxShadow: {
        "soft-lg": "0 10px 30px rgba(11,99,214,0.08), 0 4px 12px rgba(2,6,23,0.04)"
      },
      borderRadius: {
        xl: '1rem'
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/line-clamp')
  ]
}
