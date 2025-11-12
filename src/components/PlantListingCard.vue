<template>
  <ICard
    v-for="(plant, i) in plantsList"
    :key="i"
    class="w-full max-w-3xl cursor-pointer"
    @click="navigateToDetails(plant.id)"
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

          <span class="text-xs opacity-60">
            <template v-if="plant.status.flowerDay.exist">
              (Tag {{ plant.status.age }}, Blüte {{ plant.status.flowerDay.value }})
            </template>
            <template v-else>
              (Tag {{ plant.status.age }})
            </template>
          </span>
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
          @click.stop="$router.push(`/plants/${plant.id}/log/watering`)"
        >
          <IconWatering />
        </IBtn>

        <IDropdown
          :items="plant.actions"
          class="dropdown-end sm:dropdown-center"
          :class="i === plantsList.length - 1 ? 'dropdown-top' : undefined"
          @click.stop
        />
      </div>
    </div>
  </ICard>
</template>

<script lang="ts" setup>
import type { Plant } from '../modules/plants/types'
import dayjs from 'dayjs'
import {
  Edit as IconEdit,
  Eye as IconShow,
  Trash as IconTrash,
  Droplet as IconWatering,
} from 'lucide-vue-next'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePlant } from '../composables/usePlant.ts'
import { usePlantPhase } from '../composables/usePlantPhase.ts'
import { usePlantSubstrate } from '../composables/usePlantSubstrate.ts'
import { usePlantStore } from '../stores/plantStore.ts'
import { PLANT_PLACEHOLDER_IMAGE } from '../util.ts'
import IBadge from './ui/IBadge.vue'
import IBtn from './ui/IBtn.vue'
import ICard from './ui/ICard.vue'
import IDropdown from './ui/IDropdown.vue'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

const plantStore = usePlantStore()

const router = useRouter()
const { getPlantAge, getFlowerDay, getPlantName, showDeleteConfirmationModal } = usePlant()
const { getPhaseLabel, getPhaseIcon, getPhaseColor } = usePlantPhase()
const { getSubstrateLabel, getSubstrateIcon } = usePlantSubstrate()

const plantsList = computed(
  () => plantStore.plants.map(plant => ({
    id: plant.id,
    image: getPlantImage(plant),
    name: getPlantName(plant),
    status: {
      phase: getPhaseLabel(plant.phase.phase),
      age: getPlantAge(plant),
      flowerDay: getFlowerDay(plant),
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
        onClick: () => router.push(`/plants/${plant.id}`),
      },
      {
        icon: IconEdit,
        label: 'Bearbeiten',
        onClick: () => router.push(`/plants/${plant.id}/edit`),
      },
      {
        icon: IconTrash,
        label: 'Löschen',
        onClick: () => showDeleteConfirmationModal(plant),
      },
    ],
  })),
)

function getPlantImage(plant: Plant) {
  if (plant.favoritImage)
    return URL.createObjectURL(plant.favoritImage.file)

  const firstImage = plant.images[0]
  if (firstImage !== undefined)
    return URL.createObjectURL(firstImage.file)

  return PLANT_PLACEHOLDER_IMAGE
}

function getPlantStatusClass(plant: Plant): string {
  const colors = getPhaseColor(plant.phase.phase)

  return `${colors.bg} ${colors.text}`
}

function getLastWatering(plant: Plant): string {
  if (plant.wateringLogs.length === 0) {
    return 'Kein Protokoll'
  }

  const latestLog = plant.wateringLogs.reduce((lhs, rhs) => lhs.date > rhs.date ? lhs : rhs)
  const logDate = dayjs(new Date(latestLog.date)).format('DD.MM.YYYY')

  return `Zuletzt gegossen: ${logDate}`
}

function navigateToDetails(plantId: number) {
  router.push(`/plants/${plantId}`)
}
</script>
