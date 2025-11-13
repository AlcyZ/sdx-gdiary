<template>
  <ICard
    v-if="plant.images.length > 0"
    class="w-full max-w-3xl"
  >
    <ICardTitle class="text-3xl">
      Gallery
    </ICardTitle>

    <ICarousel
      class="rounded-box"
    >
      <ICarouselItem
        v-for="(image, i) in plant.images"
        :key="i"
        class="w-full aspect-square md:aspect-video overflow-auto relative"
      >
        <PlantDetailsCardGalleryImage
          :image="image"
        />

        <div class="join join-vertical absolute top-2 left-2">
          <IBtn
            square
            class="join-item p-2 border-none bg-gray-900/60"
            @click="$emit('selectFavorit', image)"
          >
            <IconStar
              class="w-6 h-6"
              :class="plant.favoritImage?.id === image.id ? 'fill-amber-400 text-amber-400' : 'stroke-base-300/60'"
            />
          </IBtn>

          <IBtn
            square
            class="join-item p-2 border-none bg-gray-900/80"
            @click="openDownloadModal(image)"
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
import type PlantRepository from '../modules/plants/plant_repository.ts'
import type { Plant, PlantImage } from '../modules/plants/types'
import dayjs from 'dayjs'
import {
  Download as IconDownload,
  Star as IconStar,
} from 'lucide-vue-next'
import { inject } from 'vue'
import { useModal } from '../composables/useModal.ts'
import { REPO_PLANT } from '../di_keys.ts'
import { doThen, mapMimeToExtension } from '../util.ts'
import PlantDetailsCardGalleryImage from './PlantDetailsCardGalleryImage.vue'
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

const plantRepo = inject(REPO_PLANT) as PlantRepository

const { showConfirmationModal } = useModal()

function openDownloadModal(image: PlantImage) {
  const onClick = async () => {
    doThen(await plantRepo.getImageByImageId(image.id), (img) => {
      const extension = mapMimeToExtension(img.mime)
      const plantName = plant.name !== undefined && plant.name !== ''
        ? `${plant.name}_${plant.strain}`
        : plant.strain
      const prefix = plantName.replaceAll(' ', '_')
      const time = dayjs().format('HH_mm_ss')

      const filename = `${prefix}-${image.id}_${time}${extension}`
      const a = document.createElement('a')

      const blob = new Blob([img.data], { type: img.mime })
      const url = URL.createObjectURL(blob)

      a.href = url
      a.download = filename

      a.click()
      URL.revokeObjectURL(url)
    })
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
