/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // safelist: [
  //   {
  //     pattern: /text-(rose|amber)-(500|600)/,
  //   },
  // ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      screens: {
        '3xl': '1920px',
      },
      transitionProperty: {
        'all': 'width, opacity, transform, translate',
      },
      fontSize: {
        '2.5xl': '1.6875rem'
      },
      width: {
        '68': '17rem',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};