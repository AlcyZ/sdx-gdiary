<template>
  <select
    v-model="model"
    class="select"
    :class="selectClass"
  >
    <slot />
    <template
      v-for="(option, i) in options"
    >
      <slot name="option" :item="option" :i="i" />
    </template>
  </select>
</template>

<script lang="ts" setup generic="T">
import type { SelectSize } from '../types'
import { computed } from 'vue'

interface Props {
  options: Array<T>
  modelValue: T
  fullWidth?: boolean
  size?: SelectSize
}
interface Emits {
  'update:modelValue': [value: T]
}

const { modelValue, fullWidth = false, size } = defineProps<Props>()
const emit = defineEmits<Emits>()
defineSlots<{
  default: (props: Record<string, never>) => any
  option: (props: { item: T, i: number }) => any
}>()

const model = computed({
  get(): T {
    return modelValue
  },
  set(value: T) {
    emit('update:modelValue', value)
  },
})

const sizeMap: Record<SelectSize, string> = {
  xs: 'select-xs',
  sm: 'select-sm',
  md: 'select-md',
  lg: 'select-lg',
  xl: 'select-xl',
}

const selectClass = computed(() => [
  fullWidth ? 'w-full' : undefined,
  size ? sizeMap[size] : undefined,
])
</script>
