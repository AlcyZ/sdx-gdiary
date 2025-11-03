<template>
  <div>
    <IFloatingLabel
      :label="labelText"
    >
      <input
        ref="input"
        v-model="model"
        :type="type"
        :placeholder="labelText"
        class="input input-md w-full"
      >
    </IFloatingLabel>
    <div
      v-if="error"
      class="text-xs text-error px-4 mt-1"
    >
      {{ error }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import IFloatingLabel from './IFloatingLabel.vue'

interface Props {
  label: string
  error?: string
  required?: boolean
  type?: 'text' | 'date' | 'number'
}
interface Emits {

}

const { label, required = false, type = 'text' } = defineProps<Props>()
defineEmits<Emits>()

const model = defineModel<string | undefined>()
const input = ref<HTMLInputElement | null>(null)

const labelText = computed((): string => required ? `${label}*` : label)

function focus() {
  input.value?.focus()
}

defineExpose({
  focus,
})
</script>
