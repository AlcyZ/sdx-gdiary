<template>
  <div class="w-full flex flex-col items-center gap-y-5">
    <IMobileBack @back="$router.push('/plants')" />

    <PlantDetailsCards
      v-if="plantStore.plant"
      :plant="plantStore.plant"
    />
    <IFab
      :actions="fabActions"
      class="mb-14"
      :icon="IconMenu"
    />
  </div>
</template>

<script lang="ts" setup>
import { Cog as IconMenu } from 'lucide-vue-next'
import PlantDetailsCards from '../components/PlantDetailsCards.vue'
import IFab from '../components/ui/IFab.vue'
import IMobileBack from '../components/ui/IMobileBack.vue'
import { usePlantView } from '../composables/usePlantView.ts'
import { usePlantStore } from '../stores/plantStore.ts'

interface Props {
}
interface Emits {
}

defineProps<Props>()
defineEmits<Emits>()

const { fabActions } = usePlantView()

const plantStore = usePlantStore()
</script>
