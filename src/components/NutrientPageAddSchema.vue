<template>
  <ICard
    class="w-full max-w-2xl"
    class-actions="justify-between"
  >
    <ICardTitle class="text-3xl">
      Düngerschema hinzufügen
    </ICardTitle>

    <form
      class="my-5"
      @submit.prevent="saveAndNew"
    >
      <InputTextFloat
        v-model="name"
        :error="errors.name"
        label="Name des Zuchtschemas"
        required
      />

      <hr class="my-3 text-base-200">

      <div class="flex items-center justify-between mb-2">
        <h3 class="text-xl font-semibold">
          Enthaltene Dünger
        </h3>

        <IBtn variant="primary" circle class="text-base-100" @click="addFertilizer">
          <IconAdd />
        </IBtn>
      </div>

      <div class="space-y-3">
        <div
          v-for="(fertilizerData, i) in fertilizersData"
          :key="i"
          class="flex items-center justify-between"
        >
          <select class="select">
            <option
              v-for="(fertilizer, j) in fertilizers"
              :key="j"
              :selected="fertilizer === fertilizerData.fertilizer"
            >
              {{ fertilizer.name }} - {{ fertilizer.manufacturer ?? 'Unknown' }}
            </option>
          </select>

          <InputTextFloat
            v-model="fertilizerData.value"
            label="ML pro Liter"
            type="number"
          />
        </div>
        <span
          v-if="errors.fertilizersData"
          class="text-xs text-error px-4 mt-1"
        >{{ errors.fertilizersData }}</span>
      </div>
    </form>

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
import type { Fertilizer, NewWateringSchema, NewWateringSchemaFertilizer } from '../modules/nutrients/types'
import { toTypedSchema } from '@vee-validate/yup'
import {
  CirclePlus as IconAdd,
  MoveLeft as IconBack,
  Save as IconSave,
} from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { array, object, string } from 'yup'
import { useToast } from '../composables/useToast.ts'
import WateringSchemaRepository from '../modules/nutrients/watering_schema_repository.ts'
import IBtn from './IBtn.vue'
import ICard from './ICard.vue'
import ICardTitle from './ICardTitle.vue'
import InputTextFloat from './InputTextFloat.vue'

interface Props {
  fertilizers: Array<Fertilizer>
}
interface Emits {
  back: []
  backAndSync: []
}

interface FertilizerData {
  fertilizer: Fertilizer
  value: number
}

const { fertilizers } = defineProps<Props>()
const emit = defineEmits<Emits>()

const { toast } = useToast()

const ERR_MSG_REQUIRED = 'Es muss ein Name für das Zuchtschema angegeben werden'
const ERR_DATA_REQUIRED = 'Es muss mindestens ein Dünger dem Schema zugewiesen werden'

const validationSchema = toTypedSchema(object({
  name: string().required(ERR_MSG_REQUIRED),
  fertilizersData: array().required(ERR_DATA_REQUIRED).min(1, ERR_DATA_REQUIRED),
}))
const { errors, defineField, validate } = useForm({
  validationSchema,
  initialValues: {
    fertilizersData: [],
  },
})

const [name] = defineField('name')
const [fertilizersData] = defineField<'fertilizersData', Array<FertilizerData>>('fertilizersData')

function addFertilizer() {
  if (fertilizers.length === 0)
    return

  const dataset = {
    fertilizer: fertilizers[0]!,
    value: 5,
  }

  fertilizersData.value?.push(dataset)
}

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
  if (!(await validateForm()))
    return false

  const fertilizerItems: Array<NewWateringSchemaFertilizer>
    = fertilizersData.value.map((data: FertilizerData): NewWateringSchemaFertilizer => ({
      fertilizer: data.fertilizer,
      amount: data.value,
    }))
  const schema: NewWateringSchema = {
    name: name.value!,
    fertilizers: fertilizerItems,
  }

  const repo = await WateringSchemaRepository.create()
  const result = await repo.save(schema)

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
