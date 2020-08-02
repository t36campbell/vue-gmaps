import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import colors from 'vuetify/lib/util/colors';

Vue.use(Vuetify);

const vuetify = new Vuetify({
  theme: {
    dark: false,
    themes: {
      dark: {
        primary: '#4CAF50',
        secondary: '#1B5E20',
        accent: '#9C27B0',
        info: colors.grey.darken4,
      },
      light: {
        primary: '#4CAF50',
        secondary: '#1B5E20',
        accent: '#9C27B0',
        info: colors.grey.lighten4,
      },
    },
  },
});

export default vuetify;
