<template>
  <input
    v-model="inputModel"
    type="range"
    :min="min"
    :max="max"
    step="1"
  >
</template>

<script lang="ts" setup generic="T">
import { computed } from 'vue'

interface Props {
  steps: Array<T>
  modelValue: T
}
interface Emits {
  'update:modelValue': [value: T]
}

const { steps, modelValue } = defineProps<Props>()
const emit = defineEmits<Emits>()

const inputModel = computed({
  get() {
    return steps.findIndex(item => item === modelValue)
  },
  set(step: string) {
    const index = Number(step)
    const value = steps[index]

    if (value !== undefined)
      emit('update:modelValue', value)
  },
})

const min = 0
const max = computed(() => steps.length - 1)
</script>
