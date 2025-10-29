<template>
  <LayoutPwa v-if="isInPwa" />
  <LayoutBrowser v-else :is-mobile />
</template>

<script setup lang="ts">
import {computed, onMounted} from "vue";
import LayoutPwa from "./layouts/LayoutPwa.vue";
import LayoutBrowser from "./layouts/LayoutBrowser.vue";

const isInPwa = computed(() => isInStandaloneModeCheck())
const isMobile = computed(() => isMobileCheck())

function isInStandaloneModeCheck(): boolean {
  return (
      window.matchMedia('(display-mode: standalone)').matches
      || window.navigator.standalone === true
  )
}

function isMobileCheck(): boolean {
  const ua = navigator.userAgent
  return /iPhone|iPad|iPod|Android/i.test(ua)
}

onMounted(() => {
  console.info(navigator.userAgent);
})
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
