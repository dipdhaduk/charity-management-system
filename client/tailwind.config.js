/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        ink: 'var(--color-ink)',
        muted: 'var(--color-muted)',
        line: 'var(--color-line)',
        brand: {
          DEFAULT: 'var(--color-brand)',
          hover: 'var(--color-brand-hover)',
        },
        accent: 'var(--color-accent)',
        soft: 'var(--color-soft)',
      },
      fontFamily: {
        heading: ['"Bricolage Grotesque"', 'sans-serif'],
        sans: ['"DM Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        card: '20px',
        featured: '28px',
      },
      boxShadow: {
        soft: '0 4px 24px -2px rgba(16, 35, 27, 0.06)',
        card: '0 2px 8px -2px rgba(16, 35, 27, 0.05)',
      },
    },
  },
  plugins: [],
};
