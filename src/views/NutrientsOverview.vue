<template>
  <LayoutDock>
    <div class="flex-1 flex items-center justify-center p-4">
      <NutrientsOverviewEmptyState
        v-if="isEmpty"
      />
      <div
        v-else
        class="flex-1"
      >
        <h2 class="text-2xl font-semibold flex items-center justify-between mb-4">
          Bewässerungsschema

          <IBtn
            square
            ghost
            @click="$router.push({ name: 'nutrients.schema.add' })"
          >
            <IconPlus />
          </IBtn>
        </h2>

        <NutrientsOverviewSchemaEmpty
          v-if="!hasSchemas"
        />
        <NutrientsOverviewSchemaList
          v-else
        />

        <div class="divider my-6" />

        <h2 class="text-2xl font-semibold flex items-center justify-between mb-4">
          Dünger

          <IBtn
            square
            ghost
            @click="$router.push({ name: 'nutrients.fertilizer.add' })"
          >
            <IconPlus />
          </IBtn>
        </h2>

        <NutrientsOverviewFertilizerList />
      </div>

      <IFab
        :icon="IconMenu"
        class="mb-14"
        :actions="fabActions"
      />
    </div>
  </LayoutDock>
</template>

<script lang="ts" setup>
import {
  Cog as IconMenu,
  CirclePlus as IconPlus,
} from 'lucide-vue-next'
import { computed } from 'vue'
import NutrientsOverviewEmptyState from '../components/NutrientsOverviewEmptyState.vue'
import NutrientsOverviewFertilizerList from '../components/NutrientsOverviewFertilizerList.vue'
import NutrientsOverviewSchemaEmpty from '../components/NutrientsOverviewSchemaEmpty.vue'
import NutrientsOverviewSchemaList from '../components/NutrientsOverviewSchemaList.vue'
import IBtn from '../components/ui/IBtn.vue'
import IFab from '../components/ui/IFab.vue'
import { useNutrientsView } from '../composables/useNutrientsView.ts'
import LayoutDock from '../layouts/LayoutDock.vue'
import { useFertilizerStore } from '../stores/fertilizerStore.ts'
import { useWateringSchemaStore } from '../stores/wateringSchemaStore.ts'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

const wateringSchemaStore = useWateringSchemaStore()
const fertilizerStore = useFertilizerStore()

const { fabActions } = useNutrientsView()

const hasSchemas = computed(() => wateringSchemaStore.wateringSchemas.length > 0)
const hasFertilizers = computed(() => fertilizerStore.fertilizers.length > 0)

const isEmpty = computed(
  (): boolean => !hasSchemas.value && !hasFertilizers.value,
)
</script>
