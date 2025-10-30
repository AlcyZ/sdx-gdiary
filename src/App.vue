<template>
  <div class="bg-neutral-200 w-screen h-screen">
    <PageHome
      v-if="currentPage === 'Home'"
    />
    <PagePlant
      v-else-if="currentPage === 'Pflanzen'"
    />
    <PageTodo
      v-else-if="currentPage === 'Todo'"
    />

    <LayoutDock
      :items="docks"
      @change-page="changePage"
    />
  </div>
</template>

<script setup lang="ts">
import type { DockItem, Page } from './types'
import {
  House as IconHouse,
  Flower2 as IconPlant,
  LayoutList as IconTodo,
} from 'lucide-vue-next'
import { computed, ref } from 'vue'
import LayoutDock from './components/LayoutDock.vue'
import PageHome from './pages/PageHome.vue'
import PagePlant from './pages/PagePlant.vue'
import PageTodo from './pages/PageTodo.vue'

const _isInPwa = computed(() => isInStandaloneModeCheck())
const _isMobile = computed(() => isMobileCheck())

const docks = ref<Array<DockItem>>([
  {
    label: 'Home',
    icon: IconHouse,
    active: true,
  },
  {
    label: 'Pflanzen',
    icon: IconPlant,
    active: false,
  },
  {
    label: 'Todo',
    icon: IconTodo,
    active: false,
  },
])

const currentPage = computed((): Page => docks.value.find(dock => dock.active)?.label || 'Home')

function isInStandaloneModeCheck(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone === true
  )
}

function isMobileCheck(): boolean {
  const ua = navigator.userAgent
  return /iPhone|iPad|iPod|Android/i.test(ua)
}

function changePage(newPage: DockItem) {
  docks.value.forEach(dock => dock.active = false)
  docks.value.filter(dock => dock.label === newPage.label).forEach(dock => dock.active = true)
}
</script>
