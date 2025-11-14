<template>
  <LayoutDock>
    <div class="w-full flex flex-col items-center gap-y-5 p-4" :class="{ 'flex-1 justify-center': !plantStore.hasPlants }">
      <template v-if="plantStore.hasPlants">
        <header class="w-full max-w-3xl">
          <h1 class="text-4xl font-extrabold">
            Pflanzen
          </h1>
        </header>

        <PlantListingCard />
      </template>

      <PlantListingEmpty
        v-else
      />

      <IFab
        :actions="fabActions"
        class="mb-14"
        :icon="IconMenu"
      />
    </div>
  </LayoutDock>
</template>

<script lang="ts" setup>
import {
  Cog as IconMenu,
} from 'lucide-vue-next'
import PlantListingCard from '../components/PlantListingCard.vue'
import PlantListingEmpty from '../components/PlantListingEmpty.vue'
import IFab from '../components/ui/IFab.vue'
import { usePlantView } from '../composables/usePlantView.ts'
import LayoutDock from '../layouts/LayoutDock.vue'
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
