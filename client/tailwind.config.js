/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        retro: ['"Silkscreen"', 'monospace'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        sans: ['"JetBrains Mono"', 'system-ui', 'sans-serif'],
      },
      colors: {
        pixel: {
          bg: '#FAF8F5',
          card: '#FFFFFF',
          dark: '#18181B',
          border: '#18181B',
          green: '#22c55e',
          emerald: '#16a34a',
          amber: '#F59E0B',
          purple: '#8B5CF6',
          blue: '#3B82F6',
          red: '#EF4444',
          sand: '#F3EFEA',
          muted: '#71717A',
        }
      },
      boxShadow: {
        'pixel-sm': '2px 2px 0px 0px rgba(0,0,0,0.8)',
        'pixel': '3px 3px 0px 0px rgba(0,0,0,0.8)',
        'pixel-md': '4px 4px 0px 0px rgba(0,0,0,0.8)',
        'pixel-lg': '6px 6px 0px 0px rgba(0,0,0,0.8)',
        'pixel-hover': '5px 5px 0px 0px rgba(0,0,0,0.8)',
        'hud-glow': '0 0 15px rgba(34, 197, 94, 0.25)',
        'hud-border': '0 0 10px rgba(255, 255, 255, 0.08)'
      }
    },
  },
  plugins: [],
};
