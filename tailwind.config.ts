import type { Config } from "tailwindcss";
import typography from '@tailwindcss/typography';

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        'noto-serif': ['var(--font-noto-serif)'],
        'zcool-kuaile': ['var(--font-zcool-kuaile)'],
      },
    },
  },
  plugins: [
    typography
  ],
} satisfies Config;
