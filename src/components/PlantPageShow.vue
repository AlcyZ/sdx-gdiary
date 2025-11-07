<template>
  <PlantPageShowOverview
    v-if="page === 'show'"
    :plant="plant"
    @add-pour="changePage('add-pour')"
  />
  <PlantPageShowAddPouring
    v-else-if="page === 'add-pour'"
    :fertilizers="fertilizers"
    :plant="plant"
    @back="back"
    @back-and-sync="backAndSync"
  />
</template>

<script lang="ts" setup>
import type { Fertilizer } from '../modules/nutrients/types'

import type { Plant } from '../modules/plants/types'
import { usePage } from '../composables/usePage.ts'
import PlantPageShowAddPouring from './PlantPageShowAddPouring.vue'
import PlantPageShowOverview from './PlantPageShowOverview.vue'

interface Props {
  plant: Plant
  fertilizers: Array<Fertilizer>
}
interface Emits {
  back: []
  syncPlant: [plant: Plant]
}

const { plant } = defineProps<Props>()
const emit = defineEmits<Emits>()

type Subpage = 'show' | 'add-pour'

const { page, changePage } = usePage<Subpage>('add-pour')

function back() {
  changePage('show')
}

function backAndSync() {
  back()
  emit('syncPlant', plant)
}
</script>
