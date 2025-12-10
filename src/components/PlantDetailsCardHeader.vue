<template>
  <ICard
    class="w-full max-w-3xl"
  >
    <div class="flex justify-between items-baseline">
      <ICardTitle
        as="h1"
        class="text-3xl"
      >
        {{ plantName }}
      </ICardTitle>
      <span class="text-sm text-gray-400">Tag {{ plantAge }} ({{ currentPhase.label }})</span>
    </div>

    <div class="flex space-x-2 mt-3">
      <IBadge variant="accent" class="text-base-100">
        <component :is="currentPhase.icon" :size="14" />
        {{ currentPhase.label }}
      </IBadge>

      <IBadge variant="neutral" class="text-base-100">
        <component :is="substrate.icon" :size="14" />
        {{ substrate.label }} ({{ substrate.size }})
      </IBadge>

      <IBadge v-if="plant.isHarvested" variant="success" class="text-base-100">
        <IconHarvested :size="14" />
        Geerntet
      </IBadge>
    </div>
  </ICard>
</template>

<script lang="ts" setup>
import type { Plant } from '../modules/plants/types'
import {
  Tractor as IconHarvested,
} from 'lucide-vue-next'
import { computed } from 'vue'
import { usePlant } from '../composables/usePlant.ts'
import { usePlantContainer } from '../composables/usePlantContainer.ts'
import { usePlantPhase } from '../composables/usePlantPhase.ts'
import IBadge from './ui/IBadge.vue'
import ICard from './ui/ICard.vue'
import ICardTitle from './ui/ICardTitle.vue'

interface Props {
  plant: Plant
}
interface Emits {

}

const { plant } = defineProps<Props>()
defineEmits<Emits>()

const { getPlantAge, getPlantName } = usePlant()
const { getPhaseIcon, getPhaseLabel } = usePlantPhase()
const { getContainerIcon, getContainerLabel } = usePlantContainer()

const plantName = computed(() => getPlantName(plant))
const plantAge = computed(() => getPlantAge(plant))

const currentPhase = computed(() => ({
  phase: plant.phase.phase,
  label: getPhaseLabel(plant.phase.phase),
  icon: getPhaseIcon(plant.phase.phase),
}))

const substrate = computed(() => ({
  label: getContainerLabel(plant.container.medium),
  icon: getContainerIcon(plant.container.medium),
  size: `${plant.container.volume}L`,
}))
</script>
