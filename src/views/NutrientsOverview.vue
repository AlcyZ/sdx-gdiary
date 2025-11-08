<template>
  <div class="flex-1 flex items-center justify-center">
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
    <IFab
      :icon="IconMenu"
      class="mb-14"
      :actions="fabActions"
    />
  </div>
</template>

<script lang="ts" setup>
import type { Fertilizer, WateringSchema } from '../modules/nutrients/types'
import {
  Cog as IconMenu,
} from 'lucide-vue-next'
import { inject, onMounted, ref } from 'vue'
import ICard from '../components/ICard.vue'
import ICardTitle from '../components/ICardTitle.vue'
import IFab from '../components/IFab.vue'
import NutrientPageOverviewFertilizers from '../componentsBackup/NutrientPageOverviewFertilizers.vue'
import NutrientPageOverviewWateringSchemas from '../componentsBackup/NutrientPageOverviewWateringSchemas.vue'
import { useNutrientsView } from '../composables/useNutrientsView.ts'
import { REPO_FERTILIZERS, REPO_WATERING_SCHEMA } from '../di_keys.ts'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

const wateringRepo = inject(REPO_WATERING_SCHEMA)
const fertilizerRepo = inject(REPO_FERTILIZERS)

const { fabActions } = useNutrientsView()

const wateringSchemas = ref<Array<WateringSchema>>([])
const fertilizers = ref<Array<Fertilizer>>([])

async function syncData() {
  fertilizers.value = await fertilizerRepo?.getAll() || []
  wateringSchemas.value = await wateringRepo?.getAll() || []
}

onMounted(syncData)
</script>
