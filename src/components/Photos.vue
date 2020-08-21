<template>
  <v-container fluid>
      <v-row dense v-if="isSelected">
        <v-col
          :key="selected.id"
          :cols="12"
        >
          <v-card>
            <v-img
              :src="selected.url_n"
              class="white--text align-end"
              height="600px"
            >
              <v-row dense>
                  <v-col :cols="10">
                    <v-card-title v-text="selected.title"></v-card-title>
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
      <v-row dense v-if="hasCards">
        <v-col
          v-for="card in cards"
          :key="card.id"
          :cols="4"
        >
          <v-card v-on:click="select(card)">
            <v-img
              :src="card.url_n"
              class="white--text align-end"
              height="300px"
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

export default Vue.extend({
  name: 'Photos',
  props: ['tag', 'hasCards', 'cards'],
  data: () => ({
    isSelected: true,
    selected: null,
  }),
  watch: {},
  mounted() {},
  methods: {
    select(card) {
      this.selected = card;
      this.isSelected = true;
    },
  },
});
</script>
