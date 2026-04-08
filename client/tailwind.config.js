/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Aether Maps Brand Palette
        'sky-blue': '#3B82F6',
        'soft-coral': '#FB7185',
        'mint-green': '#10B981',
        'pale-yellow': '#FDE68A',
        'slate-soft': '#F8FAFC',
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
        '5xl': '40px',
      },
      boxShadow: {
        // Custom "Clay" effect shadows
        'clay': '0 20px 40px -15px rgba(0, 0, 0, 0.1)',
        'clay-inner': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.06)',
      },
      animation: {
        'soft-pulse': 'soft-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'soft-pulse': {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: .8, transform: 'scale(0.98)' },
        }
      }
    },
  },
  plugins: [],
}