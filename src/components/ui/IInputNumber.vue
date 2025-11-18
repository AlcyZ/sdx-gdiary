<template>
  <div>
    <label class="floating-label">
      <input
        v-model.number="model"
        type="number"
        class="input"
        :inputmode="inputMode"
        :class="inputClass"
        :placeholder="label"
      >
      <span>{{ required ? `${label}*` : label }}</span>
    </label>
    <div
      v-if="error"
      class="px-4 text-xs text-error flex items-center"
    >
      <XIcon
        :size="16"
      />
      <span>{{ error }}</span>
    </div>
    <div
      v-if="info"
      class="px-4 text-xs opacity-60"
    >
      {{ info }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { InputSize } from '../../types'
import { XIcon } from 'lucide-vue-next'
import { computed, ref } from 'vue'

interface Props {
  modelValue?: number
  label: string
  error?: string
  info?: string
  required?: boolean
  fullWidth?: boolean
  size?: InputSize
  inputMode?: 'decimal' | 'numeric'
}
interface Emits {
  'update:modelValue': [value: number | undefined]
}

const { fullWidth, size, inputMode = 'decimal', modelValue, required = false } = defineProps<Props>()
const emit = defineEmits<Emits>()

const input = ref<HTMLInputElement | null>(null)

const model = computed({
  get(): number | undefined {
    return modelValue
  },
  // Note: Might be string if user write '1.' instead of '1,'
  set(value: number | string | undefined): void {
    if (typeof value !== 'string')
      emit('update:modelValue', value)
  },
})

const sizeMap: Record<InputSize, string> = {
  xs: 'input-xs',
  sm: 'input-sm',
  md: 'input-md',
  lg: 'input-lg',
  xl: 'input-xl',
}

const inputClass = computed(() => [
  fullWidth ? 'w-full' : undefined,
  size ? sizeMap[size] : undefined,
])

function focus() {
  input.value?.focus()
}

defineExpose({
  focus,
})
</script>
