<template>
  <ICard
    class="w-full max-w-2xl"
    class-actions="justify-between"
  >
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold">
        {{ plantName }} bearbeiten
      </h1>
    </div>

    <PlantForm
      v-model:strain="strain"
      v-model:name="name"
      v-model:substrate="substrate"
      v-model:substrate-size="substrateSize"
      v-model:phases="phases"
      v-model:watering-schema="wateringSchema"
      :errors="errors"
      :watering-schemas="wateringSchemas"
    />

    <template #actions>
      <IBtn
        @click="$emit('back')"
      >
        <IconBack />
        Zurück
      </IBtn>

      <IBtn
        variant="primary"
        class="text-base-100"
        :disabled="loading || hasFormErrors"
        @click="updatePlant"
      >
        <IconSave />
        Aktualisieren
      </IBtn>
    </template>
  </ICard>
</template>

<script lang="ts" setup>
import type { WateringSchema } from '../modules/nutrients/types'
import type { EditPlant, Plant } from '../modules/plants/types'
import {
  MoveLeft as IconBack,
  Save as IconSave,
} from 'lucide-vue-next'
import { computed, inject, ref } from 'vue'
import { usePlantForm } from '../composables/usePlantForm.ts'
import { useToast } from '../composables/useToast.ts'
import { REPO_PLANT } from '../di_keys.ts'
import { INDEX_WATERING_SCHEMA_ID } from '../modules/db'
import { err } from '../util.ts'
import IBtn from '../components/IBtn.vue'
import ICard from '../components/ICard.vue'
import PlantForm from './PlantForm.vue'

interface Props {
  plant: Plant
  wateringSchemas: Array<WateringSchema>
}
interface Emits {
  back: []
  backAndSync: []
}

const { plant } = defineProps<Props>()
const emit = defineEmits<Emits>()

const loading = ref(false)

const plantRepo = inject(REPO_PLANT)
const { toast } = useToast()

const plantName = computed(
  () => plant.name !== undefined && plant.name !== ''
    ? `${plant.name} (${plant.strain})`
    : plant.strain,
)

const {
  strain,
  name,
  substrate,
  substrateSize,
  phases,
  wateringSchema,
  validate,
  errors,
} = usePlantForm({
  strain: plant.strain,
  name: plant.name,
  substrate: plant.substrate.substrate,
  substrateSize: plant.substrate.size,
  phases: plant.phases,
}, plant.wateringSchema)

const hasFormErrors = computed(() => Object.keys(errors.value).length > 0)

async function updatePlant() {
  const validationResult = await validate()
  if (!validationResult.valid) {
    toast('Bitte fülle alle Pflichtfelder aus', 'error')
    return
  }

  const data: EditPlant = {
    id: plant.id,
    strain: strain.value!,
    name: name.value,
    substrate: {
      id: plant.substrate.id,
      substrate: substrate.value,
      size: substrateSize.value,
    },
    phases: phases.value,
  }

  if (wateringSchema.value) {
    data[INDEX_WATERING_SCHEMA_ID] = wateringSchema.value.id
  }

  const result = await plantRepo?.update(data) || err(undefined)
  if (!result.ok) {
    toast('Es ist ein Fehler beim aktualisieren der Pflanze aufgetreten', 'error')
    return
  }

  toast('Pflanze erfolgreich aktualisiert', 'success')
  emit('backAndSync')
}
</script>
