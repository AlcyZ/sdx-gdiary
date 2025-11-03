<template>
  <LayoutBase
    :docks="docks"
    @change-page="changePage"
  >
    <PageHome
      v-if="currentPage === 'Home'"
    />
    <PagePlant
      v-else-if="currentPage === 'Pflanzen'"
    />
    <PageNutrients
      v-else-if="currentPage === 'Nutrients'"
    />
  </LayoutBase>
</template>

<script setup lang="ts">
import type { DockItem, Page } from './types'
import {
  House as IconHouse,
  Apple as IconNutrients,
  Flower2 as IconPlant,
} from 'lucide-vue-next'
import { computed, ref } from 'vue'
import LayoutBase from './layouts/LayoutBase.vue'
import PageHome from './pages/PageHome.vue'
import PageNutrients from './pages/PageNutrients.vue'
import PagePlant from './pages/PagePlant.vue'

const docks = ref<Array<DockItem>>([
  {
    label: 'Home',
    icon: IconHouse,
    active: false,
  },
  {
    label: 'Pflanzen',
    icon: IconPlant,
    active: false,
  },
  {
    label: 'Nutrients',
    icon: IconNutrients,
    active: true,
  },
])

const currentPage = computed((): Page => docks.value.find(dock => dock.active)?.label || 'Home')

function changePage(newPage: Page) {
  docks.value.forEach(dock => dock.active = false)
  docks.value.filter(dock => dock.label === newPage).forEach(dock => dock.active = true)
}
</script>
