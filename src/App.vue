<template>
  <LayoutBase
    :docks="docks"
    @change-page="navigateTo"
  >
    <PageHome
      v-if="page === 'home'"
    />
    <PagePlant
      v-else-if="page === 'plant'"
    />
    <PageNutrients
      v-else-if="page === 'nutrients'"
    />
  </LayoutBase>
</template>

<script setup lang="ts">
import type { DockItem } from './types'
import {
  House as IconHouse,
  Apple as IconNutrients,
  Flower2 as IconPlant,
} from 'lucide-vue-next'
import { computed } from 'vue'
import { usePage } from './composables/usePage.ts'
import LayoutBase from './layouts/LayoutBase.vue'
import PageHome from './pages/PageHome.vue'
import PageNutrients from './pages/PageNutrients.vue'
import PagePlant from './pages/PagePlant.vue'
import { typedKeys } from './util.ts'

type AppPage = 'home' | 'plant' | 'nutrients'
const { page, changePage } = usePage<AppPage>('plant')

const pagesMap: Record<AppPage, DockItem<AppPage>> = {
  home: { label: 'Home', icon: IconHouse, data: 'home' },
  plant: { label: 'Pflanzen', icon: IconPlant, data: 'plant' },
  nutrients: { label: 'Nutrients', icon: IconNutrients, data: 'nutrients' },
}

const docks = computed(
  () => typedKeys(pagesMap).map((p: AppPage): DockItem<AppPage> => ({
    ...pagesMap[p],
    active: page.value === p,
  })),
)

function navigateTo(item: DockItem<AppPage>) {
  if (item.data)
    changePage(item.data)
}
</script>
