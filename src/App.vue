<template>
  <div class="flex flex-col h-screen bg-[#e4e8e6]">
    <div class="flex-1 min-h-0 relative overflow-hidden">
      <RouterView v-slot="{ Component, route }">
        <Transition
          :name="getTransitionName(route)"
          enter-active-class="timing-ease duration-250"
          leave-active-class="timing-ease duration-250"
        >
          <div :key="route.fullPath" class="h-full w-full absolute inset-0">
            <component :is="Component" class="h-full overflow-y-auto" />
          </div>
        </Transition>
      </RouterView>
    </div>

    <ILayoutDock v-if="isDockVisible" />
  </div>
</template>

<script setup lang="ts">
import type { RouteLocationNormalizedLoadedGeneric } from 'vue-router'
import { onMounted } from 'vue'
import ILayoutDock from './components/layout/ILayoutDock.vue'
import { useLayout } from './composables/useLayout.ts'
import { useConfigurationStore } from './stores/configurationStore.ts'
import { useFertilizerStore } from './stores/fertilizerStore.ts'
import { usePlantStore } from './stores/plantStore.ts'
import { useWateringSchemaStore } from './stores/wateringSchemaStore.ts'

const plantStore = usePlantStore()
const fertilizerStore = useFertilizerStore()
const wateringSchemaStore = useWateringSchemaStore()
const configStore = useConfigurationStore()

const {
  isDockVisible,
} = useLayout()

async function sync() {
  await Promise.all([
    plantStore.syncPlants(),
    fertilizerStore.syncFertilizers(),
    wateringSchemaStore.syncWateringSchemas(),
  ])
  configStore.syncPlantListingConfiguration()
}

function getTransitionName(route: RouteLocationNormalizedLoadedGeneric) {
  return typeof route.meta.transition === 'string'
    ? route.meta.transition
    : 'slide-left'
}

onMounted(sync)
</script>

<style>
.timing-ease {
  transition-timing-function: ease;
}

.slide-left-enter-from {
  transform: translateX(100%);
}

.slide-left-enter-to {
  transform: translateX(0);
}

.slide-left-leave-from {
  transform: translateX(0);
}

.slide-left-leave-to {
  transform: translateX(-100%);
}

.slide-right-enter-from {
  transform: translateX(-100%);
}

.slide-right-enter-to {
  transform: translateX(0);
}

.slide-right-leave-from {
  transform: translateX(0);
}

.slide-right-leave-to {
  transform: translateX(100%);
}

.slide-up-enter-from {
  transform: translateY(100%);
}

.slide-up-enter-to {
  transform: translateY(0);
}

.slide-up-leave-from {
  transform: translateY(0);
}

.slide-up-leave-to {
  transform: translateY(-100%);
}

.slide-down-enter-from {
  transform: translateY(-100%);
}

.slide-down-enter-to {
  transform: translateY(0);
}

.slide-down-leave-from {
  transform: translateY(0);
}

.slide-down-leave-to {
  transform: translateY(100%);
}
</style>
