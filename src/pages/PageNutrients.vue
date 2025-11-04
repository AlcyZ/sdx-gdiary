<template>
  <div class="py-6 flex justify-center items-center w-full">
    <IFab
      :icon="IconMenu"
      class="mb-14"
      :actions="fabActions"
    />

    <NutrientPageOverview
      v-if="page === 'list'"
      :watering-schemas="wateringSchemas"
      :fertilizers="fertilizers"
      @sync="syncData"
      @add-fertilizer="changePage('add-fertilizer')"
      @add-schema="changePage('add-schema')"
      @back="back"
    />
    <NutrientPageAddFertilizer
      v-else-if="page === 'add-fertilizer'"
      @back="back"
      @sync="syncData"
    />
    <NutrientPageAddSchema
      v-else-if="page === 'add-schema'"
      :fertilizers="fertilizers"
      @back="back"
      @back-and-sync="backAndSync"
    />
    <NutrientPageAdd
      v-else-if="page === 'add'"
      @back="back"
    />
  </div>
</template>

<script lang="ts" setup>
import type { Fertilizer, WateringSchema } from '../modules/nutrients/types'
import type { FabAction } from '../types'
import {
  Beaker as IconFertilizer,
  Apple as IconList,
  Cog as IconMenu,
  CirclePlus as IconNew,
} from 'lucide-vue-next'
import { inject, onMounted, ref } from 'vue'
import IFab from '../components/IFab.vue'
import NutrientPageAdd from '../components/NutrientPageAdd.vue'
import NutrientPageAddFertilizer from '../components/NutrientPageAddFertilizer.vue'
import NutrientPageAddSchema from '../components/NutrientPageAddSchema.vue'
import NutrientPageOverview from '../components/NutrientPageOverview.vue'
import { usePage } from '../composables/usePage.ts'
import { REPO_FERTILIZERS, REPO_WATERING_SCHEMA } from '../di_keys.ts'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

type NutrientPage = 'list' | 'add' | 'add-fertilizer' | 'add-schema'
const { page, changePage } = usePage<NutrientPage>('list')

const wateringRepo = inject(REPO_WATERING_SCHEMA)
const fertilizerRepo = inject(REPO_FERTILIZERS)

const wateringSchemas = ref<Array<WateringSchema>>([])
const fertilizers = ref<Array<Fertilizer>>([])

function back() {
  changePage('list')
}
async function backAndSync() {
  changePage('list')
  await syncData()
}

async function syncData() {
  fertilizers.value = await fertilizerRepo?.getAll() || []
  wateringSchemas.value = await wateringRepo?.getAll() || []
}

const fabActions = ref<Array<FabAction>>([
  {
    icon: IconNew,
    onClick: () => changePage('add'),
  },
  {
    icon: IconList,
    onClick: () => changePage('list'),
  },
  {
    icon: IconFertilizer,
    onClick: () => changePage('add-fertilizer'),
  },
])

onMounted(syncData)
</script>
