<template>
  <IModal
    class="modal-bottom sm:modal-middle"
    close-on-click-outside
  >
    <div tabindex="-1" class="absolute w-0 h-0 overflow-hidden" />
    <div class="h-full divide-y divide-base-300 flex flex-col">
      <div class="flex items-center py-2 px-4">
        <IBtn
          class="ml-2 w-full"
          ghost
        >
          <IconCamera />
          Bild aufnehmen
        </IBtn>
      </div>
      <div class="flex items-center py-2 px-4">
        <IBtn
          class="ml-2 w-full"
          ghost
          @click="selectImage"
        >
          <IconUpload />
          Bild auswählen
        </IBtn>
        <input
          ref="inputFile"
          type="file"
          class="hidden"
          accept="image/png, image/jpeg, image/webp"
          @change="handleSelect"
        >
      </div>
      <div class="flex items-center py-2 px-4">
        <IBtn
          class="ml-2 w-full"
          ghost
          @click="$emit('abort')"
        >
          <IconBack />
          Zurück
        </IBtn>
      </div>
    </div>
  </IModal>
</template>

<script lang="ts" setup>
import type { Option } from '../types'
import {
  X as IconBack,
  Camera as IconCamera,
  ImageUp as IconUpload,
} from 'lucide-vue-next'
import { ref } from 'vue'
import { none, some } from '../util.ts'
import IBtn from './ui/IBtn.vue'
import IModal from './ui/IModal.vue'

interface Props {

}
interface Emits {
  abort: []
  upload: [file: File]
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const inputFile = ref<HTMLInputElement | undefined>()

function selectImage() {
  inputFile.value?.click()
}

function handleSelect(event: Event) {
  const fileResult = getUploadedFile(event)
  if (!fileResult.exist)
    return

  emit('upload', fileResult.value)
}

function getUploadedFile(event: Event): Option<File> {
  if (!(event.target instanceof HTMLInputElement))
    return none()

  const files = event.target.files
  if (!files)
    return none()

  const file = files[0]
  return file instanceof File
    ? some(file)
    : none()
}
</script>
