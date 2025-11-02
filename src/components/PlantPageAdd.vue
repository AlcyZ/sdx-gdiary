<template>
  <ICard
    class="w-full max-w-2xl"
  >
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold">
        Neue Pflanze anlegen
      </h1>
    </div>

    <div class="space-y-3">
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
        v-model:phase="phase"
        v-model:start="phaseStart"
        :phase-error="errors.phase"
        :start-error="errors.phaseStart"
      />
    </div>

    <button
      class="btn btn-primary text-base-100"
      :disabled="loading"
      @click="submit"
    >
      <IconAdd />
      Speichern
    </button>
  </ICard>
</template>

<script lang="ts" setup>
import type { NewPlant, PlantPhaseType, PlantSubstrateType } from '../modules/plants/types'
import type { ToastVariant } from '../types'
import { toTypedSchema } from '@vee-validate/yup'
import {
  CirclePlus as IconAdd,
} from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import * as yup from 'yup'
import { useToast } from '../composables/useToast.ts'
import PlantRepository from '../modules/plants/plant_repository.ts'
import ICard from './ICard.vue'
import InputTextFloat from './InputTextFloat.vue'
import PlantFormPhase from './PlantFormPhase.vue'
import PlantFormSubstrate from './PlantFormSubstrate.vue'

interface Props {

}
interface Emits {
  back: []
  backAndSync: []
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const { showToast } = useToast()

const loading = ref(false)

const ERR_STRAIN_REQUIRED = 'Die Sorte muss angegeben werden'
const ERR_STRAIN_MAX = ({ max }: { max: number }) => `Die Sorte dar maximal ${max} Zeichen lang sein`

const ERR_SUBSTRATE_REQUIRED = 'Es muss ein Substrat/Medium ausgewählt werden'
const ERR_SUBSTRATE_SIZE_REQUIRED = 'Es muss eine Substratgröße angegeben werden'
const ERR_PHASE_REQUIRED = 'Die Wachstumsphase muss angegeben werden'
const ERR_PHASE_START_REQUIRED = 'Es muss ein Startdatum für die Wachstumsphase angegeben werden'

const validationSchema = toTypedSchema(
  yup.object({
    strain: yup.string().required(ERR_STRAIN_REQUIRED).max(64, ERR_STRAIN_MAX),
    name: yup.string().optional(),
    substrate: yup.string().required(ERR_SUBSTRATE_REQUIRED),
    substrateSize: yup.string().required(ERR_SUBSTRATE_SIZE_REQUIRED),
    phase: yup.string().required(ERR_PHASE_REQUIRED),
    phaseStart: yup.string().required(ERR_PHASE_START_REQUIRED),
  }),
)

const { validate, errors, defineField } = useForm({
  validationSchema,
})

const [strain] = defineField('strain')
const [name] = defineField('name')
const [substrate] = defineField<'substrate', PlantSubstrateType>('substrate')
const [substrateSize] = defineField('substrateSize')
const [phase] = defineField<'phase', PlantPhaseType>('phase')
const [phaseStart] = defineField('phaseStart')

function toast(message: string, variant: ToastVariant = 'error', close?: () => void) {
  showToast({
    message,
    variant,
    class: 'w-full sm:w-max',
    duration: 1500,
  }, close !== undefined ? { close } : undefined)
}

async function submit() {
  loading.value = true

  const r = await validate()
  if (!r.valid) {
    toast('Bitte fülle alle Pflichtfelder aus')
    loading.value = false
    return
  }

  const newPlant: NewPlant = {
    strain: strain.value!,
    name: name.value,
    substrate: {
      substrate: substrate.value,
      size: substrateSize.value!,
    },
    phase: {
      phase: phase.value,
      startedAt: phaseStart.value!,
    },
  }

  const repo = await PlantRepository.create()
  const result = await repo.save(newPlant)

  if (result.ok) {
    toast('Pflanze erfolgreich gespeichert', 'success', () => {
      loading.value = false
      emit('backAndSync')
    })
    return
  }

  loading.value = false
  toast('Pflanze konnte nicht gespeichert werden')
}
</script>
