module.exports = {
  transpileDependencies: [
    'vuetify',
  ],
  devServer: {
    proxy: 'https://tsc-cors.herokuapp.com/',
  },
};
