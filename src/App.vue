<template>
  <div class="flex flex-col h-screen bg-[#e4e8e6]">
    <div class="flex-1 min-h-0 relative overflow-hidden">
      <RouterView v-slot="{ Component, route }">
        <Transition name="slide">
          <div :key="route.fullPath" class="h-full w-full">
            <component :is="Component" class="h-full overflow-y-auto" />
          </div>
        </Transition>
      </RouterView>
    </div>

    <ILayoutDock />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import ILayoutDock from './components/layout/ILayoutDock.vue'
import { useConfigurationStore } from './stores/configurationStore.ts'
import { useFertilizerStore } from './stores/fertilizerStore.ts'
import { usePlantStore } from './stores/plantStore.ts'
import { useWateringSchemaStore } from './stores/wateringSchemaStore.ts'

const plantStore = usePlantStore()
const fertilizerStore = useFertilizerStore()
const wateringSchemaStore = useWateringSchemaStore()
const configStore = useConfigurationStore()

async function sync() {
  await Promise.all([
    plantStore.syncPlants(),
    fertilizerStore.syncFertilizers(),
    wateringSchemaStore.syncWateringSchemas(),
  ])
  configStore.syncPlantListingConfiguration()
}

onMounted(sync)
</script>

<style>
.slide-enter-active,
.slide-leave-active {
  transition: transform 2.5s ease;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}
</style>
