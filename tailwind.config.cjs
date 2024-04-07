const daisyui = require('daisyui');

/** @type {import('tailwindcss').Config}*/
const config = {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
      backgroundImage: {
        'primary-gradient': 'linear-gradient(90deg, #4C38CA 0%, #2563EB 100%)'
      }
    }
  },

  daisyui: {
    themes: ['night']
  },

  plugins: [daisyui]
};

module.exports = config;
