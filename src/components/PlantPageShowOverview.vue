<template>
  <div class="w-full flex flex-col items-center gap-y-5">
    <IMobileBack @back="$emit('back')" />
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
      </div>
    </ICard>

    <ICard
      class="w-full max-w-3xl"
    >
      <IBtn
        variant="accent"
        class="w-full text-base-100"
        size="lg"
        @click="$emit('addPour')"
      >
        <IconPlus />
        Neuer Gieß-Eintrag
      </IBtn>
    </ICard>

    <ICard
      class="w-full max-w-3xl"
    >
      <ICardTitle
        as="h2"
        class="text-xl"
      >
        Phasen-Verlauf
      </ICardTitle>

      <ITimeline vertical>
        <ITimelineItem
          v-for="(phase, i) in plantPhases"
          :key="i"
          box-end
          :hide-start-line="i === 0"
          :hide-end-line="i === plantPhases.length - 1"
        >
          <template #end>
            <template v-if="phase.phase === currentPhase.phase">
              <span class="font-semibold">{{ phase.label }}</span>
              <div class="text-xs">
                Start: {{ phase.startedAt }}
              </div>
              <div
                v-if="phase.info"
                class="text-xs opacity-80 italic"
              >
                {{ phase.info }}
              </div>
            </template>
            <template v-else>
              <span class="opacity-80">{{ phase.label }}</span>
              <div class="text-xs opacity-60">
                Start: {{ phase.startedAt }}
              </div>
              <div
                v-if="phase.info"
                class="text-xs opacity-50 italic"
              >
                {{ phase.info }}
              </div>
            </template>
          </template>
          <template #middle>
            <div
              class="border rounded-full p-1.5 flex items-center justify-center"
              :class="{
                'bg-primary text-base-100': phase.phase === currentPhase.phase,
                'bg-gray-200 text-gray-400 opacity-75': phase.phase !== currentPhase.phase,
              }"
            >
              <component
                :is="phase.icon"
                :size="18"
              />
            </div>
          </template>
        </ITimelineItem>
      </ITimeline>
    </ICard>

    <ICard
      class="w-full max-w-3xl hidden sm:flex"
    >
      <IBtn
        class="w-full"
        @click="$emit('back')"
      >
        Zurück
      </IBtn>
    </ICard>
  </div>
</template>

<script lang="ts" setup>
import type { Component } from 'vue'
import type { Plant, PlantPhase } from '../modules/plants/types'
import dayjs from 'dayjs'
import {
  Plus as IconPlus,
} from 'lucide-vue-next'
import { formatDate } from 'sdx-php-date'
import { computed } from 'vue'
import { usePlantPhase } from '../composables/usePlantPhase.ts'
import { usePlantSubstrate } from '../composables/usePlantSubstrate.ts'
import IBadge from './IBadge.vue'
import IBtn from './IBtn.vue'
import ICard from './ICard.vue'
import ICardTitle from './ICardTitle.vue'
import IMobileBack from './IMobileBack.vue'
import ITimeline from './ITimeline.vue'
import ITimelineItem from './ITimelineItem.vue'

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
    .reverse()
    || [],
)

function formatStartedAt(startedAt: string): string {
  const date = new Date(startedAt)
  return formatDate('d.m.Y', date)
}
</script>
