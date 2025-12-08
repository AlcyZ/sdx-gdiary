<template>
  <slot name="default" :src="imgSrc" :is-loading="isLoading" />
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
defineSlots<{
  default: (props: { src: string, isLoading: boolean }) => any
}>()

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
