<template>
  <ICard
    class="w-full max-w-2xl"
    class-actions="justify-between"
  >
    <ICardTitle class="text-3xl">
      Düngerschema hinzufügen
    </ICardTitle>

    <WateringSchemaForm
      v-model:name="name"
      v-model:fertilizers-data="fertilizersData"
      :error-name="errors.name"
      :error-fertilizer-data="errors.fertilizersData"
      class="my-5"
      :fertilizers="fertilizers"
      @submit="saveAndNew"
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
          variant="primary"
          class="join-item text-base-100"
          @click="save"
        >
          <IconSave />
          Speichern
        </IBtn>
        <IBtn
          variant="neutral"
          class="join-item"
          @click="saveAndNew"
        >
          <IconAdd />
          Speichern & Neu
        </IBtn>
      </div>
    </template>
  </ICard>
</template>

<script lang="ts" setup>
import type { Fertilizer, NewWateringSchema } from '../modules/nutrients/types'
import {
  CirclePlus as IconAdd,
  MoveLeft as IconBack,
  Save as IconSave,
} from 'lucide-vue-next'
import { inject } from 'vue'
import { useToast } from '../composables/useToast.ts'
import { useWateringSchemaForm } from '../composables/useWateringSchemaForm.ts'
import { REPO_WATERING_SCHEMA } from '../di_keys.ts'
import IBtn from './IBtn.vue'
import ICard from './ICard.vue'
import ICardTitle from './ICardTitle.vue'
import WateringSchemaForm from './WateringSchemaForm.vue'

interface Props {
  fertilizers: Array<Fertilizer>
}
interface Emits {
  back: []
  backAndSync: []
}

const { fertilizers } = defineProps<Props>()
const emit = defineEmits<Emits>()

const wateringRepo = inject(REPO_WATERING_SCHEMA)
const { toast } = useToast()

const {
  name,
  fertilizersData,
  errors,
  validate,
} = useWateringSchemaForm({
  fertilizersData: [],
})

async function save() {
  if (!(await saveSchema()))
    return

  toast('Zuchtschema erfolgreich gespeichert', 'success', 1500, () => emit('backAndSync'))
}

async function saveAndNew() {
  if (!(await saveSchema()))
    return

  toast('Zuchtschema erfolgreich gespeichert', 'success')
  name.value = ''
}

async function saveSchema(): Promise<boolean> {
  if (!wateringRepo)
    return false

  if (!(await validateForm()))
    return false

  const schema: NewWateringSchema = {
    name: name.value!,
    fertilizers: fertilizersData.value,
  }

  const result = await wateringRepo.save(schema)

  if (!result.ok)
    toast('Zuchtschema konnte nicht gespeichert werden', 'error')

  return result.ok
}

async function validateForm(): Promise<boolean> {
  const result = await validate()

  if (!result.valid)
    toast('Bitte fülle alle Pflichtfelder aus und weise mindestens einen Dünger zu', 'error')

  return result.valid
}
</script>
