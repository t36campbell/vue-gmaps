<template>
  <v-container fluid>
      <v-progress-linear
        :active="loading"
        :indeterminate="loading"
        absolute
        top
        color="primary"
      ></v-progress-linear>
      <form>
        <label>
          Search:
          <input v-model="tag" type="text">
        </label>
        <button type="submit" class="go-button" @click.prevent="search">Search</button>
      </form>
      <v-row dense v-if="hasCards">
        <v-col
          v-for="card in cards"
          :key="card.id"
          :cols="4"
        >
          <v-card>
            <v-img
              :src="card.url_n"
              class="white--text align-end"
              height="300px"
              max-height="350px"
            >
              <v-row dense>
                  <v-col :cols="10">
                    <v-card-title v-text="card.title"></v-card-title>
                  </v-col>
                  <v-col :cols="2">
                    <v-card-subtitle>
                      <v-btn
                        icon
                        color="white"
                      >
                        <v-icon>mdi-heart</v-icon>
                      </v-btn>
                    </v-card-subtitle>
                  </v-col>
                </v-row>
            </v-img>
          </v-card>
        </v-col>
      </v-row>
  </v-container>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';
import flickrAPIKey from '../flickr-config';

export default Vue.extend({
  name: 'Photos',

  data: () => ({
    loading: false,
    hasCards: false,
    tag: '',
    cards: [],
  }),
  watch: {
    loading(val) {
      if (!val) return;
      // eslint-disable-next-line no-return-assign
      setTimeout(() => (this.loading = false), this.timeout);
    },
  },
  methods: {
    search() {
      this.loading = true;
      this.getImages()
        .then((response) => {
          this.cards = response.data.photos.photo;
          this.hasCards = true;
          this.loading = false;
        });
    },
    getImages() {
      return axios({
        method: 'get',
        url: 'https://api.flickr.com/services/rest',
        params: {
          method: 'flickr.photos.search',
          api_key: flickrAPIKey,
          tags: this.tag,
          sort: 'relevance',
          extras: 'url_n',
          page: 1,
          format: 'json',
          nojsoncallback: 1,
          per_page: 30,
        },
      });
    },
  },
});
</script>
