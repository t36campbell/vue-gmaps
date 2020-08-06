<template>
  <v-container fluid>
    <v-row dense>
      <v-col :cols="12">
        <v-card>
          <gmap-map :center="center" :zoom="zoom" style="width:100%;  height: 550px">
            <gmap-marker
              :key="index"
              v-for="(m, index) in markers"
              :position="m.position"
              :clickable="true"
              :icon="m.icon"
              @click="center=m.position, zoom=9"
            ></gmap-marker>
          </gmap-map>
          <v-card-title>Products Avaialable at all Major Retailers</v-card-title>
          <v-card-subtitle>Search for Location or Use Your Current Location</v-card-subtitle>
          <v-card-text>
            <v-progress-linear
              :active="loading"
              :indeterminate="loading"
              absolute
              top
              color="secondary"
            ></v-progress-linear>
            <gmap-autocomplete
              class="col-md-12 rounded-lg form-input"
              @place_changed="[setPlace($event), addMarker($event), timeout = 1000, loading = true]"
            ></gmap-autocomplete>
            <br><br>
            <h3 class="text-center">OR</h3>
            <br>
            <v-btn
              class="col-md-12 rounded-lg"
              color="secondary"
              @click="[geolocate(), timeout = 1000, loading = true]"
              large
              outlined
            >Use My Current Location</v-btn>
            <br><br>
            <v-select
              class="col-md-12 rounded-lg"
              v-model="radius"
              :items="radiusOptions"
              menu-props="auto"
              label="Search Radius"
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
              @click="[findNearby(), timeout = 3000, loading = true]"
              large
            >Search for Stores</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row dense v-if="hasCards">
        <v-col
          v-for="card in cards"
          :key="card.store.id"
          :cols="4"
        >
          <v-card
            height="150px"
            color="info"
          >
            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-title
                  class="headline text--black"
                  v-text="card.store.title"
                ></v-card-title>
                <v-card-subtitle
                  class="text--grey"
                  v-text="card.store.address"
                ></v-card-subtitle>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
import { gmapApi } from 'vue2-google-maps';
import vgmAPIKey from '../vgm-config';

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
    keywordOptions: [
      'Best Buy', 'Target', 'Walmart', 'Home Depot', "Lowe's",
    ],
    loading: false,
    timeout: 1000,
    cards: [],
    hasCards: false,
  }),
  watch: {
    loading(val) {
      if (!val) return;
      // eslint-disable-next-line no-return-assign
      setTimeout(() => (this.loading = false), this.timeout);
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
    if (localStorage.getItem('data')) {
      try {
        const recents = JSON.parse(localStorage.getItem('data'));
        this.data = recents;
      } catch (e) {
        localStorage.removeItem('data');
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
    addResults() {
      console.log(this.data);
      this.data.forEach((result) => {
        const marker = {
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng,
        };
        this.markers.push({ position: marker });
        this.results.push({ position: marker });
        const store = {
          id: result.place_id,
          title: result.name,
          address: result.vicinity,
          position: marker,
        };
        this.cards.push({ store });
        this.hasCards = true;
      });
      this.zoom = 9;
      this.saveResults();
      console.log(this.cards);
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
          console.log(err);
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
    saveResults() {
      localStorage.zoom = this.zoom;
      localStorage.setItem('currentPlace', JSON.stringify(this.currentPlace));
      localStorage.setItem('center', JSON.stringify(this.center));
      const recentResults = JSON.stringify(
        this.results.slice(Math.max(this.places.length - 25, 0)),
      );
      localStorage.setItem('results', recentResults);
      const recentData = JSON.stringify(this.data);
      localStorage.setItem('data', recentData);
      const recentCards = JSON.stringify(
        this.cards.slice(Math.max(this.places.length - 25, 0)),
      );
      localStorage.setItem('cards', recentCards);
    },
    findNearby() {
      const URL = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${
        this.currentPlace.lat
      },${this.currentPlace.lng}&radius=${this.radius * 1000}
        &keyword=${this.keyword}&key=${vgmAPIKey}`;
      axios
        .get(URL, {
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        })
        .then((response) => {
          this.data = response.data.results;
          this.addResults();
        })
        .catch((error) => {
          console.log(error.message);
        });
    },
  },
};
</script>

<style>
.form-input {
  border: 1px solid #BDBDBD;
}
.form-input:focus {
  border: 1px solid #1B5E20 !important;
}
</style>
