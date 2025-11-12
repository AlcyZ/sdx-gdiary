<template>
  <div
    class="border-2 border-dashed rounded-field p-6 text-center cursor-pointer transition duration-200 flex items-center justify-center"
    :class="isDragging ? 'border-info bg-blue-50' : 'border-gray-300'"
    @dragover.prevent="onDragOver"
    @dragleave.prevent="onDragLeave"
    @drop.prevent="onDrop"
    @click="fileInput?.click()"
  >
    <template v-if="modelValue === undefined">
      {{ label !== undefined ? label : 'Drag & drop file' }}
    </template>
    <template v-else>
      <IconFile class="mr-1" /> {{ modelValue.name }}
    </template>
    <input
      ref="fileInput"
      type="file"
      :accept="accept"
      class="hidden"
      @change="onFileSelect"
    >
  </div>
</template>

<script lang="ts" setup>
import { File as IconFile } from 'lucide-vue-next'
import { ref } from 'vue'

interface Props {
  label?: string
  accept?: string
  modelValue?: File
}
interface Emits {
  'update:modelValue': [file: File | undefined]
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const isDragging = ref(false)
const fileInput = ref<HTMLInputElement | undefined>()

const onDragOver = () => (isDragging.value = true)
const onDragLeave = () => (isDragging.value = false)

async function onDrop(event: DragEvent) {
  isDragging.value = false
  const file = event.dataTransfer?.files[0]

  if (file)
    emit('update:modelValue', file)
}

async function onFileSelect(event: Event) {
  if (event.target instanceof HTMLInputElement) {
    const file = event.target.files !== null ? event.target.files[0] : undefined

    if (file)
      emit('update:modelValue', file)
  }
}
</script>
