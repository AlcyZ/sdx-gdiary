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
