<template>
  <div class="space-y-3">
    <IInputText
      ref="inputName"
      v-model="name"
      label="Name"
      required
      :error="errorName"
      full-width
    />

    <IInputText
      ref="inputManufacturer"
      v-model="manufacturer"
      label="Hersteller"
      :error="errorManufacturer"
      full-width
    />
  </div>
</template>

<script lang="ts" setup>
import type { NewFertilizer } from '../modules/nutrients/types'
import type InputTextFloat from './InputTextFloat.vue'
import { ref } from 'vue'
import IInputText from './ui/IInputText.vue'

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
