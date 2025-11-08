<template>
  <ICard
    class="w-full max-w-2xl"
    class-actions="justify-between"
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
      <IBtn
        @click="$emit('back')"
      >
        <IconBack />
        Zurück
      </IBtn>

      <div class="join">
        <IBtn
          class="join-item"
        >
          <IconImage />
          Bild hinzufügen
        </IBtn>

        <IBtn
          variant="neutral"
          class="join-item"
          @click="$emit('addPour')"
        >
          <IconWater />
          Gießeintrag hinzufügen
        </IBtn>
      </div>
    </template>
  </ICard>
</template>

<script lang="ts" setup>
import type { Component } from 'vue'
import type { Plant, PlantPhase } from '../modules/plants/types'
import {
  MoveLeft as IconBack,
  Image as IconImage,
  Droplet as IconWater,
} from 'lucide-vue-next'
import { formatDate } from 'sdx-php-date'
import { computed } from 'vue'
import IBtn from '../components/ui/IBtn.vue'
import ICard from '../components/ui/ICard.vue'
import IStat from '../components/ui/IStat.vue'
import IStatDesc from '../components/ui/IStatDesc.vue'
import IStats from '../components/ui/IStats.vue'
import IStatTitle from '../components/ui/IStatTitle.vue'
import IStatValue from '../components/ui/IStatValue.vue'
import ITimeline from '../components/ui/ITimeline.vue'
import ITimelineItem from '../components/ui/ITimelineItem.vue'
import { usePlantPhase } from '../composables/usePlantPhase.ts'
import { now } from '../util.ts'

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
