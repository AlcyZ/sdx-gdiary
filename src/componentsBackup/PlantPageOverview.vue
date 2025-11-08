<template>
  <div class="w-full flex flex-col items-center gap-y-5">
    <header class="w-full max-w-3xl p-4">
      <h1 class="text-4xl font-extrabold">
        Pflanzen
      </h1>
    </header>

    <ICard
      v-for="(plant, i) in plantsList"
      :key="i"
      class="w-full max-w-3xl"
    >
      <div class="grid grid-cols-[6fr_2fr_2fr]">
        <div class="flex items-center">
          <img
            :src="plant.image"
            :alt="`image-${plant.name}`"
            class="rounded-full w-14 h-14 mr-4"
          >

          <div class="flex flex-col">
            <span class="text-xl font-semibold">{{ plant.name }}</span>

            <IBadge
              class="mt-0.5"
              :class="plant.status.class"
            >
              <component
                :is="plant.status.icon"
                :size="16"
              />
              {{ plant.status.phase }}
            </IBadge>

            <span class="text-xs opacity-60">(Tag {{ plant.status.age }})</span>
          </div>
        </div>

        <div class="text-xs flex flex-col items-center justify-center text-center">
          <div class="font-semibold opacity-75">
            {{ plant.lastWatering }}
          </div>
          <div class="flex items-center opacity-60">
            <component
              :is="plant.substrate.icon"
              :size="14"
            />
            <span>{{ plant.substrate.label }} | {{ plant.substrate.size }}</span>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-center">
          <IBtn
            square
            ghost
          >
            <IconWatering />
          </IBtn>

          <div class="dropdown dropdown-end sm:dropdown-center">
            <IBtn
              square
              ghost
              tabindex="0"
              role="button"
              class="m1"
            >
              <IconMore />
            </IBtn>
            <ul tabindex="-1" class="dropdown-content menu bg-base-100 rounded-box z-1 w-40 p-2 shadow-sm">
              <li
                v-for="(action, j) in plant.actions"
                :key="j"
              >
                <button
                  type="button"
                  role="button"
                  @click="action.onClick"
                >
                  <component :is="action.icon" />
                  {{ action.label }}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </ICard>
  </div>
</template>

<script lang="ts" setup>
import type { Plant } from '../modules/plants/types'
import dayjs from 'dayjs'
import {
  Edit as IconEdit,
  EllipsisVertical as IconMore,
  Eye as IconShow,
  Trash as IconTrash,
  Droplet as IconWatering,
} from 'lucide-vue-next'
import { computed } from 'vue'
import { usePlant } from '../composables/usePlant.ts'
import { usePlantPhase } from '../composables/usePlantPhase.ts'
import { usePlantSubstrate } from '../composables/usePlantSubstrate.ts'
import { PLANT_PLACEHOLDER_IMAGE } from '../util.ts'
import IBadge from '../components/ui/IBadge.vue'
import IBtn from '../components/ui/IBtn.vue'
import ICard from '../components/ui/ICard.vue'

interface Props {
  plants: Array<Plant>
}
interface Emits {
  show: [plant: Plant]
  edit: [plant: Plant]
  delete: [plant: Plant]
}

const { plants } = defineProps<Props>()
const emit = defineEmits<Emits>()

const { getPlantAge } = usePlant()
const { getPhaseLabel, getPhaseIcon, getPhaseColor } = usePlantPhase()
const { getSubstrateLabel, getSubstrateIcon } = usePlantSubstrate()

const plantsList = computed(
  () => plants.map(plant => ({
    image: PLANT_PLACEHOLDER_IMAGE,
    name: getPlantName(plant),
    status: {
      phase: getPhaseLabel(plant.phase.phase),
      age: getPlantAge(plant),
      icon: getPhaseIcon(plant.phase.phase),
      class: getPlantStatusClass(plant),
    },
    substrate: {
      label: getSubstrateLabel(plant.substrate.substrate),
      size: plant.substrate.size,
      icon: getSubstrateIcon(plant.substrate.substrate),
    },
    lastWatering: getLastWatering(plant),
    actions: [
      {
        icon: IconShow,
        label: 'Details',
        onClick: () => emit('show', plant),
      },
      {
        icon: IconEdit,
        label: 'Bearbeiten',
        onClick: () => emit('edit', plant),
      },
      {
        icon: IconTrash,
        label: 'Löschen',
        onClick: () => emit('delete', plant),
      },
    ],
  })),
)

function getPlantName(plant: Plant): string {
  return plant.name !== undefined && plant.name !== ''
    ? `${plant.name} (${plant.strain})`
    : plant.strain
}

function getPlantStatusClass(plant: Plant): string {
  const colors = getPhaseColor(plant.phase.phase)

  return `${colors.bg} ${colors.text}`
}

function getLastWatering(plant: Plant): string {
  if (plant.wateringLogs.length === 0) {
    return 'Kein Protokoll'
  }

  const latestLog = plant.wateringLogs.reduce((lhs, rhs) => lhs.date < rhs.date ? lhs : rhs)
  const logDate = dayjs(new Date(latestLog.date)).format('DD.MM.YYYY')

  return `Zuletzt gegossen: ${logDate}`
}
</script>
