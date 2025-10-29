<template>
  <LayoutPwa v-if="isInPwa" />
  <LayoutBrowser v-else :is-mobile />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import LayoutBrowser from './layouts/LayoutBrowser.vue'
import LayoutPwa from './layouts/LayoutPwa.vue'

const isInPwa = computed(() => isInStandaloneModeCheck())
const _isMobile = computed(() => isMobileCheck())

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
</script>
