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
          class="flex items-center"
        >
          <div class="flex-1 flex items-center justify-between">
            <select v-model="fertilizerData.fertilizer" class="select">
              <option
                v-for="(fertilizer, j) in sortedFertilizers"
                :key="j"
                :value="fertilizer"
                :disabled="isSelected(fertilizer)"
              >
                {{ fertilizer.manufacturer ?? fallbackManufacturer }} - {{ fertilizer.name }}
              </option>
            </select>

            <InputTextFloat
              v-model="fertilizerData.value"
              label="ML pro Liter"
              type="number"
            />
          </div>

          <IBtn
            square
            ghost
            size="sm"
            class="ml-3"
            @click="removeItem(fertilizerData)"
          >
            <IconRemove :size="20" />
          </IBtn>
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
import type { FertilizerData } from '../composables/useWateringSchemaForm.ts'
import type { Fertilizer, NewWateringSchema, NewWateringSchemaFertilizer } from '../modules/nutrients/types'
import {
  CirclePlus as IconAdd,
  MoveLeft as IconBack,
  CircleMinus as IconRemove,
  Save as IconSave,
} from 'lucide-vue-next'
import { computed, inject } from 'vue'
import { useToast } from '../composables/useToast.ts'
import { useWateringSchemaForm } from '../composables/useWateringSchemaForm.ts'
import { REPO_WATERING_SCHEMA } from '../di_keys.ts'
import { removeArrayElement } from '../util.ts'
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

const { fertilizers } = defineProps<Props>()
const emit = defineEmits<Emits>()

const wateringRepo = inject(REPO_WATERING_SCHEMA)
const { toast } = useToast()

const fallbackManufacturer = 'Unbekannter Hersteller'

const sortedFertilizers = computed(
  () => [...fertilizers].sort(
    (lhs: Fertilizer, rhs: Fertilizer) =>
      (lhs.manufacturer ?? fallbackManufacturer).localeCompare(rhs.manufacturer ?? fallbackManufacturer),
  ),
)

const {
  name,
  fertilizersData,
  errors,
  validate,
} = useWateringSchemaForm({
  fertilizersData: [],
})

const unselectedFertilizers = computed(
  (): Array<Fertilizer> => sortedFertilizers.value.filter(
    item => fertilizersData.value.every(dataset => dataset.fertilizer.id !== item.id),
  ),
)

function isSelected(fertilizer: Fertilizer): boolean {
  return fertilizersData.value.some(item => item.fertilizer.id === fertilizer.id)
}

function addFertilizer() {
  if (unselectedFertilizers.value.length === 0)
    return

  const dataset = {
    fertilizer: unselectedFertilizers.value[0]!,
    value: 5,
  }

  fertilizersData.value?.push(dataset)
}

function removeItem(item: FertilizerData) {
  removeArrayElement(fertilizersData.value, i => i.fertilizer.id === item.fertilizer.id)
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
  if (!wateringRepo)
    return false

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
