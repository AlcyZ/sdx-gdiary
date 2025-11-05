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
      @edit-schema="editSchema"
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
    <template v-if="page === 'edit-schema'">
      <NutrientPageEditSchema
        v-if="selectedSchema"
        :watering-schema="selectedSchema"
        @back="back"
      />

      <ISelectionError
        v-else
        text="Aufgrund eines Fehlers kann das Schema nicht bearbeitet werden"
        @back="back"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
import type { Fertilizer, WateringSchema } from '../modules/nutrients/types'
import type { FabAction } from '../types'
import {
  Beaker as IconFertilizer,
  List as IconList,
  Cog as IconMenu,
  Droplet as IconWateringSchema,
} from 'lucide-vue-next'
import { inject, onMounted, ref } from 'vue'
import IFab from '../components/IFab.vue'
import ISelectionError from '../components/ISelectionError.vue'
import NutrientPageAddFertilizer from '../components/NutrientPageAddFertilizer.vue'
import NutrientPageAddSchema from '../components/NutrientPageAddSchema.vue'
import NutrientPageEditSchema from '../components/NutrientPageEditSchema.vue'
import NutrientPageOverview from '../components/NutrientPageOverview.vue'
import { usePage } from '../composables/usePage.ts'
import { REPO_FERTILIZERS, REPO_WATERING_SCHEMA } from '../di_keys.ts'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

type NutrientPage = 'list' | 'add-fertilizer' | 'add-schema' | 'edit-schema'
const { page, changePage } = usePage<NutrientPage>('list')

const wateringRepo = inject(REPO_WATERING_SCHEMA)
const fertilizerRepo = inject(REPO_FERTILIZERS)

const wateringSchemas = ref<Array<WateringSchema>>([])
const fertilizers = ref<Array<Fertilizer>>([])
const selectedSchema = ref<WateringSchema | null>(null)

function back() {
  changePage('list')
  selectedSchema.value = null
}
async function backAndSync() {
  back()
  await syncData()
}

async function syncData() {
  fertilizers.value = await fertilizerRepo?.getAll() || []
  wateringSchemas.value = await wateringRepo?.getAll() || []
}

function editSchema(wateringSchema: WateringSchema) {
  selectedSchema.value = wateringSchema
  changePage('edit-schema')
}

const fabActions = ref<Array<FabAction>>([
  {
    icon: IconWateringSchema,
    onClick: () => changePage('add-schema'),
  },
  {
    icon: IconFertilizer,
    onClick: () => changePage('add-fertilizer'),
  },
  {
    icon: IconList,
    onClick: () => changePage('list'),
  },
])

onMounted(syncData)
</script>
