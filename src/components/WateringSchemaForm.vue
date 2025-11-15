<template>
  <form
    @submit.prevent="$emit('submit')"
  >
    <IInputText
      v-model="name"
      :error="errorName"
      label="Name des Zuchtschemas"
      required
      :icon="IconName"
      full-width
    />

    <div class="divider" />

    <div class="flex items-center justify-between mb-2">
      <h3 class="text-xl font-semibold">
        Enthaltene Dünger
      </h3>
    </div>

    <div
      class="grid grid-cols-[3fr_minmax(100px,_2fr)_auto] gap-x-2 gap-y-3"
    >
      <div
        v-for="(fertilizerData, i) in fertilizersData"
        :key="i"
        class="contents"
      >
        <div class="flex items-center">
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
        </div>

        <div class="flex items-center">
          <label class="input">
            <input v-model.number="fertilizerData.amount" type="text" placeholder="5">
            <span class="label">ml/L</span>
          </label>
        </div>

        <div class="flex items-center">
          <IBtn
            square
            ghost
            size="lg"
            variant="error"
            @click="removeItem(fertilizerData)"
          >
            <IconDelete :size="20" />
          </IBtn>
        </div>
      </div>

      <div class="col-span-3">
        <IBtn
          class="w-full flex justify-start border-dashed border-base-300"
          ghost
          @click="addFertilizer"
        >
          <IconAdd />
          Dünger hinzufügen
        </IBtn>
      </div>
    </div>

    <!--    <div class="space-y-3"> -->
    <!--      <div -->
    <!--        v-for="(fertilizerData, i) in fertilizersData" -->
    <!--        :key="i" -->
    <!--        class="flex items-center" -->
    <!--      > -->
    <!--        <div class="flex-1 flex items-center justify-between"> -->
    <!--          <ISelect -->
    <!--            v-model="fertilizerData.fertilizer" -->
    <!--            :options="sortedFertilizers" -->
    <!--          > -->
    <!--            <template #option="{ item: fertilizer, i: j }: { item: Fertilizer, i: number }"> -->
    <!--              <option -->
    <!--                :key="j" -->
    <!--                :value="fertilizer" -->
    <!--                :disabled="isSelected(fertilizer)" -->
    <!--              > -->
    <!--                {{ fertilizer.manufacturer ?? fallbackManufacturer }} - {{ fertilizer.name }} -->
    <!--              </option> -->
    <!--            </template> -->
    <!--          </ISelect> -->

    <!--          <IInputNumber -->
    <!--            v-model="fertilizerData.amount" -->
    <!--            label="ML pro Liter" -->
    <!--          /> -->
    <!--        </div> -->

    <!--        <IBtn -->
    <!--          square -->
    <!--          ghost -->
    <!--          size="sm" -->
    <!--          class="ml-3" -->
    <!--          @click="removeItem(fertilizerData)" -->
    <!--        > -->
    <!--          <IconRemove :size="20" /> -->
    <!--        </IBtn> -->
    <!--      </div> -->
    <!--      <span -->
    <!--        v-if="errorFertilizerData" -->
    <!--        class="text-xs text-error px-4 mt-1" -->
    <!--      >{{ errorFertilizerData }}</span> -->
    <!--    </div> -->
  </form>
</template>

<script lang="ts" setup>
import type { Fertilizer, NewWateringSchemaFertilizer } from '../modules/nutrients/types'
import {
  PlusCircle as IconAdd,
  Trash as IconDelete,
  Feather as IconName,
} from 'lucide-vue-next'
import { computed } from 'vue'
import { useFertilizerStore } from '../stores/fertilizerStore.ts'
import { removeArrayElement } from '../util.ts'
import IBtn from './ui/IBtn.vue'
import IInputText from './ui/IInputText.vue'
import ISelect from './ui/ISelect.vue'

interface Props {
  fertilizersData: Array<NewWateringSchemaFertilizer>
  errorName?: string
  errorFertilizerData?: string
}
interface Emits {
  'update:fertilizersData': [data: Array<NewWateringSchemaFertilizer>]
  'submit': []
}

const { fertilizersData } = defineProps<Props>()
const emit = defineEmits<Emits>()

const name = defineModel<string>('name')

const fertilizerStore = useFertilizerStore()

const fallbackManufacturer = 'Unbekannter Hersteller'

const sortedFertilizers = computed(
  () => [...fertilizerStore.fertilizers].sort(
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
