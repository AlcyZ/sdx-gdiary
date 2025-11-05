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
}

const { plant } = defineProps<Props>()
defineEmits<Emits>()

type Subpage = 'show' | 'add-pour'

const { page, changePage } = usePage<Subpage>('add-pour')

function back() {
  changePage('show')
}
</script>
