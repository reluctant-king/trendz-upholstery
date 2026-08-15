/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: 'rgb(var(--cream) / <alpha-value>)',
        beige: 'rgb(var(--beige) / <alpha-value>)',
        gold: 'rgb(var(--gold) / <alpha-value>)',
        mutedGold: 'rgb(var(--muted-gold) / <alpha-value>)',
        navy: 'rgb(var(--navy) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        deep: 'rgb(var(--deep) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        warmWhite: 'rgb(var(--warm-white) / <alpha-value>)',
        charcoal: '#000814',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        card: '0 24px 48px -24px rgba(0, 53, 102, 0.18)',
        soft: '0 12px 32px -16px rgba(0, 53, 102, 0.14)',
        gold: '0 14px 34px -12px rgba(255, 195, 0, 0.45)',
        lift: '0 32px 64px -24px rgba(0, 53, 102, 0.3)',
      },
      letterSpacing: {
        eyebrow: '0.22em',
      },
      maxWidth: {
        prose: '65ch',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
};
