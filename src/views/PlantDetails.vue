<template>
  <div class="w-full flex flex-col items-center gap-y-5">
    <IMobileBack @back="$router.push('/plants')" />

    <PlantDetailsCards
      v-if="plant"
      :plant="plant"
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
import { onMounted } from 'vue'
import PlantDetailsCards from '../components/PlantDetailsCards.vue'
import IFab from '../components/ui/IFab.vue'
import IMobileBack from '../components/ui/IMobileBack.vue'
import { usePlant } from '../composables/usePlant.ts'
import { usePlantView } from '../composables/usePlantView.ts'

interface Props {
}
interface Emits {
}

defineProps<Props>()
defineEmits<Emits>()

const {
  plant,
  syncPlant,
} = usePlant()

const { fabActions } = usePlantView()

onMounted(syncPlant)
</script>
