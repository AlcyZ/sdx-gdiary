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

    <HarvestSessionForm
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
import type { Plant } from '../modules/plants/types'
import {
  Save as IconSave,
} from 'lucide-vue-next'
import { ref } from 'vue'
import { useHarvestSessionForm } from '../composables/useHarvestSessionForm.ts'
import HarvestSessionForm from './HarvestSessionForm.vue'
import IBtn from './ui/IBtn.vue'
import ICard from './ui/ICard.vue'
import ICardTitle from './ui/ICardTitle.vue'
import IInputDatetime from './ui/IInputDatetime.vue'

interface Props {
  plant: Plant
}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

const {
  date,
  weight,
  container,
  info,
  state,
  errors,
  hasFormErrors,
  validate,
  resetForm,
} = useHarvestSessionForm()

const loading = ref(false)

async function save() {
  const validationResult = await validate()
  console.info('todo: save', validationResult)

  loading.value = true
  setTimeout(() => loading.value = false, 2500)
}
</script>
