<template>
  <ICard class="w-full max-w-2xl">
    <ICardTitle class="text-2xl font-bold mb-5">
      Nutrients
    </ICardTitle>

    <NutrientPageOverviewWateringSchemas
      :watering-schemas="wateringSchemas"
      :fertilizers="fertilizers"
      class="my-3"
      @sync="$emit('sync')"
      @add-schema="$emit('addSchema')"
      @edit-schema="$emit('editSchema', $event)"
    />

    <NutrientPageOverviewFertilizers
      :fertilizers="fertilizers"
      class="my-3"
      @sync="$emit('sync')"
      @add-fertilizer="$emit('addFertilizer')"
    />
  </ICard>
</template>

<script lang="ts" setup>
import type { Fertilizer, WateringSchema } from '../modules/nutrients/types'
import ICard from '../components/ui/ICard.vue'
import ICardTitle from '../components/ui/ICardTitle.vue'
import NutrientPageOverviewFertilizers from './NutrientPageOverviewFertilizers.vue'
import NutrientPageOverviewWateringSchemas from './NutrientPageOverviewWateringSchemas.vue'

interface Props {
  wateringSchemas: Array<WateringSchema>
  fertilizers: Array<Fertilizer>
}
interface Emits {
  sync: []
  addFertilizer: []
  addSchema: []
  editSchema: [wateringSchema: WateringSchema]
}

const { fertilizers } = defineProps<Props>()
defineEmits<Emits>()
</script>
