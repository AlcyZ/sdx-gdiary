<template>
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
</template>

<script lang="ts" setup>
import type { Plant, WateringLog } from '../modules/plants/types'
import dayjs from 'dayjs'
import { Trash as IconDelete } from 'lucide-vue-next'
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

const sortedWateringLogs = computed(
  () => [...plant?.wateringLogs || []].sort((lhs, rhs) => rhs.date - lhs.date).map(log => ({
    ...log,
    formatted: dayjs(new Date(log.date)).format('DD.MM.YYYY HH:mm'),
  })),
)

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
