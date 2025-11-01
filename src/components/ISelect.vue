<template>
  <select
    v-model="model"
    class="select"
  >
    <slot />
    <template
      v-for="(option) in options"
    >
      <slot name="option" :item="option" />
    </template>
  </select>
</template>

<script lang="ts" setup generic="T">
import { computed } from 'vue'

interface Props {
  options: Array<T>
  modelValue: T
}
interface Emits {
  'update:modelValue': [value: T]
}

const { modelValue } = defineProps<Props>()
const emit = defineEmits<Emits>()
defineSlots<{
  default: (props: Record<string, never>) => any
  option: (props: { item: T }) => any
}>()

const model = computed({
  get(): T {
    return modelValue
  },
  set(value: T) {
    emit('update:modelValue', value)
  },
})
</script>
