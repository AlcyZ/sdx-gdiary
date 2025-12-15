<template>
  <div class="flex-1 flex items-center justify-center py-4">
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
        v-model:container="container"
        v-model:medium="medium"
        v-model:volume="volume"
        v-model:notes="notes"
        v-model:container-datetime="containerDatetime"
        v-model:phases="phases"
        v-model:watering-schema="wateringSchema"
        v-model:images="images"
        :errors="errors"
      />

      <template #actions>
        <IBtn
          variant="primary"
          class="w-full text-base-100"
          :disabled="loading || hasFormErrors"
          @click="saveAndNew"
        >
          <IconAdd />
          Speichern & Neu
        </IBtn>
        <IBtn
          variant="neutral"
          class="w-full"
          :disabled="loading || hasFormErrors"
          @click="save"
        >
          <IconSave />
          Speichern
        </IBtn>
      </template>
    </ICard>
    <IFab
      :actions="fabActions"
      class="mb-14"
      :icon="IconMenu"
    />
  </div>
</template>

<script lang="ts" setup>
import type PlantRepository from '../modules/plants/plant_repository.ts'
import type { NewPlant } from '../modules/plants/types'
import type { Result, ToastVariant } from '../types'
import {
  CirclePlus as IconAdd,
  Cog as IconMenu,
  Save as IconSave,
} from 'lucide-vue-next'
import { inject, ref } from 'vue'
import { useRouter } from 'vue-router'
import PlantForm from '../components/PlantForm.vue'
import IBtn from '../components/ui/IBtn.vue'
import ICard from '../components/ui/ICard.vue'
import IFab from '../components/ui/IFab.vue'
import { usePageLayout } from '../composables/usePageLayout.ts'
import { usePlantForm } from '../composables/usePlantForm.ts'
import { usePlantView } from '../composables/usePlantView.ts'
import { useToast } from '../composables/useToast.ts'
import { REPO_PLANT } from '../di_keys.ts'
import { INDEX_WATERING_SCHEMA_ID } from '../modules/db'
import { usePlantStore } from '../stores/plantStore.ts'
import { andThen, combineOpts, err, some, toOpt, wrapOption } from '../util.ts'

interface Props {
}
interface Emits {
  back: []
  backAndSync: []
}

defineProps<Props>()
defineEmits<Emits>()

usePageLayout({
  topNavigation: true,
})

const plantRepo = inject(REPO_PLANT) as PlantRepository

const plantStore = usePlantStore()

const router = useRouter()
const { showToast } = useToast()
const { fabActions } = usePlantView()

const loading = ref(false)

const {
  strain,
  name,
  container,
  medium,
  volume,
  notes,
  containerDatetime,
  phases,
  wateringSchema,
  validate,
  errors,
  hasFormErrors,
} = usePlantForm()

const images = ref<FileList | undefined>()

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
    toast('Pflanze erfolgreich gespeichert', 'success')
    await router.push('/plants')
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

async function savePlant(): Promise<Result<IDBValidKey, string>> {
  loading.value = true

  const r = await validate()
  if (!r.valid) {
    loading.value = false

    return err('Bitte fülle alle Pflichtfelder aus')
  }

  const newPlant: NewPlant = {
    strain: strain.value!,
    name: name.value,
    container: {
      container: container.value,
      medium: medium.value,
      volume: volume.value,
      notes: notes.value,
      datetime: containerDatetime.value,
    },
    phases: phases.value,
    [INDEX_WATERING_SCHEMA_ID]: wateringSchema.value?.id,
  }

  const saveResult = await plantRepo.save(newPlant)
  const plantResult = await andThen(
    combineOpts(toOpt(saveResult), wrapOption(images.value)),
    async ([plantId, images]) => combineOpts(
      toOpt(await plantRepo.getById(plantId)),
      some(images),
    ),
  )

  await andThen(
    plantResult,
    async ([plant, images]) => await plantRepo.uploadPlantImages(plant, images),
  )

  images.value = undefined
  loading.value = false
  if (saveResult.ok)
    await plantStore.syncPlants()

  return saveResult.ok ? saveResult : err('Pflanze konnte nicht gespeichert werden')
}
</script>
