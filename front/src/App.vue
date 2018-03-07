<template lang="html">
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <router-view />
  </div>
</template>

<script lang="ts">
/*
 * Root component
 */
import Vue from 'vue'
import Component from 'vue-class-component'
@Component({})
export default class App extends Vue {
}
</script>

<style></style>
