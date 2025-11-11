<template>
  <ICard
    class="w-full max-w-3xl"
  >
    <ICardTitle class="text-3xl">
      Gallery
    </ICardTitle>

    <ICarousel
      class="rounded-box"
    >
      <ICarouselItem
        v-for="(image, i) in images"
        :key="i"
        class="w-full aspect-square md:aspect-video overflow-auto"
      >
        <img :src="image.src" :alt="image.alt" class="object-cover">
      </ICarouselItem>
    </ICarousel>
  </ICard>
</template>

<script lang="ts" setup>
import type { Plant } from '../modules/plants/types'
import { computed } from 'vue'
import ICard from './ui/ICard.vue'
import ICardTitle from './ui/ICardTitle.vue'
import ICarousel from './ui/ICarousel.vue'
import ICarouselItem from './ui/ICarouselItem.vue'

interface Props {
  plant: Plant
}
interface Emits {

}

const { plant } = defineProps<Props>()
defineEmits<Emits>()

const images = computed(() => plant.images.map((image, index) => ({
  alt: `plant-${plant.id}-image-${index}`,
  src: URL.createObjectURL(image.file),
})))
</script>
