/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        retina: {
          navy: '#0B0F19',
          card: '#111827',
          surface: '#1E293B',
          border: '#334155',
          cyan: '#06B6D4',
          cyanGlow: '#0891B2',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#EF4444',
          muted: '#94A3B8'
        }
      }
    },
  },
  plugins: [],
}
