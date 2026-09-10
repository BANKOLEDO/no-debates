/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['"Newsreader"', 'Georgia', 'serif'],
        display: ['"Syne"', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        canvas: '#FAF8F5',
        surface: {
          DEFAULT: '#FFFFFF',
          subtle: '#F5F2EB',
          card: '#FBF9F6',
          dark: '#141312',
        },
        ink: {
          900: '#141312',
          800: '#262421',
          700: '#423F3A',
          600: '#5E5A53',
          500: '#7B766D',
          400: '#9E998F',
          300: '#C7C2B8',
          200: '#DFDAD0',
          100: '#EFEBE2',
          50: '#F8F6F1',
        },
        accent: {
          DEFAULT: '#FF4A1C',
          hover: '#E53E12',
          soft: '#FFF0EB',
          border: '#FFD4C4',
        },
        olive: {
          DEFAULT: '#39463C',
          light: '#4C5D50',
          soft: '#E8ECE9',
        },
        sand: {
          DEFAULT: '#E8E1D5',
          light: '#F3EFE7',
          dark: '#D5CCBD',
        }
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(20, 19, 18, 0.04), 0 1px 2px rgba(20, 19, 18, 0.02)',
        'card': '0 4px 20px -2px rgba(20, 19, 18, 0.06), 0 2px 6px -1px rgba(20, 19, 18, 0.03)',
        'card-hover': '0 12px 32px -4px rgba(20, 19, 18, 0.1), 0 4px 12px -2px rgba(20, 19, 18, 0.04)',
        'float': '0 20px 48px -8px rgba(20, 19, 18, 0.12), 0 8px 16px -4px rgba(20, 19, 18, 0.06)',
        'pill': '0 2px 8px rgba(20, 19, 18, 0.08)',
        'accent': '0 8px 24px -4px rgba(255, 74, 28, 0.35)',
      },
      borderRadius: {
        '2.5xl': '20px',
        '3xl': '24px',
        '4xl': '32px',
      }
    },
  },
  plugins: [],
}
