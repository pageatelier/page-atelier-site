/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html'],
  theme: {
    extend: {
      colors: {
        ink: '#182126',
        'ink-soft': '#465259',
        ivory: '#f3f0e9',
        'ivory-strong': '#ebe6dc',
        paper: '#faf9f5',
        mist: '#bfd4dd',
        'mist-pale': '#e3ecef',
        blue: '#527887',
        silver: '#c9ced0',
        line: 'rgba(24, 33, 38, 0.16)',
        'white-line': 'rgba(255, 255, 255, 0.58)',
      },
      // radius-lg/md/sm from :root, carried over 1:1 (overrides Tailwind's default sm/md/lg)
      borderRadius: {
        sm: '14px',
        md: '22px',
        lg: '34px',
      },
      fontFamily: {
        serif: ['Gloock', 'Georgia', 'serif'],
        sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
      },
      // Former micro-label sizes (0.61rem–0.94rem, ~17 distinct values) consolidated into 3 steps.
      fontSize: {
        '2xs': ['0.7rem', { lineHeight: '1.3' }],
        xs: ['0.75rem', { lineHeight: '1.3' }],
        sm: ['0.85rem', { lineHeight: '1.5' }],
      },
      // Button hover elevation, consolidated from 4+ one-off shadow values into 2 tokens.
      // Ambient panel shadows (former --shadow / --shadow-soft) carried over alongside.
      boxShadow: {
        btn: '0 14px 30px rgba(24, 33, 38, 0.13)',
        'btn-hover': '0 18px 38px rgba(24, 33, 38, 0.16)',
        panel: '0 28px 80px rgba(24, 33, 38, 0.1)',
        'panel-soft': '0 14px 38px rgba(24, 33, 38, 0.08)',
      },
      // Fluid section rhythm (former --gutter / --section), reused across every page.
      spacing: {
        gutter: 'clamp(22px, 5vw, 78px)',
        section: 'clamp(92px, 11vw, 168px)',
        'section-tight': 'clamp(70px, 8vw, 118px)',
      },
      keyframes: {
        pageEnter: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'page-enter': 'pageEnter 0.75s ease both',
      },
    },
  },
  safelist: ['is-shown'],
  plugins: [],
}
