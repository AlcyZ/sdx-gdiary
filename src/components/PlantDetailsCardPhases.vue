<template>
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
          <template v-if="phase.phase === plant.phase.phase">
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
              'bg-primary text-base-100': phase.phase === plant.phase.phase,
              'bg-gray-200 text-gray-400 opacity-75': phase.phase !== plant.phase.phase,
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
</template>

<script lang="ts" setup>
import type { Plant, PlantPhase } from '../modules/plants/types'
import dayjs from 'dayjs'
import { computed } from 'vue'
import { usePlantPhase } from '../composables/usePlantPhase.ts'
import ICard from './ui/ICard.vue'
import ICardTitle from './ui/ICardTitle.vue'
import ITimeline from './ui/ITimeline.vue'
import ITimelineItem from './ui/ITimelineItem.vue'

interface Props {
  plant: Plant
}
interface Emits {

}

const { plant } = defineProps<Props>()
defineEmits<Emits>()

const { getPhaseIcon, getPhaseLabel } = usePlantPhase()

const plantPhases = computed(
  () => plant.phases
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
  return dayjs(new Date(startedAt)).format('DD.MM.YYYY')
}
</script>
