// vite.config.js
const { resolve } = require('path');

module.exports = {
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        discord: resolve(__dirname, 'discord.html'),
        twitter: resolve(__dirname, 'twitter.html'),
        github: resolve(__dirname, 'github.html'),
        medium: resolve(__dirname, 'medium.html'),
        telegram: resolve(__dirname, 'telegram.html'),
        truthsocial: resolve(__dirname, 'truthsocial.html'),
      },
    },
  },
};
