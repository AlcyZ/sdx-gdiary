<template>
  <div>
    <div
      v-for="(plant, i) in plantStore.plants"
      :key="i"
    >
      {{ plant.strain }}
      -
      <RouterLink :to="{ name: ROUTE_PLANT_DETAILS, params: { plantId: plant.id } }">
        Details
      </RouterLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useLayout } from '../composables/useLayout.ts'
import { ROUTE_PLANT_DETAILS } from '../routes.ts'
import { usePlantStore } from '../stores/plantStore.ts'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

const plantStore = usePlantStore()

useLayout({
  dockVisible: true,
  topNavigationVisible: false,
})
</script>
