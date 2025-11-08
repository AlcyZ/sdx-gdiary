<template>
  <div>
    <div class="flex items-center justify-between mb-3 border-b border-b-base-200">
      <h2 class="text-lg font-semibold">
        Dünger
      </h2>

      <IBtn ghost @click="$emit('addFertilizer')">
        <IconAdd />
        Neu
      </IBtn>
    </div>
    <div class="join join-vertical w-full">
      <ICollapse
        v-for="manufacturer in Object.keys(fertilizersGroup).sort()"
        :key="manufacturer"
        name="manufacturer"
        class="border border-base-200 join-item"
        arrow
        closable
      >
        <ICollapseTitle class="font-semibold opacity-80">
          {{ manufacturer }}
        </ICollapseTitle>
        <ICollapseContent>
          <IList>
            <IListRow
              v-for="(fertilizer, i) in fertilizersGroup[manufacturer]"
              :key="i"
            >
              <div class="list-col-grow flex items-center font-semibold opacity-60">
                {{ fertilizer.name }}
              </div>
              <IBtn
                square
                ghost
                size="sm"
                @click="edit(fertilizer)"
              >
                <IconEdit :size="20" />
              </IBtn>

              <IBtn
                square
                ghost
                size="sm"
                @click="showDeleteConfirmation(fertilizer)"
              >
                <IconDelete :size="20" />
              </IBtn>
            </IListRow>
          </IList>
        </ICollapseContent>
      </ICollapse>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Fertilizer, NewFertilizer } from '../modules/nutrients/types'
import {
  CirclePlus as IconAdd,
  Trash as IconDelete,
  Edit as IconEdit,
} from 'lucide-vue-next'
import { computed, inject } from 'vue'
import { useModal } from '../composables/useModal.ts'
import { useToast } from '../composables/useToast.ts'
import { REPO_FERTILIZERS } from '../di_keys.ts'
import { err } from '../util.ts'
import FertilizerModalEdit from './FertilizerModalEdit.vue'
import IBtn from '../components/IBtn.vue'
import ICollapse from '../components/ICollapse.vue'
import ICollapseContent from '../components/ICollapseContent.vue'
import ICollapseTitle from '../components/ICollapseTitle.vue'
import IList from '../components/IList.vue'
import IListRow from '../components/IListRow.vue'

interface Props {
  fertilizers: Array<Fertilizer>
}
interface Emits {
  addFertilizer: []
  sync: []
}

const { fertilizers } = defineProps<Props>()
const emit = defineEmits<Emits>()

const fertilizerRepo = inject(REPO_FERTILIZERS)

const { toast } = useToast()
const { showConfirmationModal, showModal } = useModal()

const fertilizersGroup = computed(() => {
  const unknown = 'Unbekannter Hersteller'

  const data: Record<string, Array<Fertilizer>> = {}

  for (const fertilizer of fertilizers) {
    const manufacturer = fertilizer.manufacturer || unknown

    if (!(manufacturer in data)) {
      data[manufacturer] = []
    }

    data[manufacturer]?.push(fertilizer)
  }

  return data
})

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
    emit('sync')
    close()
  }

  const { close } = showModal(FertilizerModalEdit, {
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
      emit('sync')
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
