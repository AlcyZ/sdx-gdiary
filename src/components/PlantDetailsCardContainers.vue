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
      <div
        v-for="(log, i) in sortedContainers"
        :key="i"
        class="shadow-sm rounded-field px-6 py-4"
      >
        <div class="flex items-center justify-between">
          <h3>
            <span class="font-semibold opacity-80">{{ log.day }}</span>&nbsp;
            <span class="opacity-60">{{ log.time }}</span>
          </h3>

          <IDropdown
            :items="log.actions"
            class="dropdown-end"
          />
        </div>

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

        <div
          v-if="log.notes"
          class="inset-shadow-sm bg-amber-50 inset-shadow-amber-400/40 px-4 py-2 rounded-field mt-3 text-sm text-gray-500"
        >
          {{ log.notes || '' }}
        </div>
      </div>
    </div>
  </ICard>
</template>

<script lang="ts" setup>
import type { PlantContainer } from '../modules/plant_container/types'
import type { Plant } from '../modules/plants/types'
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
import { err } from '../util.ts'
import IBadge from './ui/IBadge.vue'
import ICard from './ui/ICard.vue'
import ICardTitle from './ui/ICardTitle.vue'
import IDropdown from './ui/IDropdown.vue'
import IPopperSelf from './ui/IPopperSelf.vue'

interface Props {
  plant: Plant
}
interface Emits {

}

const { plant } = defineProps<Props>()
defineEmits<Emits>()

const plantStore = usePlantStore()
const { showConfirmationModal } = useModal()
const { toast } = useToast()
const { getContainerIcon, getContainerLabel } = usePlantContainer()

function getDayAndTime(timestamp: number) {
  const formatted = dayjs(new Date(timestamp)).format('DD.MM.YYYY HH:mm')
  const [day, time] = formatted.split(' ')

  return { day, time }
}

const sortedContainers = computed(
  () => [...plant?.logs.containers || []].sort((lhs, rhs) => rhs.timestamp - lhs.timestamp).map(log => ({
    ...log,
    ...getDayAndTime(log.timestamp),
    actions: [
      {
        label: 'Bearbeiten',
        icon: IconEdit,
        onClick: () => console.log('todo: edit container'),
      },
      {
        label: 'Löschen',
        icon: IconDelete,
        onClick: async () => await openDeleteContainerLogModal(log),
      },
    ],
  })),
)

async function openDeleteContainerLogModal(log: PlantContainer) {
  const { day, time } = getDayAndTime(log.timestamp)
  const text = `Bist du sicher, dass du den Gießeintrag vom ${day} um ${time} Uhr löschen möchtest?`

  const deleteWateringLog = async () => {
    // const result = await plantStore.deleteWateringLog(log.id)
    const result = err()

    result.ok
      ? toast('Gießeintrag erfolgreich gelöscht', 'success')
      : toast('Es ist ein Fehler beim löschen des Gießeintrags aufgetreten', 'error')

    if (!result.ok)
      console.error('[PlantDetailsCardWatering.deleteWateringLog] error:', result.error)
  }

  showConfirmationModal({
    title: 'Gießeintrag löschen?',
    text,
    actions: [
      {
        label: 'Löschen',
        icon: IconDelete,
        class: 'btn-error text-base-100',
        onClick: deleteWateringLog,
      },
    ],
  })
}
</script>
