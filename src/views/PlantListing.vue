<template>
  <div class="w-full flex flex-col items-center gap-y-5">
    <header class="w-full max-w-3xl p-4">
      <h1 class="text-4xl font-extrabold">
        Pflanzen
      </h1>
    </header>

    <PlantListingCard />

    <IFab
      :actions="fabActions"
      class="mb-14"
      :icon="IconMenu"
    />
  </div>
</template>

<script lang="ts" setup>
import {
  Cog as IconMenu,
} from 'lucide-vue-next'
import PlantListingCard from '../components/PlantListingCard.vue'
import IFab from '../components/ui/IFab.vue'
import { usePlantView } from '../composables/usePlantView.ts'

interface Props {
}
interface Emits {
}

defineProps<Props>()
defineEmits<Emits>()

const { fabActions } = usePlantView()
</script>
