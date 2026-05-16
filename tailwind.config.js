/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Backgrounds — Budding Mariners is near-black
        navy: {
          900: '#000000',
          800: '#080808',
          700: '#121212',
          600: '#1c1c1c',
        },
        // Primary brand accent — gold/yellow (aliased as `ocean` so the
        // whole UI re-skins without touching every component class)
        ocean: {
          400: '#F2C94C',
          500: '#E6B833',
          600: '#C99A1F',
        },
        gold: {
          400: '#F7E08A',
          500: '#F2C94C',
        },
      },
      fontFamily: {
        display: ['Poppins', 'system-ui', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      // Make numeric weight utilities (font-700 etc.) valid so headings
      // actually render bold like the brand site.
      fontWeight: {
        400: '400',
        500: '500',
        600: '600',
        700: '700',
        800: '800',
      },
      backgroundImage: {
        'ocean-gradient':
          'linear-gradient(165deg, #000000 0%, #060606 40%, #0a0d14 72%, #11192a 100%)',
        'glow-radial':
          'radial-gradient(circle at 50% 0%, rgba(242,201,76,0.14) 0%, rgba(0,0,0,0) 60%)',
        'stats-gradient':
          'linear-gradient(180deg, #0b1220 0%, #161f33 100%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-18px)' },
        },
        wave: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 25px rgba(242,201,76,0.40)' },
          '50%': { boxShadow: '0 0 55px rgba(242,201,76,0.80)' },
        },
        heartBeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '25%': { transform: 'scale(1.15)' },
          '40%': { transform: 'scale(0.95)' },
          '60%': { transform: 'scale(1.1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        wave: 'wave 12s linear infinite',
        glowPulse: 'glowPulse 2.6s ease-in-out infinite',
        heartBeat: 'heartBeat 1.4s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
      },
    },
  },
  plugins: [],
}
