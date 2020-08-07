import Vue from 'vue';
import * as VueGoogleMaps from 'vue2-google-maps';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import vuetify from './plugins/vuetify';
import vgmAPIKey from './vgm-config';

Vue.config.productionTip = false;
Vue.use(VueGoogleMaps, {
  load: {
    key: vgmAPIKey,
    libraries: ['places', 'geometry'],
  },
});

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
