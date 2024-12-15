import scrollbarPlugin from 'tailwind-scrollbar';

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [
    scrollbarPlugin({ nocompatible: true }),
  ],
  theme: {
    extend: {
      maxWidth: {
        container: "1440px",
      },
      screens: {
        xs: "320px",
        sm: "375px",
        sml: "500px",
        md: "667px",
        mdl: "768px",
        lg: "960px",
        lgl: "1024px",
        xl: "1280px",
      },
      fontFamily: {
        sans: ['"Open Sans"', 'sans-serif'],
        heading: ['"Poppins"', 'sans-serif'],
        bodyFont: ["DM Sans", "sans-serif"],
        titleFont: ["Poppins", "sans-serif"],
      },
      colors: {
        primaryRed: '#d0121a',
        hoverRed: '#a00d14',
        lightGray: '#f4f4f4',
        primeColor: "#262626",
        lightText: "#6D6D6D",
      },
      boxShadow: {
        testShadow: "0px 0px 54px -13px rgba(0,0,0,0.7)",
      },
      animation: {
        marquee: 'marquee 15s linear infinite',
        blink: 'blink 1s steps(2, start) infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        blink: {
          '0%, 100%': { opacity: 3 },
          '0%': { opacity: 0 },
        },
      },
    },
  },
};
