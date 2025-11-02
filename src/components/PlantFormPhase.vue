<template>
  <IFieldset
    legend="Wachstumsphase"
  >
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
  </IFieldset>
</template>

<script lang="ts" setup>
import type { NewPlantPhase, PlantPhaseItem, PlantPhaseType } from '../modules/plants/types'
import {
  Archive as IconCuring,
  Wind as IconDrying,
  Flower as IconFlower,
  Sprout as IconGermination,
  Scissors as IconHarvest,
  Flower2 as IconPreFlower,
  Grape as IconRipening,
  Leaf as IconSeedling,
  Sun as IconVegetation,
} from 'lucide-vue-next'
import { computed, onMounted, toRaw } from 'vue'
import { extractEventValue } from '../util.ts'
import IFieldset from './IFieldset.vue'
import IStep from './IStep.vue'
import ISteps from './ISteps.vue'

interface Props {
  modelValue: Array<NewPlantPhase>
  error?: string
}
interface Emits {
  'update:modelValue': [data: Array<NewPlantPhase>]
}

const { modelValue } = defineProps<Props>()
const emit = defineEmits<Emits>()

type PlantPhaseItemData = PlantPhaseItem & { data?: NewPlantPhase }

const plantPhases: Array<PlantPhaseItem> = [
  {
    phase: 'germination',
    label: 'Keimung',
    icon: IconGermination,
  },
  {
    phase: 'seedling',
    label: 'Sämling',
    icon: IconSeedling,
  },
  {
    phase: 'vegetation',
    label: 'Vegetationsphase',
    icon: IconVegetation,
  },
  {
    phase: 'pre-flower',
    label: 'Vorblüte',
    icon: IconPreFlower,
  },
  {
    phase: 'flower',
    label: 'Blütephase',
    icon: IconFlower,
  },
  {
    phase: 'ripening',
    label: 'Reifephase',
    icon: IconRipening,
  },
  {
    phase: 'harvest',
    label: 'Ernte',
    icon: IconHarvest,
  },
  {
    phase: 'drying',
    label: 'Trocknung',
    icon: IconDrying,
  },
  {
    phase: 'curing',
    label: 'Fermentierung',
    icon: IconCuring,
  },
]

const phases = computed(
  (): Array<PlantPhaseItemData> => plantPhases.map(
    (plantPhase: PlantPhaseItem): PlantPhaseItemData => ({
      ...plantPhase,
      data: modelValue.find((phase: NewPlantPhase): boolean => phase.phase === plantPhase.phase),
    }),
  ),
)

function now() {
  return new Date().toISOString().split('T')[0]!
}

function selectPhase(selectedPhase: PlantPhaseItem) {
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

function changeDate(item: PlantPhaseItem, event: Event) {
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
