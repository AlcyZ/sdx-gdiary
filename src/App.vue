<template>
  <LayoutDock />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import LayoutDock from './layouts/LayoutDock.vue'
import { useFertilizerStore } from './stores/fertilizerStore.ts'
import { useWateringSchemaStore } from './stores/wateringSchemaStore.ts'

const fertilizerStore = useFertilizerStore()
const wateringSchemaStore = useWateringSchemaStore()

async function sync() {
  await Promise.all([
    fertilizerStore.syncFertilizers(),
    wateringSchemaStore.syncWateringSchemas(),
  ])
}

onMounted(sync)
</script>
