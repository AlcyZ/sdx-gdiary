<template>
  <motion.ul
    class="w-full flex flex-col items-center gap-y-5 mt-4"
    :variants="fadeLeft.list"
    initial="from"
    animate="to"
  >
    <motion.li
      :variants="fadeLeft.item"
      class="w-full"
    >
      <PlantDetailsCardHeader
        :plant
      />
    </motion.li>
    <motion.li
      :variants="fadeLeft.item"
      class="w-full"
    >
      <PlantDetailsCardGallery
        :key="plant.id"
        :plant
        @select-favorit="markFavorit"
      />
    </motion.li>
    <motion.li
      :variants="fadeLeft.item"
      class="w-full"
    >
      <PlantDetailsCardActionWatering
        :plant
      />
    </motion.li>
    <motion.li
      :variants="fadeLeft.item"
      class="w-full"
    >
      <PlantDetailsCardPhases
        :plant
      />
    </motion.li>
    <motion.li
      :variants="fadeLeft.item"
      class="w-full"
    >
      <PlantDetailsCardActionHarvest
        :plant
      />
    </motion.li>
    <motion.li
      :variants="fadeLeft.item"
      class="w-full"
    >
      <PlantDetailsCardHarvest
        :plant
      />
    </motion.li>
    <motion.li
      :variants="fadeLeft.item"
      class="w-full"
    >
      <PlantDetailsCardWatering
        :plant
      />
    </motion.li>
    <motion.li
      :variants="fadeLeft.item"
      class="w-full"
    >
      <PlantDetailsCardContainers
        :plant
      />
    </motion.li>
    <motion.li
      :variants="fadeLeft.item"
      class="w-full"
    >
      <PlantDetailsCardActionBack />
    </motion.li>
  </motion.ul>
</template>

<script lang="ts" setup>
import type { Plant, PlantImage } from '../modules/plants/types'
import { motion } from 'motion-v'
import useStaggerAnimation from '../composables/useStaggerAnimation.ts'
import { useToast } from '../composables/useToast.ts'
import { usePlantStore } from '../stores/plantStore.ts'
import PlantDetailsCardActionBack from './PlantDetailsCardActionBack.vue'
import PlantDetailsCardActionHarvest from './PlantDetailsCardActionHarvest.vue'
import PlantDetailsCardActionWatering from './PlantDetailsCardActionWatering.vue'
import PlantDetailsCardContainers from './PlantDetailsCardContainers.vue'
import PlantDetailsCardGallery from './PlantDetailsCardGallery.vue'
import PlantDetailsCardHarvest from './PlantDetailsCardHarvest.vue'
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

const plantStore = usePlantStore()
const { toast } = useToast()

const { fadeLeft } = useStaggerAnimation()

async function markFavorit(image: PlantImage) {
  const result = await plantStore.markFavorit(image)

  result.ok
    ? toast('Bild als Favorit markiert', 'success')
    : toast('Es ist ein Fehler aufgetreten', 'error')
}
</script>
