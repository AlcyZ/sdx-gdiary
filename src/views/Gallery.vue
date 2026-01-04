<template>
  <GalleryEmptyPlants
    v-if="hasNoPlants"
  />
  <GalleryEmptyImages
    v-else-if="hasNoImages"
  />
  <GalleryPlants
    v-else
  />
</template>

<script lang="ts" setup>
import GalleryEmptyImages from '../components/GalleryEmptyImages.vue'
import GalleryEmptyPlants from '../components/GalleryEmptyPlants.vue'
import GalleryPlants from '../components/GalleryPlants.vue'
import { usePlantStore } from '../stores/plantStore.ts'
import {computed} from "vue";
import {usePageLayout} from "../composables/usePageLayout.ts";

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

usePageLayout({
  dock: true,
})

const plantStore = usePlantStore()

const hasNoPlants = computed(() => !plantStore.hasPlants)
const hasNoImages = computed(() => !plantStore.plants.some(plant => plant.images.length > 0))
</script>
