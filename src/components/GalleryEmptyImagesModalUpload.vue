<template>
  <IModal
    class="modal-bottom sm:modal-middle"
    close-on-click-outside
  >
    <div class="space-y-3">
      <p
        v-if="!selected"
        class="leading-none mb-3"
      >
        Bitte wähle eine Pflanze aus, für die das Bild verwendet werden soll
      </p>

      <select v-model="selected" class="select">
        <option
          v-for="(plant, i) in plants"
          :key="i"
          :value="plant"
        >
          {{ getPlantName(plant) }}
        </option>
      </select>

      <IInputMultiFileUpload
        v-if="selected"
        v-model="files"
        accept="image/jpeg,image/png,image/webp"
        label="Klick oder ziehe die Bilder in das Rechteck"
      />

      <div
        v-if="files !== undefined && files.length > 0"
      >
        <pre>
        {{ Array.from(files).map((file: File) => file.name).join(', ') }}
      </pre>
      </div>
    </div>

    <!--    <form method="dialog"> -->
    <!--      <IBtn type="submit"> -->
    <!--        Schließen -->
    <!--      </IBtn> -->
    <!--    </form> -->
  </IModal>
</template>

<script lang="ts" setup>
import type { Plant } from '../modules/plants/types'
import { ref } from 'vue'
import { usePlant } from '../composables/usePlant.ts'
import IInputMultiFileUpload from './ui/IInputMultiFileUpload.vue'
import IModal from './ui/IModal.vue'

interface Props {
  plants: Array<Plant>
}
interface Emits {
  upload: [plant: Plant, images: FileList]
}

const { plants } = defineProps<Props>()
const emit = defineEmits<Emits>()

const { getPlantName } = usePlant()

// const selected = ref<Plant>(plants[0]!)
const selected = ref<Plant | undefined>()
const files = ref<FileList | undefined>()

function upload() {
  if (selected.value === undefined || files.value === undefined)
    return

  emit('upload', selected.value, files.value)
}
</script>
