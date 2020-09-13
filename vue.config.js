module.exports = {
  transpileDependencies: [
    'vuetify',
  ],
  devServer: {
    proxy: 'https://cors-anywhere.herokuapp.com/',
  },
};
