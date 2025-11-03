<template>
  <div class="space-y-3">
    <InputTextFloat
      ref="inputName"
      v-model="name"
      label="Name"
      required
      :error="errorName"
    />

    <InputTextFloat
      ref="inputManufacturer"
      v-model="manufacturer"
      label="Hersteller"
      :error="errorManufacturer"
    />
  </div>
</template>

<script lang="ts" setup>
import type { NewFertilizer } from '../modules/nutrients/types'
import { ref } from 'vue'
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

const inputName = ref<InstanceType<typeof InputTextFloat> | null>(null)
const inputManufacturer = ref<InstanceType<typeof InputTextFloat> | null>(null)

function focusName() {
  inputName.value?.focus()
}

function focusManufacturer() {
  inputManufacturer.value?.focus()
}

defineExpose({
  focusName,
  focusManufacturer,
})
</script>
