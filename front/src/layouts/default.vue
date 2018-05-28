<template>
  <q-layout view="hHh lpr fFf">

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({ name: 'LayoutDefault' })
export default class LayoutDefault extends Vue {
}
</script>

<style>
</style>
