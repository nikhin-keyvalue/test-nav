/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */

import type { Config } from 'tailwindcss';

export const colors = {
  primary: {
    DEFAULT: '#DA212C',
  },
  secondary: {
    DEFAULT: '#323C49',
    500: '#8C9299',
    300: '#DEE0E2',
  },
  grey: {
    4: '#F7F7F8',
    8: '#EFEFF0',
    16: '#DEE0E2',
    32: '#BDC1C5',
    56: '#8C9299',
    88: '#4B535F',
    26: '#262626',
  },
  white: '#FFFFFF',
  green: '#6E9C6D',
  blue: {
    DEFAULT: '#0587B3',
    100: '#EBF8FF',
    500: '4299E1',
  },
  purple: '#775478',
  yellow: '#FFFC5C',
};

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/containers/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  important: '#__next',
  theme: {
    extend: {
      colors,
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        kanit: ['var(--font-kanit)', 'sans-serif'],
        roboto: ['var(--font-roboto)', 'sans-serif'],
        roboto_mono: ['var(--font-roboto-mono)', 'sans-serif'],
      },
      fontSize: {
        '15px': [
          '0.9375rem',
          {
            lineHeight: '1.5rem',
          },
        ],
      },
      boxShadow: {
        menu: '0px 2px 12px 0px rgba(0, 0, 0, 0.12)',
        blockbase: '0px 0px 16px 0px rgba(50, 60, 73, 0.08)',
      },
      // Note: Default screen breakpoint width is different for mui and tailwind. Below added screens config makes sure they are in sync, when used together
      screens: {
        'lg-mui': '1200px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
  corePlugins: {
    preflight: false,
  },
};
export default config;
