<template>
  <div class="space-y-4">
    <IInputText
      ref="inputName"
      v-model="name"
      label="Name des Düngers"
      :icon="IconName"
      required
      :error="errorName"
      full-width
      :size="size"
    />

    <IInputText
      ref="inputManufacturer"
      v-model="manufacturer"
      label="Hersteller (optional)"
      :icon="IconManufacturer"
      :error="errorManufacturer"
      full-width
      :size="size"
    />
  </div>
</template>

<script lang="ts" setup>
import type { NewFertilizer } from '../modules/nutrients/types'
import type { InputSize } from '../types'
import {
  Factory as IconManufacturer,
  Feather as IconName,
} from 'lucide-vue-next'
import { ref } from 'vue'
import IInputText from './ui/IInputText.vue'

interface Props {
  errorName?: string
  errorManufacturer?: string
  size?: InputSize
}
interface Emits {
  'update:modelValue': [value: NewFertilizer]
}

defineProps<Props>()
defineEmits<Emits>()

const name = defineModel<string>('name', { required: true })
const manufacturer = defineModel<string | undefined>('manufacturer')

const inputName = ref<InstanceType<typeof IInputText> | null>(null)
const inputManufacturer = ref<InstanceType<typeof IInputText> | null>(null)

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
