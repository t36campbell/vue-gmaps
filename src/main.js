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
  apiKey: 'AIzaSyDxCgbCQ1RTm8KJxO5T697cKjER79eSQe4',
  authDomain: 'vue-gmaps-6ff51.firebaseapp.com',
  databaseURL: 'https://vue-gmaps-6ff51.firebaseio.com',
  projectId: 'vue-gmaps-6ff51',
  storageBucket: 'vue-gmaps-6ff51.appspot.com',
  messagingSenderId: '972237420195',
  appId: '1:972237420195:web:319dc4748a171c3c3df116',
  measurementId: 'G-7SDENKS15E',
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
