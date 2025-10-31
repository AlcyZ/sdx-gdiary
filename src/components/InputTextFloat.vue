<template>
  <div>
    <label class="floating-label">
      <input
        v-model="model"
        :type="type"
        :placeholder="labelText"
        class="input input-md w-full"
      >
      <span>{{ labelText }}</span>
    </label>
    <div
      v-if="error"
      class="text-xs text-error px-4 mt-1"
    >
      {{ error }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  label: string
  error?: string
  required?: boolean
  type?: 'text' | 'date'
}
interface Emits {

}

const { label, required = false, type = 'text' } = defineProps<Props>()
defineEmits<Emits>()

const model = defineModel()

const labelText = computed((): string => required ? `${label}*` : label)
</script>
