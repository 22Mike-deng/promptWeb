/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-purple': '#a855f7',
        'neon-blue': '#3b82f6',
        'neon-pink': '#ec4899',
        'neon-green': '#22c55e',
        'neon-yellow': '#eab308',
        'dark-bg': '#0f0f1a',
        'dark-card': '#1a1a2e',
        'dark-border': '#2d2d44',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #a855f7, 0 0 10px #a855f7' },
          '100%': { boxShadow: '0 0 20px #a855f7, 0 0 40px #a855f7' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      fontFamily: {
        'game': ['Orbitron', 'sans-serif'],
        'body': ['Rajdhani', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
