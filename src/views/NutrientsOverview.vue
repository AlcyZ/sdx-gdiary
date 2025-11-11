<template>
  <LayoutDock>
    <div class="flex-1 flex items-center justify-center">
      <ICard class="w-full max-w-2xl">
        <ICardTitle class="text-2xl font-bold mb-5">
          Nutrients
        </ICardTitle>

        <NutrientsOverviewWateringSchemas
          class="my-3"
        />

        <NutrientsOverviewFertilizers
          class="my-3"
        />
      </ICard>
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
} from 'lucide-vue-next'
import NutrientsOverviewFertilizers from '../components/NutrientsOverviewFertilizers.vue'
import NutrientsOverviewWateringSchemas from '../components/NutrientsOverviewWateringSchemas.vue'
import ICard from '../components/ui/ICard.vue'
import ICardTitle from '../components/ui/ICardTitle.vue'
import IFab from '../components/ui/IFab.vue'
import { useNutrientsView } from '../composables/useNutrientsView.ts'
import LayoutDock from '../layouts/LayoutDock.vue'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

const { fabActions } = useNutrientsView()
</script>
