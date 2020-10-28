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
        mdi-map
      </v-icon>
      <v-toolbar-title class="mr-12 align-center">
        <span class="title">vgm</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  name: 'App',
  components: {},
  data: () => ({
    drawer: false,
    items: [],
    tags: [],
    tag: '',
  }),
  watch: {},
  mounted() {
    this.items = [
      { icon: 'mdi-image-multiple', text: 'Home', path: '' },
      { icon: 'mdi-store', text: 'Products', path: '' },
      { icon: 'mdi-cog', text: 'Settings', path: '' },
    ];
  },
  methods: {},
});
</script>

<style>
.toggle {
  margin-left: 3px;
}
</style>
