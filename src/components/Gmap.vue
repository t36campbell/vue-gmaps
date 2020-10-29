<template>
  <v-container fluid>
    <v-row dense>
      <v-col :cols="12">
        <v-card>
          <v-img>
            <gmap-map ref="map" :center="center" :zoom="zoom" style="width:100%;  height: 720px">
              <gmap-marker
                :key="index"
                v-for="(m, index) in markers"
                :position="m.position"
                :clickable="true"
                :icon="m.icon"
                @click="center=m.position, zoom=9"
              ></gmap-marker>
            </gmap-map>
            <v-progress-linear
              :active="loading"
              :indeterminate="loading"
              absolute
              top
              color="secondary"
            ></v-progress-linear>
          </v-img>
          <v-expansion-panels v-model="panel">
            <v-expansion-panel>
              <v-expansion-panel-header>
                <v-card-title>Products Avaialable at All Major Retailers</v-card-title>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-card-subtitle>Search for Location or Use Your Current Location</v-card-subtitle>
                <v-card-text>
                  <gmap-autocomplete
                    class="col-md-12 rounded-lg form-input"
                    @place_changed="[
                      setPlace($event),
                      addMarker($event),
                      timeout = 1000,
                      loading = true
                    ]"
                  ></gmap-autocomplete>
                  <br />
                  <br />
                  <h3 class="text-center">OR</h3>
                  <br />
                  <v-btn
                    class="col-md-12 rounded-lg"
                    color="secondary"
                    @click="[geolocate(), timeout = 1000, loading = true]"
                    large
                    outlined
                  >Use My Current Location</v-btn>
                  <br />
                  <br />
                  <v-select
                    class="col-md-12 rounded-lg"
                    v-model="radius"
                    :items="radiusOptions"
                    menu-props="auto"
                    label="Search Radius in Miles"
                    solo
                  ></v-select>
                  <v-select
                    class="col-md-12 rounded-lg"
                    v-model="keyword"
                    :items="keywordOptions"
                    menu-props="auto"
                    label="Stores"
                    solo
                  ></v-select>
                </v-card-text>
                <v-card-actions class="text-center">
                  <v-btn
                    class="col-md-12 rounded-lg"
                    color="accent"
                    @click="[findNearby(), panel= null, timeout = 3000, loading = true]"
                    large
                  >Search for Stores</v-btn>
                </v-card-actions>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>
      </v-col>
    </v-row>
    <v-row dense v-if="hasCards">
      <v-col
        v-for="card in cards" :key="card.id"
        :cols="card.selected === true ? '12' : '4'"
      >
        <v-card :height="card.selected === true ? '100%' : '200px'" :color="card.color">
          <div class="d-flex flex-no-wrap justify-space-between">
            <div>
              <v-card-title class="headline text--black" v-text="card.title"></v-card-title>
              <v-card-subtitle class="text--grey">
                {{card.address}}
              </v-card-subtitle>
            </div>
            <div>
              <v-card-subtitle class="text--grey">
                {{card.distance}} mi
              </v-card-subtitle>
            </div>
          </div>
          <v-card-text id="directions" v-if="hasDirections"></v-card-text>
          <v-card-actions v-if="card.selected !== true">
            <v-btn
              class="col-md-12 rounded-lg"
              color="color.grey"
              @click="[
                selectStore(card),
                timeout = 1000,
                loading = true,
                card.selected = true,
                card.color = 'info',
                getDirections(),
                timeout = 3000,
                loading = true,
                hasDirections =true,
              ]"
              large
              outlined
            >Get Directions</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
import { gmapApi } from 'vue2-google-maps';
import vgmAPIKey from '../vgm-config';

// eslint-disable-next-line no-undef
const directionsService = new google.maps.DirectionsService();
// eslint-disable-next-line no-undef
const directionsDisplay = new google.maps.DirectionsRenderer();
export default {
  name: 'Gmap',
  computed: {
    google: gmapApi,
  },
  data: () => ({
    zoom: 3,
    currentPlace: null,
    center: { lat: 39.8283, lng: -98.5795 },
    markers: [],
    places: [],
    data: null,
    results: [],
    tab: null,
    radius: '25',
    radiusOptions: ['25', '50', '100'],
    keyword: 'Best Buy',
    keywordOptions: ['Best Buy', 'Target', 'Walmart', 'Home Depot', "Lowe's"],
    panel: 0,
    loading: false,
    timeout: 1000,
    cards: [],
    selected: [],
    hasCards: false,
    hasDirections: false,
  }),
  watch: {
    loading(val) {
      if (!val) return;
      // eslint-disable-next-line no-return-assign
      setTimeout(() => (this.loading = false), this.timeout);
    },
    hasCards(val) {
      if (!val) return;
      this.panel = null;
    },
    hasDirections(val) {
      if (!val) return;
      this.panel = 1;
    },
  },
  mounted() {
    if (localStorage.zoom) this.zoom = Number(localStorage.zoom);
    if (localStorage.getItem('currentPlace')) {
      try {
        this.currentPlace = JSON.parse(localStorage.getItem('currentPlace'));
      } catch (e) {
        localStorage.removeItem('currentPlace');
      }
    }
    if (localStorage.getItem('center')) {
      try {
        this.center = JSON.parse(localStorage.getItem('center'));
      } catch (e) {
        localStorage.removeItem('center');
      }
    }
    if (localStorage.getItem('places')) {
      try {
        const recents = JSON.parse(localStorage.getItem('places'));
        this.places = recents;
        this.markers.push(...recents);
      } catch (e) {
        localStorage.removeItem('places');
      }
    }
    if (localStorage.getItem('results')) {
      try {
        const recents = JSON.parse(localStorage.getItem('results'));
        this.results = recents;
        this.markers.push(...recents);
      } catch (e) {
        localStorage.removeItem('results');
      }
    }
    if (localStorage.getItem('cards')) {
      this.hasCards = true;
      try {
        const recents = JSON.parse(localStorage.getItem('cards'));
        this.cards = recents;
      } catch (e) {
        localStorage.removeItem('cards');
      }
    }
  },
  methods: {
    setPlace(place) {
      this.currentPlace = place;
    },
    addMarker() {
      if (this.currentPlace) {
        const marker = {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng(),
        };
        this.currentPlace = marker;
        this.markers.push({ position: marker });
        this.places.push({ position: this.currentPlace });
        this.center = marker;
        this.zoom = 12;
        this.saveMap();
      }
    },
    geolocate() {
      const options = {
        maximumAge: 60000,
        timeout: 5000,
        enableHighAccuracy: true,
      };
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const marker = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.currentPlace = marker;
          this.markers.push({ position: marker });
          this.places.push({ position: this.currentPlace });
          this.center = marker;
          this.zoom = 12;
          this.saveMap();
        },
        (err) => {
          console.log('geolocate', err);
        },
        options,
      );
    },
    saveMap() {
      localStorage.zoom = this.zoom;
      localStorage.setItem('currentPlace', JSON.stringify(this.currentPlace));
      localStorage.setItem('center', JSON.stringify(this.center));
      const recentPlaces = JSON.stringify(
        this.places.slice(Math.max(this.places.length - 5, 0)),
      );
      localStorage.setItem('places', recentPlaces);
    },
    findNearby() {
      const URL = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${
        this.currentPlace.lat
      },${this.currentPlace.lng}&radius=${this.radius * 1609.34}
        &keyword=${this.keyword}&key=${vgmAPIKey}`;
      axios
        .get(URL)
        .then((response) => {
          this.data = response.data.results;
          this.addResults();
        })
        .catch((error) => {
          console.log('findNearby', error.message);
        });
    },
    addResults() {
      this.cards = [];
      this.data.forEach((result) => {
        const marker = {
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng,
        };
        // eslint-disable-next-line no-undef
        const p1 = new google.maps.LatLng(
          this.currentPlace.lat,
          this.currentPlace.lng,
        );
        // eslint-disable-next-line no-undef
        const p2 = new google.maps.LatLng(
          marker.lat,
          marker.lng,
        );
        // eslint-disable-next-line no-undef
        const calc = google.maps.geometry.spherical.computeDistanceBetween(p1, p2);
        const dist = Number((calc / 1609).toFixed(2)); // meters to miles
        const store = {
          id: result.place_id,
          color: '',
          title: result.name,
          address: result.vicinity,
          position: marker,
          distance: dist,
          selected: false,
        };
        this.markers.push({ position: marker });
        this.results.push({ position: marker });
        this.cards.push(store);
      });
      this.cards.sort((a, b) => ((a.distance > b.distance) ? 1 : -1));
      this.hasCards = true;
      if (this.radius === '25') this.zoom = 10;
      else if (this.radius === '50') this.zoom = 9;
      else this.zoom = 8;
      window.scrollTo(0, 0);
      this.saveResults();
    },
    saveResults() {
      localStorage.zoom = this.zoom;
      localStorage.setItem('currentPlace', JSON.stringify(this.currentPlace));
      localStorage.setItem('center', JSON.stringify(this.center));
      const recentResults = JSON.stringify(
        this.results.slice(Math.max(this.places.length - 25, 0)),
      );
      localStorage.removeItem('results');
      localStorage.setItem('results', recentResults);
      const recentCards = JSON.stringify(
        this.cards.slice(Math.max(this.places.length - 25, 0)),
      );
      localStorage.removeItem('cards');
      localStorage.setItem('cards', recentCards);
    },
    selectStore(store) {
      if (this.selected) {
        this.selected.selected = false;
        this.selected.color = '';
        this.cards.sort((a, b) => ((a.distance > b.distance) ? 1 : -1));
        console.log('was true', this.selected);
      }
      const i = this.cards.indexOf(store);
      this.cards.splice(i, 1);
      this.cards.unshift(store);
      this.cards.selected = false;
      this.selected = store;
    },
    getDirections() {
      directionsDisplay.setMap(this.$refs.map.$mapObject);
      // eslint-disable-next-line no-shadow
      function displayRoute(service, display, start, destination) {
        service.route({
          origin: start,
          destination,
          travelMode: 'DRIVING',
        }, (response, status) => {
          if (status === 'OK') {
            display.setPanel(document.getElementById('directions'));
            display.setDirections(response);
          } else {
            console.log('getDirections', status);
          }
        });
      }
      displayRoute(
        directionsService, directionsDisplay,
        this.currentPlace, this.selected.position,
      );
    },
  },
};
</script>

<style>
.form-input {
  color: #757575;
  border: 1px solid #757575;
}
#directions .adp-directions {
  width: 100%;
}
</style>
