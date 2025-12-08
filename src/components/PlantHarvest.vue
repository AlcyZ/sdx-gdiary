<template>
  <ICard
    class="w-full max-w-2xl"
    class-actions="justify-between"
  >
    <div class="flex items-center justify-between">
      <ICardTitle class="text-3xl">
        Ernte Session
      </ICardTitle>

      <IInputDatetime
        v-model="date"
      />
    </div>

    <HarvestForm
      v-model:date="date"
      v-model:weight="weight"
      v-model:container="container"
      v-model:info="info"
      v-model:state="state"
      :error-date="errors.date"
      :error-weight="errors.weight"
      :error-container="errors.container"
      :error-info="errors.info"
      :error-state="errors.state"
      class="my-4"
    />

    <template #actions>
      <IBtn
        variant="neutral"
        class="w-full"
        :disabled="loading || hasFormErrors"
        :loading="loading"
        loading-type="ring"
        @click="save"
      >
        <IconSave />
        Speichern
      </IBtn>
    </template>
  </ICard>
</template>

<script lang="ts" setup>
import type HarvestRepository from '../modules/harvest/harvest_repository.ts'
import type { NewHarvestSession } from '../modules/harvest/types'
import type { Plant } from '../modules/plants/types'
import {
  Save as IconSave,
} from 'lucide-vue-next'
import { inject, ref } from 'vue'
import { useHarvestSessionForm } from '../composables/useHarvestSessionForm.ts'
import { useToast } from '../composables/useToast.ts'
import { REPO_HARVEST } from '../di_keys.ts'
import HarvestForm from './HarvestForm.vue'
import IBtn from './ui/IBtn.vue'
import ICard from './ui/ICard.vue'
import ICardTitle from './ui/ICardTitle.vue'
import IInputDatetime from './ui/IInputDatetime.vue'

interface Props {
  plant: Plant
}
interface Emits {
  saved: []
}

const { plant } = defineProps<Props>()
const emit = defineEmits<Emits>()

const harvestRepo = inject(REPO_HARVEST) as HarvestRepository

const {
  date,
  weight,
  container,
  info,
  state,
  errors,
  hasFormErrors,
  validate,
} = useHarvestSessionForm()

const { toast } = useToast()

const loading = ref(false)

async function save() {
  const validationResult = await validate()
  if (!validationResult.valid) {
    toast('Bitte fülle alle Pflichtfelder aus!', 'error')
    return
  }

  const harvest: NewHarvestSession = {
    type: 'session',
    date: date.value,
    weight: weight.value,
    container: container.value,
    info: info.value,
    state: state.value,
    plantId: plant.id,
  }
  const result = await harvestRepo.save(harvest)

  if (!result.ok) {
    toast('Es ist ein Fehler beim speichern der Ernte aufgetreten', 'error')
    console.error('[PlantHarvestSession.save]:', result.error)
    return
  }

  toast('Ernte gespeichert!', 'success')
  emit('saved')
}
</script>
