/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['*'],
  theme: {
    screens: {
      xsm: '380px',

      csm: '550px',
      // => @media (min-width: 550px) { ... }

      sm: '640px',
      // => @media (min-width: 640px) { ... }

      md: '768px',
      // => @media (min-width: 768px) { ... }

      lg: '1024px',
      // => @media (min-width: 1024px) { ... }

      xl: '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }.
      '3xl': '2000px',

      '4xl': '2500px',
    },

    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        'open-sans': ['Open Sans', 'sans-serif'],
      },
      backgroundImage: {
        'blockchain-bg-1': "url('./assets/blockchain-outline-1.jpg')",
        'blockchain-bg-2': "url('./assets/blockchain-outline-2.jpg')",
      },
    },
  },
  plugins: [],
};
