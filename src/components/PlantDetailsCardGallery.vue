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
        class="w-full aspect-square md:aspect-video overflow-auto relative"
      >
        <img :src="image.src" :alt="image.alt" class="object-cover">

        <IBtn
          square
          class="absolute top-2 right-2 p-2 bg-gray-900 bg-opacity-50 border-none"
          @click="$emit('selectFavorit', image.image)"
        >
          <IconStar
            class="w-6 h-6"
            :class="i === 1 ? 'fill-amber-400 text-amber-400' : undefined"
          />
        </IBtn>
      </ICarouselItem>
    </ICarousel>
  </ICard>
</template>

<script lang="ts" setup>
import type { Plant, PlantImage } from '../modules/plants/types'
import { Star as IconStar } from 'lucide-vue-next'
import { computed } from 'vue'
import IBtn from './ui/IBtn.vue'
import ICard from './ui/ICard.vue'
import ICardTitle from './ui/ICardTitle.vue'
import ICarousel from './ui/ICarousel.vue'
import ICarouselItem from './ui/ICarouselItem.vue'

interface Props {
  plant: Plant
}
interface Emits {
  selectFavorit: [image: PlantImage]
}

const { plant } = defineProps<Props>()
defineEmits<Emits>()

const images = computed(() => plant.images.map((image, index) => ({
  alt: `plant-${plant.id}-image-${index}`,
  src: URL.createObjectURL(image.file),
  image,
})))
</script>
