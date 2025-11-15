<template>
  <NutrientsOverviewGroupings
    :groups
  >
    <template #header-actions="{ payload: schemaId }">
      <div class="space-x-1 mr-2">
        <IBtn
          square
          ghost
          size="lg"
          @click="$router.push({ name: 'nutrients.schema.edit', params: { schemaId } })"
        >
          <IconEdit2 :size="20" />
        </IBtn>
        <IBtn
          square
          ghost
          size="lg"
          variant="error"
          @click="() => console.log('doto')"
        >
          <IconDelete2 :size="20" />
        </IBtn>
      </div>
    </template>

    <template #item="{ item: fertilizer }: { item: WateringSchemaFertilizer }">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-x-1">
          <IBadge
            class="mr-2 font-semibold w-24"
            variant="accent"
            soft
          >
            {{ fertilizer.amount }}ml/L
          </IBadge>

          <h4 class="font-semibold text-primary-content">
            {{ fertilizer.fertilizer.name }}
          </h4>
        </div>

        <div class="space-x-1">
          <IBtn
            square
            ghost
            size="lg"
          >
            <IconEdit :size="20" />
          </IBtn>
          <IBtn
            square
            ghost
            size="lg"
            variant="error"
          >
            <IconDelete :size="20" />
          </IBtn>
        </div>
      </div>
      <div v-if="fertilizer.fertilizer.manufacturer" class="flex items-center gap-x-4">
        <IBadge
          v-if="fertilizer.fertilizer.manufacturer"
          size="xs"
        >
          {{ fertilizer.fertilizer.manufacturer }}
        </IBadge>
      </div>
      <!--      <div class=""> -->
      <!--        <IBadge -->
      <!--          class="mr-2 font-semibold w-20" -->
      <!--          variant="accent" -->
      <!--          soft -->
      <!--        > -->
      <!--          {{ fertilizer.amount }}ml/L -->
      <!--        </IBadge> -->

      <!--        <div class="flex items-center space-x-2"> -->
      <!--          <h4 class="font-semibold text-primary-content"> -->
      <!--            {{ fertilizer.fertilizer.name }} -->
      <!--          </h4> -->
      <!--          <IBadge -->
      <!--            v-if="fertilizer.fertilizer.manufacturer" -->
      <!--            size="sm" -->
      <!--            class="" -->
      <!--          >{{ fertilizer.fertilizer.manufacturer }}</IBadge> -->
      <!--        </div> -->
      <!--      </div> -->
      <!--      <div class="space-x-1"> -->
      <!--        <IBtn -->
      <!--          square -->
      <!--          ghost -->
      <!--          size="lg" -->
      <!--        > -->
      <!--          <IconEdit :size="20" /> -->
      <!--        </IBtn> -->
      <!--        <IBtn -->
      <!--          square -->
      <!--          ghost -->
      <!--          size="lg" -->
      <!--          variant="error" -->
      <!--        > -->
      <!--          <IconDelete :size="20" /> -->
      <!--        </IBtn> -->
      <!--      </div> -->
    </template>
  </NutrientsOverviewGroupings>
</template>

<script lang="ts" setup>
import type { WateringSchemaFertilizer } from '../modules/nutrients/types'
import {
  Trash as IconDelete,
  Trash2 as IconDelete2,
  Edit as IconEdit,
  Edit2 as IconEdit2,
} from 'lucide-vue-next'
import { computed } from 'vue'
import { useWateringSchemaStore } from '../stores/wateringSchemaStore.ts'
import NutrientsOverviewGroupings from './NutrientsOverviewGroupings.vue'
import IBadge from './ui/IBadge.vue'
import IBtn from './ui/IBtn.vue'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

const wateringStore = useWateringSchemaStore()

const groups = computed(() => wateringStore.wateringSchemas.map(schema => ({
  title: schema.name,
  payload: schema.id,
  items: schema.fertilizers,
})))
</script>
