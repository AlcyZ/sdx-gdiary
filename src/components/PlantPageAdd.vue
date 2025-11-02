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
        v-model="phases"
        :error="errors.phases"
      />
    </div>

    <div class="flex items-center justify-between">
      <button
        class="btn btn-primary text-base-100"
        :disabled="loading || hasFormErrors"
        @click="save"
      >
        <IconSave />
        Speichern
      </button>
      <button
        class="btn btn-secondary text-base-100"
        :disabled="loading || hasFormErrors"
        @click="saveAndNew"
      >
        <IconAdd />
        Speichern & Neue
      </button>
    </div>
  </ICard>
</template>

<script lang="ts" setup>
import type { NewPlant, NewPlantPhase, PlantPhaseType, PlantSubstrateType } from '../modules/plants/types'
import type { Result, ToastVariant } from '../types'
import { toTypedSchema } from '@vee-validate/yup'
import {
  CirclePlus as IconAdd,
  Save as IconSave,
} from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { computed, ref } from 'vue'
import * as yup from 'yup'
import { useToast } from '../composables/useToast.ts'
import PlantRepository from '../modules/plants/plant_repository.ts'
import { err } from '../util.ts'
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
const ERR_PHASES_NOT_CHRONOLOGICALLY = 'Die Phasen müssen chronologisch aufeinander folgen'

const phaseSchema = yup.object({
  phase: yup.mixed<PlantPhaseType>().required(),
  startedAt: yup.string().required('Asd muss'),
  info: yup.string().optional(),
})

const validationSchema = toTypedSchema(
  yup.object({
    strain: yup.string().required(ERR_STRAIN_REQUIRED).max(64, ERR_STRAIN_MAX),
    name: yup.string().optional(),
    substrate: yup.string().required(ERR_SUBSTRATE_REQUIRED),
    substrateSize: yup.string().required(ERR_SUBSTRATE_SIZE_REQUIRED),
    phases: yup.array()
      .of(phaseSchema)
      .test('is-ascending', ERR_PHASES_NOT_CHRONOLOGICALLY, isChronologicallySorted),
  }),
)

const { validate, errors, defineField } = useForm({
  validationSchema,
  initialValues: {
    strain: '',
    name: '',
    substrate: '',
    substrateSize: '',
    phases: [],
  },
})

const hasFormErrors = computed(() => Object.keys(errors.value).length > 0)

const [strain] = defineField('strain')
const [name] = defineField('name')
const [substrate] = defineField<'substrate', PlantSubstrateType>('substrate')
const [substrateSize] = defineField('substrateSize')
const [phases] = defineField<'phases', Array<NewPlantPhase>>('phases')

function toast(message: string, variant: ToastVariant = 'error', close?: () => void) {
  showToast({
    message,
    variant,
    class: 'w-full sm:w-max',
    duration: 1500,
  }, close !== undefined ? { close } : undefined)
}

async function save() {
  const result = await savePlant()

  if (result.ok) {
    loading.value = true
    toast('Pflanze erfolgreich gespeichert', 'success', () => {
      loading.value = false
      emit('backAndSync')
    })
    return
  }

  toast(result.error)
}

async function saveAndNew() {
  const result = await savePlant()
  if (!result.ok) {
    toast(result.error)
    return
  }

  toast('Pflanze erfolgreich gespeichert', 'success')

  strain.value = ''
  name.value = ''
}

async function savePlant(): Promise<Result<undefined, string>> {
  loading.value = true

  const r = await validate()
  if (!r.valid) {
    loading.value = false

    return err('Bitte fülle alle Pflichtfelder aus')
  }

  const newPlant: NewPlant = {
    strain: strain.value!,
    name: name.value,
    substrate: {
      substrate: substrate.value,
      size: substrateSize.value!,
    },
    phases: phases.value,
  }

  const repo = await PlantRepository.create()
  const result = await repo.save(newPlant)
  loading.value = false

  return result.ok ? result : err('Pflanze konnte nicht gespeichert werden')
}

function isChronologicallySorted(phases: Array<NewPlantPhase> | undefined): boolean {
  if (!phases || phases.length < 2) {
    return true
  }

  for (let i = 0; i < phases.length - 1; i++) {
    const current = phases[i]
    const next = phases[i + 1]

    if (!current?.startedAt || !next?.startedAt) {
      continue
    }

    const currentDate = new Date(current.startedAt)
    const nextDate = new Date(next.startedAt)

    if (Number.isNaN(currentDate.getTime()) || Number.isNaN(nextDate.getTime()))
      continue

    if (currentDate > nextDate)
      return false
  }

  return true
}
</script>
