<template>
  <IModal
    close-on-click-outside
  >
    <h2 class="text-xl font-semibold">
      Zuchtschema Dünger bearbeiten
    </h2>

    <div class="flex-1 flex items-center justify-between">
      <select v-model="fertilizer" class="select">
        <option
          v-for="(item, j) in sortedFertilizers"
          :key="j"
          :value="item"
          :disabled="isSelected(item)"
        >
          {{ item.manufacturer ?? fallbackManufacturer }} - {{ item.name }}
        </option>
      </select>

      <IInputNumber
        v-model="amount"
        label="ML pro Liter"
        type="number"
      />
    </div>

    <template #action>
      <IBtn
        @click="$emit('close')"
      >
        <IconClose />
        Schließen
      </IBtn>

      <IBtn
        variant="primary"
        class="ml-1 text-base-100"
        @click="update"
      >
        <IconSave />
        Aktualisieren
      </IBtn>
    </template>
  </IModal>
</template>

<script lang="ts" setup>
import type {
  Fertilizer,
  NewWateringSchemaFertilizer,
  WateringSchema,
  WateringSchemaFertilizer,
} from '../modules/nutrients/types'
import {
  X as IconClose,
  Save as IconSave,
} from 'lucide-vue-next'
import { computed, ref } from 'vue'
import IBtn from './ui/IBtn.vue'
import IInputNumber from './ui/IInputNumber.vue'
import IModal from './ui/IModal.vue'

interface Props {
  wateringSchema: WateringSchema
  fertilizer: WateringSchemaFertilizer
  fertilizers: Array<Fertilizer>
}
interface Emits {
  close: []
  edit: [schema: NewWateringSchemaFertilizer]
}

const { wateringSchema, fertilizer: schemaFertilizer, fertilizers } = defineProps<Props>()
const emit = defineEmits<Emits>()

const fertilizer = ref<Fertilizer>(schemaFertilizer.fertilizer)
const amount = ref(schemaFertilizer.amount)

const fallbackManufacturer = 'Unbekannter Hersteller'
const sortedFertilizers = computed(
  () => [...fertilizers].sort(
    (lhs: Fertilizer, rhs: Fertilizer) =>
      (lhs.manufacturer ?? fallbackManufacturer).localeCompare(rhs.manufacturer ?? fallbackManufacturer),
  ),
)

function isSelected(check: Fertilizer): boolean {
  return check.id !== schemaFertilizer.fertilizer.id
    && wateringSchema.fertilizers.some(item => item.fertilizer.id === check.id)
}

async function update() {
  const data: NewWateringSchemaFertilizer = {
    fertilizer: fertilizer.value,
    amount: amount.value,
  }
  emit('edit', data)
}
</script>
