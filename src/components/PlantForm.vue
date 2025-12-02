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
          v-model="name"
          :error="errors.name"
          full-width
          placeholder="#1 Super Silver Purple Chicken Cookie"
        />
      </div>
    </ICard>

    <PlantFormImages
      v-model="images"
    />

    <PlantFormContainer
      v-model:container="container"
      v-model:medium="medium"
      v-model:volume="volume"
      v-model:notes="notes"
      v-model:datetime="containerDatetime"
      :container-error="errors.container"
      :medium-error="errors.medium"
      :volume-error="errors.volume"
      :notes-error="errors.notes"
      :show-warning="isEdit"
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
import type { PlantContainerMedium } from '../modules/plant_container/types'
import type { NewPlantPhase } from '../modules/plants/types'
import { useWateringSchemaStore } from '../stores/wateringSchemaStore.ts'
import PlantFormContainer from './PlantFormContainer.vue'
import PlantFormImages from './PlantFormImages.vue'
import PlantFormPhase from './PlantFormPhase.vue'
import ICard from './ui/ICard.vue'
import ICardTitle from './ui/ICardTitle.vue'
import IInput from './ui/IInput.vue'
import ISelect from './ui/ISelect.vue'

interface Props {
  errors: FormError
  isEdit?: boolean
}
interface Emits {
  submit: []
}

interface FormError {
  strain?: string
  name?: string
  container?: string
  medium?: string
  volume?: string
  notes?: string
  phases?: string
}

defineProps<Props>()
defineEmits<Emits>()

const wateringSchemaStore = useWateringSchemaStore()

const strain = defineModel<string>('strain')
const name = defineModel<string>('name')

const medium = defineModel<PlantContainerMedium>('medium', { required: true })
const container = defineModel<string>('container', { required: true })
const volume = defineModel<number>('volume', { required: true })
const notes = defineModel<string>('notes')
const containerDatetime = defineModel<string>('containerDatetime', { required: true })

const phases = defineModel<Array<NewPlantPhase>>('phases', { required: true })
const wateringSchema = defineModel<WateringSchema>('wateringSchema')
const images = defineModel<FileList>('images')
</script>
