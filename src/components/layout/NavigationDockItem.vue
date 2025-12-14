<template>
  <RouterLink
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
</template>

<script lang="ts" setup>
import type { DockItem } from '../../types'

interface Props {
  dock: DockItem
}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()
</script>
