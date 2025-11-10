<template>
  <LayoutDock />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import LayoutDock from './layouts/LayoutDock.vue'
import { useFertilizerStore } from './stores/fertilizerStore.ts'
import { usePlantStore } from './stores/plantStore.ts'
import { useWateringSchemaStore } from './stores/wateringSchemaStore.ts'

const plantStore = usePlantStore()
const fertilizerStore = useFertilizerStore()
const wateringSchemaStore = useWateringSchemaStore()

async function sync() {
  await Promise.all([
    plantStore.syncPlants(),
    fertilizerStore.syncFertilizers(),
    wateringSchemaStore.syncWateringSchemas(),
  ])
}

onMounted(sync)
</script>
