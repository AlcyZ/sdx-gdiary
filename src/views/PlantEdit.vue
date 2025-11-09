<template>
  <div class="flex-1 flex items-center justify-center">
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
          @click="$router.push('/plants')"
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
  </div>
</template>

<script lang="ts" setup>
import type { WateringSchema } from '../modules/nutrients/types'
import type { EditPlant } from '../modules/plants/types'
import {
  MoveLeft as IconBack,
  Save as IconSave,
} from 'lucide-vue-next'
import { computed, inject, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import PlantForm from '../components/PlantForm.vue'
import IBtn from '../components/ui/IBtn.vue'
import ICard from '../components/ui/ICard.vue'
import { usePlant } from '../composables/usePlant.ts'
import { usePlantForm } from '../composables/usePlantForm.ts'
import { useToast } from '../composables/useToast.ts'
import { REPO_WATERING_SCHEMA } from '../di_keys.ts'
import { INDEX_WATERING_SCHEMA_ID } from '../modules/db'
import { err } from '../util.ts'

interface Props {
}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

const wateringRepo = inject(REPO_WATERING_SCHEMA)

const router = useRouter()
const { plant, syncPlant, plantRepo } = usePlant()
const { toast } = useToast()

const loading = ref(false)

const wateringSchemas = ref<Array<WateringSchema>>([])

const plantName = computed(
  () => plant.value === null
    ? ''
    : plant.value.name !== undefined && plant.value.name !== ''
      ? `${plant.value.name} (${plant.value.strain})`
      : plant.value.strain,
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
  resetForm,
} = usePlantForm()

const hasFormErrors = computed(() => Object.keys(errors.value).length > 0)

async function updatePlant() {
  if (!plant.value)
    return

  const validationResult = await validate()
  if (!validationResult.valid) {
    toast('Bitte fülle alle Pflichtfelder aus', 'error')
    return
  }

  const data: EditPlant = {
    id: plant.value.id,
    strain: strain.value!,
    name: name.value,
    substrate: {
      id: plant.value.substrate.id,
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
  await router.push('/plants')
}

async function syncWateringSchemas() {
  wateringSchemas.value = await wateringRepo?.getAll() || []
}

onMounted(async () => {
  await Promise.all([
    syncPlant(),
    syncWateringSchemas(),
  ])

  if (!plant.value)
    return

  resetForm({
    values: {
      strain: plant.value.strain,
      name: plant.value.name,
      substrate: plant.value.substrate.substrate,
      substrateSize: plant.value.substrate.size,
      phases: plant.value.phases,
    },
  })
  wateringSchema.value = plant.value.wateringSchema
})
</script>
