<template>
  <div class="flex flex-col min-h-screen w-full">
    <div class="flex-1 flex flex-col">
      <slot />
    </div>

    <div class="flex border border-subtle bg-white">
      <RouterLink
        v-for="(dock, i) in docks"
        :key="i"
        class="flex-1 py-sm"
        :to="dock.to"
      >
        <div class="flex flex-col items-center justify-center">
          <component :is="dock.icon" />
          <span class="text-xs">{{ dock.label }}</span>
        </div>
      </RouterLink>
    </div>
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
