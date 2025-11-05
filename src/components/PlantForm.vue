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

    <IFieldset
      v-if="wateringSchemas.length > 0"
      legend="Bewässerungsschema"
    >
      <label
        :for="schemaSelectId"
      >
        Wähle dein Bewässerungsschema. Dadurch lässt sich beim erstellen eines Gießeintrags direkt die passenden Dünger auswählen
      </label>
      <select
        :id="schemaSelectId"
        v-model="wateringSchema"
        class="select"
        :class="{ 'opacity-75': wateringSchema === undefined }"
      >
        <option class="opacity-75 text-xs" :value="undefined">
          - Kein Bewässerungsschema -
        </option>
        <option
          v-for="(schema, i) in wateringSchemas"
          :key="i"
          :value="schema"
        >
          {{ schema.name }}
        </option>
      </select>
    </IFieldset>

    <PlantFormPhase
      v-model="phases"
      :error="errors.phases"
    />
  </form>
</template>

<script lang="ts" setup>
import type { WateringSchema } from '../modules/nutrients/types'
import type { NewPlantPhase } from '../modules/plants/types'
import { useId } from 'vue'
import IFieldset from './IFieldset.vue'
import InputTextFloat from './InputTextFloat.vue'
import PlantFormPhase from './PlantFormPhase.vue'
import PlantFormSubstrate from './PlantFormSubstrate.vue'

interface Props {
  errors: FormError
  wateringSchemas: Array<WateringSchema>
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

const { wateringSchemas } = defineProps<Props>()
defineEmits<Emits>()

const strain = defineModel<string>('strain')
const name = defineModel<string>('name')
const substrate = defineModel<string>('substrate')
const substrateSize = defineModel<string>('substrateSize', { required: true })
const phases = defineModel<Array<NewPlantPhase>>('phases', { required: true })
const wateringSchema = defineModel<WateringSchema>('wateringSchema')

const schemaSelectId = useId()
</script>
