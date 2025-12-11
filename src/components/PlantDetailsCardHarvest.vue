<template>
  <ICard
    v-if="sortedHarvests.length > 0"
    class="w-full max-w-3xl"
  >
    <ICardTitle class="text-2xl flex items-center text-gray-900/70">
      <IconHarvest
        class="stroke-accent"
        :size="36"
      />
      Informationen zur Ernte
    </ICardTitle>
    <span class="opacity-60 text-xs pl-6">{{ sortedHarvests.length }} Einträge</span>

    <div class="flex flex-col gap-y-5">
      <PlantDetailsLogCard
        v-for="(log, i) in sortedHarvests"
        :key="i"
        :day="log.day"
        :time="log.time"
      >
        <template #actions>
          <IDropdown
            :items="log.actions"
            align="end"
          />
        </template>

        <PlantDetailsCardHarvestSession
          v-if="log.type === 'session'"
          :log="log"
        />
        <PlantDetailsCardHarvestFinish
          v-else
          :log="log"
        />
      </PlantDetailsLogCard>
    </div>
  </ICard>
</template>

<script lang="ts" setup>
import type { Harvest } from '../modules/harvest/types'
import type { Plant } from '../modules/plants/types'
import type { DropdownMenu } from '../types'
import dayjs from 'dayjs'
import {
  Trash as IconDelete,
  Edit as IconEdit,
  Scissors as IconHarvest,
} from 'lucide-vue-next'
import { computed } from 'vue'
import { useDropdown } from '../composables/useDropdown.ts'
import { useModal } from '../composables/useModal.ts'
import { useToast } from '../composables/useToast.ts'
import { usePlantStore } from '../stores/plantStore.ts'
import PlantDetailsCardHarvestFinish from './PlantDetailsCardHarvestFinish.vue'
import PlantDetailsCardHarvestSession from './PlantDetailsCardHarvestSession.vue'
import PlantDetailsLogCard from './PlantDetailsLogCard.vue'
import ICard from './ui/ICard.vue'
import ICardTitle from './ui/ICardTitle.vue'
import IDropdown from './ui/IDropdown.vue'

interface Props {
  plant: Plant
}
interface Emits {

}

const { plant } = defineProps<Props>()
defineEmits<Emits>()

const plantStore = usePlantStore()

const { createItem } = useDropdown()
const { showConfirmationModal } = useModal()
const { resultToast } = useToast()

function getDayAndTime(timestamp: number) {
  const formatted = dayjs(new Date(timestamp)).format('DD.MM.YYYY HH:mm')
  const [day, time] = formatted.split(' ')

  return { day, time }
}

function showDeleteConfirmationModal(log: Harvest) {
  const date = dayjs(new Date(log.timestamp)).format('DD.MM.YYYY HH:mm')
  const text = `Bist du sicher, dass du den Ernteeintrag vom ${date} löschen möchtest?`

  showConfirmationModal({
    title: 'Ernteeintrag löschen?',
    text,
    actions: [
      {
        label: 'Löschen',
        class: 'btn-error text-base-100',
        onClick: async () => {
          const result = await plantStore.deleteHarvest(log.id)
          resultToast('Ernteeintrag gelöscht', 'löschen des Ernteeintrags', result)
        },
      },
    ],
  })
}

const sortedHarvests = computed(
  () => plant.logs.harvests.toSorted((lhs, rhs) => rhs.timestamp - lhs.timestamp)
    .map(log => ({
      ...log,
      ...getDayAndTime(log.timestamp),
      actions: [
        {
          type: 'item',
          content: createItem('Bearbeiten', IconEdit),
          onClick: () => console.log('Todo: Edit'),
        },
        {
          type: 'item',
          content: createItem('Löschen', IconDelete),
          onClick: () => showDeleteConfirmationModal(log),
        },
      ] as Array<DropdownMenu>,
    })),
)
</script>
