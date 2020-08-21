<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      color="info"
      app
      clipped
    >
      <v-list dense>
        <v-list-item
          v-for="item in items"
          :key="item.text"
          v-on:click="route(item.path)"
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ item.text }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-action>
            <v-icon color="grey darken-1">mdi-brightness-4</v-icon>
          </v-list-item-action>
          <v-list-item-title class="grey--text text--darken-1">
            <v-switch
              class="toggle"
              v-model="$vuetify.theme.dark"
            ></v-switch>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      clipped-left
      color="primary"
      dense
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-icon
        class="mx-4"
        large
      >
        mdi-image
      </v-icon>
      <v-toolbar-title class="mr-12 align-center">
        <span class="title">pkchr</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-row
        align="center"
        style="max-width: 650px"
      >
        <v-text-field
          :append-icon-cb="() => {}"
          v-model="tag"
          @keyup.enter.native="route(`/search/${tag}`)"
          placeholder="Search..."
          single-line
          append-icon="mdi-magnify"
          color="white"
          hide-details
        ></v-text-field>
      </v-row>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import Vue from 'vue';
import router from './router';

export default Vue.extend({
  name: 'App',
  components: {},
  data: () => ({
    drawer: null,
    items: [],
    tag: '',
  }),
  watch: {
  },
  mounted() {
    this.tag = 'neowise';
    this.items = [
      { icon: 'mdi-trending-up', text: 'Home', path: `/search/${this.tag}` },
      { icon: 'mdi-youtube-subscription', text: 'Stores', path: '/stores' },
      { icon: 'mdi-image-multiple', text: 'Tags', path: '' },
      { icon: 'mdi-store', text: 'Products', path: '' },
      { icon: 'mdi-cog', text: 'Settings', path: '' },
    ];
    this.route(`/search/${this.tag}`);
  },
  methods: {
    route(path) {
      router.push(path);
    },
  },
});
</script>

<style>
.toggle {
  margin-left: 3px;
}
</style>
