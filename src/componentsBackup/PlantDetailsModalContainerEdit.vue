<template>
  <IModal
    close-on-click-outside
  >
    <h2 class="font-semibold text-2xl">
      Behälter bearbeiten
    </h2>

    <PlantFormContainer
      v-model:medium="medium"
      v-model:container="container"
      v-model:volume="volume"
      v-model:notes="notes"
      v-model:datetime="datetime"
    />

    <template #action>
      <IBtn
        @click="$emit('close')"
      >
        <IconClose />
        Schließen
      </IBtn>

      <IBtn
        variant="primary"
        class="ml-1 text-base-100"
        @click="editContainer"
      >
        <IconSave />
        Änderung speichern
      </IBtn>
    </template>
  </IModal>
</template>

<script lang="ts" setup>
import type { PlantContainer } from '../modules/plant_container/types'
import type { EditPlantContainer } from '../modules/plants/types'
import dayjs from 'dayjs'
import {
  X as IconClose,
  Save as IconSave,
} from 'lucide-vue-next'
import { ref } from 'vue'
import PlantFormContainer from './PlantFormContainer.vue'
import IBtn from './ui/IBtn.vue'
import IModal from './ui/IModal.vue'

interface Props {
  container: PlantContainer
}
interface Emits {
  close: []
  edit: [data: EditPlantContainer]
}

const { container: containerProp } = defineProps<Props>()
const emit = defineEmits<Emits>()

const medium = ref(containerProp.medium)
const container = ref(containerProp.container)
const volume = ref(containerProp.volume)
const notes = ref(containerProp.notes)
const datetime = ref(dayjs(new Date(containerProp.timestamp)).format('YYYY-MM-DDTHH:mm'))

function editContainer() {
  const data: EditPlantContainer = {
    id: containerProp.id,
    container: container.value,
    medium: medium.value,
    volume: volume.value,
    notes: notes.value,
    datetime: datetime.value,
  }
  emit('edit', data)
}
</script>
