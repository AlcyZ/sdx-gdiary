<template>
  <div class="space-y-3">
    <InputTextFloat
      v-model="name"
      label="Name"
      required
      :error="errorName"
    />

    <InputTextFloat
      v-model="manufacturer"
      label="Hersteller"
      :error="errorManufacturer"
    />
  </div>
</template>

<script lang="ts" setup>
import type { NewFertilizer } from '../modules/nutrients/types'
import InputTextFloat from './InputTextFloat.vue'

interface Props {
  errorName?: string
  errorManufacturer?: string
}
interface Emits {
  'update:modelValue': [value: NewFertilizer]
}

defineProps<Props>()
defineEmits<Emits>()

const name = defineModel<string>('name', { required: true })
const manufacturer = defineModel<string | undefined>('manufacturer')
</script>
