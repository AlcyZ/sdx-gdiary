<template>
  <form
    class="space-y-3"
    @submit.prevent="$emit('submit')"
  >
    <InputTextFloat
      v-model="strain"
      label="Wähle die Sorte deiner Pflanze aus"
      :error="errors.strain"
      required
    />

    <InputTextFloat
      v-model="name"
      label="Gib deiner Pflanze einen Namen (optional)"
      :error="errors.name"
    />

    <PlantFormSubstrate
      v-model:substrate="substrate"
      v-model:size="substrateSize"
      :substrate-error="errors.substrate"
      :size-error="errors.substrateSize"
    />

    <PlantFormPhase
      v-model="phases"
      :error="errors.phases"
    />
  </form>
</template>

<script lang="ts" setup>
import type { NewPlantPhase } from '../modules/plants/types'
import InputTextFloat from './InputTextFloat.vue'
import PlantFormPhase from './PlantFormPhase.vue'
import PlantFormSubstrate from './PlantFormSubstrate.vue'

interface Props {
  errors: FormError
}
interface Emits {
  submit: []
}

interface FormError {
  strain?: string
  name?: string
  substrate?: string
  substrateSize?: string
  phases?: string
}

defineProps<Props>()
defineEmits<Emits>()

const strain = defineModel<string>('strain')
const name = defineModel<string>('name')
const substrate = defineModel<string>('substrate')
const substrateSize = defineModel<string>('substrateSize', { required: true })
const phases = defineModel<Array<NewPlantPhase>>('phases', { required: true })
</script>
