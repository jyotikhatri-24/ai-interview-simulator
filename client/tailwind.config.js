module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          500: '#6366F1',
          600: '#4F46E5',
        },
        purple: {
          500: '#8B5CF6',
          600: '#7C3AED',
        },
        cyan: {
          500: '#06B6D4',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 10px 15px -3px rgba(0, 0, 0, 0.04), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
        'premium-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.03)',
        'indigo-glow': '0 0 20px rgba(99, 102, 241, 0.15)',
      }
    },
  },
  plugins: [],
}
