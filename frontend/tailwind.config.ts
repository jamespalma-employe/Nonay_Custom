import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class', '.body--dark'],
  content: ['./public/**/*.html', './src/**/*.{vue, js, ts, jsx, tsx}'],
  theme: {
    screens: {
      xs: '0px',
      sm: '600px',
      md: '1200px',
      lg: '1440px',
      xl: '1920px',
    },
    extend: {
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        dark: 'var(--dark)',
        positive: 'var(--positive)',
        negative: 'var(--negative)',
        info: 'var(--info)',
        warning: 'var(--warning)',
        background: 'var(--app-background)',
        card: 'var(--app-card)',
        'card-dashboard': 'var(--app-card-dashboard)',
        'color-p': 'var(--app-color-p)',
        description: 'var(--app-description)',
        'button-dashboard': 'var(--app-btn-dashboard)',
        code: 'var(--app-code)'
      },
    },
  },
  plugins: [],
} satisfies Config;
