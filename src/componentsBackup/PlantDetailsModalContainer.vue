<template>
  <IModal
    close-on-click-outside
  >
    <h3 class="text-3xl font-semibold">
      Pflanzenbehälter ändern
    </h3>

    <p class="text-gray-500 text-sm my-6">
      Wenn du deine Pflanze umgetopft hast kannst du hier die Änderung notieren. Dies ist die bevorzugte Funktion. So
      behältst du genau den Überblick, wann du welche Behälter verwendet hast.
    </p>

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
        @click="saveContainer"
      >
        <IconSave />
        Änderung speichern
      </IBtn>
    </template>
  </IModal>
</template>

<script lang="ts" setup>
import type { PlantContainerMedium } from '../modules/plant_container/types'
import type { NewPlantContainer } from '../modules/plants/types'
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

}

interface Emits {
  save: [container: NewPlantContainer]
  close: []
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const medium = ref<PlantContainerMedium>('soil')
const container = ref<string>('')
const volume = ref<number>(0.5)
const notes = ref<string | undefined>()
const datetime = ref<string>(dayjs().format('YYYY-MM-DDTHH:mm'))

function saveContainer() {
  const data: NewPlantContainer = {
    medium: medium.value,
    container: container.value,
    volume: volume.value,
    notes: notes.value,
    datetime: datetime.value,
  }
  emit('save', data)
}
</script>
