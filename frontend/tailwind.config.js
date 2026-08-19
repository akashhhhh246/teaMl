/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        tea: {
          50: '#f4f9f6',
          100: '#e5f2ec',
          200: '#cbe4d7',
          300: '#a3ceb9',
          400: '#73b295',
          500: '#4e9676',
          600: '#3a7a5e',
          700: '#2f614c',
          800: '#274e3e',
          900: '#1e3d31',
          950: '#0f241c',
        },
        matcha: {
          light: '#a3e635',
          DEFAULT: '#65a30d',
          dark: '#3f6212',
          deep: '#1a2e05'
        },
        amberGold: {
          light: '#fde68a',
          DEFAULT: '#d97706',
          dark: '#b45309',
        },
        camellia: {
          light: '#fda4af',
          DEFAULT: '#f43f5e',
          dark: '#be123c',
        },
        obsidian: {
          900: '#0b0f12',
          800: '#111827',
          700: '#1f2937',
          600: '#374151'
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
