<template>
  <LayoutForm>
    <template #top-navigation>
      <TopNavigation
        @back="$router.back()"
      />
    </template>

    <div class="flex justify-center py-4">
      <PlantHarvest
        v-if="plantStore.plant"
        :plant="plantStore.plant"
        @saved="handleHarvestSessionSaved"
      />
      <NotFound
        v-else
      />
    </div>
  </LayoutForm>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import TopNavigation from '../componentsBackup/layout/TopNavigation.vue'
import PlantHarvest from '../componentsBackup/PlantHarvest.vue'
import LayoutForm from '../layouts/LayoutForm.vue'
import { ROUTE_PLANT_DETAILS } from '../routes.ts'
import { usePlantStore } from '../stores/plantStore.ts'
import NotFound from './NotFound.vue'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

const plantStore = usePlantStore()
const router = useRouter()

async function handleHarvestSessionSaved() {
  await Promise.all([
    plantStore.syncData(),
    router.push({
      name: ROUTE_PLANT_DETAILS,
      params: { plantId: plantStore.plant?.id },
    }),
  ])
}

onMounted(async () => await plantStore.syncPlantWithRoute())
</script>
