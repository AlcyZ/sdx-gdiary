<template>
  <div>
    <label class="floating-label">
      <input
        ref="input"
        v-model="model"
        :type="type"
        class="input"
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
  label: string
  type?: 'text' | 'password' | 'date'
  error?: string
  info?: string
  fullWidth?: boolean
  size?: InputSize
  required?: boolean
}
interface Emits {

}

const { fullWidth, size, type = 'text', required = false } = defineProps<Props>()
defineEmits<Emits>()

const model = defineModel<string>()
const input = ref<HTMLInputElement | null>(null)

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
