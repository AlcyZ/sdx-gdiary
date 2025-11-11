<template>
  <LayoutDock>
    <template #top-navigation>
      <TopNavigation
        :title="plantName"
        :actions="sampleActions"
        @back="$router.push('/plants')"
      />
    </template>

    <div class="w-full flex flex-col items-center gap-y-5 mt-4">
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
  </LayoutDock>
</template>

<script lang="ts" setup>
import type { TopNavigationAction } from '../types'
import {
  Trash as IconDelete,
  Edit as IconEdit,
  Cog as IconMenu,
  Camera as IconPhoto,
} from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
import TopNavigation from '../components/layout/TopNavigation.vue'
import PlantDetailsCards from '../components/PlantDetailsCards.vue'
import IFab from '../components/ui/IFab.vue'
import { usePlant } from '../composables/usePlant.ts'
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
const { getPlantName } = usePlant()

const plantName = computed(() => plantStore.plant ? getPlantName(plantStore.plant) : '')

onMounted(async () => await plantStore.syncPlantWithRoute())

const sampleActions = ref<Array<TopNavigationAction>>([
  {
    label: 'Bild hinzufügen',
    icon: IconPhoto,
    onClick: () => console.warn('todo: implement plant images'),
  },
  {
    label: 'Bearbeiten',
    icon: IconEdit,
    onClick: () => console.warn('todo: implement edit plant'),
  },
  {
    label: 'Löschen',
    icon: IconDelete,
    onClick: () => console.warn('todo: implement delete plant'),
  },
])
</script>
