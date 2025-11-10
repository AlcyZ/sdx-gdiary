<template>
  <PlantDetailsCardHeader
    :plant
  />

  <PlantDetailsCardActionWatering
    :plant
  />

  <PlantDetailsCardPhases
    :plant
  />

  <PlantDetailsCardWatering
    :plant
  />

  <PlantDetailsCardActionBack />
</template>

<script lang="ts" setup>
import type { Plant } from '../modules/plants/types'

import PlantDetailsCardActionBack from './PlantDetailsCardActionBack.vue'
import PlantDetailsCardActionWatering from './PlantDetailsCardActionWatering.vue'
import PlantDetailsCardHeader from './PlantDetailsCardHeader.vue'
import PlantDetailsCardPhases from './PlantDetailsCardPhases.vue'
import PlantDetailsCardWatering from './PlantDetailsCardWatering.vue'

interface Props {
  plant: Plant
}
interface Emits {
}

defineProps<Props>()
defineEmits<Emits>()
</script>
