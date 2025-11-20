<template>
  <div
    class="relative border-2 border-dashed rounded-field text-center cursor-pointer transition duration-200 flex items-center justify-center"
    :class="containerClass"
    @dragover.prevent="onDragOver"
    @dragleave.prevent="onDragLeave"
    @drop.prevent="onDrop"
    @click="fileInput?.click()"
  >
    <template v-if="modelValue === undefined">
      <span class="font-semibold opacity-80">{{ label !== undefined ? label : 'Drag & drop files' }}</span>
    </template>
    <template v-else>
      <IconFile class="mr-1" /> {{ labelSelected }}
    </template>
    <input
      ref="fileInput"
      type="file"
      :accept="accept"
      class="hidden"
      multiple
      @change="onFileSelect"
    >

    <IBtn
      v-if="modelValue !== undefined"
      square
      ghost
      size="lg"
      class="absolute right-0 top-0"
      @click.stop="$emit('update:modelValue', undefined)"
    >
      <IconX />
    </IBtn>
  </div>
</template>

<script lang="ts" setup>
import { File as IconFile, X as IconX } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import IBtn from './IBtn.vue'

interface Props {
  label?: string
  accept?: string
  modelValue?: FileList | undefined
}
interface Emits {
  'update:modelValue': [file: FileList | undefined]
}

const { modelValue } = defineProps<Props>()
const emit = defineEmits<Emits>()

const isDragging = ref(false)
const fileInput = ref<HTMLInputElement | undefined>()

const labelSelected = computed(() => {
  if (!modelValue)
    return 'Nichts ausgewählt'

  return Array.from(modelValue).map(file => file.name.substring(0, 30)).join(' ')
})

const containerClass = computed(() => [
  isDragging.value ? 'border-info bg-blue-50' : 'border-primary',
  modelValue !== undefined ? 'pr-12 pl-6 py-6' : 'p-6',
])

const onDragOver = () => (isDragging.value = true)
const onDragLeave = () => (isDragging.value = false)

async function onDrop(event: DragEvent) {
  isDragging.value = false
  const files = event.dataTransfer?.files

  if (files)
    emit('update:modelValue', files)
}

async function onFileSelect(event: Event) {
  if (event.target instanceof HTMLInputElement) {
    const files = event.target.files !== null ? event.target.files : undefined

    if (files)
      emit('update:modelValue', files)
  }
}
</script>
