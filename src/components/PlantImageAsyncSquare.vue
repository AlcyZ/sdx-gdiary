<template>
  <PlantImgAsync
    :key="image.id"
    :image
  >
    <template #default="{ src }">
      <div
        class="
      w-full
      aspect-square
      overflow-hidden
      shadow-md
      bg-gray-200
    "
      >
        <img
          :src="src"
          :alt="`plant-image-${image.id}`"
          class="w-full h-full object-cover"
        >
      </div>
    </template>
  </PlantImgAsync>
</template>

<script lang="ts" setup>
import type { PlantImage } from '../modules/plants/types'
import PlantImgAsync from './PlantImgAsync.vue'

interface Props {
  image: PlantImage
}
interface Emits {

}

const { image } = defineProps<Props>()
defineEmits<Emits>()
</script>
