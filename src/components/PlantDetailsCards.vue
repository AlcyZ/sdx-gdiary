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
    </div>
  </ICard>

  <ICard
    class="w-full max-w-3xl"
  >
    <IBtn
      variant="accent"
      class="w-full text-base-100"
      size="lg"
      @click="$router.push(`/plants/${plant.id}/log/watering`)"
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
    class="w-full max-w-3xl"
  >
    <ICardTitle class="text-xl">
      Gießtagebuch
    </ICardTitle>

    <div
      v-for="(log, i) in sortedWateringLogs"
      :key="i"
      class="rounded-box border border-base-200 py-1 px-3 flex gap-x-2"
    >
      <div class="flex-1">
        <div class="text-lg font-semibold">
          {{ log.formatted }}
        </div>
        <div class="font-semibold opacity-75 ml-1">
          {{ log.amount }}Liter
        </div>
        <div class="ml-2 space-x-1">
          <IBadge
            v-for="(fertilizer, j) in log.fertilizers"
            :key="j"
            variant="info"
            class="text-base-100"
            size="sm"
          >
            {{ fertilizer.name }}: {{ fertilizer.amount }}ml
          </IBadge>
        </div>
      </div>

      <IBtn
        ghost
        square
        size="sm"
        variant="error"
        @click="openDeleteLogModal(log)"
      >
        <IconDelete :size="20" />
      </IBtn>
    </div>
  </ICard>

  <ICard
    class="w-full max-w-3xl hidden sm:flex"
  >
    <IBtn
      class="w-full"
      @click="$router.push('/plants')"
    >
      Zurück
    </IBtn>
  </ICard>
</template>

<script lang="ts" setup>
import type { Component } from 'vue'
import type { Plant, PlantPhase, WateringLog } from '../modules/plants/types'
import dayjs from 'dayjs'
import {
  Trash as IconDelete,
  Plus as IconPlus,
} from 'lucide-vue-next'
import { formatDate } from 'sdx-php-date'
import { computed } from 'vue'
import IBadge from '../components/ui/IBadge.vue'
import IBtn from '../components/ui/IBtn.vue'
import ICard from '../components/ui/ICard.vue'
import ICardTitle from '../components/ui/ICardTitle.vue'
import ITimeline from '../components/ui/ITimeline.vue'
import ITimelineItem from '../components/ui/ITimelineItem.vue'
import { useModal } from '../composables/useModal.ts'
import { usePlant } from '../composables/usePlant.ts'
import { usePlantPhase } from '../composables/usePlantPhase.ts'
import { usePlantSubstrate } from '../composables/usePlantSubstrate.ts'
import { useToast } from '../composables/useToast.ts'
import { usePlantStore } from '../stores/plantStore.ts'

interface Props {
  plant: Plant
}
interface Emits {
}

const { plant } = defineProps<Props>()
defineEmits<Emits>()

type PhaseData = PlantPhase & { label: string, icon: Component, started: string }

const plantStore = usePlantStore()

const { toast } = useToast()
const { getPlantAge } = usePlant()
const { getPhaseIcon, getPhaseLabel } = usePlantPhase()
const { getSubstrateIcon, getSubstrateLabel } = usePlantSubstrate()
const { showConfirmationModal } = useModal()

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

const plantAge = computed(() => getPlantAge(plant))

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

const sortedWateringLogs = computed(
  () => [...plant?.wateringLogs || []].sort((lhs, rhs) => rhs.date - lhs.date).map(log => ({
    ...log,
    formatted: dayjs(new Date(log.date)).format('DD.MM.YYYY HH:mm'),
  })),
)

function formatStartedAt(startedAt: string): string {
  const date = new Date(startedAt)
  return formatDate('d.m.Y', date)
}

function openDeleteLogModal(log: WateringLog) {
  const date = dayjs(new Date(log.date)).format('DD.MM.YYYY HH:mm')
  const text = `Bist du sicher, dass du den Gießeintrag vom ${date} löschen möchtest?`

  const onClick = async () => {
    const result = await plantStore.deleteWateringLog(log.id)
    if (result)
      toast('Gießeintrag gelöscht', 'success')
  }

  showConfirmationModal({
    title: 'Gießeintrag löschen',
    text,
    actions: [
      {
        label: 'Löschen',
        icon: IconDelete,
        class: 'btn-error text-base-100',
        onClick,
      },
    ],
  })
}
</script>
