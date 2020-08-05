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
          <v-card-title>Top western road trips</v-card-title>

          <v-card-subtitle>1,000 miles of wonder</v-card-subtitle>
            <v-card-text>
                <gmap-autocomplete
                    class="col-md-6 text-black form-control rounded-0"
                    @place_changed="[setPlace($event), addMarker($event)]"
                ></gmap-autocomplete>
            </v-card-text>
          <v-card-actions>
            <v-btn text>Share</v-btn>
            <v-btn color="purple" text>Explore</v-btn>
          </v-card-actions>

        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Gmap',
  data: () => ({
    zoom: 3,
    currentPlace: null,
    center: { lat: 39.8283, lng: -98.5795 },
    markers: [
      {
        position: { lat: 40.7060361, lng: -74.0088256 },
      },
      {
        position: { lat: 25.7620955, lng: -80.1932258 },
      },
      {
        position: { lat: 44.9750472, lng: -93.2503777 },
      },
      {
        position: { lat: 32.7793704, lng: -96.8008565 },
      },
      {
        position: { lat: 47.6172481, lng: -122.3520857 },
      },
      {
        position: { lat: 34.1015088, lng: -118.333556 },
      },
    ],
    places: [],
    show: false,
  }),
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
  },
};
</script>
