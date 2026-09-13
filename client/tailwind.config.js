/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        retro: ['"Silkscreen"', 'monospace'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        pixel: {
          bg: '#FAF8F5',
          card: '#FFFFFF',
          dark: '#18181B',
          border: '#18181B',
          green: '#10B981',
          emerald: '#059669',
          amber: '#F59E0B',
          purple: '#8B5CF6',
          blue: '#3B82F6',
          red: '#EF4444',
          sand: '#F3EFEA',
          muted: '#71717A',
        }
      },
      boxShadow: {
        'pixel-sm': '2px 2px 0px 0px #18181B',
        'pixel': '3px 3px 0px 0px #18181B',
        'pixel-md': '4px 4px 0px 0px #18181B',
        'pixel-lg': '6px 6px 0px 0px #18181B',
        'pixel-hover': '5px 5px 0px 0px #18181B',
        'pixel-inset': 'inset 2px 2px 0px 0px #18181B',
      }
    },
  },
  plugins: [],
};
