<template>
  <div class="flex justify-center py-4">
    <PlantHarvestEdit
      v-if="plantStore.plant && harvest"
      :plant="plantStore.plant"
      :harvest="harvest"
      @updated="handleHarvestUpdated"
    />
    <NotFound
      v-else
    />
  </div>
</template>

<script lang="ts" setup>
import type { Harvest } from '../modules/harvest/types'
import type { Option } from '../types'
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PlantHarvestEdit from '../components/PlantHarvestEdit.vue'
import { usePageLayout } from '../composables/usePageLayout.ts'
import { ROUTE_PLANT_DETAILS } from '../routes.ts'
import { usePlantStore } from '../stores/plantStore.ts'
import { none, some } from '../util.ts'
import NotFound from './NotFound.vue'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

usePageLayout({
  topNavigation: true,
})

const plantStore = usePlantStore()
const route = useRoute()
const router = useRouter()

async function handleHarvestUpdated() {
  await Promise.all([
    plantStore.syncData(),
    router.push({
      name: ROUTE_PLANT_DETAILS,
      params: { plantId: plantStore.plant?.id },
    }),
  ])
}

const harvest = computed((): Harvest | undefined => {
  if (!plantStore.plant)
    return undefined

  const harvestId = getHarvestIdFromRoute()
  if (!harvestId.exist)
    return undefined

  return plantStore.plant.logs.harvests.find(harvest => harvest.id === harvestId.value)
})

function getHarvestIdFromRoute(): Option<number> {
  const harvestId = Number(route.params.harvestId)

  if (Number.isNaN(harvestId)) {
    console.warn('[HarvestPlantEdit.getHarvestIdFromRoute]: harvestId not found in route params:', route.params)
    return none()
  }

  return some(harvestId)
}

onMounted(async () => await plantStore.syncPlantWithRoute())
</script>
