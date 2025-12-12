<template>
  <div class="flex flex-col min-h-screen w-full pb-20 overflow-hidden">
    <slot name="top-navigation" />

    <slot />

    <IDock
      :items="docks"
    />
  </div>
</template>

<script lang="ts" setup>
import type { DockItem } from '../types'
import {
  Images as IconGallery,
  Apple as IconNutrients,
  Flower2 as IconPlant,
  Settings as IconSettings,
} from 'lucide-vue-next'
import { ref } from 'vue'
import IDock from '../componentsBackup/ui/IDock.vue'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()
defineSlots<{
  'default': (props: Record<string, never>) => any
  'top-navigation': (props: Record<string, never>) => any
}>()

const docks = ref<Array<DockItem>>([
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
  {
    label: 'Galerie',
    icon: IconGallery,
    to: '/gallery',
  },
  {
    label: 'Einstellungen',
    icon: IconSettings,
    to: '/settings',
  },
])
</script>
