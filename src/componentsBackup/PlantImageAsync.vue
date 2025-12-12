<template>
  <PlantImgAsync
    :image
  >
    <template #default="{ src, isLoading }">
      <IImgAsync
        :img-src="src"
        :loading="isLoading"
        :size-class="sizeClass"
      />
    </template>
  </PlantImgAsync>
</template>

<script lang="ts" setup>
import type { PlantImage } from '../modules/plants/types'
import PlantImgAsync from './PlantImgAsync.vue'
import IImgAsync from './ui/IImgAsync.vue'

interface Props {
  image: PlantImage
  sizeClass: string
}
interface Emits {

}

const { image } = defineProps<Props>()
defineEmits<Emits>()
</script>
