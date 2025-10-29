<template>
  <div class="bg-neutral-200 text-neutral-800 w-screen h-screen">
    <div class="text-2xl flex items-center justify-center text-center">
      <SampleCamera v-if="!isMobile" />

      <h1 v-else>
        Bitte verwende dein Mobiles Gerät.
      </h1>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SampleCamera from '../components/SampleCamera.vue'

interface Props {
  isMobile: boolean
}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()
</script>
