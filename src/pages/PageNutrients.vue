<template>
  <div class="py-6 flex justify-center items-center w-full">
    <IFab
      :icon="IconMenu"
      :actions="fabActions"
    />

    <NutrientPageOverview
      v-if="page === 'list'"
      @back="back"
    />
    <NutrientPageAddFertilizer
      v-else-if="page === 'add-fertilizer'"
      @back="back"
    />
    <NutrientPageAdd
      v-else-if="page === 'add'"
      @back="back"
    />
  </div>
</template>

<script lang="ts" setup>
import type { FabAction } from '../types'
import {
  Beaker as IconFertilizer,
  Apple as IconList,
  Cog as IconMenu,
  CirclePlus as IconNew,
} from 'lucide-vue-next'
import { ref } from 'vue'
import IFab from '../components/IFab.vue'
import NutrientPageAdd from '../components/NutrientPageAdd.vue'
import NutrientPageAddFertilizer from '../components/NutrientPageAddFertilizer.vue'
import NutrientPageOverview from '../components/NutrientPageOverview.vue'
import { usePage } from '../composables/usePage.ts'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

type NutrientPage = 'list' | 'add' | 'add-fertilizer'
const { page, changePage } = usePage<NutrientPage>('add-fertilizer')

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

function back() {
  changePage('list')
}
</script>
