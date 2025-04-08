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
      },
      colors: {
        "dark-blue": {
          "50": "#CCD1DA",
          "100": "#ABB2C1",
          "200": "#808CA2",
          "300": "#566683",
          "400": "#2C3F64",
          "500": "#021945",
          "600": "#021539",
          "700": "#01112E",
          "800": "#010C22",
          "900": "#010817",
          "950": "#00050E",
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};