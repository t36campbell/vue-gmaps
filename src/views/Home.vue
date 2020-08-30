<template>
  <div class="home">
    <v-progress-linear
      :active="loading"
      :indeterminate="loading"
      absolute
      top
      color="primary"
    ></v-progress-linear>
    <Photos :tag='tag' :hasCards='hasCards' :cards='cards'/>
  </div>
</template>

<script>
import Photos from '@/components/Photos.vue';
import axios from 'axios';
import flickrAPIKey from '../flickr-config';

export default {
  name: 'Home',
  props: ['tag'],
  components: {
    Photos,
  },
  data: () => ({
    loading: false,
    hasCards: false,
    cards: [],
  }),
  watch: {
    tag(val) {
      if (!val) return;
      // eslint-disable-next-line no-return-assign
      this.search();
    },
  },
  mounted() {
    if (this.tag) this.search();
  },
  methods: {
    search() {
      this.loading = true;
      this.getImages()
        .then((response) => {
          this.cards = response.data.photos.photo;
          this.hasCards = true;
          // eslint-disable-next-line no-return-assign
          setTimeout(() => (this.loading = false), 2000);
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
          sort: 'interestingness-desc',
          extras: 'url_n, url_z',
          page: 1,
          format: 'json',
          nojsoncallback: 1,
          per_page: 30,
        },
      });
    },
  },
};
</script>
