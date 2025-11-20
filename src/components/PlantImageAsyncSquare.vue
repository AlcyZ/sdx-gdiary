<template>
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
      :src="imgSrc"
      :alt="`plant-image-${image.id}`"
      class="w-full h-full object-cover"
    >
  </div>
</template>

<script lang="ts" setup>
import type { PlantImage } from '../modules/plants/types'
import { inject, ref, watch } from 'vue'
import { REPO_PLANT } from '../di_keys.ts'
import { BASE64_PLACEHOLDER, none } from '../util.ts'

interface Props {
  image: PlantImage
}
interface Emits {

}

const { image } = defineProps<Props>()
defineEmits<Emits>()

const plantRepo = inject(REPO_PLANT)

const imgSrc = ref(BASE64_PLACEHOLDER)

const isLoading = ref(false)

watch(() => image, newImage => loadImage(newImage), { immediate: true })

async function loadImage(plantImage: PlantImage) {
  isLoading.value = true
  const imageOption = await plantRepo?.getImageByImageId(plantImage.id) || none()

  isLoading.value = false
  if (imageOption.exist) {
    const blob = new Blob([imageOption.value.data], { type: imageOption.value.mime })
    imgSrc.value = URL.createObjectURL(blob)
  }
  else {
    imgSrc.value = BASE64_PLACEHOLDER
  }
}
</script>
