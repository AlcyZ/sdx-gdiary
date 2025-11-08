<template>
  <IModal
    close-on-click-outside
    class="modal-bottom sm:modal-middle"
    modal-box-class="w-full max-w-3xl"
  >
    <h2 class="text-2xl font-semibold mb-5">
      Dünger hinzufügen
    </h2>

    <div class="max-h-[60vh] overflow-y-auto">
      <!-- watering schema fertilizers -->
      <PlantPageShowAddPouringModalAddFertilizerList
        :items="selectableSchemaFertilizers"
        @clicked="$emit('addSchemaFertilizer', $event)"
      >
        <template #title>
          <IconRestore :size="18" class="mr-1" />
          Aus Schema wiederherstellen
        </template>

        <template #item="{ item: fertilizer }: { item: WateringSchemaFertilizer }">
          <span class="font-semibold opacity-80">{{ fertilizer.fertilizer.name }}</span>
          <div class="text-xs opacity-60 text-primary">
            War Teil des Bewässerungsschemas
          </div>
        </template>
      </PlantPageShowAddPouringModalAddFertilizerList>

      <hr class="my-4 text-base-300">

      <!-- other fertilizers -->
      <PlantPageShowAddPouringModalAddFertilizerList
        :items="selectableFertilizers"
        @clicked="$emit('addFertilizer', $event)"
      >
        <template #title>
          <IconFertilizer :size="18" class="mr-1" />
          Weitere Dünger
        </template>

        <template #item="{ item: fertilizer }: { item: Fertilizer }">
          <span>{{ fertilizer.name }}</span>
        </template>
      </PlantPageShowAddPouringModalAddFertilizerList>
    </div>

    <template #action>
      <IBtn
        class="w-full"
        @click="$emit('close')"
      >
        <IconClose />
        Schließen
      </IBtn>
    </template>
  </IModal>
</template>

<script lang="ts" setup>
import type { FormFertilizerData } from '../composables/usePouringForm.ts'
import type { Fertilizer, WateringSchema, WateringSchemaFertilizer } from '../modules/nutrients/types'
import {
  X as IconClose,
  Droplet as IconFertilizer,
  RotateCcw as IconRestore,
} from 'lucide-vue-next'
import { computed } from 'vue'
import IBtn from './IBtn.vue'
import IModal from './IModal.vue'
import PlantPageShowAddPouringModalAddFertilizerList from './PlantPageShowAddPouringModalAddFertilizerList.vue'

interface Props {
  wateringSchema?: WateringSchema
  data: Array<FormFertilizerData>
  fertilizers: Array<Fertilizer>
}
interface Emits {
  close: []
  addFertilizer: [fertilizer: Fertilizer]
  addSchemaFertilizer: [fertilizer: WateringSchemaFertilizer]
}

const { wateringSchema, data, fertilizers } = defineProps<Props>()
defineEmits<Emits>()

const selectableSchemaFertilizers = computed(
  (): Array<WateringSchemaFertilizer> => wateringSchema === undefined
    ? []
    : wateringSchema.fertilizers.filter(item => data.every(
        dataset => dataset.fertilizer.id !== item.fertilizer.id,
      )),
)

const selectableFertilizers = computed(
  (): Array<Fertilizer> => fertilizers.filter(
    item => selectableSchemaFertilizers.value.every(dataset => dataset.fertilizer.id !== item.id)
      && data.every(dataset => dataset.fertilizer.id !== item.id),
  ),
)
</script>
