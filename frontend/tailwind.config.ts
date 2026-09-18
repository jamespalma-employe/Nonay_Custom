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
        'dark-page': 'var(--dark-page)',
        positive: 'var(--positive)',
        negative: 'var(--negative)',
        info: 'var(--info)',
        warning: 'var(--warning)',
        'background-color': 'var(--background-color)',
        background: {
          DEFAULT: 'var(--background)',
          secondary: 'var(--background-secondary)'
        },
        card: 'var(--card)',
        'color-p': 'var(--color-p)'
      },
    },
  },
  plugins: [],
} satisfies Config;

