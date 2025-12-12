<template>
  <ICard
    v-if="sortedContainers.length > 0"
    class="w-full max-w-3xl"
  >
    <ICardTitle class="text-2xl flex items-center text-gray-900/70">
      <IconTitle
        class="stroke-base-300"
        :size="28"
      />
      Verwendete Behälter/Töpfe
    </ICardTitle>
    <span class="opacity-60 text-xs pl-6">{{ sortedContainers.length }} Einträge</span>

    <div class="flex flex-col gap-y-5">
      <PlantDetailsLogCard
        v-for="(log, i) in sortedContainers"
        :key="i"
        :day="log.day"
        :time="log.time"
      >
        <template #actions>
          <IDropdownLegacy
            :items="log.actions"
            class="dropdown-end"
          />
        </template>

        <div class="flex items-center justify-between gap-x-2 mt-2">
          <div
            class="flex items-center"
          >
            <IconVolume class="stroke-gray-500" />
            <span class="flex-1 ml-2 text-xl font-semibold text-gray-600 truncate overflow-hidden whitespace-nowrap">{{ log.volume }} Liter</span>
          </div>
          <div class="grid grid-cols-2 gap-x-2 items-center">
            <IPopperSelf>
              <IBadge
                class="w-full"
                soft
                variant="info"
                size="sm"
              >
                <IconContainer :size="18" />
                <span class="truncate overflow-hidden whitespace-nowrap">{{ log.container }}</span>
              </IBadge>
            </IPopperSelf>

            <IPopperSelf>
              <IBadge
                class="w-full"
                soft
                variant="accent"
                size="sm"
              >
                <component :is="getContainerIcon(log.medium)" :size="18" />
                <span class="truncate overflow-hidden whitespace-nowrap">{{ getContainerLabel(log.medium) }}</span>
              </IBadge>
            </IPopperSelf>
          </div>
        </div>

        <INote v-if="log.notes">
          {{ log.notes || '' }}
        </INote>
      </PlantDetailsLogCard>
    </div>
  </ICard>
</template>

<script lang="ts" setup>
import type { PlantContainer } from '../modules/plant_container/types'
import type { EditPlantContainer, Plant } from '../modules/plants/types'
import dayjs from 'dayjs'
import {
  Package as IconContainer,
  Trash as IconDelete,
  Edit as IconEdit,
  Amphora as IconTitle,
  Ruler as IconVolume,
} from 'lucide-vue-next'
import { computed } from 'vue'
import { useModal } from '../composables/useModal.ts'
import { usePlantContainer } from '../composables/usePlantContainer.ts'
import { useToast } from '../composables/useToast.ts'
import { usePlantStore } from '../stores/plantStore.ts'
import PlantDetailsLogCard from './PlantDetailsLogCard.vue'
import PlantDetailsModalContainerEdit from './PlantDetailsModalContainerEdit.vue'
import IBadge from './ui/IBadge.vue'
import ICard from './ui/ICard.vue'
import ICardTitle from './ui/ICardTitle.vue'
import IDropdownLegacy from './ui/IDropdownLegacy.vue'
import INote from './ui/INote.vue'
import IPopperSelf from './ui/IPopperSelf.vue'

interface Props {
  plant: Plant
}
interface Emits {

}

const { plant } = defineProps<Props>()
defineEmits<Emits>()

const plantStore = usePlantStore()
const { showModal, showConfirmationModal } = useModal()
const { toast } = useToast()
const { getContainerIcon, getContainerLabel } = usePlantContainer()

function getDayAndTime(timestamp: number) {
  const formatted = dayjs(new Date(timestamp)).format('DD.MM.YYYY HH:mm')
  const [day, time] = formatted.split(' ')

  return { day, time }
}

const sortedContainers = computed(
  () => [...plant?.logs.containers || []].sort((lhs, rhs) => rhs.timestamp - lhs.timestamp).map(container => ({
    ...container,
    ...getDayAndTime(container.timestamp),
    actions: [
      {
        label: 'Bearbeiten',
        icon: IconEdit,
        onClick: async () => await openEditContainerModal(container),
      },
      {
        label: 'Löschen',
        icon: IconDelete,
        onClick: async () => await openDeleteContainerModal(container),
      },
    ],
  })),
)

async function openEditContainerModal(container: PlantContainer) {
  const { close } = showModal(PlantDetailsModalContainerEdit, {
    container,
    onEdit: async (data: EditPlantContainer) => {
      const result = await plantStore.updateContainer(data)

      result.ok
        ? toast('Behälter erfolgreich bearbeitet', 'success')
        : toast('Es ist ein Fehler beim bearbeiten des Behälters aufgetreten', 'error')

      await close()
    },
  })
}

async function openDeleteContainerModal(container: PlantContainer) {
  const text = `Bist du sicher, dass du den Behälter löschen möchtest?`

  const deleteContainer = async () => {
    const result = await plantStore.deleteContainer(container.id)

    result.ok
      ? toast('Behälter erfolgreich gelöscht', 'success')
      : toast('Es ist ein Fehler beim löschen des Behälter aufgetreten', 'error')

    if (!result.ok)
      console.error('[PlantDetailsCardContainer.deleteContainer] error:', result.error)
  }

  showConfirmationModal({
    title: 'Behälter löschen?',
    text,
    actions: [
      {
        label: 'Löschen',
        icon: IconDelete,
        class: 'btn-error text-base-100',
        onClick: deleteContainer,
      },
    ],
  })
}
</script>
