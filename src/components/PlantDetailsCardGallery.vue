<template>
  <ICard
    v-if="images.length > 0"
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

        <div class="join join-vertical absolute top-2 left-2">
          <IBtn
            square
            class="join-item p-2 border-none bg-gray-900/60"
            @click="$emit('selectFavorit', image.image)"
          >
            <IconStar
              class="w-6 h-6"
              :class="plant.favoritImage?.id === image.image.id ? 'fill-amber-400 text-amber-400' : 'stroke-base-300/60'"
            />
          </IBtn>

          <IBtn
            square
            class="join-item p-2 border-none bg-gray-900/80"
            @click="openDownloadModal(image.image)"
          >
            <IconDownload
              class="w-6 h-6 stroke-base-300/60"
            />
          </IBtn>
        </div>
      </ICarouselItem>
    </ICarousel>
  </ICard>
</template>

<script lang="ts" setup>
import type { Plant, PlantImage } from '../modules/plants/types'
import dayjs from 'dayjs'
import {
  Download as IconDownload,
  Star as IconStar,
} from 'lucide-vue-next'
import { computed } from 'vue'
import { useModal } from '../composables/useModal.ts'
import { mapMimeToExtension } from '../util.ts'
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

const { showConfirmationModal } = useModal()

const images = computed(() => plant.images.map((image, index) => ({
  alt: `plant-${plant.id}-image-${index}`,
  src: URL.createObjectURL(image.file),
  image,
})))

function openDownloadModal(image: PlantImage) {
  const onClick = () => {
    const extension = mapMimeToExtension(image.file.type)
    const plantName = plant.name !== undefined && plant.name !== ''
      ? `${plant.name}_${plant.strain}`
      : plant.strain
    const prefix = plantName.replaceAll(' ', '_')
    const time = dayjs().format('HH_mm_ss')

    const filename = `${prefix}-${image.id}_${time}${extension}`
    const a = document.createElement('a')
    const url = URL.createObjectURL(image.file)

    a.href = url
    a.download = filename

    a.click()
    URL.revokeObjectURL(url)
  }

  showConfirmationModal({
    title: 'Bild herunterladen',
    actions: [
      {
        label: 'Download',
        icon: IconDownload,
        onClick,
        class: 'btn-secondary text-base-100',
      },
    ],
  })
}
</script>
