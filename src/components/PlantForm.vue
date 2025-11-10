<template>
  <form
    class="space-y-3"
    @submit.prevent="$emit('submit')"
  >
    <IInputText
      v-model="strain"
      label="Wähle die Sorte deiner Pflanze aus"
      :error="errors.strain"
      required
      full-width
      size="xl"
    />

    <IInputText
      v-model="name"
      label="Gib deiner Pflanze einen Namen (optional)"
      :error="errors.name"
      full-width
    />

    <PlantFormSubstrate
      v-model:substrate="substrate"
      v-model:size="substrateSize"
      :substrate-error="errors.substrate"
      :size-error="errors.substrateSize"
    />

    <IFieldset
      v-if="wateringSchemaStore.wateringSchemas.length > 0"
      legend="Bewässerungsschema"
    >
      <label
        :for="schemaSelectId"
      >
        Wähle dein Bewässerungsschema. Dadurch lässt sich beim erstellen eines Gießeintrags direkt die passenden Dünger auswählen
      </label>
      <ISelect
        v-model="wateringSchema"
        :options="wateringSchemaStore.wateringSchemas"
        :class="{ 'opacity-75': wateringSchema === undefined }"
      >
        <option class="opacity-75 text-xs" :value="undefined">
          - Kein Bewässerungsschema -
        </option>
        <template #option="{ item, i }: { item: WateringSchema, i: number }">
          <option
            :key="i"
            :value="item"
          >
            {{ item.name }}
          </option>
        </template>
      </ISelect>
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
import { useWateringSchemaStore } from '../stores/wateringSchemaStore.ts'
import PlantFormPhase from './PlantFormPhase.vue'
import PlantFormSubstrate from './PlantFormSubstrate.vue'
import IFieldset from './ui/IFieldset.vue'
import IInputText from './ui/IInputText.vue'
import ISelect from './ui/ISelect.vue'

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

const wateringSchemaStore = useWateringSchemaStore()

const strain = defineModel<string>('strain')
const name = defineModel<string>('name')
const substrate = defineModel<string>('substrate')
const substrateSize = defineModel<string>('substrateSize', { required: true })
const phases = defineModel<Array<NewPlantPhase>>('phases', { required: true })
const wateringSchema = defineModel<WateringSchema>('wateringSchema')

const schemaSelectId = useId()
</script>
