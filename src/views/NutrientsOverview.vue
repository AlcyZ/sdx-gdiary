<template>
  <div
    class="flex items-center justify-center my-4"
    :class="{ 'h-full': isEmpty }"
  >
    <component
      :is="emptyComponent"
      v-if="isEmpty"
      :variants="fadeUp"
      initial="from"
      animate="to"
    />

    <motion.div
      v-else
      class="w-full px-8"
      :variants="scale075"
      initial="from"
      animate="to"
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
    </motion.div>

    <IFab
      :icon="IconMenu"
      :actions="fabActions"
    />
  </div>
</template>

<script lang="ts" setup>
import {
  Cog as IconMenu,
  CirclePlus as IconPlus,
} from 'lucide-vue-next'
import { motion } from 'motion-v'
import { computed } from 'vue'
import NutrientsOverviewEmptyState from '../components/NutrientsOverviewEmptyState.vue'
import NutrientsOverviewFertilizerList from '../components/NutrientsOverviewFertilizerList.vue'
import NutrientsOverviewSchemaEmpty from '../components/NutrientsOverviewSchemaEmpty.vue'
import NutrientsOverviewSchemaList from '../components/NutrientsOverviewSchemaList.vue'
import IBtn from '../components/ui/IBtn.vue'
import IFab from '../components/ui/IFab.vue'
import { useContentAnimation } from '../composables/useContentAnimation.ts'
import { useNutrientsView } from '../composables/useNutrientsView.ts'
import { usePageLayout } from '../composables/usePageLayout.ts'
import { useFertilizerStore } from '../stores/fertilizerStore.ts'
import { useWateringSchemaStore } from '../stores/wateringSchemaStore.ts'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

usePageLayout({
  dock: true,
})

const wateringSchemaStore = useWateringSchemaStore()
const fertilizerStore = useFertilizerStore()

const { fabActions } = useNutrientsView()
const { fadeUp, scale075 } = useContentAnimation()

const emptyComponent = motion.create(NutrientsOverviewEmptyState)

const hasSchemas = computed(() => wateringSchemaStore.wateringSchemas.length > 0)
const hasFertilizers = computed(() => fertilizerStore.fertilizers.length > 0)

const isEmpty = computed(
  (): boolean => !hasSchemas.value && !hasFertilizers.value,
)
</script>
