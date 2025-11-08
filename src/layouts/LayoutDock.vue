<template>
  <div class="flex flex-col min-h-screen bg-neutral-100 w-full pb-16 overflow-x-hidden">
    <RouterView />

    <IDock
      :items="docks"
    />
  </div>
</template>

<script lang="ts" setup>
import type { DockItem } from '../types'
import {
  House as IconHouse,
  Apple as IconNutrients,
  Flower2 as IconPlant,
} from 'lucide-vue-next'
import { ref } from 'vue'
import IDock from '../components/IDock.vue'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

const docks = ref<Array<DockItem>>([
  {
    label: 'Home',
    icon: IconHouse,
    to: '/',
  },
  {
    label: 'Pflanzen',
    icon: IconPlant,
    to: '/plants',
  },
  {
    label: 'Dünger',
    icon: IconNutrients,
    to: '/nutrients',
  },
])
</script>
