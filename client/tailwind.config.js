/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F5F0E8',
        beige: '#E8DED0',
        gold: '#FCA311',
        mutedGold: '#C9923E',
        navy: '#14213D',
        ink: '#171717',
        charcoal: '#000000',
        warmWhite: '#FFFFFF',
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
        card: '0 24px 48px -24px rgba(20, 33, 61, 0.18)',
        soft: '0 12px 32px -16px rgba(20, 33, 61, 0.14)',
        gold: '0 14px 34px -12px rgba(252, 163, 17, 0.45)',
        lift: '0 32px 64px -24px rgba(20, 33, 61, 0.3)',
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
