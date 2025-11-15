<template>
  <form
    class="space-y-6 mb-4"
    @submit.prevent="$emit('submit')"
  >
    <ICard>
      <ICardTitle class="text-xl">
        Pflanzen-Identifikation
      </ICardTitle>

      <p class="text-xs text-gray-400 my-3">
        Gib der Pflanze einen Namen und wähle die Sorte aus dem Katalog.
      </p>

      <div>
        <h4>Wähle die Sorte deiner Pflanze aus*</h4>

        <IInput
          v-model="strain"
          :error="errors.strain"
          full-width
          placeholder="OG Kush | Northern Lights"
          size="xl"
        />
      </div>

      <div class="mt-2">
        <h4>Gib deiner Pflanze einen Namen (optional)</h4>

        <IInput
          v-model="strain"
          :error="errors.strain"
          full-width
          placeholder="#1 Super Silver Purple Chicken Cookie"
        />
      </div>
    </ICard>

    <PlantFormSubstrate
      v-model:substrate="substrate"
      v-model:size="substrateSize"
      :substrate-error="errors.substrate"
      :size-error="errors.substrateSize"
    />

    <ICard>
      <ICardTitle class="text-xl">
        Bewässerungsschema
      </ICardTitle>

      <p class="text-xs text-gray-400 my-3">
        Wähle dein Bewässerungsschema. Dadurch lässt sich beim erstellen eines Gießeintrags direkt die passenden Dünger auswählen
      </p>

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
    </ICard>

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
import ICard from './ui/ICard.vue'
import ICardTitle from './ui/ICardTitle.vue'
import IInput from './ui/IInput.vue'
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
