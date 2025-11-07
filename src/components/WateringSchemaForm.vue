<template>
  <form
    @submit.prevent="$emit('submit')"
  >
    <InputTextFloat
      v-model="name"
      :error="errorName"
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
          <ISelect
            v-model="fertilizerData.fertilizer"
            :options="sortedFertilizers"
          >
            <template #option="{ item: fertilizer, i: j }: { item: Fertilizer, i: number }">
              <option
                :key="j"
                :value="fertilizer"
                :disabled="isSelected(fertilizer)"
              >
                {{ fertilizer.manufacturer ?? fallbackManufacturer }} - {{ fertilizer.name }}
              </option>
            </template>
          </ISelect>

          <IInputNumber
            v-model="fertilizerData.amount"
            label="ML pro Liter"
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
        v-if="errorFertilizerData"
        class="text-xs text-error px-4 mt-1"
      >{{ errorFertilizerData }}</span>
    </div>
  </form>
</template>

<script lang="ts" setup>
import type { Fertilizer, NewWateringSchemaFertilizer } from '../modules/nutrients/types'
import {
  CirclePlus as IconAdd,
  CircleMinus as IconRemove,
} from 'lucide-vue-next'
import { computed } from 'vue'
import { removeArrayElement } from '../util.ts'
import IBtn from './IBtn.vue'
import InputTextFloat from './InputTextFloat.vue'
import ISelect from './ISelect.vue'
import IInputNumber from "./IInputNumber.vue";

interface Props {
  fertilizersData: Array<NewWateringSchemaFertilizer>
  errorName?: string
  errorFertilizerData?: string
  fertilizers: Array<Fertilizer>
}
interface Emits {
  'update:fertilizersData': [data: Array<NewWateringSchemaFertilizer>]
  'submit': []
}

const { fertilizers, fertilizersData } = defineProps<Props>()
const emit = defineEmits<Emits>()

const name = defineModel<string>('name')

const fallbackManufacturer = 'Unbekannter Hersteller'

const sortedFertilizers = computed(
  () => [...fertilizers].sort(
    (lhs: Fertilizer, rhs: Fertilizer) =>
      (lhs.manufacturer ?? fallbackManufacturer).localeCompare(rhs.manufacturer ?? fallbackManufacturer),
  ),
)

const unselectedFertilizers = computed(
  (): Array<Fertilizer> => sortedFertilizers.value.filter(
    item => fertilizersData.every(dataset => dataset.fertilizer.id !== item.id),
  ),
)

function isSelected(fertilizer: Fertilizer): boolean {
  return fertilizersData.some(item => item.fertilizer.id === fertilizer.id)
}

function addFertilizer() {
  if (unselectedFertilizers.value.length === 0)
    return

  const dataset: NewWateringSchemaFertilizer = {
    fertilizer: unselectedFertilizers.value[0]!,
    amount: 5,
  }

  const data = [...fertilizersData]
  data.push(dataset)

  emit('update:fertilizersData', data)
}

function removeItem(item: NewWateringSchemaFertilizer) {
  const data = [...fertilizersData]
  removeArrayElement(data, i => i.fertilizer.id === item.fertilizer.id)

  emit('update:fertilizersData', data)
}
</script>
