<template>
  <ICard
    v-for="(plant, i) in plantsList"
    :key="i"
    class="w-full max-w-3xl cursor-pointer"
    no-gap
    @click="navigateToDetails(plant.id)"
  >
    <div class="flex items-center justify-between mb-0.5">
      <h2 class="font-bold text-xl">
        {{ plant.name }}
      </h2>

      <div class="flex items-center justify-center">
        <IBtn
          square
          ghost
          @click.stop="$router.push(`/plants/${plant.id}/log/watering`)"
        >
          <IconWatering />
        </IBtn>

        <IDropdown
          :items="plant.actions"
          @click.stop
        >
          <IBtn
            square
            ghost
          >
            <IconMore />
          </IBtn>
        </IDropdown>
      </div>
    </div>
    <div class="grid grid-cols-[68px_1fr_1fr] gap-x-2">
      <div class="flex items-center justify-center">
        <PlantImgAsync
          v-if="plant.image"
          :image="plant.image"
        >
          <template #default="{ src }">
            <img
              :src="src"
              :alt="`image-${plant.name}-${plant.image.id}`"
              class="
                w-16
                h-16
                rounded-full
                object-cover
                shadow-md
                bg-gray-200
              "
            >
          </template>
        </PlantImgAsync>
        <img
          v-else
          :src="PLANT_PLACEHOLDER_IMAGE"
          :alt="`image-${plant.name}`"
        >
      </div>

      <div class="flex flex-col items-center justify-center">
        <IBadge
          v-if="plant.isHarvested"
          variant="success"
          class="mt-0.5 text-base-100"
        >
          <IconHarvested :size="16" />
          Geerntet
        </IBadge>
        <IBadge
          v-else
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

      <div class="text-xs flex flex-col items-center justify-center text-center">
        <div class="flex items-center">
          <IconWater :size="14" />
          <span class="font-semibold opacity-75 ml-0.5">{{ plant.lastWatering }}</span>
        </div>
        <div class="flex items-center opacity-60">
          <component
            :is="plant.container.icon"
            :size="14"
          />
          <span>{{ plant.container.label }} | {{ plant.container.size }}</span>
        </div>
      </div>
    </div>
  </ICard>
</template>

<script lang="ts" setup>
import type { Plant } from '../modules/plants/types'
import type { DropdownMenu } from '../types'
import {
  Edit as IconEdit,
  Leaf as IconHarvested,
  EllipsisVertical as IconMore,
  Eye as IconShow,
  Trash as IconTrash,
  Droplets as IconWater,
  Droplet as IconWatering,
} from 'lucide-vue-next'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDropdown } from '../composables/useDropdown.ts'
import { usePlant } from '../composables/usePlant.ts'
import { usePlantContainer } from '../composables/usePlantContainer.ts'
import { usePlantPhase } from '../composables/usePlantPhase.ts'
import { usePlantStore } from '../stores/plantStore.ts'
import { PLANT_PLACEHOLDER_IMAGE } from '../util.ts'
import PlantImgAsync from './PlantImgAsync.vue'
import IBadge from './ui/IBadge.vue'
import IBtn from './ui/IBtn.vue'
import ICard from './ui/ICard.vue'
import IDropdown from './ui/IDropdown.vue'

interface Props {
  config: PlantListingConfig
}
interface Emits {

}

const { config } = defineProps<Props>()
defineEmits<Emits>()

const plantStore = usePlantStore()

const router = useRouter()
const { getPlantAge, getFlowerDay, getPlantName, getLastWateringText, showDeleteConfirmationModal } = usePlant()
const { getPhaseLabel, getPhaseIcon, getPhaseColor } = usePlantPhase()
const { getContainerIcon, getContainerLabel } = usePlantContainer()
const { createItem } = useDropdown()

const plantsList = computed(
  () => plantStore.plants.filter(plantListingFilter).map(plant => ({
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
    container: {
      label: getContainerLabel(plant.container.medium),
      icon: getContainerIcon(plant.container.medium),
      size: `${plant.container.volume}L`,
    },
    lastWatering: getLastWateringText(plant),
    isHarvested: plant.isHarvested,
    actions: [
      {
        type: 'item',
        content: createItem('Details', IconShow),
        onClick: () => router.push(`/plants/${plant.id}`),
      },
      {
        type: 'item',
        content: createItem('Bearbeiten', IconEdit),
        onClick: () => router.push(`/plants/${plant.id}/edit`),
      },
      {
        type: 'item',
        content: createItem('Löschen', IconTrash),
        onClick: () => showDeleteConfirmationModal(plant),
      },
    ] as Array<DropdownMenu>,
  })),
)

function plantListingFilter(plant: Plant): boolean {
  return config.filter === 'show-all' || !plant.isHarvested
}

function getPlantImage(plant: Plant) {
  if (plant.favoritImage)
    return plant.favoritImage

  const firstImage = plant.images[0]
  if (firstImage !== undefined)
    return firstImage
  return undefined
}

function getPlantStatusClass(plant: Plant): string {
  const colors = getPhaseColor(plant.phase.phase)

  return `${colors.bg} ${colors.text}`
}

function navigateToDetails(plantId: number) {
  router.push(`/plants/${plantId}`)
}
</script>
