<template>
  <label class="input" :class="labelClass">
    <span
      v-if="label && !suffix"
      class="label"
    />

    <input
      v-model="model"
      :class="inputClass"
      :type="type"
      :placeholder="placeholder"
    >

    <span
      v-if="label && suffix"
      class="label"
    >{{ label }}</span>
  </label>
  <div
    v-if="error"
    class="text-xs text-error px-4 mt-1"
  >
    {{ error }}
  </div>
</template>

<script lang="ts" setup>
import type { InputSize } from '../../types'
import { computed } from 'vue'

interface Props {
  label?: string
  placeholder?: string
  suffix?: boolean
  error?: string
  type?: 'text' | 'number' | 'password' | 'date'
  fullWidth?: boolean
  size?: InputSize | undefined
}
interface Emits {

}

const {
  suffix = false,
  fullWidth = false,
  size,
} = defineProps<Props>()
defineEmits<Emits>()

const model = defineModel()

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

const labelClass = computed(() => [
  fullWidth ? 'w-full' : undefined,
  size ? sizeMap[size] : undefined,
])
</script>
