<template>
  <div class="flex flex-col min-h-screen bg-[#e4e8e6] overflow-x-hidden">
    <RouterView v-slot="{ Component }">
      <Transition mode="out-in" name="slide">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
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
  //transition: transform 0.25s ease, opacity 0.25s ease;
}

.slide-enter-from {
  //transform: translateX(100%);
  //opacity: 0;
}

.slide-leave-to {
  //transform: translateX(-100%);
  //opacity: 0;
}
</style>
