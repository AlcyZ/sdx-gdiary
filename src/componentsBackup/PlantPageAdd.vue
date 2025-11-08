<template>
  <ICard
    class="w-full max-w-2xl"
    class-actions="justify-between"
  >
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold">
        Neue Pflanze anlegen
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
      <div class="join">
        <IBtn
          variant="neutral"
          class="join-item"
          :disabled="loading || hasFormErrors"
          @click="saveAndNew"
        >
          <IconAdd />
          Speichern & Neu
        </IBtn>
        <IBtn
          variant="primary"
          class="join-item text-base-100"
          :disabled="loading || hasFormErrors"
          @click="save"
        >
          <IconSave />
          Speichern
        </IBtn>
      </div>
    </template>
  </ICard>
</template>

<script lang="ts" setup>
import type { WateringSchema } from '../modules/nutrients/types'
import type { NewPlant } from '../modules/plants/types'
import type { Result, ToastVariant } from '../types'
import {
  CirclePlus as IconAdd,
  MoveLeft as IconBack,
  Save as IconSave,
} from 'lucide-vue-next'
import { inject, ref } from 'vue'
import { usePlantForm } from '../composables/usePlantForm.ts'
import { useToast } from '../composables/useToast.ts'
import { REPO_PLANT } from '../di_keys.ts'
import { INDEX_WATERING_SCHEMA_ID } from '../modules/db'
import { err } from '../util.ts'
import IBtn from '../components/ui/IBtn.vue'
import ICard from '../components/ui/ICard.vue'
import PlantForm from './PlantForm.vue'

interface Props {
  wateringSchemas: Array<WateringSchema>
}
interface Emits {
  back: []
  backAndSync: []
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const plantRepo = inject(REPO_PLANT)
const { showToast } = useToast()

const loading = ref(false)

const {
  strain,
  name,
  substrate,
  substrateSize,
  phases,
  wateringSchema,
  validate,
  errors,
  hasFormErrors,
} = usePlantForm({
  strain: '',
  name: '',
  substrate: '',
  substrateSize: '',
  phases: [],
})

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
    [INDEX_WATERING_SCHEMA_ID]: wateringSchema.value?.id,
  }

  const result = await plantRepo?.save(newPlant) || err(undefined)
  loading.value = false

  return result.ok ? result : err('Pflanze konnte nicht gespeichert werden')
}
</script>
