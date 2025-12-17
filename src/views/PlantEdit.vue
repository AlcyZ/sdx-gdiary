<template>
  <div class="mt-4">
    <motion.div
      class="bg-white shadow rounded-box px-5 py-7 w-full h-fit mt-4"
      :variants="scale075"
      initial="from"
      animate="to"
    >
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold">
          {{ plantName }} bearbeiten
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
        is-edit
      />

      <div class="flex">
        <IBtn
          variant="primary"
          class="w-full text-base-100"
          :disabled="loading || hasFormErrors"
          @click="updatePlant"
        >
          <IconSave />
          Speichern
        </IBtn>
      </div>
    </motion.div>

    <IFab
      :actions="fabActions"
      class="mb-14"
      :icon="IconMenu"
    />
  </div>
</template>

<script lang="ts" setup>
import type PlantRepository from '../modules/plants/plant_repository.ts'
import type { EditPlant } from '../modules/plants/types'
import dayjs from 'dayjs'
import {
  Cog as IconMenu,
  Save as IconSave,
} from 'lucide-vue-next'
import { motion } from 'motion-v'
import { computed, inject, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import PlantForm from '../components/PlantForm.vue'
import IBtn from '../components/ui/IBtn.vue'
import IFab from '../components/ui/IFab.vue'
import { useContentAnimation } from '../composables/useContentAnimation.ts'
import { usePageLayout } from '../composables/usePageLayout.ts'
import { usePlantForm } from '../composables/usePlantForm.ts'
import { usePlantView } from '../composables/usePlantView.ts'
import { useToast } from '../composables/useToast.ts'
import { REPO_PLANT } from '../di_keys.ts'
import { INDEX_WATERING_SCHEMA_ID } from '../modules/db'
import { usePlantStore } from '../stores/plantStore.ts'
import { andThen, combineOpts, some, toOpt, wrapOption } from '../util.ts'

interface Props {
}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

usePageLayout({
  topNavigation: true,
})

const plantRepo = inject(REPO_PLANT) as PlantRepository

const plantStore = usePlantStore()

const router = useRouter()
const { toast } = useToast()
const { fabActions } = usePlantView()
const { scale075 } = useContentAnimation()

const loading = ref(false)
const images = ref<FileList | undefined>()

const plantName = computed(
  () => plantStore.plant === null
    ? ''
    : plantStore.plant.name !== undefined && plantStore.plant.name !== ''
      ? `${plantStore.plant.name} (${plantStore.plant.strain})`
      : plantStore.plant.strain,
)

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
  resetForm,
} = usePlantForm()

const hasFormErrors = computed(() => Object.keys(errors.value).length > 0)

async function updatePlant() {
  if (!plantStore.plant)
    return

  const validationResult = await validate()
  if (!validationResult.valid) {
    toast('Bitte fülle alle Pflichtfelder aus', 'error')
    return
  }

  const data: EditPlant = {
    id: plantStore.plant.id,
    strain: strain.value!,
    name: name.value,
    phases: phases.value,
    container: {
      id: plantStore.plant.container.id,
      medium: medium.value,
      container: container.value,
      volume: volume.value,
      notes: notes.value,
      datetime: containerDatetime.value,
    },
  }

  if (wateringSchema.value) {
    data[INDEX_WATERING_SCHEMA_ID] = wateringSchema.value.id
  }

  const result = await plantRepo.update(data)
  const plantResult = andThen(
    combineOpts(toOpt(result), wrapOption(plantStore.plant)),
    ([_, plant]) => combineOpts(wrapOption(images.value), some(plant)),
  )
  await andThen(
    plantResult,
    async ([images, plant]) => await plantRepo.uploadPlantImages(plant, images),
  )

  if (!result.ok) {
    toast('Es ist ein Fehler beim aktualisieren der Pflanze aufgetreten', 'error')
    return
  }

  toast('Pflanze erfolgreich aktualisiert', 'success')
  await Promise.all([
    router.push('/plants'),
    plantStore.syncData(),
  ])
}

onMounted(async () => {
  await plantStore.syncPlantWithRoute()

  if (!plantStore.plant)
    return

  resetForm({
    values: {
      strain: plantStore.plant.strain,
      name: plantStore.plant.name,
      container: {
        container: plantStore.plant.container.container,
        medium: plantStore.plant.container.medium,
        volume: plantStore.plant.container.volume,
        notes: plantStore.plant.container.notes,
        datetime: dayjs(new Date(plantStore.plant.container.timestamp)).format('YYYY-MM-DDTHH:mm'),
      },
      phases: plantStore.plant.phases,
    },
  })
  wateringSchema.value = plantStore.plant.wateringSchema
})
</script>
