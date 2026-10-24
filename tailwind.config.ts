import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        abyss: {
          950: '#F3F4F0',
          900: '#F8F9F6',
          800: '#FFFFFF',
          700: '#D8DFD9',
          600: '#BCCBC2',
        },
        mist: {
          100: '#243D35',
          200: '#334E44',
          300: '#52685F',
          400: '#65786F',
          500: '#78877F',
        },
        warm: '#203A31',
        amber: {
          DEFAULT: '#966F30',
          soft: '#B88B46',
        },
        teal: {
          DEFAULT: '#25685B',
          soft: '#367B6B',
          deep: '#124B44',
        },
        danger: '#E0655A',
      },
      fontFamily: {
        display: ['Georgia', 'Times New Roman', 'STSong', 'SimSun', 'serif'],
        body: [
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Microsoft YaHei',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 3px 16px rgba(25, 55, 40, 0.04)',
        glow: '0 0 0 1px rgba(232, 176, 75, 0.25), 0 6px 24px rgba(232, 176, 75, 0.12)',
      },
    },
  },
  plugins: [],
};

export default config;
