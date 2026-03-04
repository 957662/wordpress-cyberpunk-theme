/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#0a0a0f',
          darker: '#050508',
          card: '#16162a',
          'card-light': '#1e1e3a',
          cyan: '#00f0ff',
          purple: '#9d00ff',
          pink: '#ff0080',
          green: '#00ff88',
          yellow: '#ffff00',
        },
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%)',
        'cyber-gradient-hover': 'linear-gradient(135deg, #9d00ff 0%, #ff0080 100%)',
      },
      boxShadow: {
        'cyber-glow': '0 0 20px rgba(0, 240, 255, 0.3)',
        'cyber-glow-purple': '0 0 20px rgba(157, 0, 255, 0.3)',
        'cyber-glow-pink': '0 0 20px rgba(255, 0, 128, 0.3)',
      },
      animation: {
        'pulse-cyber': 'pulse-cyber 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'scan': 'scan 8s linear infinite',
      },
      keyframes: {
        'pulse-cyber': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.5' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
    },
  },
  plugins: [],
}
