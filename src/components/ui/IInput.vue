<template>
  <label class="input" :class="labelClass">
    <span
      v-if="label && !suffix"
      class="label"
      v-text="label"
    />

    <input
      v-model="model"
      :class="inputClass"
      :type="type"
      :placeholder="placeholder"
      :inputmode="inputMode"
    >

    <span
      v-if="label && suffix"
      class="label"
      v-text="label"
    />
  </label>
  <div
    v-if="error"
    class="text-xs text-error px-4 mt-1"
    v-text="error"
  />
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
  inputMode?: 'decimal' | 'numeric'
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
