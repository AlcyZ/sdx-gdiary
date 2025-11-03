<template>
  <div class="space-y-3">
    <InputTextFloat
      label="Name"
      required
      :model-value="modelValue.name"
      @update:model-value="updateName"
    />

    <InputTextFloat
      label="Hersteller"
      :model-value="modelValue.manufacturer"
      @update:model-value="updateManufacturer"
    />
  </div>
</template>

<script lang="ts" setup>
import InputTextFloat from './InputTextFloat.vue'

interface Props {
  modelValue: NewFertilizer
}
interface Emits {
  'update:modelValue': [value: NewFertilizer]
}

const { modelValue } = defineProps<Props>()
const emit = defineEmits<Emits>()

function updateName(name: string | undefined) {
  if (name) {
    emit('update:modelValue', {
      name,
      manufacturer: modelValue.manufacturer,
    })
  }
}

function updateManufacturer(manufacturer: string | undefined) {
  emit('update:modelValue', {
    name: modelValue.name,
    manufacturer,
  })
}
</script>
