import Vue from 'vue';
import * as VueGoogleMaps from 'vue2-google-maps';
import * as firebase from 'firebase/app';
import 'firebase/analytics';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import vuetify from './plugins/vuetify';
import vgmAPIKey from './vgm-config';

const firebaseConfig = {
  apiKey: 'AIzaSyCkClSsMigJ-0Jn0Ny3LwNWmQRtiHOZyLY',
  authDomain: 'vue-gallery-fe4bb.firebaseapp.com',
  databaseURL: 'https://vue-gallery-fe4bb.firebaseio.com',
  projectId: 'vue-gallery-fe4bb',
  storageBucket: 'vue-gallery-fe4bb.appspot.com',
  messagingSenderId: '361816645624',
  appId: '1:361816645624:web:af6395c5543f126716c00d',
  measurementId: 'G-WK1445X3VE',
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();
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
