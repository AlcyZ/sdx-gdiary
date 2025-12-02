<template>
  <ICard
    v-if="sortedWateringLogs.length > 0"
    class="w-full max-w-3xl"
  >
    <ICardTitle class="text-2xl flex items-center text-gray-900/70">
      <IconWatering
        class="fill-sky-300 stroke-base-100"
        :size="36"
      />
      Gießtagebuch
    </ICardTitle>
    <span class="opacity-60 text-xs pl-6">{{ sortedWateringLogs.length }} Einträge</span>

    <div class="flex flex-col gap-y-5">
      <div
        v-for="(log, i) in sortedWateringLogs"
        :key="i"
        class="shadow-sm rounded-field px-6 py-2"
      >
        <div class="flex items-center justify-between">
          <h3>
            <span class="font-semibold opacity-80">{{ log.day }}</span>&nbsp;
            <span class="opacity-60">{{ log.time }}</span>
          </h3>

          <IBtn
            ghost
            square
            variant="error"
            @click="openDeleteWateringLogModal(log)"
          >
            <IconDelete />
          </IBtn>
        </div>

        <div class="my-3">
          <h2 class="text-lg font-semibold flex items-center">
            <IconWater class="mr-1 fill-blue-300 stroke-blue-300" />
            {{ log.amount }} Liter
          </h2>
        </div>

        <div
          v-if="log.ec !== undefined || log.ph !== undefined"
          class="mb-2 space-x-0.5"
        >
          <IBadge
            v-if="log.ph"
            variant="info"
            outline
          >
            pH:<span class="font-semibold opacity-80">{{ log.ph }}</span>
          </IBadge>
          <IBadge
            v-if="log.ec"
            variant="accent"
            outline
          >
            EC: <span class="font-semibold opacity-80">{{ log.ec }}µS/cm</span>
          </IBadge>
        </div>

        <div class="space-x-0.5">
          <IBadge
            v-for="(fertilizer, j) in log.fertilizers"
            :key="j"
            variant="primary"
            soft
          >
            {{ fertilizer.name }} |
            <span class="font-semibold">{{ fertilizer.amount }}ml</span>
          </IBadge>
        </div>
      </div>
    </div>
  </ICard>
</template>

<script lang="ts" setup>
import type { Plant, WateringLog } from '../modules/plants/types'
import dayjs from 'dayjs'
import {
  Trash as IconDelete,
  Droplet as IconWater,
  Droplets as IconWatering,
} from 'lucide-vue-next'
import { computed } from 'vue'
import { useModal } from '../composables/useModal.ts'
import { useToast } from '../composables/useToast.ts'
import { usePlantStore } from '../stores/plantStore.ts'
import IBadge from './ui/IBadge.vue'
import IBtn from './ui/IBtn.vue'
import ICard from './ui/ICard.vue'
import ICardTitle from './ui/ICardTitle.vue'

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

function getDayAndTime(timestamp: number) {
  const formatted = dayjs(new Date(timestamp)).format('DD.MM.YYYY HH:mm')
  const [day, time] = formatted.split(' ')

  return { day, time }
}

const sortedWateringLogs = computed(
  () => [...plant?.logs.watering || []].sort((lhs, rhs) => rhs.date - lhs.date).map(log => ({
    ...log,
    ...getDayAndTime(log.date),
  })),
)

async function openDeleteWateringLogModal(log: WateringLog) {
  const { day, time } = getDayAndTime(log.date)
  const text = `Bist du sicher, dass du den Gießeintrag vom ${day} um ${time} Uhr löschen möchtest?`

  const deleteWateringLog = async () => {
    const result = await plantStore.deleteWateringLog(log.id)

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
