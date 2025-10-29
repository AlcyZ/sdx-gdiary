<template>
  <div class="bg-neutral-950 text-neutral-200 w-screen h-screen">
    <div class="text-2xl flex items-center justify-center text-center">
      <h1 v-if="isMobile">
        Um die App verwenden zu können, musst du sie auf deinen Home-Bildschrim installieren.
      </h1>

      <h1 v-else>
        Bitte verwende dein Mobiles Gerät.
      </h1>
    </div>

    <div class="p-12 flex items-center justify-center">
      <div class="">
        <button
          class="btn btn-primary"
        >
          Kamera öffnen
        </button>

        <button
          class="btn btn-secondary"
        >
          Kamera stoppen
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

interface Props {
  isMobile: boolean
}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()
</script>
