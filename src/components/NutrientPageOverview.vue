<template>
  <ICard class="w-full max-w-2xl">
    <ICardTitle class="text-2xl font-bold mb-5">
      Nutrients
    </ICardTitle>

    <div class="my-3">
      <div class="flex items-center justify-between mb-3 border-b border-b-base-200">
        <h2 class="text-lg font-semibold">
          Zuchtschema
        </h2>

        <IBtn ghost @click="$emit('addSchema')">
          <IconAdd />
          Neu
        </IBtn>
      </div>
    </div>

    <NutrientPageOverviewFertilizers
      :fertilizers="fertilizers"
      @sync="$emit('sync')"
      @add-fertilizer="$emit('addFertilizer')"
    />
  </ICard>
</template>

<script lang="ts" setup>
import type { Fertilizer, WateringSchema } from '../modules/nutrients/types'
import {
  CirclePlus as IconAdd,
} from 'lucide-vue-next'
import IBtn from './IBtn.vue'
import ICard from './ICard.vue'
import ICardTitle from './ICardTitle.vue'
import NutrientPageOverviewFertilizers from './NutrientPageOverviewFertilizers.vue'

interface Props {
  wateringSchemas: Array<WateringSchema>
  fertilizers: Array<Fertilizer>
}
interface Emits {
  sync: []
  addFertilizer: []
  addSchema: []
}

const { fertilizers } = defineProps<Props>()
const emit = defineEmits<Emits>()
</script>
