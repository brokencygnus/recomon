/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      screens: {
        '2.5xl': '1680px',
        '3xl': '1920px',
        '4xl': '2560px',
      },
      transitionProperty: {
        'all': 'width, opacity, transform, translate, rotate',
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