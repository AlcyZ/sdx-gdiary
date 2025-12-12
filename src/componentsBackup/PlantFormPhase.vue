<template>
  <ICard>
    <ICardTitle class="text-xl">
      Start der Wachstumsphasen
    </ICardTitle>

    <p class="text-xs text-gray-400 my-3">
      Lege des Startdatum der Wachstumsphasen fest.
    </p>

    <div class="overflow-y-auto max-h-96">
      <ISteps
        vertical
        :steps="phases"
        class="w-full"
      >
        <template #customStep="{ item }: { item: PlantPhaseItemData }">
          <IStep
            :variant="item.data !== undefined ? 'primary' : undefined"
            class="h-18"
          >
            <div
              class="flex flex-col md:flex-row items-center justify-between w-full"
            >
              {{ item.label }}

              <input
                v-if="item.data"
                :value="item.data.startedAt"
                class="input"
                type="date"
                @change="changeDate(item, $event)"
              >
            </div>

            <template #icon>
              <component
                :is="item.icon"
                class="cursor-pointer text-base p-0.5"
                @click="selectPhase(item)"
              />
            </template>
          </IStep>
        </template>
      </ISteps>
    </div>

    <div v-if="error" class="text-error">
      {{ error }}
    </div>
  </ICard>
</template>

<script lang="ts" setup>
import type { Component } from 'vue'
import type { NewPlantPhase, PlantPhaseType } from '../modules/plants/types'

import { computed, onMounted, toRaw } from 'vue'
import { usePlantPhase } from '../composables/usePlantPhase.ts'
import { extractEventValue, now } from '../util.ts'
import ICard from './ui/ICard.vue'
import ICardTitle from './ui/ICardTitle.vue'
import IStep from './ui/IStep.vue'
import ISteps from './ui/ISteps.vue'

interface Props {
  modelValue: Array<NewPlantPhase>
  error?: string
}
interface Emits {
  'update:modelValue': [data: Array<NewPlantPhase>]
}

const { modelValue } = defineProps<Props>()
const emit = defineEmits<Emits>()

const { getPhaseIcon, getPhaseLabel } = usePlantPhase()

interface PlantPhaseItemData {
  label: string
  phase: PlantPhaseType
  data?: NewPlantPhase
  icon: Component
}

const plantPhases: Array<PlantPhaseType> = [
  'germination',
  'seedling',
  'vegetation',
  'pre-flower',
  'flower',
  'ripening',
  'harvest',
  'drying',
]

const phases = computed(
  (): Array<PlantPhaseItemData> => plantPhases.map(
    (phase: PlantPhaseType): PlantPhaseItemData => ({
      phase,
      data: modelValue.find((item: NewPlantPhase): boolean => item.phase === phase),
      icon: getPhaseIcon(phase),
      label: getPhaseLabel(phase),
    }),
  ),
)

function selectPhase(selectedPhase: PlantPhaseItemData) {
  const collect = () => {
    const data: Array<NewPlantPhase> = []
    const defaultDataset = (phase: PlantPhaseType): NewPlantPhase => ({ phase, startedAt: now() })

    for (const item of phases.value) {
      const dataset = item.data !== undefined ? toRaw(item.data) : defaultDataset(item.phase)
      data.push(dataset)

      if (item.phase === selectedPhase.phase) {
        return data
      }
    }

    return []
  }

  const data = collect()
  emit('update:modelValue', data)
}

function changeDate(item: PlantPhaseItemData, event: Event) {
  const value = extractEventValue(event)
  const date = value.exist ? value.value : now()

  const data = phases.value.map((phase: PlantPhaseItemData) => phase.data)
    .filter((data: NewPlantPhase | undefined): data is NewPlantPhase => data !== undefined)
    .map((data: NewPlantPhase): NewPlantPhase => data.phase === item.phase
      ? {
          ...data,
          startedAt: date,
        }
      : toRaw(data))

  emit('update:modelValue', data)
}

onMounted(() => {
  if (modelValue.length === 0) {
    emit('update:modelValue', [{
      phase: 'germination',
      startedAt: now(),
    }])
  }
})
</script>
