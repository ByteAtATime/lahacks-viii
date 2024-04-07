const daisyui = require('daisyui');

/** @type {import('tailwindcss').Config}*/
const config = {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
      backgroundImage: {
        'primary-gradient': 'linear-gradient(90deg, #4C38CA 0%, #2563EB 100%)'
      },
      dropShadow: {
        glow: ['0 0px 20px rgba(255,255, 255, 0.35)', '0 0px 65px rgba(255, 255,255, 0.2)']
      }
    }
  },

  daisyui: {
    themes: ['night']
  },

  plugins: [daisyui]
};

module.exports = config;
