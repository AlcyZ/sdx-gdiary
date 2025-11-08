<template>
  <ICard
    class="w-full max-w-2xl"
    class-actions="justify-between"
  >
    <ICardTitle class="text-3xl">
      Düngerschema bearbeiten
    </ICardTitle>

    <WateringSchemaForm
      v-model:name="name"
      v-model:fertilizers-data="fertilizersData"
      :error-name="errors.name"
      :error-fertilizer-data="errors.fertilizersData"
      :fertilizers="fertilizers"
      class="my-5"
      @submit="updateSchema"
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
        @click="updateSchema"
      >
        <IconSave />
        Aktualisieren
      </IBtn>
    </template>
  </ICard>
</template>

<script lang="ts" setup>
import type {
  EditedWateringSchema,
  Fertilizer,
  NewWateringSchemaFertilizer,
  WateringSchema,
  WateringSchemaFertilizer,
} from '../modules/nutrients/types'
import {
  MoveLeft as IconBack,
  Save as IconSave,
} from 'lucide-vue-next'
import { inject } from 'vue'
import { useToast } from '../composables/useToast.ts'
import { useWateringSchemaForm } from '../composables/useWateringSchemaForm.ts'
import { REPO_WATERING_SCHEMA } from '../di_keys.ts'
import { err } from '../util.ts'
import IBtn from '../components/IBtn.vue'
import ICard from '../components/ICard.vue'
import ICardTitle from '../components/ICardTitle.vue'
import WateringSchemaForm from './WateringSchemaForm.vue'

interface Props {
  wateringSchema: WateringSchema
  fertilizers: Array<Fertilizer>
}
interface Emits {
  back: []
  backAndSync: []
}

const { wateringSchema } = defineProps<Props>()
const emit = defineEmits<Emits>()

const wateringRepo = inject(REPO_WATERING_SCHEMA)

const { toast } = useToast()

const {
  name,
  fertilizersData,
  errors,
  validate,
} = useWateringSchemaForm({
  name: wateringSchema.name,
  fertilizersData: wateringSchema.fertilizers.map((fertilizer: WateringSchemaFertilizer): NewWateringSchemaFertilizer => ({
    amount: fertilizer.amount,
    fertilizer: fertilizer.fertilizer,
  })),
})

async function updateSchema() {
  const validationResult = await validate()
  if (!validationResult.valid) {
    toast('Bitte fülle alle Pflichtfelder aus', 'error')
    return
  }

  const data: EditedWateringSchema = {
    id: wateringSchema.id,
    name: name.value!,
    fertilizers: fertilizersData.value,
  }

  const result = await wateringRepo?.updateSchema(data) || err(undefined)
  if (!result.ok) {
    toast('Es ist ein Fehler beim aktualisieren des Bewässerungsschemas aufgetreten', 'error')
    return
  }

  toast('Bewässerungsschema erfolgreich aktualisiert', 'success')
  emit('backAndSync')
}
</script>
