const {nextui} = require('@nextui-org/react');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['www.fifatown.co.kr'],
  },
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            // ... other colors
            primary: {
              // ... other primary color shades
              DEFAULT: '#0051FF', // Changed primary color
            },
            // ... rest of the colors
          },
        },
        dark: {
          colors: {
            // ... other colors
            primary: {
              // ... other primary color shades
              DEFAULT: '#0051FF', // Changed primary color
            },
            // ... rest of the colors
          },
        },
        // ... other themes if any
      },
    }),
  ],
};

module.exports = nextConfig;
