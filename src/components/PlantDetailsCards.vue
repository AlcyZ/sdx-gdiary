<template>
  <PlantDetailsCardHeader
    :plant
  />

  <PlantDetailsCardGallery
    :key="plant.id"
    :plant
    @select-favorit="markFavorit"
  />

  <PlantDetailsCardActionWatering
    :plant
  />

  <PlantDetailsCardPhases
    :plant
  />

  <PlantDetailsCardActionHarvest
    :plant
  />

  <PlantDetailsCardHarvest
    :plant
  />

  <PlantDetailsCardWatering
    :plant
  />

  <PlantDetailsCardContainers
    :plant
  />

  <PlantDetailsCardActionBack />
</template>

<script lang="ts" setup>
import type { Plant, PlantImage } from '../modules/plants/types'

import { useToast } from '../composables/useToast.ts'
import { usePlantStore } from '../stores/plantStore.ts'
import PlantDetailsCardActionBack from './PlantDetailsCardActionBack.vue'
import PlantDetailsCardActionHarvest from './PlantDetailsCardActionHarvest.vue'
import PlantDetailsCardActionWatering from './PlantDetailsCardActionWatering.vue'
import PlantDetailsCardContainers from './PlantDetailsCardContainers.vue'
import PlantDetailsCardGallery from './PlantDetailsCardGallery.vue'
import PlantDetailsCardHeader from './PlantDetailsCardHeader.vue'
import PlantDetailsCardPhases from './PlantDetailsCardPhases.vue'
import PlantDetailsCardWatering from './PlantDetailsCardWatering.vue'
import PlantDetailsCardHarvest from "./PlantDetailsCardHarvest.vue";

interface Props {
  plant: Plant
}
interface Emits {
}

defineProps<Props>()
defineEmits<Emits>()

const plantStore = usePlantStore()
const { toast } = useToast()

async function markFavorit(image: PlantImage) {
  const result = await plantStore.markFavorit(image)

  result.ok
    ? toast('Bild als Favorit markiert', 'success')
    : toast('Es ist ein Fehler aufgetreten', 'error')
}
</script>
