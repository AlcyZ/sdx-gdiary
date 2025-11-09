<template>
  <div class="flex-1 flex items-center justify-center">
    <ICard class="w-full max-w-2xl">
      <ICardTitle class="text-2xl font-bold mb-5">
        Nutrients
      </ICardTitle>

      <NutrientsOverviewWateringSchemas
        :watering-schemas="wateringSchemas"
        :fertilizers="fertilizers"
        class="my-3"
        @sync="syncData"
      />

      <NutrientsOverviewFertilizers
        :fertilizers="fertilizers"
        class="my-3"
        @sync="syncData"
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
import NutrientsOverviewFertilizers from '../components/NutrientsOverviewFertilizers.vue'
import NutrientsOverviewWateringSchemas from '../components/NutrientsOverviewWateringSchemas.vue'
import ICard from '../components/ui/ICard.vue'
import ICardTitle from '../components/ui/ICardTitle.vue'
import IFab from '../components/ui/IFab.vue'
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
