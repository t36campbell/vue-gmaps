<template>
  <div class="home">
    <Gmap />
  </div>
</template>

<script>
import Gmap from '@/components/Gmap.vue';

export default {
  name: 'Home',
  components: {
    Gmap,
  },
};
</script>

<style>
.home{
  margin: 1rem 3rem
}
</style>
