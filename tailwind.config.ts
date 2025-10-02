import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        surface: '#111827',
        surfaceLight: '#1f2937',
        accent: '#38bdf8'
      },
      boxShadow: {
        card: '0 10px 25px -15px rgba(15, 23, 42, 0.8)'
      }
    }
  },
  plugins: []
};

export default config;
