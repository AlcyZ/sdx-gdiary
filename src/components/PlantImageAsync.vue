<template>
  <IImgAsync
    :img-src="imgSrc"
    :loading="isLoading"
    :size-class="sizeClass"
  />
</template>

<script lang="ts" setup>
import type { PlantImage } from '../modules/plants/types'
import { inject, onMounted, ref } from 'vue'
import { REPO_PLANT } from '../di_keys.ts'
import { BASE64_PLACEHOLDER, none } from '../util.ts'
import IImgAsync from './ui/IImgAsync.vue'

interface Props {
  image: PlantImage
  sizeClass: string
}
interface Emits {

}

const { image } = defineProps<Props>()
defineEmits<Emits>()

const plantRepo = inject(REPO_PLANT)

const imgSrc = ref(BASE64_PLACEHOLDER)

const isLoading = ref(false)

async function loadImage() {
  isLoading.value = true
  const imageOption = await plantRepo?.getImageByImageId(image.id) || none()

  isLoading.value = false
  if (imageOption.exist) {
    const blob = new Blob([imageOption.value.data], { type: imageOption.value.mime })
    imgSrc.value = URL.createObjectURL(blob)
  }
  else {
    imgSrc.value = BASE64_PLACEHOLDER
  }
}

onMounted(loadImage)
</script>
