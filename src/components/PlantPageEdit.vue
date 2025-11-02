<template>
  <div v-if="plant">
    edit: {{ plant?.strain || 'not selected' }}

    <button
      class="btn"
      @click="$emit('back')"
    >
      Zurück
    </button>
  </div>
  <PlantPageSelectionError
    v-else
  />
</template>

<script lang="ts" setup>
import type { Plant } from '../modules/plants/types'
import PlantPageSelectionError from './PlantPageSelectionError.vue'

interface Props {
  plant: Plant | null
}
interface Emits {
  back: []
  backAndSync: []
}

defineProps<Props>()
defineEmits<Emits>()
</script>
