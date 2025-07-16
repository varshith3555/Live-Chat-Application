module.exports = {
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        midnight: '#0a0f1c',
        neon: '#39ff14',
        violet: '#7c3aed',
        electric: '#3b82f6', // Tailwind blue-500
        cyan: '#06b6d4',     // Tailwind cyan-400
      },
      keyframes: {
        'gradient-move': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        'gradient-move': 'gradient-move 10s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} 