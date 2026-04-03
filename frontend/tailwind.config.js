export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg:       '#0C0C0F',
        surface:  '#141418',
        surface2: '#1C1C22',
        border:   '#222228',
        accent:   '#F59E0B',
        success:  '#10B981',
        danger:   '#EF4444',
        muted:    '#71717A',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}