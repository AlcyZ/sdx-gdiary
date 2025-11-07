<template>
  <IMobileBack @back="$emit('back')" />
  <ICard
    class="w-full max-w-3xl"
  >
    <div class="flex justify-between items-baseline">
      <h1 class="text-3xl font-bold">
        {{ plantName }}
      </h1>
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
    </div>

    <template #actions>
      <IBtn
        @click="$emit('back')"
      >Zurück</IBtn>
    </template>
  </ICard>
</template>

<script lang="ts" setup>
import type { Component } from 'vue'
import type { Plant, PlantPhase } from '../modules/plants/types'

import { formatDate } from 'sdx-php-date'
import { computed } from 'vue'
import { usePlantPhase } from '../composables/usePlantPhase.ts'
import { usePlantSubstrate } from '../composables/usePlantSubstrate.ts'
import IBadge from './IBadge.vue'
import ICard from './ICard.vue'
import dayjs from "dayjs";
import IMobileBack from "./IMobileBack.vue";
import IBtn from "./IBtn.vue";

interface Props {
  plant: Plant
}
interface Emits {
  addPour: []
  back: []
}

type PhaseData = PlantPhase & { label: string, icon: Component, started: string }

const { plant } = defineProps<Props>()
defineEmits<Emits>()

const { getPhaseIcon, getPhaseLabel } = usePlantPhase()
const { getSubstrateIcon, getSubstrateLabel } = usePlantSubstrate()

const plantName = computed(() => {
  const fallback = plant?.strain || 'Unknown'

  if (plant?.name) {
    return plant.name !== '' ? `${plant.name} (${fallback})` : fallback
  }

  return fallback
})

const currentPhase = computed(() => ({
  phase: plant.phase.phase,
  label: getPhaseLabel(plant.phase.phase),
  icon: getPhaseIcon(plant.phase.phase),
}))

const substrate = computed(() => ({
  substrate: plant.substrate.substrate,
  label: getSubstrateLabel(plant.substrate.substrate),
  icon: getSubstrateIcon(plant.substrate.substrate),
  size: plant.substrate.size,
}))

const plantAge = computed(() => {
  const startDateString = plant.phases.find(phase => phase.phase === 'germination')?.startedAt
    || dayjs().format('YYYY-MM-DDTHH:mm')

  const startDate = dayjs(startDateString)
  const compareDate = plant.phase.phase === 'germination' ? dayjs() : dayjs(plant.phase.startedAt)

  return compareDate.diff(startDate, 'days')
})

const plantPhases = computed(
  (): Array<PhaseData> => plant?.phases
    .map((phase: PlantPhase) => ({
      ...phase,
      label: getPhaseLabel(phase.phase),
      icon: getPhaseIcon(phase.phase),
      started: formatStartedAt(phase.startedAt),
    }))
    || [],
)

function formatStartedAt(startedAt: string): string {
  const date = new Date(startedAt)
  return formatDate('d.m.Y', date)
}
</script>
