import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        inter: ['var(--font-inter)'],
        'dm-mono': ['var(--font-dm-mono)'],
        'xanh-mono': ['var(--font-xanh-mono)'],
      },
    },
  },
  plugins: [],
};

export default config;