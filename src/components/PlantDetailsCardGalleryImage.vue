<template>
  <div
    class="w-full h-full inline-block relative overflow-hidden bg-[#E0E0E0]"
    @click="dev"
  >
    <div
      v-if="isLoading"
      class="absolute top-0 left-0 w-full h-full flex items-center justify-center z-10 bg-white/50"
    >
      <span style="font-size: 10px; color: #666;">Lädt Bild (ID: {{ image.id }})</span>
    </div>

    <img
      :src="imgSrc"
      alt="todo: proper alt"
      class="w-full h-full object-cover"
      loading="lazy"
    >
  </div>
</template>

<script lang="ts" setup>
import type { PlantImage } from '../modules/plants/types'
import { inject, onMounted, ref } from 'vue'
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

function dev() {
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
  }, 3000)
}

async function loadImage() {
  isLoading.value = true
  const imageOption = await plantRepo?.getImageByImageId(image.id) || none()

  isLoading.value = false
  imgSrc.value = imageOption.exist
    ? URL.createObjectURL(imageOption.value.image)
    : BASE64_PLACEHOLDER
}

onMounted(loadImage)
</script>
