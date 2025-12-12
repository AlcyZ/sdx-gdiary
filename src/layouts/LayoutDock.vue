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
        <div class="flex flex-col items-center justify-center relative">
          <component :is="dock.icon" />
          <span class="text-xs">{{ dock.label }}</span>
          <transition
            appear
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 scale-x-0"
            enter-to-class="opacity-100 scale-x-100"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 scale-x-100"
            leave-to-class="opacity-0 scale-x-0"
          >
            <div
              v-if="$route.path.startsWith(dock.to)"
              class="h-[3px] w-2/5 bg-dim rounded-full absolute -bottom-1"
            />
          </transition>
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
