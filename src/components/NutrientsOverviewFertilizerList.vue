<template>
  <NutrientsOverviewGroupings
    :groups
  >
    <template #item="{ item: fertilizer }: { item: Fertilizer }">
      <div class="flex items-center justify-between">
        <h4 class="font-semibold text-primary-content">
          {{ fertilizer.name }}
        </h4>

        <div class="space-x-1">
          <IBtn
            square
            ghost
            size="lg"
            @click="edit(fertilizer)"
          >
            <IconEdit :size="20" />
          </IBtn>
          <IBtn
            square
            ghost
            variant="error"
            size="lg"
            @click="showDeleteConfirmation(fertilizer)"
          >
            <IconDelete :size="20" />
          </IBtn>
        </div>
      </div>
    </template>
  </NutrientsOverviewGroupings>
</template>

<script lang="ts" setup>
import type { Fertilizer, NewFertilizer } from '../modules/nutrients/types'
import {
  Trash as IconDelete,
  Edit as IconEdit,
} from 'lucide-vue-next'
import { computed, inject } from 'vue'
import { useModal } from '../composables/useModal.ts'
import { useToast } from '../composables/useToast.ts'
import { REPO_FERTILIZERS } from '../di_keys.ts'
import { useFertilizerStore } from '../stores/fertilizerStore.ts'
import { err } from '../util.ts'
import NutrientsOverviewGroupings from './NutrientsOverviewGroupings.vue'
import NutrientsOverviewModalFertilizerEdit from './NutrientsOverviewModalFertilizerEdit.vue'
import IBtn from './ui/IBtn.vue'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

const fertilizerRepo = inject(REPO_FERTILIZERS)
const fertilizerStore = useFertilizerStore()

const { toast } = useToast()
const { showConfirmationModal, showModal } = useModal()

const fertilizersGroup = computed(() => {
  const unknown = 'Unbekannter Hersteller'

  const data: Record<string, Array<Fertilizer>> = {}

  for (const fertilizer of fertilizerStore.fertilizers) {
    const manufacturer = fertilizer.manufacturer || unknown

    if (!(manufacturer in data)) {
      data[manufacturer] = []
    }

    data[manufacturer]?.push(fertilizer)
  }

  return data
})

const groups = computed(
  () => Object.entries(fertilizersGroup.value)
    .map(([manufacturer, items]) => ({
      title: manufacturer,
      items,
    })),
)

function edit(fertilizer: Fertilizer) {
  const updateFertilizer = async (update: NewFertilizer, close: () => void) => {
    const data: Fertilizer = {
      id: fertilizer.id,
      name: update.name,
      manufacturer: update.manufacturer,
    }

    const result = await fertilizerRepo?.update(data) || err(undefined)
    if (!result.ok) {
      toast('Es ist ein Fehler beim aktualisieren des Düngers aufgetreten', 'error')
      return
    }

    toast('Dünger aktualisiert', 'success')
    await fertilizerStore.syncFertilizers()
    close()
  }

  const { close } = showModal(NutrientsOverviewModalFertilizerEdit, {
    fertilizer,
    onSave: async (update: NewFertilizer) => updateFertilizer(update, close),
  })
}

function showDeleteConfirmation(fertilizer: Fertilizer) {
  const fertilizerName = fertilizer.manufacturer !== undefined && fertilizer.manufacturer !== ''
    ? `${fertilizer.name} (${fertilizer.manufacturer})`
    : fertilizer.name
  const text = `Bist du sicher, dass der Dünger '${fertilizerName}' gelöscht werden soll?`

  const deleteFertilizer = async () => {
    const result = await fertilizerRepo?.delete(fertilizer.id) || err(undefined)

    if (result.ok) {
      toast('Dünger erfolgreich gelöscht', 'success')
      await fertilizerStore.syncFertilizers()
    }
    else {
      toast('Es ist ein Fehler beim löschen des Düngers aufgetreten', 'error')
    }
  }

  showConfirmationModal({
    title: 'Dünger löschen',
    text,
    actions: [
      {
        label: 'Löschen',
        class: 'btn-error text-base-100',
        onClick: deleteFertilizer,
        icon: IconDelete,
      },
    ],
  })
}
</script>
