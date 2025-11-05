<template>
  <ICard
    class="w-full max-w-2xl"
  >
    <h1 class="text-4xl font-bold text-primary border-b border-b-base-200 mb-3">
      {{ plantName }}
    </h1>

    <IStats class="shadow mt-2">
      <IStat>
        <IStatTitle>Substrat</IStatTitle>
        <IStatValue>{{ plant.substrate.substrate }} ({{ plant.substrate.size }})</IStatValue>
        <IStatDesc>{{ plant.substrate.info || 'Keine weiteren Informationen zum Substrat' }}</IStatDesc>
      </IStat>

      <IStat>
        <IStatTitle>Startdatum</IStatTitle>
        <IStatValue>{{ plantStartDate }}</IStatValue>
        <IStatDesc>Der Grow ist am {{ plantStartDate }} gestartet worden</IStatDesc>
      </IStat>
    </IStats>

    <div class="mt-2 grid grid-cols-1 sm:grid-cols-2">
      <div>
        <h2 class="text-xl font-semibold">
          Timeline
        </h2>
        <ITimeline
          vertical
          :items="plantPhases"
        >
          <template #item="{ item, key }: { item: PhaseData, key: number }">
            <ITimelineItem
              box-start
              :hide-start-line="key === 0"
              :hide-end-line="key === (plantPhases.length - 1)"
            >
              <template #start>
                {{ item.started }}
              </template>

              <template #middle>
                <div class="border rounded-full p-1.5 flex items-center justify-center bg-neutral text-base-200">
                  <component
                    :is="item.icon"
                    size="18"
                  />
                </div>
              </template>

              <template #end>
                {{ item.label }}
              </template>
            </ITimelineItem>
          </template>
        </ITimeline>
      </div>
      <div />
    </div>

    <template #actions>
      <IBtn>
        <IconImage />
        Bild hinzufügen
      </IBtn>

      <IBtn
        @click="$emit('addPour')"
      >
        <IconWater />
        Gießeintrag hinzufügen
      </IBtn>
    </template>
  </ICard>
</template>

<script lang="ts" setup>
import type { Component } from 'vue'
import type { Plant, PlantPhase } from '../modules/plants/types'
import {
  Image as IconImage,
  Droplet as IconWater,
} from 'lucide-vue-next'
import { formatDate } from 'sdx-php-date'
import { computed } from 'vue'
import { usePlantPhase } from '../composables/usePlantPhase.ts'
import { now } from '../util.ts'
import IBtn from './IBtn.vue'
import ICard from './ICard.vue'
import IStat from './IStat.vue'
import IStatDesc from './IStatDesc.vue'
import IStats from './IStats.vue'
import IStatTitle from './IStatTitle.vue'
import IStatValue from './IStatValue.vue'
import ITimeline from './ITimeline.vue'
import ITimelineItem from './ITimelineItem.vue'

interface Props {
  plant: Plant
}
interface Emits {
  addPour: []
}

type PhaseData = PlantPhase & { label: string, icon: Component, started: string }

const { plant } = defineProps<Props>()
defineEmits<Emits>()

const { getPhaseIcon, getPhaseLabel } = usePlantPhase()

const plantName = computed(() => {
  const fallback = plant?.strain || 'Unknown'

  if (plant?.name) {
    return plant.name !== '' ? `${plant.name} (${fallback})` : fallback
  }

  return fallback
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

const plantStartDate = computed(() => {
  const dateString = plant?.phases.find(p => p.phase === 'germination')?.startedAt || now()
  const date = new Date(dateString)

  return formatDate('d.m.Y', date)
})

function formatStartedAt(startedAt: string): string {
  const date = new Date(startedAt)
  return formatDate('d.m.Y', date)
}
</script>
