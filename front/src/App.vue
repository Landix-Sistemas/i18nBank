<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({ name: 'App' })
class App extends Vue {
}
App['render'] = (h: any) => h(App)
export default App
</script>

<style>
</style>
